import type { Metadata } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { SileoProvider } from "@/components/providers/sileo-provider";

import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Receipt OCR",
    template: "%s | Receipt OCR",
  },
  description: "Receipt OCR extraction workspace powered by Google Vision API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${ibmPlexMono.variable} min-h-screen antialiased`}
    >
      <body suppressHydrationWarning className="min-h-screen bg-background font-sans text-foreground">
        <SileoProvider />
        {children}
      </body>
    </html>
  );
}
