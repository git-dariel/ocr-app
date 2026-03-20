"use client";

import {
  OCR_UPLOAD_IMAGE_MAX_DIMENSION_PX,
  OCR_UPLOAD_TARGET_MAX_FILE_SIZE_BYTES,
} from "@/features/ocr/constants";

const JPEG_QUALITY_STEPS = [0.86, 0.78, 0.7, 0.62];
const SCALE_STEPS = [1, 0.9, 0.8, 0.7];

export async function optimizeUploadImage(file: File): Promise<File> {
  if (typeof document === "undefined" || file.size <= OCR_UPLOAD_TARGET_MAX_FILE_SIZE_BYTES) {
    return file;
  }

  if (!file.type.startsWith("image/") || file.type === "image/tiff") {
    return file;
  }

  const loadedImage = await loadImage(file).catch(() => null);
  if (!loadedImage) {
    return file;
  }

  const { image, cleanup } = loadedImage;

  try {
    const baseDimensions = constrainDimensions(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return file;
    }

    let smallestBlob: Blob | null = null;

    for (const scale of SCALE_STEPS) {
      const targetWidth = Math.max(1, Math.round(baseDimensions.width * scale));
      const targetHeight = Math.max(1, Math.round(baseDimensions.height * scale));

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      context.clearRect(0, 0, targetWidth, targetHeight);
      context.drawImage(image, 0, 0, targetWidth, targetHeight);

      for (const quality of JPEG_QUALITY_STEPS) {
        const blob = await canvasToBlob(canvas, quality);
        if (!blob) {
          continue;
        }

        if (!smallestBlob || blob.size < smallestBlob.size) {
          smallestBlob = blob;
        }

        if (blob.size <= OCR_UPLOAD_TARGET_MAX_FILE_SIZE_BYTES) {
          return createOptimizedFile(file, blob);
        }
      }
    }

    return smallestBlob ? createOptimizedFile(file, smallestBlob) : file;
  } finally {
    cleanup();
  }
}

function constrainDimensions(width: number, height: number): { width: number; height: number } {
  const largestSide = Math.max(width, height);
  if (largestSide <= OCR_UPLOAD_IMAGE_MAX_DIMENSION_PX) {
    return { width, height };
  }

  const scale = OCR_UPLOAD_IMAGE_MAX_DIMENSION_PX / largestSide;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

function loadImage(file: File): Promise<{ image: HTMLImageElement; cleanup: () => void }> {
  const objectUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      resolve({
        image,
        cleanup: () => URL.revokeObjectURL(objectUrl),
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to load image for upload optimization."));
    };

    image.src = objectUrl;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });
}

function createOptimizedFile(sourceFile: File, blob: Blob): File {
  const fileName = replaceExtensionWithJpeg(sourceFile.name);

  return new File([blob], fileName, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

function replaceExtensionWithJpeg(fileName: string): string {
  const extensionPattern = /\.[^.]+$/;
  if (!extensionPattern.test(fileName)) {
    return `${fileName}.jpg`;
  }

  return fileName.replace(extensionPattern, ".jpg");
}
