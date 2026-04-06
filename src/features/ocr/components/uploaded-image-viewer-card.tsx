"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Minus, Plus, RotateCcw } from "lucide-react";

type UploadedImageViewerCardProps = {
  file: File | null;
};

export function UploadedImageViewerCard({ file }: UploadedImageViewerCardProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setZoom(1);
    setPan({ x: 0, y: 0 });

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  function clampZoom(nextZoom: number): number {
    return Math.min(5, Math.max(1, nextZoom));
  }

  function zoomIn(): void {
    setZoom((current) => clampZoom(current + 0.25));
  }

  function zoomOut(): void {
    setZoom((current) => clampZoom(current - 0.25));
  }

  function resetView(): void {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>): void {
    if (!previewUrl) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    const step = event.deltaY < 0 ? 0.2 : -0.2;
    setZoom((current) => clampZoom(current + step));
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>): void {
    if (zoom <= 1) {
      return;
    }
    setIsDragging(true);
    dragStartRef.current = { x: event.clientX, y: event.clientY };
    panStartRef.current = { ...pan };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>): void {
    if (!isDragging) {
      return;
    }
    const deltaX = event.clientX - dragStartRef.current.x;
    const deltaY = event.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + deltaX,
      y: panStartRef.current.y + deltaY,
    });
  }

  function stopDragging(): void {
    setIsDragging(false);
  }

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171815]">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5 dark:border-white/8">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#145d66]/10 text-[#145d66] dark:bg-[#145d66]/20 dark:text-[#86d0d8]">
          <ImageIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">Uploaded image</p>
          <p className="text-xs text-slate-400 dark:text-stone-500">
            Preview the exact image used for OCR extraction.
          </p>
        </div>
      </div>

      <div className="p-5">
        {previewUrl ? (
          <div className="overflow-hidden rounded-[18px] border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#0f1110]">
            <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 text-xs dark:border-white/10">
              <p className="text-slate-500 dark:text-stone-400">Hold and drag to move image when zoomed.</p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="rounded-md border border-slate-200 p-1 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10"
                  onClick={zoomOut}
                >
                  <Minus className="h-3.5 w-3.5 text-slate-600 dark:text-stone-300" />
                </button>
                <span className="min-w-12 text-center font-medium text-slate-600 dark:text-stone-300">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 p-1 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10"
                  onClick={zoomIn}
                >
                  <Plus className="h-3.5 w-3.5 text-slate-600 dark:text-stone-300" />
                </button>
                <button
                  type="button"
                  className="rounded-md border border-slate-200 p-1 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10"
                  onClick={resetView}
                >
                  <RotateCcw className="h-3.5 w-3.5 text-slate-600 dark:text-stone-300" />
                </button>
              </div>
            </div>

            <div
              className="relative flex h-[560px] items-center justify-center overflow-hidden overscroll-contain"
              onWheelCapture={handleWheel}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerLeave={stopDragging}
              style={{ cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default" }}
            >
              <img
                alt={file?.name ?? "Uploaded receipt"}
                className="max-h-[560px] w-full select-none object-contain"
                draggable={false}
                src={previewUrl}
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-[18px] border border-dashed border-slate-200 bg-slate-50 text-center dark:border-white/10 dark:bg-white/3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/8">
              <ImageIcon className="h-5 w-5 text-slate-400 dark:text-stone-500" />
            </span>
            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-stone-400">
              No uploaded image yet
            </p>
            <p className="mt-1 text-xs text-slate-400 dark:text-stone-500">
              Choose or capture a receipt to preview it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
