import { NextResponse } from "next/server";

import { normalizeOcrError } from "@/lib/errors";
import { runReceiptOcrPipeline } from "@/helpers/receipt-ocr-pipeline";
import { assertMultipartFormDataRequest } from "@/validations/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    assertMultipartFormDataRequest(request);
    const formData = await request.formData();
    const result = await runReceiptOcrPipeline(formData);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const normalizedError = normalizeOcrError(error);

    if (normalizedError.status >= 500) {
      console.error("OCR API failure", {
        code: normalizedError.code,
        message: normalizedError.message,
        details: normalizedError.details,
        cause: error instanceof Error ? error.stack : String(error),
      });
    }

    return NextResponse.json(
      {
        error: {
          code: normalizedError.code,
          message: normalizedError.message,
          ...(normalizedError.details ? { details: normalizedError.details } : {}),
        },
      },
      { status: normalizedError.status },
    );
  }
}
