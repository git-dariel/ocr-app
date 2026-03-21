import Link from "next/link";
import { ArrowRight, CheckCircle2, ScanSearch, ShieldCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthField = {
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
};

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  submitLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  secondaryPrompt: string;
  fields: AuthField[];
};

const FEATURES = [
  {
    icon: ScanSearch,
    title: "Receipt-first OCR",
    description: "One workspace for capture, extraction, and raw-line review.",
  },
  {
    icon: ShieldCheck,
    title: "Secure pipeline",
    description: "Validation and OCR execution stay in secure server-side flows.",
  },
  {
    icon: CheckCircle2,
    title: "Operator-friendly output",
    description: "Raw lines are easy to inspect before downstream parsing begins.",
  },
];

export function AuthShell({
  eyebrow,
  title,
  description,
  submitLabel,
  secondaryHref,
  secondaryLabel,
  secondaryPrompt,
  fields,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.1fr_0.9fr]">

      {/* ── Left panel — dark brand side ──────────────────────────────────── */}
      <section className="relative hidden overflow-hidden bg-[#11120f] lg:flex lg:flex-col lg:justify-between">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-[480px] w-[480px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-[#145d66]/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[300px] w-[300px] translate-x-1/4 translate-y-1/4 rounded-full bg-[#145d66]/10 blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="relative px-10 pt-12">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#145d66] font-mono text-sm font-bold text-white shadow-sm">
              s.
            </span>
            <div>
              <p className="text-[11px] tracking-[0.2em] text-[#86d0d8] lowercase">ScanTalino</p>
              <p className="text-sm font-semibold text-stone-100">Capture Workspace</p>
            </div>
          </Link>
        </div>

        {/* Hero copy */}
        <div className="relative px-10 py-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86d0d8]">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-[1.08] text-stone-100 xl:text-5xl">
            Keep extraction work close to the people who review it.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-stone-400">
            A focused workspace for teams that need receipt capture, OCR output, and parsing prep in
            one place — no clutter, no friction.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative border-t border-white/8 px-10 pb-12">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 border-b border-white/8 py-5 last:border-b-0"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/6">
                <feature.icon className="h-4 w-4 text-[#86d0d8]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-stone-100">{feature.title}</p>
                <p className="mt-0.5 text-sm leading-6 text-stone-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Right panel — form side ───────────────────────────────────────── */}
      <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-8 lg:px-10">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <Link href="/" className="mb-8 inline-flex items-center gap-3 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#145d66] font-mono text-sm font-bold text-white">
              s.
            </span>
            <div>
              <p className="text-[11px] tracking-[0.2em] text-[#145d66] lowercase">ScanTalino</p>
              <p className="text-sm font-semibold text-slate-900">Capture Workspace</p>
            </div>
          </Link>

          {/* Form card */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {/* Eyebrow + heading */}
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#145d66]">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

            {/* Form */}
            <form className="mt-7 space-y-4">
              {fields.map((field) => (
                <div key={field.label} className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">{field.label}</Label>
                  <Input
                    autoComplete={field.autoComplete}
                    className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus-visible:border-[#145d66] focus-visible:ring-[#145d66]/20"
                    placeholder={field.placeholder}
                    type={field.type}
                  />
                </div>
              ))}

              {/* Submit */}
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#145d66] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0e4d55]"
                >
                  {submitLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-100" />
              <span className="text-xs text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            {/* Secondary action */}
            <Link
              href={secondaryHref}
              className="flex h-11 w-full items-center justify-center rounded-full border border-slate-200 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              {secondaryLabel}
            </Link>

            {/* Footer prompt */}
            <p className="mt-5 text-center text-sm text-slate-500">
              {secondaryPrompt}{" "}
              <Link
                href={secondaryHref}
                className="font-semibold text-[#145d66] transition-colors hover:text-[#0e4d55]"
              >
                {secondaryLabel}
              </Link>
            </p>
          </div>

          {/* Bottom note */}
          <p className="mt-6 text-center text-xs text-slate-400">
            By continuing, you agree to our{" "}
            <span className="font-medium text-slate-500">Terms of Service</span> and{" "}
            <span className="font-medium text-slate-500">Privacy Policy</span>.
          </p>
        </div>
      </section>
    </main>
  );
}
