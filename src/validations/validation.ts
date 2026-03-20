import { OcrApiError } from "@/lib/errors";
import type { CropRegion, SupportedImageMimeType, ValidatedReceiptUpload } from "@/types/types";

const DEFAULT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const SUPPORTED_MIME_TYPES = new Set<SupportedImageMimeType>([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/tiff",
]);

export function assertMultipartFormDataRequest(request: Request): void {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";

  if (!contentType.includes("multipart/form-data")) {
    throw new OcrApiError({
      status: 415,
      code: "UNSUPPORTED_CONTENT_TYPE",
      message: "Use multipart/form-data with a file field named 'file'.",
    });
  }
}

export async function validateReceiptUpload(formData: FormData): Promise<ValidatedReceiptUpload> {
  const uploaded = formData.get("file");

  if (!(uploaded instanceof File)) {
    throw new OcrApiError({
      status: 400,
      code: "MISSING_FILE",
      message: "No file uploaded. Use form-data with key 'file'.",
    });
  }

  if (uploaded.size === 0) {
    throw new OcrApiError({
      status: 400,
      code: "EMPTY_FILE",
      message: "Uploaded file is empty.",
    });
  }

  const maxFileSizeBytes = getMaxFileSizeBytes();
  if (uploaded.size > maxFileSizeBytes) {
    throw new OcrApiError({
      status: 413,
      code: "FILE_TOO_LARGE",
      message: `File exceeds the ${maxFileSizeBytes} byte limit.`,
      details: { maxFileSizeBytes },
    });
  }

  const imageBuffer = Buffer.from(await uploaded.arrayBuffer());
  const detectedMimeType = detectMimeTypeFromBuffer(imageBuffer);
  if (!detectedMimeType) {
    throw new OcrApiError({
      status: 415,
      code: "UNSUPPORTED_FILE_TYPE",
      message: "Unsupported image format. Use JPEG, PNG, WEBP, or TIFF.",
    });
  }

  const declaredMimeType = normalizeMimeType(uploaded.type);
  if (uploaded.type && !declaredMimeType) {
    throw new OcrApiError({
      status: 415,
      code: "UNSUPPORTED_FILE_TYPE",
      message: "Unsupported image MIME type. Use JPEG, PNG, WEBP, or TIFF.",
    });
  }

  if (declaredMimeType && declaredMimeType !== detectedMimeType) {
    throw new OcrApiError({
      status: 400,
      code: "MIME_TYPE_MISMATCH",
      message: "Uploaded file content does not match the declared image MIME type.",
      details: {
        declaredMimeType,
        detectedMimeType,
      },
    });
  }

  return {
    fileName: uploaded.name,
    mimeType: detectedMimeType,
    sizeBytes: uploaded.size,
    imageBuffer,
    cropRegion: parseCropRegion(formData),
  };
}

function getMaxFileSizeBytes(): number {
  const rawValue = process.env.OCR_MAX_FILE_SIZE_BYTES;
  if (!rawValue) {
    return DEFAULT_MAX_FILE_SIZE_BYTES;
  }

  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_MAX_FILE_SIZE_BYTES;
  }

  return Math.floor(parsed);
}

function normalizeMimeType(rawMimeType: string): SupportedImageMimeType | null {
  const normalized = rawMimeType.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (normalized === "image/jpg") {
    return "image/jpeg";
  }

  if (SUPPORTED_MIME_TYPES.has(normalized as SupportedImageMimeType)) {
    return normalized as SupportedImageMimeType;
  }

  return null;
}

function detectMimeTypeFromBuffer(buffer: Buffer): SupportedImageMimeType | null {
  if (isJpeg(buffer)) {
    return "image/jpeg";
  }

  if (isPng(buffer)) {
    return "image/png";
  }

  if (isWebp(buffer)) {
    return "image/webp";
  }

  if (isTiff(buffer)) {
    return "image/tiff";
  }

  return null;
}

function isJpeg(buffer: Buffer): boolean {
  return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}

function isPng(buffer: Buffer): boolean {
  if (buffer.length < 8) {
    return false;
  }

  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return buffer.subarray(0, 8).equals(pngSignature);
}

function isWebp(buffer: Buffer): boolean {
  return (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  );
}

function isTiff(buffer: Buffer): boolean {
  if (buffer.length < 4) {
    return false;
  }

  const littleEndianTiff =
    buffer[0] === 0x49 && buffer[1] === 0x49 && buffer[2] === 0x2a && buffer[3] === 0x00;
  const bigEndianTiff =
    buffer[0] === 0x4d && buffer[1] === 0x4d && buffer[2] === 0x00 && buffer[3] === 0x2a;

  return littleEndianTiff || bigEndianTiff;
}

function parseCropRegion(formData: FormData): CropRegion | undefined {
  const cropJson = formData.get("crop");
  if (typeof cropJson === "string" && cropJson.trim().length > 0) {
    return parseCropFromJson(cropJson);
  }

  const left = parseNumberField(formData.get("cropLeft"));
  const top = parseNumberField(formData.get("cropTop"));
  const width = parseNumberField(formData.get("cropWidth"));
  const height = parseNumberField(formData.get("cropHeight"));

  const hasAnyManualCropField = [left, top, width, height].some((value) => value !== undefined);

  if (!hasAnyManualCropField) {
    return undefined;
  }

  return validateCropRegion({
    left,
    top,
    width,
    height,
  });
}

function parseCropFromJson(rawValue: string): CropRegion {
  let parsedValue: unknown;
  try {
    parsedValue = JSON.parse(rawValue);
  } catch {
    throw new OcrApiError({
      status: 400,
      code: "INVALID_CROP_REGION",
      message: "Crop region JSON is invalid.",
    });
  }

  if (!parsedValue || typeof parsedValue !== "object") {
    throw new OcrApiError({
      status: 400,
      code: "INVALID_CROP_REGION",
      message: "Crop region must be an object with left, top, width, and height numbers.",
    });
  }

  const cropRecord = parsedValue as Record<string, unknown>;

  return validateCropRegion({
    left: toFiniteNumber(cropRecord.left),
    top: toFiniteNumber(cropRecord.top),
    width: toFiniteNumber(cropRecord.width),
    height: toFiniteNumber(cropRecord.height),
  });
}

function parseNumberField(value: FormDataEntryValue | null): number | undefined {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new OcrApiError({
      status: 400,
      code: "INVALID_CROP_REGION",
      message: "Crop values must be valid numbers.",
    });
  }

  return parsed;
}

function toFiniteNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new OcrApiError({
      status: 400,
      code: "INVALID_CROP_REGION",
      message: "Crop values must be valid numbers.",
    });
  }

  return value;
}

function validateCropRegion(input: {
  left?: number;
  top?: number;
  width?: number;
  height?: number;
}): CropRegion {
  const { left, top, width, height } = input;

  if (left === undefined || top === undefined || width === undefined || height === undefined) {
    throw new OcrApiError({
      status: 400,
      code: "INVALID_CROP_REGION",
      message: "Crop region requires left, top, width, and height values together.",
    });
  }

  if (left < 0 || top < 0 || width <= 0 || height <= 0) {
    throw new OcrApiError({
      status: 400,
      code: "INVALID_CROP_REGION",
      message: "Crop values must satisfy left >= 0, top >= 0, width > 0, and height > 0.",
    });
  }

  return {
    left: Math.round(left),
    top: Math.round(top),
    width: Math.round(width),
    height: Math.round(height),
  };
}
