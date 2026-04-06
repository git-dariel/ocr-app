import type {
  BirPurchaseLineItem,
  BirPurchaseTotals,
  BirStructuredReceipt,
} from "@/schemas/bir-receipt";

export type SupportedImageMimeType =
  | "image/jpeg"
  | "image/png"
  | "image/webp"
  | "image/tiff";

export interface CropRegion {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface ValidatedReceiptUpload {
  fileName: string;
  mimeType: SupportedImageMimeType;
  sizeBytes: number;
  imageBuffer: Buffer;
  cropRegion?: CropRegion;
}

export interface ImagePreprocessingMetadata {
  inputMimeType: SupportedImageMimeType;
  inputSizeBytes: number;
  outputSizeBytes: number;
  outputMimeType: "image/jpeg" | "image/png";
  processingProfile: "fast" | "quality";
  originalDimensions: {
    width: number | null;
    height: number | null;
  };
  processedDimensions: {
    width: number;
    height: number;
  };
  appliedCrop: CropRegion | null;
}

export interface ImagePreprocessingResult {
  processedImageBuffer: Buffer;
  metadata: ImagePreprocessingMetadata;
}

export interface OcrMetadata {
  pageCount: number;
  blockCount: number;
  wordCount: number;
  detectedLanguages: string[];
  averagePageConfidence: number | null;
}

export interface OcrExtractionResult {
  text: string;
  metadata: OcrMetadata;
}

export interface ReceiptOcrResponse {
  text: string;
  parsed: ParsedReceiptText;
  structured: BirStructuredReceipt;
  metadata: {
    image: ImagePreprocessingMetadata;
    ocr: OcrMetadata;
    timingsMs: {
      validation: number;
      preprocessing: number;
      ocr: number;
      parsing: number;
      structured: number;
      total: number;
    };
  };
}

export interface ParsedReceiptText {
  rawLines: string[];
}

export type { BirPurchaseLineItem, BirPurchaseTotals, BirStructuredReceipt };
