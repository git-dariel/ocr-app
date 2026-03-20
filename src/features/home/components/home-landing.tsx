import Link from "next/link";
import { ArrowRight, FileImage, ShieldCheck, WandSparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: FileImage,
    title: "Receipt-Only OCR Pipeline",
    description:
      "Purpose-built upload and preprocessing flow for receipt images before OCR extraction.",
  },
  {
    icon: WandSparkles,
    title: "Preprocessing First",
    description:
      "Automatic grayscale, normalization, sharpening, and resize to improve extracted text quality.",
  },
  {
    icon: ShieldCheck,
    title: "Server-Side Architecture",
    description:
      "File validation, OCR invocation, and response shaping happen securely in backend route handlers.",
  },
];

export function HomeLanding() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-blue-100/40 p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
          Receipt OCR Application
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight text-slate-950 sm:text-5xl">
          Extract clean receipt text fast, with a production-ready OCR backend.
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
          Upload receipt images, run OCR with Google Vision, and review normalized `rawLines`
          for downstream parsing workflows.
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/extract">
              Open OCR Workspace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader className="pb-2">
              <feature.icon className="h-5 w-5 text-blue-700" />
              <CardTitle className="pt-2 text-base">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-600">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
