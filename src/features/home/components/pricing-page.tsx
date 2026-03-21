"use client";

import Link from "next/link";
import { ArrowUpRight, Check, Minus } from "lucide-react";
import { motion } from "framer-motion";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Starter",
    eyebrow: "For individuals",
    price: "Free",
    priceNote: "forever",
    description:
      "Everything you need to start scanning and reviewing receipts in a single workspace.",
    cta: { label: "Get started", href: "/sign-up", primary: false },
    features: [
      { label: "Up to 50 extractions / month", included: true },
      { label: "Camera + file upload", included: true },
      { label: "Image preprocessing pipeline", included: true },
      { label: "Raw OCR line review", included: true },
      { label: "Google Vision provider", included: true },
      { label: "Team members", included: false },
      { label: "Priority processing", included: false },
      { label: "API access", included: false },
    ],
  },
  {
    name: "Pro",
    eyebrow: "Most popular",
    price: "$19",
    priceNote: "per month",
    description:
      "For growing teams that need higher volume, team collaboration, and faster processing queues.",
    cta: { label: "Start free trial", href: "/sign-up", primary: true },
    highlight: true,
    features: [
      { label: "Up to 2 000 extractions / month", included: true },
      { label: "Camera + file upload", included: true },
      { label: "Image preprocessing pipeline", included: true },
      { label: "Raw OCR line review", included: true },
      { label: "Google Vision provider", included: true },
      { label: "Up to 5 team members", included: true },
      { label: "Priority processing", included: true },
      { label: "API access", included: false },
    ],
  },
  {
    name: "Enterprise",
    eyebrow: "For large teams",
    price: "Custom",
    priceNote: "contact us",
    description:
      "Unlimited volume, dedicated support, API access, and custom integrations for receipt-heavy operations.",
    cta: { label: "Contact sales", href: "/sign-up", primary: false },
    features: [
      { label: "Unlimited extractions", included: true },
      { label: "Camera + file upload", included: true },
      { label: "Image preprocessing pipeline", included: true },
      { label: "Raw OCR line review", included: true },
      { label: "Google Vision provider", included: true },
      { label: "Unlimited team members", included: true },
      { label: "Priority processing", included: true },
      { label: "API access", included: true },
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: "What counts as an extraction?",
    a: "Each time you submit a receipt image through the OCR workspace and receive a result counts as one extraction, regardless of page count.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. You can upgrade or downgrade your plan at any time from your account settings. Billing is prorated for the current cycle.",
  },
  {
    q: "What image formats are supported?",
    a: "The workspace accepts JPEG, PNG, WEBP, and HEIC files. Camera capture uses JPEG natively across supported browsers.",
  },
  {
    q: "Is Google Vision required?",
    a: "The current pipeline routes through Google Vision OCR for best-in-class accuracy on receipt text. Additional providers are on the roadmap.",
  },
];

export function PricingPage() {
  return (
    <div className="bg-[#11120f] text-stone-100">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,93,102,0.32),transparent_55%)]" />
        <motion.div
          className="relative mx-auto max-w-3xl px-4 text-center sm:px-8"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.24em] text-[#86d0d8]">Pricing</p>
          <h1 className="mt-5 text-[clamp(2.4rem,7vw,5rem)] font-semibold leading-none tracking-[-0.05em] text-stone-100">
            Simple, honest pricing.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-stone-400 sm:text-base">
            Start for free and scale when your team grows. No hidden fees, no extraction surprises —
            just a clean receipt workspace at every tier.
          </p>
        </motion.div>
      </section>

      {/* Plan cards */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-8 sm:pb-28">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={cn(
                "flex flex-col rounded-[28px] border p-6 sm:p-8",
                plan.highlight
                  ? "border-[#145d66]/60 bg-[#0d1a1c] shadow-[0_0_0_1px_rgba(20,93,102,0.25),0_40px_100px_-48px_rgba(20,93,102,0.5)]"
                  : "border-white/10 bg-[#171815]",
              )}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              {/* Header */}
              <div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
                    {plan.eyebrow}
                  </p>
                  {plan.highlight && (
                    <span className="rounded-full bg-[#145d66] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      Popular
                    </span>
                  )}
                </div>
                <p className="mt-3 text-xl font-semibold text-stone-100">{plan.name}</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-[-0.04em] text-stone-100">
                    {plan.price}
                  </span>
                  <span className="mb-1 text-sm text-stone-500">{plan.priceNote}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-stone-400">{plan.description}</p>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <Button
                  asChild
                  className={cn(
                    "h-11 w-full rounded-full text-sm font-semibold",
                    plan.highlight
                      ? "bg-[#145d66] text-white hover:bg-[#17838f]"
                      : "border border-white/12 bg-transparent text-stone-100 hover:bg-white/8",
                  )}
                  variant={plan.highlight ? "default" : "ghost"}
                >
                  <Link href={plan.cta.href}>
                    {plan.cta.label}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Divider */}
              <div className="my-6 border-t border-white/8" />

              {/* Feature list */}
              <ul className="flex-1 space-y-3.5">
                {plan.features.map((feat) => (
                  <li key={feat.label} className="flex items-start gap-3">
                    {feat.included ? (
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#145d66]/20 text-[#86d0d8]">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    ) : (
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/6 text-stone-600">
                        <Minus className="h-2.5 w-2.5" />
                      </span>
                    )}
                    <span
                      className={cn(
                        "text-sm leading-5",
                        feat.included ? "text-stone-300" : "text-stone-600",
                      )}
                    >
                      {feat.label}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#f3efe8] text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-[#17838f]">FAQ</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-slate-950 sm:text-4xl">
              Common questions.
            </h2>

            <div className="mt-10 space-y-0">
              {FAQ_ITEMS.map((item, i) => (
                <motion.div
                  key={item.q}
                  className="border-t border-black/8 py-6 last:border-b"
                  initial={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  viewport={{ once: true, amount: 0.3 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <p className="text-base font-semibold text-slate-950">{item.q}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#11120f]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20">
          <div className="rounded-[36px] border border-white/10 bg-[#171815] px-6 py-10 text-center sm:px-10 sm:py-14">
            <p className="text-xs uppercase tracking-[0.22em] text-[#86d0d8]">Ready to start?</p>
            <h2 className="mx-auto mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.05em] sm:text-4xl">
              Sign up free and scan your first receipt today.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-stone-400">
              No credit card required. Upgrade when your volume grows or when your team needs more
              seats.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full border border-white/10 bg-white px-8 text-slate-950 hover:bg-stone-100"
              >
                <Link href="/sign-up">
                  Create free workspace
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 rounded-full border border-white/12 bg-transparent px-8 text-stone-100 hover:bg-white/10"
                variant="ghost"
              >
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
