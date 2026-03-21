interface OcrApiErrorOptions {
  status: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
  cause?: unknown;
}

export class OcrApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown>;

  constructor(options: OcrApiErrorOptions) {
    super(options.message, { cause: options.cause });
    this.name = "OcrApiError";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }
}

export function normalizeOcrError(error: unknown): OcrApiError {
  if (error instanceof OcrApiError) {
    return error;
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new OcrApiError({
      status: 504,
      code: "OCR_TIMEOUT",
      message: "OCR request timed out.",
    });
  }

  return new OcrApiError({
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "Failed to process OCR request.",
  });
}
