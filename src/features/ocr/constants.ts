export const OCR_API_ENDPOINT = "/api/ocr";

export const SUPPORTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",
] as const;

export const SUPPORTED_IMAGE_ACCEPT = SUPPORTED_IMAGE_TYPES.join(",");

export const FILE_VALIDATION_ERROR_MESSAGE =
  "Unsupported file type. Use JPEG, PNG, WEBP, or TIFF.";
export const REQUEST_ERROR_FALLBACK_MESSAGE =
  "Unable to extract text from the uploaded receipt.";
export const EMPTY_FILE_ERROR_MESSAGE = "Select a receipt image first.";

export const COPY_FEEDBACK_DURATION_MS = 1400;

export const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  audio: false,
  video: {
    facingMode: { ideal: "environment" },
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  },
};
