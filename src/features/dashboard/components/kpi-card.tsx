import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import type { KpiStat } from "@/features/dashboard/data/dashboard-data";

export function KpiCard({ label, value, trend, highlight, href }: KpiStat) {
  return (
    <div
      className={cn(
        "relative rounded-[20px] border px-4 py-4 sm:rounded-[24px] sm:px-5 sm:py-5",
        highlight
          ? "border-transparent bg-[#145d66]"
          : "border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171815]",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p
          className={cn(
            "text-sm font-medium",
            highlight ? "text-white/75" : "text-slate-500 dark:text-stone-400",
          )}
        >
          {label}
        </p>
        <Link
          href={href}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors",
            highlight
              ? "bg-white/20 hover:bg-white/30"
              : "bg-slate-100 hover:bg-slate-200 dark:bg-white/8 dark:hover:bg-white/12",
          )}
        >
          <ArrowUpRight
            className={cn(
              "h-4 w-4",
              highlight ? "text-white" : "text-slate-500 dark:text-stone-400",
            )}
          />
        </Link>
      </div>

      <p
        className={cn(
          "mt-3 text-4xl font-bold tracking-tight sm:mt-4 sm:text-5xl",
          highlight ? "text-white" : "text-slate-900 dark:text-stone-100",
        )}
      >
        {value}
      </p>

      <div
        className={cn(
          "mt-3 flex w-fit items-center gap-1.5 rounded-full px-2 py-1 text-[11px] sm:mt-4 sm:px-2.5 sm:text-xs",
          highlight ? "bg-white/15" : "bg-emerald-50 dark:bg-emerald-950/30",
        )}
      >
        <TrendingUp
          className={cn(
            "h-3 w-3",
            highlight ? "text-white/80" : "text-emerald-600 dark:text-emerald-400",
          )}
        />
        <span className={highlight ? "text-white/80" : "text-emerald-700 dark:text-emerald-400"}>
          {trend}
        </span>
      </div>
    </div>
  );
}
