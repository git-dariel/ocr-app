import { GoogleGenerativeAI } from "@google/generative-ai";

import { OcrApiError } from "@/lib/errors";
import {
  createDefaultBirLineItem,
  normalizeBirStructuredReceipt,
  type BirStructuredReceipt,
} from "@/schemas/bir-receipt";

// Default to a generally-available text model, but allow overriding via GEMINI_MODEL.
// If your key/project doesn’t support this model, set GEMINI_MODEL in .env.local.
const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash-001";

type GeminiProviderError = Error & {
  status?: number;
  code?: string | number;
};

let geminiClient: GoogleGenerativeAI | null = null;
let resolvedModelName: string | null = null;

function getGeminiApiKey(): string {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new OcrApiError({
      status: 500,
      code: "STRUCTURED_EXTRACTOR_MISCONFIGURED",
      message: "Missing GEMINI_API_KEY for structured receipt extraction.",
    });
  }

  return apiKey;
}

function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = getGeminiApiKey();

  if (!geminiClient) {
    geminiClient = new GoogleGenerativeAI(apiKey);
  }

  return geminiClient;
}

function getGeminiModelName(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
}

async function resolveWorkingModelName(): Promise<string> {
  if (resolvedModelName) {
    return resolvedModelName;
  }

  const preferred = getGeminiModelName();
  resolvedModelName = preferred;
  return preferred;
}

function isModelNotFoundError(message: string, code: string | number | null): boolean {
  if (code === 404) {
    return true;
  }
  const normalized = message.toLowerCase();
  return normalized.includes("not found") && normalized.includes("models/");
}

async function pickFirstGenerateContentModel(): Promise<string | null> {
  const apiKey = getGeminiApiKey();
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const body = (await response.json()) as {
    models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>;
  };
  const models = body.models ?? [];

  const candidates = models
    .filter((model) => model?.name)
    .filter((model) => (model.supportedGenerationMethods ?? []).includes("generateContent"))
    .map((model) => String(model.name));

  if (candidates.length === 0) {
    return null;
  }

  // Prefer "gemini" models; otherwise use the first available generateContent model.
  const geminiCandidate = candidates.find((name) => name.toLowerCase().includes("gemini"));
  return geminiCandidate ?? candidates[0];
}

function normalizeModelId(modelName: string): string {
  // listModels() returns "models/<id>" but the SDK expects "<id>" in getGenerativeModel({ model })
  return modelName.startsWith("models/") ? modelName.slice("models/".length) : modelName;
}

function buildPrompt(rawText: string): string {
  return [
    "You are extracting BIR purchases inquiry fields from OCR receipt text.",
    "Return JSON only. No markdown and no extra keys.",
    'Schema (required): {"schemaVersion":"1","lineItems":[{',
    '"sequence":number,',
    '"tin":string,',
    '"registeredName":string,',
    '"lastName":string,',
    '"firstName":string,',
    '"middleName":string,',
    '"substreetStreetBarangay":string,',
    '"districtCityZipCode":string,',
    '"exempt":number,',
    '"zeroRated":number,',
    '"taxableNetOfVat":number,',
    '"totalPurchase":number,',
    '"services":number,',
    '"capitalGoods":number,',
    '"goodsOtherThanCapitalGoods":number,',
    '"inputTax":number',
    "}],",
    '"totals":{"exempt":number,"zeroRated":number,"taxableNetOfVat":number,"totalPurchase":number,"inputTax":number}}',
    "Rules:",
    "- Use one lineItem for the current receipt when possible.",
    "- Convert all amount fields to decimal numbers without commas.",
    "- If a field is not present, use empty string for text and 0 for numbers.",
    "- sequence starts at 1.",
    "- totals must equal lineItems sum.",
    "- IMPORTANT: `registeredName` must be the SELLER/SUPPLIER business name from the receipt header/title.",
    "- IMPORTANT: Never map `Customer:` value to `registeredName`.",
    "- If a person line exists like `NAME - Prop.` or `Proprietor`, map that person to firstName/middleName/lastName.",
    "- If no fields are confidently detected, still return one lineItem with sequence 1 and zero/empty defaults.",
    "- TIN may appear in formats like 000-123-456 or 000123456. Preserve only numbers and dashes in TIN.",
    "- Prioritize these labels when present: Exempt, Zero-Rated, Taxable (Net of VAT), Total Purchase, Total Input Tax.",
    "",
    "OCR text:",
    rawText,
  ].join("\n");
}

