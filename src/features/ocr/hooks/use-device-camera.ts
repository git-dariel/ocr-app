"use client";

import { useEffect, useRef, useState } from "react";
import { sileo } from "sileo";

import { CAMERA_CONSTRAINTS } from "@/features/ocr/constants";

export function useDeviceCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);

  const isCameraSupported =
    typeof navigator !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia);

  async function startCamera(): Promise<boolean> {
    if (!isCameraSupported) {
      sileo.warning({
        title: "Camera unavailable",
        description: "Live camera is not supported by this browser.",
      });
      return false;
    }

    setIsCameraLoading(true);

    try {
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
      streamRef.current = stream;
      setIsCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }

      return true;
    } catch {
      sileo.warning({
        title: "Camera blocked",
        description:
          "Camera access was blocked or unavailable. You can still upload from file picker.",
      });
      setIsCameraOpen(false);
      return false;
    } finally {
      setIsCameraLoading(false);
    }
  }

  function stopCamera(): void {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsCameraOpen(false);
  }

  async function capturePhoto(): Promise<File | null> {
    if (!videoRef.current) {
      sileo.warning({
        title: "Camera not ready",
        description: "Camera preview is not ready yet.",
      });
      return null;
    }

    const video = videoRef.current;
    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      sileo.warning({
        title: "Camera not ready",
        description: "Camera preview is not ready yet.",
      });
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) {
      sileo.error({
        title: "Capture failed",
        description: "Unable to capture camera frame.",
      });
      return null;
    }

    context.drawImage(video, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((value) => resolve(value), "image/jpeg", 0.92);
    });

    if (!blob) {
      sileo.error({
        title: "Capture failed",
        description: "Unable to capture camera frame.",
      });
      return null;
    }

    return new File([blob], `receipt-${Date.now()}.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  }

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    isCameraSupported,
    isCameraOpen,
    isCameraLoading,
    startCamera,
    stopCamera,
    capturePhoto,
  };
}
