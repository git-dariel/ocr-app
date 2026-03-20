import type { Metadata } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
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
  title: "Receipt OCR",
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
        <div className="relative flex min-h-screen flex-col">
          <SileoProvider />
          <SiteHeader />
          <main className="flex min-h-0 flex-1 bg-background">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
