export interface OcrApiErrorPayload {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
}

export interface OcrReceiptResponse {
  text: string;
  parsed: {
    rawLines: string[];
  };
  metadata: {
    image: {
      inputMimeType: string;
      inputSizeBytes: number;
      outputSizeBytes: number;
      outputMimeType?: string;
      processingProfile?: "fast" | "quality";
      originalDimensions: {
        width: number | null;
        height: number | null;
      };
      processedDimensions: {
        width: number;
        height: number;
      };
      appliedCrop: {
        left: number;
        top: number;
        width: number;
        height: number;
      } | null;
    };
    ocr: {
      pageCount: number;
      blockCount: number;
      wordCount: number;
      detectedLanguages: string[];
      averagePageConfidence: number | null;
    };
    timingsMs?: {
      validation: number;
      preprocessing: number;
      ocr: number;
      parsing: number;
      total: number;
    };
  };
}
