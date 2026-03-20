import type { ParsedReceiptText } from "@/types/types";

export function parseReceiptText(rawText: string): ParsedReceiptText {
  const rawLines = rawText
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0);

  return { rawLines };
}