function extractRawLines(rawText: string): string[] {
  return rawText
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0);
}

function getCustomerName(rawLines: string[]): string {
  for (const line of rawLines) {
    const match = line.match(/^customer\s*:\s*(.+)$/i);
    if (match) {
      return match[1].trim();
    }
  }
  return "";
}

function inferBusinessName(rawLines: string[]): string {
  const blocklist = [
    "service invoice",
    "official receipt",
    "sales invoice",
    "invoice",
    "customer:",
    "address:",
    "tin:",
    "date:",
  ];

  for (const line of rawLines.slice(0, 12)) {
    const normalized = line.toLowerCase();
    if (normalized.length < 4) {
      continue;
    }
    if (blocklist.some((entry) => normalized.includes(entry))) {
      continue;
    }
    if (/^\d/.test(normalized)) {
      continue;
    }
    return line;
  }

  return "";
}

function getProprietorName(rawLines: string[]): string {
  for (const line of rawLines) {
    const bySuffix = line.match(/^(.+?)\s*-\s*prop\.?$/i);
    if (bySuffix) {
      return bySuffix[1].trim();
    }

    const byLabel = line.match(/^proprietor\s*:\s*(.+)$/i);
    if (byLabel) {
      return byLabel[1].trim();
    }
  }
  return "";
}

function splitFullName(fullName: string): { firstName: string; middleName: string; lastName: string } {
  const cleaned = fullName.replace(/\s+/g, " ").trim();
  const parts = cleaned.split(" ").filter(Boolean);
  if (parts.length === 0) {
    return { firstName: "", middleName: "", lastName: "" };
  }
  if (parts.length === 1) {
    return { firstName: parts[0], middleName: "", lastName: "" };
  }
  if (parts.length === 2) {
    return { firstName: parts[0], middleName: "", lastName: parts[1] };
  }
  return {
    firstName: parts[0],
    middleName: parts.slice(1, -1).join(" "),
    lastName: parts[parts.length - 1],
  };
}

function looksLikeOrganization(name: string): boolean {
  const normalized = name.toLowerCase();
  const orgHints = [
    " inc",
    " corporation",
    " corp",
    " company",
    " co.",
    " ltd",
    " llc",
    " enterprises",
    " enterprise",
    " solutions",
    " solution",
    " trading",
    " store",
    " station",
  ];
  return orgHints.some((hint) => normalized.includes(hint));
}

function normalizeTin(rawTin: string): string {
  const digits = rawTin.replace(/\D/g, "");
  if (!digits) {
    return "";
  }

  const groups: string[] = [];
  for (let index = 0; index < digits.length; index += 3) {
    groups.push(digits.slice(index, index + 3));
  }
  return groups.join("-");
}

function getCustomerTin(rawLines: string[]): string {
  const customerIndex = rawLines.findIndex((line) => /^customer\s*:/i.test(line));
  const tinRegex = /tin\s*:\s*([0-9\-\s]{8,})/i;

  // Prefer TIN lines near the customer section.
  if (customerIndex >= 0) {
    const window = rawLines.slice(customerIndex, Math.min(customerIndex + 12, rawLines.length));
    for (const line of window) {
      if (/vat reg|non-vat|printer|bestprints/i.test(line)) {
        continue;
      }
      const match = line.match(tinRegex);
      if (match) {
        return normalizeTin(match[1]);
      }
    }
  }

  // Fallback: first TIN line not clearly related to printer metadata.
  for (const line of rawLines) {
    if (/vat reg|non-vat|printer|bestprints/i.test(line)) {
      continue;
    }
    const match = line.match(tinRegex);
    if (match) {
      return normalizeTin(match[1]);
    }
  }

  return "";
}

