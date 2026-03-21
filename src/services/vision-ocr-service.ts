import { ImageAnnotatorClient, protos } from "@google-cloud/vision";

import { OcrApiError } from "@/lib/errors";
import type { OcrExtractionResult, OcrMetadata } from "@/types/types";

type AnnotateImageResponse = protos.google.cloud.vision.v1.IAnnotateImageResponse;
type TextAnnotation = NonNullable<AnnotateImageResponse["fullTextAnnotation"]>;

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
  project_id?: string;
};

type VisionProviderError = Error & {
  code?: number | string;
  details?: string;
};

type VisionProviderDetails = {
  providerCode: number | string | null;
  providerMessage: string;
  providerDetails: string;
};

let visionClient: ImageAnnotatorClient | undefined;

function getVisionClient(): ImageAnnotatorClient {
  if (!visionClient) {
    const credentials = resolveServiceAccountCredentials();
    visionClient = credentials
      ? new ImageAnnotatorClient({
          credentials,
          projectId: credentials.project_id,
        })
      : new ImageAnnotatorClient();
  }

  return visionClient;
}

function resolveServiceAccountCredentials(): ServiceAccountCredentials | null {
  const rawValue = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!rawValue) {
    return null;
  }

  const trimmed = rawValue.trim();
  const unquoted =
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
      ? trimmed.slice(1, -1).trim()
      : trimmed;
  if (!unquoted.startsWith("{")) {
    return null;
  }

  try {
    const parsed = JSON.parse(unquoted) as Partial<ServiceAccountCredentials>;
    if (!parsed.client_email || !parsed.private_key) {
      throw new Error("Missing required service account fields.");
    }

    return {
      client_email: parsed.client_email,
      private_key: parsed.private_key,
      project_id: parsed.project_id,
    };
  } catch {
    throw new OcrApiError({
      status: 500,
      code: "OCR_PROVIDER_MISCONFIGURED",
      message:
        "Invalid GOOGLE_APPLICATION_CREDENTIALS value. Provide a file path or a valid service-account JSON object.",
    });
  }
}

export async function extractReceiptTextWithVision(
  imageBuffer: Buffer,
): Promise<OcrExtractionResult> {
  try {
    const [response] = await getVisionClient().documentTextDetection({
      image: { content: imageBuffer },
    });

    if (response.error?.message) {
      throw new OcrApiError({
        status: 502,
        code: "OCR_PROVIDER_ERROR",
        message: "Google Vision OCR failed to process the image.",
        details: { providerMessage: response.error.message },
      });
    }

    return {
      text: response.fullTextAnnotation?.text ?? "",
      metadata: buildOcrMetadata(response),
    };
  } catch (error) {
    if (error instanceof OcrApiError) {
      throw error;
    }

    throw mapVisionError(error);
  }
}

function mapVisionError(error: unknown): OcrApiError {
  const providerError = asVisionProviderError(error);
  const providerDetails = buildProviderDetails(providerError);

  if (providerDetails.providerCode === 7) {
    const billingDisabled =
      providerDetails.providerMessage.includes("billing to be enabled") ||
      providerDetails.providerDetails.includes("billing to be enabled");

    return new OcrApiError({
      status: 503,
      code: billingDisabled
        ? "OCR_PROVIDER_BILLING_DISABLED"
        : "OCR_PROVIDER_PERMISSION_DENIED",
      message: billingDisabled
        ? "Google Vision OCR is unavailable because billing is not enabled for the configured Google Cloud project."
        : "Google Vision OCR rejected the request with insufficient permissions.",
      details: providerDetails,
      cause: providerError,
    });
  }

  if (providerDetails.providerCode === 16) {
    return new OcrApiError({
      status: 500,
      code: "OCR_PROVIDER_MISCONFIGURED",
      message: "Google Vision OCR credentials are missing or invalid.",
      details: providerDetails,
      cause: providerError,
    });
  }

  if (providerDetails.providerCode === 14 || providerDetails.providerCode === 4) {
    return new OcrApiError({
      status: 502,
      code: "OCR_PROVIDER_UNAVAILABLE",
      message: "Unable to reach Google Vision OCR service.",
      details: providerDetails,
      cause: providerError,
    });
  }

  return new OcrApiError({
    status: 502,
    code: "OCR_PROVIDER_UNAVAILABLE",
    message: "Google Vision OCR request failed before a response was returned.",
    details: providerDetails,
    cause: providerError,
  });
}

function asVisionProviderError(error: unknown): VisionProviderError {
  if (error instanceof Error) {
    return error as VisionProviderError;
  }

  return new Error(String(error));
}

function buildProviderDetails(error: VisionProviderError): VisionProviderDetails {
  return {
    providerCode: normalizeProviderCode(error.code),
    providerMessage: error.message,
    providerDetails: error.details ?? "",
  };
}

function normalizeProviderCode(code: VisionProviderError["code"]): number | string | null {
  if (typeof code === "number" || typeof code === "string") {
    return code;
  }

  return null;
}

function buildOcrMetadata(response: AnnotateImageResponse): OcrMetadata {
  const annotation: TextAnnotation | null = response.fullTextAnnotation ?? null;
  const pages = annotation?.pages ?? [];

  let blockCount = 0;
  let wordCount = 0;
  const pageConfidences: number[] = [];
  const detectedLanguages = new Set<string>();

  for (const page of pages) {
    if (typeof page.confidence === "number") {
      pageConfidences.push(page.confidence);
    }

    appendLanguages(detectedLanguages, page.property?.detectedLanguages);

    for (const block of page.blocks ?? []) {
      blockCount += 1;
      appendLanguages(detectedLanguages, block.property?.detectedLanguages);

      for (const paragraph of block.paragraphs ?? []) {
        appendLanguages(detectedLanguages, paragraph.property?.detectedLanguages);
        for (const word of paragraph.words ?? []) {
          wordCount += 1;
          appendLanguages(detectedLanguages, word.property?.detectedLanguages);
        }
      }
    }
  }

  return {
    pageCount: pages.length,
    blockCount,
    wordCount,
    detectedLanguages: Array.from(detectedLanguages).sort(),
    averagePageConfidence: calculateAverage(pageConfidences),
  };
}

function appendLanguages(
  target: Set<string>,
  languages: Array<{ languageCode?: string | null }> | null | undefined,
): void {
  for (const language of languages ?? []) {
    if (typeof language.languageCode === "string" && language.languageCode.trim()) {
      target.add(language.languageCode);
    }
  }
}

function calculateAverage(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sum = values.reduce((total, value) => total + value, 0);
  return Number((sum / values.length).toFixed(4));
}
