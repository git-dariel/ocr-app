"use client";

import Link from "next/link";
import { ArrowUpRight, X, Menu } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "#workflow", label: "Workflow" },
  { href: "#workspace", label: "Workspace" },
  { href: "/pricing", label: "Pricing" },
  { href: "#cta", label: "Start" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navRef = useRef<HTMLElement>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  const closeMenu = () => setMenuOpen(false);

  return (
    <motion.header
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Nav pill */}
      <motion.nav
        className={cn(
          "mx-auto mt-4 flex w-[calc(100%-1.5rem)] max-w-7xl items-center justify-between rounded-full border px-3 py-3 text-sm backdrop-blur-xl transition-colors sm:px-5",
          scrolled || menuOpen
            ? "border-white/15 bg-[#10110f]/90 text-stone-100 shadow-[0_18px_60px_-28px_rgba(0,0,0,0.75)]"
            : "border-white/10 bg-transparent text-stone-200",
        )}
      >
        <Link aria-label="Go to home page" className="flex items-center gap-3" href="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 font-mono text-xs tracking-[0.24em] text-stone-100">
            s.
          </span>
          <div>
            <p className="text-[0.7rem] tracking-[0.22em] text-[#86d0d8] lowercase">ScanTalino.</p>
            <p className="text-sm font-semibold text-stone-100">Capture Workspace</p>
          </div>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-6 text-sm text-stone-300 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link className="transition-colors hover:text-[#86d0d8]" href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop right actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button
            asChild
            className="rounded-full bg-transparent px-5 text-stone-100 hover:bg-white/10"
            variant="ghost"
          >
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button
            asChild
            className="rounded-full border border-white/10 bg-white px-5 text-slate-950 hover:bg-stone-100"
          >
            <Link href="/sign-up">
              Start free
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-stone-100 transition-colors hover:bg-white/14 lg:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {menuOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                transition={{ duration: 0.18 }}
              >
                <X className="h-4 w-4" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
                transition={{ duration: 0.18 }}
              >
                <Menu className="h-4 w-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-2 w-[calc(100%-1.5rem)] max-w-7xl overflow-hidden rounded-[24px] border border-white/15 bg-[#10110f]/95 p-4 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl lg:hidden"
          >
            {/* Nav links */}
            <ul className="space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="flex items-center rounded-full px-4 py-3 text-sm font-medium text-stone-300 transition-colors hover:bg-white/8 hover:text-stone-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="my-3 border-t border-white/10" />

            {/* CTA buttons */}
            <div className="flex flex-col gap-2">
              <Button
                asChild
                className="h-11 w-full rounded-full border border-white/12 bg-transparent text-stone-100 hover:bg-white/10"
                variant="ghost"
              >
                <Link href="/sign-in" onClick={closeMenu}>
                  Sign in
                </Link>
              </Button>
              <Button
                asChild
                className="h-11 w-full rounded-full border border-white/10 bg-white text-slate-950 hover:bg-stone-100"
              >
                <Link href="/sign-up" onClick={closeMenu}>
                  Start free
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