function isAddressStopLine(line: string): boolean {
  const normalized = line.toLowerCase();
  return (
    normalized.startsWith("tin:") ||
    normalized.startsWith("date:") ||
    normalized.startsWith("quantity") ||
    normalized.startsWith("nature of service") ||
    normalized.startsWith("unit cost") ||
    normalized.startsWith("total amount") ||
    normalized.startsWith("form of payment") ||
    normalized.startsWith("payment received") ||
    normalized.startsWith("service invoice") ||
    normalized.startsWith("no ") ||
    normalized === "no" ||
    normalized.startsWith("cash") ||
    normalized.startsWith("check") ||
    normalized.includes("☐")
  );
}

function getCustomerAddress(rawLines: string[]): string {
  const customerIndex = rawLines.findIndex((line) => /^customer\s*:/i.test(line));
  if (customerIndex < 0) {
    return "";
  }

  const addressIndex = rawLines.findIndex((line, index) => index >= customerIndex && /^address\s*:/i.test(line));
  if (addressIndex < 0) {
    return "";
  }

  const segments: string[] = [];
  const firstLine = rawLines[addressIndex].replace(/^address\s*:\s*/i, "").trim();
  if (firstLine) {
    segments.push(firstLine);
  }

  for (let index = addressIndex + 1; index < rawLines.length && index <= addressIndex + 3; index += 1) {
    const line = rawLines[index].trim();
    if (!line || isAddressStopLine(line)) {
      break;
    }
    segments.push(line);
  }

  return segments.join(" ").trim();
}

function splitAddressForBir(address: string): { substreetStreetBarangay: string; districtCityZipCode: string } {
  const normalized = address.replace(/\s+/g, " ").trim();
  if (!normalized) {
    return { substreetStreetBarangay: "", districtCityZipCode: "" };
  }

  const segments = normalized
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  if (segments.length <= 1) {
    return { substreetStreetBarangay: normalized, districtCityZipCode: "" };
  }

  return {
    substreetStreetBarangay: segments.slice(0, -1).join(", "),
    districtCityZipCode: segments[segments.length - 1],
  };
}

function applyBusinessNameNormalization(
  structured: BirStructuredReceipt,
  rawText: string,
): BirStructuredReceipt {
  const rawLines = extractRawLines(rawText);
  const customerNameRaw = getCustomerName(rawLines);
  const customerName = customerNameRaw.toLowerCase();
  const inferredBusinessName = inferBusinessName(rawLines);
  const customerTin = getCustomerTin(rawLines);
  const customerAddress = getCustomerAddress(rawLines);
  const normalizedCustomerAddress = splitAddressForBir(customerAddress);
  const proprietorName = getProprietorName(rawLines);
  const normalizedPerson = splitFullName(proprietorName);

  const normalizedLineItems = structured.lineItems.map((lineItem) => {
    const currentRegistered = lineItem.registeredName.trim();
    const currentRegisteredLower = currentRegistered.toLowerCase();
    const preferredRegisteredName = inferredBusinessName || customerNameRaw;
    const shouldReplaceRegisteredName = Boolean(
      preferredRegisteredName &&
        (!currentRegistered ||
          (customerName.length > 0 && currentRegisteredLower === customerName) ||
          currentRegisteredLower.startsWith("customer:")),
    );

    let normalizedName = {
      firstName: lineItem.firstName || normalizedPerson.firstName,
      middleName: lineItem.middleName || normalizedPerson.middleName,
      lastName: lineItem.lastName || normalizedPerson.lastName,
    };

    if (customerNameRaw) {
      if (looksLikeOrganization(customerNameRaw)) {
        normalizedName = {
          firstName: customerNameRaw,
          middleName: "",
          lastName: "",
        };
      } else {
        const splitCustomerName = splitFullName(customerNameRaw);
        normalizedName = {
          firstName: splitCustomerName.firstName,
          middleName: splitCustomerName.middleName,
          lastName: splitCustomerName.lastName,
        };
      }
    }

    return {
      ...lineItem,
      tin: customerTin || lineItem.tin,
      registeredName: shouldReplaceRegisteredName ? preferredRegisteredName : lineItem.registeredName,
      firstName: normalizedName.firstName,
      middleName: normalizedName.middleName,
      lastName: normalizedName.lastName,
      substreetStreetBarangay: normalizedCustomerAddress.substreetStreetBarangay || lineItem.substreetStreetBarangay,
      districtCityZipCode: normalizedCustomerAddress.districtCityZipCode || lineItem.districtCityZipCode,
    };
  });

  return {
    ...structured,
    lineItems: normalizedLineItems,
  };
}

