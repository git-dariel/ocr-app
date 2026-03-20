"use client";

import { Toaster } from "sileo";

export function SileoProvider() {
  return (
    <Toaster
      position="top-center"
      offset={{ top: 72 }}
      options={{
        roundness: 14,
      }}
      theme="light"
    />
  );
}
