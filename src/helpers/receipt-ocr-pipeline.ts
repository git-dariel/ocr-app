import type { ReceiptOcrResponse } from "@/types/types";
import { preprocessReceiptImage } from "@/helpers/image-preprocessing";
import { validateReceiptUpload } from "@/validations/validation";
import { extractReceiptTextWithVision } from "@/services/vision-ocr-service";
import { parseReceiptText } from "@/helpers/receipt-text-parser";

export async function runReceiptOcrPipeline(formData: FormData): Promise<ReceiptOcrResponse> {
  const pipelineStartedAt = Date.now();

  const validationStartedAt = Date.now();
  const validatedUpload = await validateReceiptUpload(formData);
  const validationMs = Date.now() - validationStartedAt;

  const preprocessingStartedAt = Date.now();
  const preprocessedImage = await preprocessReceiptImage(validatedUpload);
  const preprocessingMs = Date.now() - preprocessingStartedAt;

  const ocrStartedAt = Date.now();
  const extractedText = await extractReceiptTextWithVision(preprocessedImage.processedImageBuffer);
  const ocrMs = Date.now() - ocrStartedAt;

  const parsingStartedAt = Date.now();
  const parsed = parseReceiptText(extractedText.text);
  const parsingMs = Date.now() - parsingStartedAt;
  const totalMs = Date.now() - pipelineStartedAt;

  return {
    text: extractedText.text,
    parsed,
    metadata: {
      image: preprocessedImage.metadata,
      ocr: extractedText.metadata,
      timingsMs: {
        validation: validationMs,
        preprocessing: preprocessingMs,
        ocr: ocrMs,
        parsing: parsingMs,
        total: totalMs,
      },
    },
  };
}
