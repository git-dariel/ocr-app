"use client";

import { Check, Copy, FileText, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { OcrReceiptResponse } from "@/features/ocr/types";

type RawOutputCardProps = {
  result: OcrReceiptResponse | null;
  rawLinesText: string;
  copied: boolean;
  hideUploadOnMobile: boolean;
  onCopyRawLines: () => Promise<void>;
  onShowUploadPanel: () => void;
};

export function RawOutputCard({
  result,
  rawLinesText,
  copied,
  hideUploadOnMobile,
  onCopyRawLines,
  onShowUploadPanel,
}: RawOutputCardProps) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171815]">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#145d66]/10 text-[#145d66] dark:bg-[#145d66]/20 dark:text-[#86d0d8]">
            <FileText className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
              Parsed raw lines
            </p>
            <p className="text-xs text-slate-400 dark:text-stone-500">
              Reviewable output for downstream parsing or manual verification.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            disabled={!result || !rawLinesText}
            onClick={onCopyRawLines}
            size="sm"
            type="button"
            variant="secondary"
            className="rounded-full"
          >
            {copied ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-1.5 h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>
          {hideUploadOnMobile && (
            <Button
              onClick={onShowUploadPanel}
              size="sm"
              type="button"
              variant="secondary"
              className="rounded-full"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Upload
            </Button>
          )}
        </div>
      </div>

      <div className="p-5">
        {result ? (
          <Textarea
            className="min-h-[400px] rounded-[18px] border-slate-200 bg-slate-50 px-5 py-4 font-mono text-xs leading-6 text-slate-800 placeholder:text-slate-400 dark:border-white/10 dark:bg-[#0f1110] dark:text-stone-100 dark:placeholder:text-stone-500"
            readOnly
            value={rawLinesText}
          />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-slate-200 bg-slate-50 py-20 text-center dark:border-white/10 dark:bg-white/3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/8">
              <FileText className="h-5 w-5 text-slate-400 dark:text-stone-500" />
            </span>
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-stone-400">
              No output yet
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-stone-500">
              OCR output appears here after a successful extraction run.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
