"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useReceiptOcr } from "@/features/ocr/hooks/use-receipt-ocr";
import { useDeviceCamera } from "@/features/ocr/hooks/use-device-camera";

import { InputPanel } from "@/features/ocr/components/input-panel";
import { ExtractStatStrip } from "@/features/ocr/components/extract-stat-strip";
import { RawOutputCard } from "@/features/ocr/components/raw-output-card";
import { OcrMetadataCard } from "@/features/ocr/components/ocr-metadata-card";

export function ReceiptOcrWorkbench() {
  const { file, isSubmitting, result, copied, hasOutput, rawLinesText, selectFile, submit, copyRawLines } =
    useReceiptOcr();

  const { videoRef, isCameraOpen, isCameraLoading, isCameraReady, startCamera, stopCamera, capturePhoto } =
    useDeviceCamera();

  const [showUploadPanelMobile, setShowUploadPanelMobile] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await submit();
    if (success && typeof window !== "undefined" && window.innerWidth < 1280) {
      setShowUploadPanelMobile(false);
    }
  }

  const hideUploadOnMobile = hasOutput && !showUploadPanelMobile;

  const statusLabel = isSubmitting
    ? "Running OCR"
    : result
      ? "Output ready"
      : file
        ? "Ready to extract"
        : "Awaiting upload";

  const statusColor = isSubmitting
    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
    : result
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
      : file
        ? "bg-[#145d66]/10 text-[#145d66] dark:bg-[#145d66]/20 dark:text-[#86d0d8]"
        : "bg-slate-100 text-slate-500 dark:bg-white/8 dark:text-stone-400";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#11120f]">
      <DashboardTopbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-white/8 dark:text-stone-400 dark:hover:bg-white/12"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
                Extract
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-stone-400">
              Upload a receipt image and run the OCR pipeline to inspect raw lines.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", statusColor)}>
              {statusLabel}
            </span>
            {file && (
              <span className="max-w-[180px] truncate rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-stone-300">
                {file.name}
              </span>
            )}
          </div>
        </div>

        {/* Stat strip — visible after first result */}
        {result && <ExtractStatStrip result={result} />}

        {/* Main grid */}
        <div className={cn("mt-4 grid gap-4 pb-6 sm:mt-6 sm:gap-6 sm:pb-8", "xl:grid-cols-[360px_minmax(0,1fr)]")}>
          {/* Left: Input panel */}
          <div className={cn(hideUploadOnMobile && "hidden xl:block")}>
            <InputPanel
              file={file}
              isSubmitting={isSubmitting}
              isCameraOpen={isCameraOpen}
              isCameraLoading={isCameraLoading}
              isCameraReady={isCameraReady}
              videoRef={videoRef}
              onSelectFile={selectFile}
              onStartCamera={startCamera}
              onStopCamera={stopCamera}
              onCapturePhoto={capturePhoto}
              onSubmit={handleSubmit}
              onShowUploadPanel={() => setShowUploadPanelMobile(true)}
            />
          </div>

          {/* Right: Output column */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Mobile: extract-again banner */}
            {hideUploadOnMobile && (
              <div className="flex items-center justify-between gap-3 rounded-[20px] border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#171815] xl:hidden">
                <p className="text-sm text-slate-600 dark:text-stone-300">
                  Showing extraction output only.
                </p>
                <Button
                  onClick={() => setShowUploadPanelMobile(true)}
                  size="sm"
                  type="button"
                  variant="secondary"
                  className="rounded-full"
                >
                  <RotateCcw className="mr-2 h-3.5 w-3.5" />
                  Extract again
                </Button>
              </div>
            )}

            <RawOutputCard
              result={result}
              rawLinesText={rawLinesText}
              copied={copied}
              hideUploadOnMobile={hideUploadOnMobile}
              onCopyRawLines={copyRawLines}
              onShowUploadPanel={() => setShowUploadPanelMobile(true)}
            />

            <OcrMetadataCard result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