function extractJsonText(candidate: string): string {
  const trimmed = candidate.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return fencedMatch ? fencedMatch[1].trim() : trimmed;
}

function toProviderDetails(error: unknown): { code: string | number | null; message: string } {
  const providerError = error as GeminiProviderError;
  return {
    code: providerError?.code ?? providerError?.status ?? null,
    message: providerError?.message ?? "Unknown Gemini provider error.",
  };
}

export async function extractStructuredReceiptWithGemini(rawText: string): Promise<BirStructuredReceipt> {
  try {
    const prompt = buildPrompt(rawText);
    const modelName = await resolveWorkingModelName();

    const generateOnce = async (nextModelName: string) => {
      const model = getGeminiClient().getGenerativeModel({ model: nextModelName });
      return await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0,
        },
      });
    };

    let response;
    try {
      response = await generateOnce(modelName);
    } catch (error) {
      const providerDetails = toProviderDetails(error);
      if (!isModelNotFoundError(providerDetails.message, providerDetails.code)) {
        throw error;
      }

      // Auto-heal: discover a supported model for this key/project and retry once.
      const discovered = await pickFirstGenerateContentModel();
      if (!discovered) {
        throw new OcrApiError({
          status: 502,
          code: "STRUCTURED_EXTRACTOR_MODEL_NOT_FOUND",
          message:
            "Gemini model is not available for this API key/project. Configure GEMINI_MODEL to a supported model.",
          details: {
            attemptedModel: modelName,
          },
          cause: error,
        });
      }

      const normalizedDiscovered = normalizeModelId(discovered);
      resolvedModelName = normalizedDiscovered;
      response = await generateOnce(normalizedDiscovered);
    }

    const candidate = response.response.text();
    const parsedJson = JSON.parse(extractJsonText(candidate)) as unknown;
    const normalized = normalizeBirStructuredReceipt(parsedJson);
    const normalizedWithBusinessRules = applyBusinessNameNormalization(normalized, rawText);
    if (normalizedWithBusinessRules.lineItems.length > 0) {
      return normalizedWithBusinessRules;
    }

    return {
      ...normalizedWithBusinessRules,
      lineItems: [createDefaultBirLineItem(1)],
    };
  } catch (error) {
    if (error instanceof OcrApiError) {
      throw error;
    }

    const providerDetails = toProviderDetails(error);
    throw new OcrApiError({
      status: 502,
      code: "STRUCTURED_EXTRACTOR_ERROR",
      message: "Gemini structured extraction failed.",
      details: {
        providerCode: providerDetails.code,
        providerMessage: providerDetails.message,
        model: resolvedModelName ?? getGeminiModelName(),
      },
      cause: error,
    });
  }
}
