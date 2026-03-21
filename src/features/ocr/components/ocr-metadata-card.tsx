import { formatBytes } from "@/features/ocr/utils/format-bytes";
import { MetaItem } from "@/features/ocr/components/meta-item";
import type { OcrReceiptResponse } from "@/features/ocr/types";

export function OcrMetadataCard({ result }: { result: OcrReceiptResponse | null }) {
  const { image, ocr, timingsMs } = result?.metadata ?? {};

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171815]">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/8">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">OCR Metadata</p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-stone-500">
            Preprocessing and OCR response details.
          </p>
        </div>
        {result && (
          <div className="flex shrink-0 flex-wrap gap-2">
            <span className="rounded-full bg-[#145d66]/10 px-2.5 py-1 text-xs font-medium text-[#145d66] dark:bg-[#145d66]/20 dark:text-[#86d0d8]">
              {image!.inputMimeType}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-white/8 dark:text-stone-300">
              {ocr!.pageCount} page{ocr!.pageCount > 1 ? "s" : ""}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-white/8 dark:text-stone-300">
              {ocr!.wordCount} words
            </span>
          </div>
        )}
      </div>

      <div className="p-5 pb-6">
        {result ? (
          <dl className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <MetaItem label="Original size" value={formatBytes(image!.inputSizeBytes)} />
            <MetaItem label="Processed size" value={formatBytes(image!.outputSizeBytes)} />
            <MetaItem
              label="Original resolution"
              value={`${image!.originalDimensions.width ?? "-"} × ${image!.originalDimensions.height ?? "-"}`}
            />
            <MetaItem
              label="Processed resolution"
              value={`${image!.processedDimensions.width} × ${image!.processedDimensions.height}`}
            />
            <MetaItem
              label="Languages detected"
              value={ocr!.detectedLanguages.length > 0 ? ocr!.detectedLanguages.join(", ") : "—"}
            />
            <MetaItem
              label="Avg confidence"
              value={ocr!.averagePageConfidence !== null ? String(ocr!.averagePageConfidence) : "—"}
            />
            <MetaItem
              label="Preprocessing"
              value={timingsMs ? `${timingsMs.preprocessing} ms` : "—"}
            />
            <MetaItem label="OCR time" value={timingsMs ? `${timingsMs.ocr} ms` : "—"} />
            <MetaItem label="Total time" value={timingsMs ? `${timingsMs.total} ms` : "—"} />
          </dl>
        ) : (
          <p className="text-sm text-slate-400 dark:text-stone-500">
            Metadata will appear after a successful extraction run.
          </p>
        )}
      </div>
    </div>
  );
}
