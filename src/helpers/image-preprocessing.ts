import sharp from "sharp";

import { OcrApiError } from "@/lib/errors";
import type { CropRegion, ImagePreprocessingResult, ValidatedReceiptUpload } from "@/types/types";

const MAX_TARGET_WIDTH_FAST = 1600;
const MAX_TARGET_WIDTH_QUALITY = 2200;
const MAX_INPUT_PIXELS = 40_000_000;
const MIN_CROP_EDGE = 20;
const OCR_PREPROCESSING_PROFILE = process.env.OCR_PREPROCESSING_PROFILE === "quality"
  ? "quality"
  : "fast";

export async function preprocessReceiptImage(
  upload: ValidatedReceiptUpload,
): Promise<ImagePreprocessingResult> {
  try {
    const inputMetadata = await sharp(upload.imageBuffer, {
      failOn: "error",
      limitInputPixels: MAX_INPUT_PIXELS,
    }).metadata();

    const safeCrop = buildSafeCrop(upload.cropRegion, inputMetadata.width, inputMetadata.height);

    const baseWidth = safeCrop?.width ?? inputMetadata.width;
    const maxTargetWidth =
      OCR_PREPROCESSING_PROFILE === "quality"
        ? MAX_TARGET_WIDTH_QUALITY
        : MAX_TARGET_WIDTH_FAST;
    const targetWidth = calculateTargetWidth(baseWidth, maxTargetWidth);

    let pipeline = sharp(upload.imageBuffer, {
      failOn: "error",
      limitInputPixels: MAX_INPUT_PIXELS,
      sequentialRead: true,
    })
      .rotate()
      .flatten({ background: "#ffffff" });

    if (safeCrop) {
      pipeline = pipeline.extract(safeCrop);
    }

    if (targetWidth) {
      pipeline = pipeline.resize({
        width: targetWidth,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    pipeline = pipeline
      // OCR is generally more reliable on high-contrast monochrome receipt text.
      .grayscale()
      .normalize();

    if (OCR_PREPROCESSING_PROFILE === "quality") {
      // Mild sharpening improves thin character edges in low-quality phone captures.
      pipeline = pipeline.sharpen();
    }

    const { data, info } = await pipeline
      // JPEG is much faster to encode and usually smaller than PNG for phone receipt images.
      .jpeg({
        quality: OCR_PREPROCESSING_PROFILE === "quality" ? 86 : 78,
        mozjpeg: true,
      })
      .toBuffer({ resolveWithObject: true });

    return {
      processedImageBuffer: data,
      metadata: {
        inputMimeType: upload.mimeType,
        inputSizeBytes: upload.sizeBytes,
        outputSizeBytes: info.size,
        outputMimeType: "image/jpeg",
        processingProfile: OCR_PREPROCESSING_PROFILE,
        originalDimensions: {
          width: inputMetadata.width ?? null,
          height: inputMetadata.height ?? null,
        },
        processedDimensions: {
          width: info.width,
          height: info.height,
        },
        appliedCrop: safeCrop
          ? {
              left: safeCrop.left,
              top: safeCrop.top,
              width: safeCrop.width,
              height: safeCrop.height,
            }
          : null,
      },
    };
  } catch (error) {
    if (error instanceof OcrApiError) {
      throw error;
    }

    throw new OcrApiError({
      status: 422,
      code: "IMAGE_PREPROCESSING_FAILED",
      message: "Image preprocessing failed. Ensure the uploaded file is a valid image.",
    });
  }
}

function buildSafeCrop(
  cropRegion: CropRegion | undefined,
  imageWidth?: number,
  imageHeight?: number,
): CropRegion | undefined {
  if (!cropRegion) {
    return undefined;
  }

  if (!imageWidth || !imageHeight) {
    throw new OcrApiError({
      status: 400,
      code: "INVALID_CROP_REGION",
      message: "Crop cannot be applied because source image dimensions are unknown.",
    });
  }

  const left = clamp(Math.floor(cropRegion.left), 0, imageWidth - 1);
  const top = clamp(Math.floor(cropRegion.top), 0, imageHeight - 1);
  const width = clamp(Math.floor(cropRegion.width), 1, imageWidth - left);
  const height = clamp(Math.floor(cropRegion.height), 1, imageHeight - top);

  if (width < MIN_CROP_EDGE || height < MIN_CROP_EDGE) {
    throw new OcrApiError({
      status: 400,
      code: "INVALID_CROP_REGION",
      message: `Crop area is too small. Minimum crop width and height is ${MIN_CROP_EDGE}px.`,
    });
  }

  return {
    left,
    top,
    width,
    height,
  };
}

function calculateTargetWidth(
  sourceWidth: number | undefined,
  maxTargetWidth: number,
): number | undefined {
  if (!sourceWidth) {
    return undefined;
  }

  if (sourceWidth > maxTargetWidth) {
    return maxTargetWidth;
  }

  return undefined;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
