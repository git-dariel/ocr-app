"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { sileo } from "sileo";

import { extractReceiptText } from "@/features/ocr/api/extract-receipt-text";
import {
  COPY_FEEDBACK_DURATION_MS,
  EMPTY_FILE_ERROR_MESSAGE,
  REQUEST_ERROR_FALLBACK_MESSAGE,
} from "@/features/ocr/constants";
import type { OcrReceiptResponse } from "@/features/ocr/types";
import { optimizeUploadImage } from "@/features/ocr/utils/optimize-upload-image";

export function useReceiptOcr() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<OcrReceiptResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const copyResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasOutput = result !== null;
  const rawLinesText = useMemo(
    () => result?.parsed.rawLines.join("\n") ?? "",
    [result],
  );

  function selectFile(nextFile: File | null): void {
    setResult(null);
    setFile(nextFile);

    if (nextFile) {
      sileo.success({
        title: "Uploaded successfully",
        description: `${nextFile.name} is ready for extraction.`,
      });
    }
  }

  async function submit(): Promise<boolean> {
    if (!file) {
      sileo.warning({
        title: "No receipt selected",
        description: EMPTY_FILE_ERROR_MESSAGE,
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      const uploadFile = await optimizeUploadImage(file);

      const response = await sileo.promise(extractReceiptText(uploadFile), {
        loading: {
          title: "Processing receipt",
          description: "Optimizing image, preprocessing, and extracting text...",
        },
        success: (data) => ({
          title: "Text extracted",
          description: `${data.parsed.rawLines.length} raw line(s) ready.`,
        }),
        error: (error) => ({
          title: "OCR request failed",
          description:
            error instanceof Error
              ? error.message
              : REQUEST_ERROR_FALLBACK_MESSAGE,
        }),
      });

      setResult(response);
      return true;
    } catch {
      setResult(null);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyRawLines(): Promise<void> {
    if (!rawLinesText) {
      sileo.warning({
        title: "Nothing to copy",
        description: "Run OCR first to generate raw lines.",
      });
      return;
    }

    setCopied(true);
    if (copyResetTimerRef.current) {
      clearTimeout(copyResetTimerRef.current);
    }
    copyResetTimerRef.current = setTimeout(() => {
      setCopied(false);
    }, COPY_FEEDBACK_DURATION_MS);
    sileo.info({
      title: "Copied",
      description: "Raw lines copied to clipboard.",
    });

    const copiedSuccessfully = await copyTextFast(rawLinesText);
    if (!copiedSuccessfully) {
      setCopied(false);
      sileo.error({
        title: "Copy failed",
        description: "Unable to copy text automatically. Please copy manually.",
      });
    }
  }

  useEffect(() => {
    return () => {
      if (copyResetTimerRef.current) {
        clearTimeout(copyResetTimerRef.current);
      }
    };
  }, []);

  async function copyTextFast(text: string): Promise<boolean> {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fallback below for environments that block Clipboard API.
      }
    }

    if (typeof document === "undefined") {
      return false;
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      textArea.style.pointerEvents = "none";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);
      const copiedFromFallback = document.execCommand("copy");
      document.body.removeChild(textArea);
      return copiedFromFallback;
    } catch {
      return false;
    }
  }

  return {
    file,
    isSubmitting,
    result,
    copied,
    hasOutput,
    rawLinesText,
    selectFile,
    submit,
    copyRawLines,
  };
}
