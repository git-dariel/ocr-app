import type { OcrApiErrorPayload, OcrReceiptResponse } from "@/features/ocr/types";
import {
  FILE_VALIDATION_ERROR_MESSAGE,
  OCR_API_ENDPOINT,
  REQUEST_ERROR_FALLBACK_MESSAGE,
  SUPPORTED_IMAGE_TYPES,
  UPLOAD_TOO_LARGE_ERROR_MESSAGE,
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

  const rawBody = await response.text();
  const body = parseApiBody(rawBody);

  if (!response.ok) {
    const message =
      body && "error" in body && body.error?.message
        ? body.error.message
        : getUploadErrorMessage(rawBody);
    throw new Error(message);
  }

  if (!body) {
    throw new Error(REQUEST_ERROR_FALLBACK_MESSAGE);
  }

  return body as OcrReceiptResponse;
}

function parseApiBody(rawBody: string): OcrReceiptResponse | OcrApiErrorPayload | null {
  if (!rawBody) {
    return null;
  }

  try {
    return JSON.parse(rawBody) as OcrReceiptResponse | OcrApiErrorPayload;
  } catch {
    return null;
  }
}

function getUploadErrorMessage(rawBody: string): string {
  const normalized = rawBody.toLowerCase();

  if (
    normalized.includes("request entity too large") ||
    normalized.includes("body exceeded") ||
    normalized.includes("payload too large")
  ) {
    return UPLOAD_TOO_LARGE_ERROR_MESSAGE;
  }

  return REQUEST_ERROR_FALLBACK_MESSAGE;
}
