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

    throw new OcrApiError({
      status: 502,
      code: "OCR_PROVIDER_UNAVAILABLE",
      message: "Unable to reach Google Vision OCR service.",
    });
  }
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
