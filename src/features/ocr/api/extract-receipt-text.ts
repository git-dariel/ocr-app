import type { OcrApiErrorPayload, OcrReceiptResponse } from "@/features/ocr/types";
import {
  FILE_VALIDATION_ERROR_MESSAGE,
  OCR_API_ENDPOINT,
  REQUEST_ERROR_FALLBACK_MESSAGE,
  SUPPORTED_IMAGE_TYPES,
} from "@/features/ocr/constants";

const SUPPORTED_TYPES = new Set<string>(SUPPORTED_IMAGE_TYPES);

export async function extractReceiptText(file: File): Promise<OcrReceiptResponse> {
  if (!SUPPORTED_TYPES.has(file.type)) {
    throw new Error(FILE_VALIDATION_ERROR_MESSAGE);
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(OCR_API_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  const body = (await response.json()) as OcrReceiptResponse | OcrApiErrorPayload;

  if (!response.ok) {
    const message =
      "error" in body && body.error?.message
        ? body.error.message
        : REQUEST_ERROR_FALLBACK_MESSAGE;
    throw new Error(message);
  }

  return body as OcrReceiptResponse;
}
