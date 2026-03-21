"use client";

import { type ChangeEvent, type FormEvent, useRef } from "react";
import { Camera, CameraOff, FileImage, ImagePlus, Loader2, ScanText, Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SUPPORTED_IMAGE_ACCEPT } from "@/features/ocr/constants";
import { formatBytes } from "@/features/ocr/utils/format-bytes";

type InputPanelProps = {
  file: File | null;
  isSubmitting: boolean;
  isCameraOpen: boolean;
  isCameraLoading: boolean;
  isCameraReady: boolean;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  onSelectFile: (file: File | null) => void;
  onStartCamera: () => Promise<boolean>;
  onStopCamera: () => void;
  onCapturePhoto: () => Promise<File | null>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onShowUploadPanel?: () => void;
};

function shouldUseNativeCameraCapture(): boolean {
  if (typeof window === "undefined") return false;
  const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  return coarsePointer && window.innerWidth < 1024;
}

export function InputPanel({
  file,
  isSubmitting,
  isCameraOpen,
  isCameraLoading,
  isCameraReady,
  videoRef,
  onSelectFile,
  onStartCamera,
  onStopCamera,
  onCapturePhoto,
  onSubmit,
  onShowUploadPanel,
}: InputPanelProps) {
  const filePickerRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    onSelectFile(nextFile);
    if (isCameraOpen) onStopCamera();
    event.currentTarget.value = "";
  }

  function openFilePicker() {
    filePickerRef.current?.click();
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      onShowUploadPanel?.();
    }
  }

  async function openCamera() {
    if (typeof window !== "undefined" && window.innerWidth < 1280) {
      onShowUploadPanel?.();
    }
    if (shouldUseNativeCameraCapture()) {
      onStopCamera();
      cameraInputRef.current?.click();
      return;
    }
    const started = await onStartCamera();
    if (!started) cameraInputRef.current?.click();
  }

  async function handleCapturePhoto() {
    const captured = await onCapturePhoto();
    if (!captured) return;
    onSelectFile(captured);
    onStopCamera();
  }

  return (
    <aside className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815] xl:sticky xl:top-6 xl:self-start">
      <div className="border-b border-slate-100 px-4 py-3.5 sm:px-5 sm:py-4 dark:border-white/8">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">
            Input Panel
          </p>
          {file && (
            <button
              onClick={() => onSelectFile(null)}
              className="text-xs text-slate-400 transition-colors hover:text-slate-600 dark:text-stone-500 dark:hover:text-stone-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <form className="p-4 sm:p-5" onSubmit={onSubmit}>
        {/* Dropzone */}
        <div className="rounded-[16px] border-2 border-dashed border-slate-200 bg-slate-50 p-4 sm:rounded-[20px] sm:p-6 dark:border-white/10 dark:bg-white/4">
          {file ? (
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#145d66]/10 text-[#145d66] dark:bg-[#145d66]/20 dark:text-[#86d0d8]">
                <FileImage className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-stone-100">
                  {file.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-stone-500">
                  {file.type || "unknown"} · {formatBytes(file.size)}
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400">
                    Ready to extract
                  </span>
                </div>
              </div>
              <button
                onClick={() => onSelectFile(null)}
                type="button"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-white/10 dark:hover:text-stone-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#145d66]/10 dark:bg-[#145d66]/20">
                <Upload className="h-6 w-6 text-[#145d66] dark:text-[#86d0d8]" />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-stone-300">
                Drop your receipt here
              </p>
              <p className="mt-1 text-xs text-slate-400 dark:text-stone-500">
                JPEG · PNG · WEBP · TIFF
              </p>
            </div>
          )}
        </div>

        {/* Hidden inputs */}
        <input
          ref={filePickerRef}
          accept={SUPPORTED_IMAGE_ACCEPT}
          className="sr-only"
          onChange={handleFileSelection}
          type="file"
        />
        <input
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          className="sr-only"
          onChange={handleFileSelection}
          type="file"
        />

        {/* Action buttons */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            className="h-10 justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-stone-100"
            onClick={openFilePicker}
            type="button"
            variant="secondary"
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Choose file
          </Button>
          <Button
            className="h-10 justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-white/10 dark:bg-white/8 dark:text-stone-300 dark:hover:bg-white/12"
            disabled={isCameraLoading}
            onClick={openCamera}
            type="button"
            variant="ghost"
          >
            <Camera className="mr-2 h-4 w-4" />
            {isCameraLoading ? "Loading…" : "Open camera"}
          </Button>
        </div>

        {/* Camera live view */}
        {isCameraOpen && (
          <div className="mt-4 space-y-3 rounded-[20px] border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-black/20">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                Live camera
              </p>
              <p className="text-xs text-slate-400 dark:text-stone-500">
                Capture a fresh receipt without leaving the page.
              </p>
            </div>
            <video
              ref={videoRef}
              autoPlay
              className="aspect-4/3 w-full rounded-[16px] border border-slate-200 bg-black object-cover dark:border-white/10"
              muted
              playsInline
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                disabled={!isCameraReady}
                onClick={handleCapturePhoto}
                type="button"
                className="rounded-full bg-[#145d66] text-white hover:bg-[#0e4d55]"
              >
                <Camera className="mr-2 h-4 w-4" />
                {isCameraReady ? "Capture" : "Preparing..."}
              </Button>
              <Button
                onClick={onStopCamera}
                type="button"
                variant="secondary"
                className="rounded-full"
              >
                <CameraOff className="mr-2 h-4 w-4" />
                Close
              </Button>
            </div>
          </div>
        )}

        <Separator className="my-4 sm:my-5 dark:bg-white/8" />

        {/* Tips */}
        <div className="space-y-1.5 text-xs leading-5 text-slate-400 dark:text-stone-500">
          <p>Large photos are optimised automatically before upload.</p>
          <p>Camera preview requires a secure context and permission.</p>
        </div>

        {/* Submit */}
        <Button
          className="mt-4 h-11 w-full rounded-full bg-[#145d66] text-white shadow-sm hover:bg-[#0e4d55] sm:mt-5 sm:h-12 dark:hover:bg-[#1a7a86]"
          disabled={isSubmitting || !file}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <ScanText className="mr-2 h-4 w-4" />
              Extract raw lines
            </>
          )}
        </Button>
      </form>
    </aside>
  );
}
