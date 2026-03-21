"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ScanSearch,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";

const proofPoints = [
  {
    label: "Receipt intake",
    title: "Upload or capture one receipt without changing the operator flow.",
    description:
      "The workspace accepts photo capture and standard upload paths so frontline teams do not need a separate process.",
  },
  {
    label: "Image prep",
    title: "Preprocessing happens before OCR, not after the damage is done.",
    description:
      "Resize, normalization, grayscale, and sharpening steps are built into the request path for more stable extraction.",
  },
  {
    label: "Review output",
    title: "Raw lines stay readable and inspectable before downstream parsing starts.",
    description:
      "The product emphasizes operator review instead of hiding text output behind abstract parsing claims.",
  },
];

const workflowSteps = [
  {
    title: "Capture",
    description: "Select a file or open the camera directly in the OCR workspace.",
  },
  {
    title: "Extract",
    description: "Run the server-side pipeline and send the processed image to Google Vision.",
  },
  {
    title: "Review",
    description: "Inspect normalized raw lines and metadata before the next parsing step.",
  },
];

export function HomeLanding() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const visualY = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : 90]);
  const visualRotate = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : -4]);

  return (
    <div className="bg-[#11120f] text-stone-100">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,93,102,0.38),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.08),transparent_16%),linear-gradient(180deg,#11120f_0%,#151713_62%,#11120f_100%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-16 pt-28 sm:px-8 lg:min-h-svh lg:grid-cols-[0.95fr_0.85fr] lg:items-center lg:pb-24 lg:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[#86d0d8]">
              Operations-grade capture
            </p>
            <h1 className="mt-5 text-[clamp(2.6rem,10vw,8rem)] font-semibold lowercase tracking-[-0.06em] text-stone-100">
              ScanTalino.
            </h1>
            <p className="mt-5 max-w-xl text-[clamp(1.1rem,2.6vw,1.9rem)] leading-tight text-stone-100">
              Raw lines you can trust before parsing begins.
            </p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-stone-400 sm:text-base">
              Upload a receipt, preprocess the image, run Google Vision, and review clean extraction
              output in a workspace designed for receipt-heavy teams.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full border border-white/10 bg-white px-6 text-slate-950 hover:bg-stone-100"
              >
                <Link href="/sign-up">
                  Start free
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 rounded-full border border-white/12 bg-transparent px-6 text-stone-100 hover:bg-white/10"
                variant="ghost"
              >
                <Link href="/sign-in">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 sm:mt-14 sm:gap-6">
              <Metric label="Uptime-focused" value="Server-side OCR path" />
              <Metric label="Output target" value="Normalized raw lines" />
              <Metric label="Image flow" value="Camera + file upload" />
            </div>
          </motion.div>

          <motion.div
            className="relative hidden min-h-[720px] lg:block"
            style={{ y: visualY, rotate: visualRotate }}
          >
            <div className="absolute right-0 top-24 h-[560px] w-[420px] rounded-[40px] bg-[#ece3d5] shadow-[0_60px_140px_-68px_rgba(0,0,0,0.85)]" />
            <div className="absolute right-10 top-16 h-[560px] w-[420px] rounded-[40px] border border-white/10 bg-[#171815] shadow-[0_65px_140px_-65px_rgba(0,0,0,0.75)]" />
            <div className="absolute right-16 top-24 h-[560px] w-[420px] overflow-hidden rounded-[40px] border border-white/10 bg-[#f4ede2] text-slate-900 shadow-[0_70px_160px_-72px_rgba(0,0,0,0.9)]">
              <div className="border-b border-black/8 px-8 py-6">
                <p className="text-xs uppercase tracking-[0.2em] text-[#17838f]">Live OCR plane</p>
                <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Merchant intake</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  A visual anchor built around the receipt itself, not a generic dashboard card.
                </p>
              </div>

              <div className="relative h-full px-8 py-6">
                <motion.div
                  animate={reduceMotion ? undefined : { y: ["-12%", "76%", "-12%"] }}
                  className="pointer-events-none absolute inset-x-4 top-10 h-20 rounded-full bg-[linear-gradient(180deg,rgba(20,93,102,0.3),rgba(20,93,102,0.02))] blur-2xl"
                  transition={{
                    duration: 6.2,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />

                <div className="space-y-4 font-mono text-[13px] leading-6 text-slate-700">
                  <p>MERCHANT: HARBOR MARKET</p>
                  <p>DATE: 2026-03-21 14:08</p>
                  <p>ITEM 01 ORGANIC OATS 7.40</p>
                  <p>ITEM 02 ROASTED COFFEE 12.80</p>
                  <p>ITEM 03 FRESH CITRUS 5.60</p>
                  <p>SUBTOTAL 25.80</p>
                  <p>TAX 3.10</p>
                  <p>TOTAL 28.90</p>
                </div>

                <div className="mt-8 grid gap-3 border-t border-black/8 pt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Preprocessing</span>
                    <span className="font-semibold">Normalized + sharpened</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Provider</span>
                    <span className="font-semibold">Google Vision OCR</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Output</span>
                    <span className="font-semibold">Review-ready raw lines</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f3efe8] text-slate-900" id="workflow">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:py-24">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#17838f]">Workflow</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Every section has one job: capture, stabilize, then review.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-600 sm:text-base">
              The landing surface leads with one visual idea, then the product explains the
              operational sequence without drowning the user in feature cards.
            </p>
          </div>

          <div className="space-y-8">
            {proofPoints.map((item, index) => (
              <motion.div
                key={item.title}
                className="grid gap-4 border-t border-black/8 pt-6 first:border-t-0 first:pt-0 lg:grid-cols-[120px_1fr]"
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                viewport={{ once: true, amount: 0.25 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                <div>
                  <p className="text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
                    {item.title}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#171815] text-stone-100" id="workspace">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:py-24">
          <motion.div
            className="overflow-hidden rounded-[36px] border border-white/10 bg-[#11120f] shadow-[0_55px_130px_-72px_rgba(0,0,0,0.95)]"
            initial={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true, amount: 0.25 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="grid lg:min-h-[520px] lg:grid-cols-[180px_1fr]">
              <div className="border-b border-white/10 bg-[#0d0e0c] p-4 sm:p-6 lg:border-b-0 lg:border-r">
                <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Sidebar</p>
                <div className="mt-6 space-y-3">
                  <WorkspaceNavItem active icon={ScanSearch} label="Extract" />
                  <WorkspaceNavItem icon={Sparkles} label="Overview" />
                </div>
              </div>
              <div className="bg-[#f5efe4] p-6 text-slate-900">
                <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Authenticated surface
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                      Extraction stays inside the dashboard shell.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#145d66] px-3 py-1 text-xs font-semibold text-white">
                    Ready
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-[26px] border border-black/8 bg-white px-5 py-5">
                    <p className="text-sm font-semibold text-slate-950">Upload receipt</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Camera capture and file upload live in the same operational panel.
                    </p>
                  </div>
                  <div className="rounded-[26px] border border-black/8 bg-white px-5 py-5">
                    <p className="text-sm font-semibold text-slate-950">Parsed raw lines</p>
                    <p className="mt-2 font-mono text-[13px] leading-6 text-slate-700">
                      TOTAL 28.90
                      <br />
                      TAX 3.10
                      <br />
                      HARBOR MARKET
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#86d0d8]">Authenticated app</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
              One sidebar, one workspace, and no split between overview and extraction.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-400 sm:text-base">
              After sign-in, operators land in the dashboard and move into the extractor from the
              same shell. The navigation stays stable while the working surface changes.
            </p>

            <div className="mt-10 space-y-5">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="grid grid-cols-[44px_1fr] gap-4 border-t border-white/10 pt-5 first:border-t-0 first:pt-0"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/8 text-sm font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-stone-100">{step.title}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f3efe8] text-slate-900" id="cta">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
          <div className="rounded-[36px] border border-black/8 bg-[#11120f] px-6 py-10 text-stone-100 shadow-[0_50px_120px_-72px_rgba(0,0,0,0.9)] sm:px-10 sm:py-12">
            <p className="text-xs uppercase tracking-[0.22em] text-[#86d0d8]">Start now</p>
            <div className="mt-4 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl">
                  Move from landing page to dashboard without breaking the visual system.
                </h2>
                <p className="mt-4 text-sm leading-7 text-stone-400 sm:text-base">
                  Sign in or create a workspace, then keep extraction inside the authenticated
                  dashboard shell where operators already monitor the pipeline.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-full bg-white px-6 text-slate-950 hover:bg-stone-100"
                >
                  <Link href="/sign-up">Create workspace</Link>
                </Button>
                <Button
                  asChild
                  className="h-12 rounded-full border border-white/12 bg-transparent px-6 text-stone-100 hover:bg-white/10"
                  variant="ghost"
                >
                  <Link href="/dashboard">View dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.12em] text-stone-500 sm:text-xs sm:tracking-[0.18em]">
        {label}
      </p>
      <p className="mt-1.5 text-xs font-semibold text-stone-100 sm:mt-2 sm:text-sm">{value}</p>
    </div>
  );
}

function WorkspaceNavItem({
  active = false,
  icon: Icon,
  label,
}: {
  active?: boolean;
  icon: typeof WandSparkles;
  label: string;
}) {
  return (
    <div
      className={
        active
          ? "flex items-center gap-3 rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-stone-100"
          : "flex items-center gap-3 rounded-full px-4 py-3 text-sm text-stone-400"
      }
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      {active ? <CheckCircle2 className="ml-auto h-4 w-4" /> : null}
    </div>
  );
}
