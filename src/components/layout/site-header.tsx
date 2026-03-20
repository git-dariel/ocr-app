"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/extract", label: "Extract" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState<boolean>(false);
  const [hidden, setHidden] = useState(false);
  // Keep desktop nav width proportional to the currently configured links.
  const desktopExpandedWidth = Math.min(
    Math.max(
      NAV_ITEMS.reduce((acc, item) => acc + item.label.length * 16 + 56, 220),
      420,
    ),
    900,
  );

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;

    if (latest > previous && latest > 150) {
      setHidden(true);
      setShowNav(false);
    } else {
      setHidden(false);
    }
  });

  return (
    <header className="relative z-50 h-24">
      <motion.nav
        className="fixed inset-x-0 top-4 mx-auto flex h-14 w-[95%] max-w-[95vw] items-center gap-4 overflow-hidden rounded-full border border-blue-200/90 bg-white/90 px-3 font-sans font-medium text-slate-700 shadow-[0_8px_30px_-18px_rgba(30,64,175,0.45)] backdrop-blur-xl max-sm:justify-between sm:w-auto"
        style={{ zIndex: 1000 }}
        variants={{
          long: { maxWidth: desktopExpandedWidth },
          short: { maxWidth: 280 },
          hideNav: {
            height: 56,
            borderRadius: 50,
            alignItems: "center",
            paddingTop: 0,
            transition: { delay: 0, duration: 0.3 },
          },
          showNav: {
            height: 130,
            borderRadius: 22,
            alignItems: "start",
            paddingTop: 8,
            transition: { delay: 0 },
          },
        }}
        initial={"short"}
        animate={[hidden ? "short" : "long", showNav ? "showNav" : "hideNav"]}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 80,
          damping: 14,
        }}
      >
        <div className="mx-1 flex min-h-[40px] min-w-[40px] items-center justify-center rounded-full bg-slate-100 ring-1 ring-blue-200/80">
          <Link
            aria-label="Go to home page"
            href="/"
            onClick={() => setShowNav(false)}
            role="button"
          >
            <Image src="/next.svg" alt="logo" height={24} priority width={24} />
          </Link>
        </div>
        <motion.ul
          className={cn(
            "w-full [--opacity-from:0.1] [--opacity-to:1] flex-col items-center justify-center gap-4 max-sm:gap-3 max-sm:pt-6 sm:flex-row",
            showNav
              ? "[--display-from:none] [--display-to:flex]"
              : "max-sm:[--display-from:none] sm:[--display-to:flex]",
          )}
          variants={{
            hidden: {
              display: "var(--display-from, none)",
              opacity: "var(--opacity-from, 1)",
              transition: { duration: 0.1, delay: 0 },
            },
            visible: {
              display: "var(--display-to, none)",
              opacity: "var(--opacity-to, 1)",
              transition: { duration: 0.6, delay: 0.2 },
            },
          }}
          initial={"hidden"}
          animate={[hidden && !showNav ? "hidden" : "visible", showNav ? "visible" : ""]}
        >
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                aria-current={pathname === item.href ? "page" : undefined}
                aria-label={`navigate to ${item.label}`}
                className={cn(
                  "cursor-pointer rounded-full px-3 py-1.5 text-[0.84rem] text-slate-700 transition-colors hover:text-blue-700 sm:text-[0.9rem]",
                  pathname === item.href &&
                    "bg-transparent text-blue-700 underline decoration-2 underline-offset-[6px] hover:text-blue-700",
                )}
                href={item.href}
                onClick={() => setShowNav(false)}
                role="button"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </motion.ul>

        <motion.div
          className="w-full [--display-from:none][--display-to:inline-block]"
          variants={{
            hidden: {
              display: "var(--display-from, none)",
              transition: { delay: 0, duration: 0.3 },
            },
            visible: {
              display: "var(--display-to)",
              transition: { delay: 0.2, duration: 0.3 },
            },
          }}
          initial="hidden"
          animate={hidden ? "visible" : "hidden"}
        >
          <Button asChild className="w-full" variant="secondary">
            <Link href="/extract">Quick Extract</Link>
          </Button>
        </motion.div>

        <Button
          className="min-w-[40px] rounded-full text-slate-700 hover:bg-blue-50 hover:text-blue-700 sm:hidden"
          onClick={() => {
            setHidden(false);
            setShowNav((prev) => !prev);
          }}
          size={"icon"}
          variant={"ghost"}
        >
          {showNav ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </motion.nav>
    </header>
  );
}
