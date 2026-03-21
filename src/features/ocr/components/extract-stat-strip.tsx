import { Clock, ScanText, Type } from "lucide-react";

import type { OcrReceiptResponse } from "@/features/ocr/types";

export function ExtractStatStrip({ result }: { result: OcrReceiptResponse }) {
  const { ocr, timingsMs } = result.metadata;

  return (
    <div className="mt-4 grid grid-cols-3 gap-3 sm:mt-6 sm:gap-4">
      {/* Words extracted — highlighted tile */}
      <div className="rounded-[16px] border border-transparent bg-[#145d66] px-3 py-3 sm:rounded-[20px] sm:px-5 sm:py-4">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ScanText className="h-3.5 w-3.5 text-white/70 sm:h-4 sm:w-4" />
          <p className="text-[11px] font-medium text-white/70 sm:text-xs">Words</p>
        </div>
        <p className="mt-1.5 text-2xl font-bold text-white sm:mt-2 sm:text-3xl">
          {ocr.wordCount}
        </p>
      </div>

      {/* Total time */}
      <div className="rounded-[16px] border border-slate-200 bg-white px-3 py-3 shadow-sm sm:rounded-[20px] sm:px-5 sm:py-4 dark:border-white/10 dark:bg-[#171815]">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Clock className="h-3.5 w-3.5 text-slate-400 sm:h-4 sm:w-4 dark:text-stone-500" />
          <p className="text-[11px] font-medium text-slate-400 sm:text-xs dark:text-stone-500">
            Total time
          </p>
        </div>
        <p className="mt-1.5 text-2xl font-bold text-slate-900 sm:mt-2 sm:text-3xl dark:text-stone-100">
          {timingsMs ? timingsMs.total : "-"}
          <span className="ml-1 text-sm font-normal text-slate-400 sm:text-base dark:text-stone-500">
            ms
          </span>
        </p>
      </div>

      {/* Pages scanned */}
      <div className="rounded-[16px] border border-slate-200 bg-white px-3 py-3 shadow-sm sm:rounded-[20px] sm:px-5 sm:py-4 dark:border-white/10 dark:bg-[#171815]">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Type className="h-3.5 w-3.5 text-slate-400 sm:h-4 sm:w-4 dark:text-stone-500" />
          <p className="text-[11px] font-medium text-slate-400 sm:text-xs dark:text-stone-500">
            Pages
          </p>
        </div>
        <p className="mt-1.5 text-2xl font-bold text-slate-900 sm:mt-2 sm:text-3xl dark:text-stone-100">
          {ocr.pageCount}
          <span className="ml-1 text-sm font-normal text-slate-400 sm:text-base dark:text-stone-500">
            pg
          </span>
        </p>
      </div>
    </div>
  );
}
