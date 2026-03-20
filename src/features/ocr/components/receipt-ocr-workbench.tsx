"use client";

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Check,
  Copy,
  FileImage,
  FileText,
  ImagePlus,
  Loader2,
  RotateCcw,
  ScanText,
  X,
} from "lucide-react";

import { SUPPORTED_IMAGE_ACCEPT } from "@/features/ocr/constants";
import { useDeviceCamera } from "@/features/ocr/hooks/use-device-camera";
import { useReceiptOcr } from "@/features/ocr/hooks/use-receipt-ocr";
import { formatBytes } from "@/features/ocr/utils/format-bytes";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export function ReceiptOcrWorkbench() {
  const {
    file,
    isSubmitting,
    result,
    copied,
    hasOutput,
    rawLinesText,
    selectFile,
    submit,
    copyRawLines,
  } = useReceiptOcr();
  const [showUploadPanelMobile, setShowUploadPanelMobile] = useState(true);

  const filePickerRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = await submit();
    if (success && typeof window !== "undefined" && window.innerWidth < 1024) {
      setShowUploadPanelMobile(false);
    }
  }

  function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    selectFile(nextFile);
    if (isCameraOpen) {
      stopCamera();
    }
    // Allow re-selecting the same file on subsequent attempts.
    event.currentTarget.value = "";
  }

  function openFilePicker() {
    filePickerRef.current?.click();
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setShowUploadPanelMobile(true);
    }
  }

  const {
    videoRef,
    isCameraOpen,
    isCameraLoading,
    isCameraReady,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useDeviceCamera();

  function shouldUseNativeCameraCapture() {
    if (typeof window === "undefined") {
      return false;
    }

    const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
    return coarsePointer && window.innerWidth < 1024;
  }

  async function openCamera() {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setShowUploadPanelMobile(true);
    }

    if (shouldUseNativeCameraCapture()) {
      stopCamera();
      cameraInputRef.current?.click();
      return;
    }

    const started = await startCamera();
    if (!started) {
      cameraInputRef.current?.click();
    }
  }

  async function handleCapturePhoto() {
    const captured = await capturePhoto();
    if (!captured) {
      return;
    }

    selectFile(captured);
    stopCamera();
  }

  function showUploadAgain() {
    setShowUploadPanelMobile(true);
  }

  const hideUploadOnMobile = hasOutput && !showUploadPanelMobile;

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
          OCR Workspace
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">Receipt Text Extraction</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Upload one receipt image. The backend preprocesses it and runs Google Vision OCR.
        </p>
      </div>

      <div className="grid items-start gap-4 lg:grid-cols-[360px_1fr]">
        <Card className={cn("self-start", hideUploadOnMobile && "hidden lg:block")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-4 w-4 text-blue-700" />
              Upload Receipt
            </CardTitle>
            <CardDescription>Supported formats: JPEG, PNG, WEBP, TIFF</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Receipt Image</Label>

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

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <Button onClick={openFilePicker} type="button" variant="secondary">
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                  <Button disabled={isCameraLoading} onClick={openCamera} type="button" variant="secondary">
                    <Camera className="mr-2 h-4 w-4" />
                    {isCameraLoading ? "Opening..." : "Open Camera"}
                  </Button>
                </div>

                {isCameraOpen ? (
                  <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-2.5">
                    <video
                      ref={videoRef}
                      autoPlay
                      className="aspect-[4/3] w-full rounded-md border border-slate-200 bg-black object-cover"
                      muted
                      playsInline
                    />
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Button disabled={!isCameraReady} onClick={handleCapturePhoto} type="button">
                        <Camera className="mr-2 h-4 w-4" />
                        {isCameraReady ? "Capture Photo" : "Preparing Camera..."}
                      </Button>
                      <Button onClick={stopCamera} type="button" variant="secondary">
                        <CameraOff className="mr-2 h-4 w-4" />
                        Close Camera
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                  {file ? (
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-slate-900">{file.name}</p>
                        <p>
                          {file.type || "unknown type"} - {formatBytes(file.size)}
                        </p>
                      </div>
                      <Button
                        aria-label="Remove uploaded file"
                        onClick={() => selectFile(null)}
                        size="icon"
                        type="button"
                        variant="ghost"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-slate-500">No receipt selected yet.</p>
                  )}
                </div>

                <p className="text-xs text-slate-500">
                  Max size follows API limit (`OCR_MAX_FILE_SIZE_BYTES`, default 10MB).
                </p>
                <p className="text-xs text-slate-500">
                  Large camera photos are optimized automatically before upload to improve mobile compatibility.
                </p>
                <p className="text-xs text-slate-500">
                  Direct camera preview works on secure contexts (localhost/https) when permission is granted.
                </p>
              </div>

              <Button className="w-full" disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <ScanText className="mr-2 h-4 w-4" />
                    Extract Raw Lines
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {hideUploadOnMobile ? (
            <Card className="lg:hidden">
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <p className="text-sm text-slate-700">Showing extracted result only.</p>
                <Button onClick={showUploadAgain} size="sm" type="button" variant="secondary">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Extract Again
                </Button>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-700" />
                  Parsed Raw Lines
                </CardTitle>
                <Button
                  disabled={!hasOutput || !rawLinesText}
                  onClick={copyRawLines}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <CardDescription>
                Only `rawLines` are shown for clear and predictable downstream parsing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {result ? (
                <Textarea
                  className="min-h-40 font-mono text-xs leading-5"
                  readOnly
                  value={rawLinesText}
                />
              ) : (
                <div className="rounded-md border border-dashed border-slate-300 bg-slate-50/70 p-5 text-sm text-slate-500">
                  OCR output will appear here after upload.
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">OCR Metadata</CardTitle>
              <CardDescription>
                Operational details from preprocessing and OCR output.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4 text-sm text-slate-700">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{result.metadata.image.inputMimeType}</Badge>
                    <Badge variant="secondary">
                      {result.metadata.ocr.pageCount} page
                      {result.metadata.ocr.pageCount > 1 ? "s" : ""}
                    </Badge>
                    <Badge variant="secondary">{result.metadata.ocr.wordCount} words</Badge>
                  </div>

                  <Separator />

                  <dl className="grid gap-2 sm:grid-cols-2">
                    <MetaItem
                      label="Original Size"
                      value={formatBytes(result.metadata.image.inputSizeBytes)}
                    />
                    <MetaItem
                      label="Processed Size"
                      value={formatBytes(result.metadata.image.outputSizeBytes)}
                    />
                    <MetaItem
                      label="Original Resolution"
                      value={`${result.metadata.image.originalDimensions.width ?? "-"} x ${result.metadata.image.originalDimensions.height ?? "-"}`}
                    />
                    <MetaItem
                      label="Processed Resolution"
                      value={`${result.metadata.image.processedDimensions.width} x ${result.metadata.image.processedDimensions.height}`}
                    />
                    <MetaItem
                      label="Detected Languages"
                      value={
                        result.metadata.ocr.detectedLanguages.length > 0
                          ? result.metadata.ocr.detectedLanguages.join(", ")
                          : "-"
                      }
                    />
                    <MetaItem
                      label="Avg Confidence"
                      value={
                        result.metadata.ocr.averagePageConfidence !== null
                          ? String(result.metadata.ocr.averagePageConfidence)
                          : "-"
                      }
                    />
                    <MetaItem
                      label="Preprocessing Time"
                      value={
                        result.metadata.timingsMs
                          ? `${result.metadata.timingsMs.preprocessing} ms`
                          : "-"
                      }
                    />
                    <MetaItem
                      label="OCR Time"
                      value={
                        result.metadata.timingsMs
                          ? `${result.metadata.timingsMs.ocr} ms`
                          : "-"
                      }
                    />
                    <MetaItem
                      label="Total Time"
                      value={
                        result.metadata.timingsMs
                          ? `${result.metadata.timingsMs.total} ms`
                          : "-"
                      }
                    />
                  </dl>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Metadata will appear after a successful run.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-2.5">
      <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
      <dd className="mt-1 font-medium text-slate-900">{value}</dd>
    </div>
  );
}
