import { TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProfileStat } from "@/features/profile/data/profile-data";

export function StatCard({ label, value, trend, highlight }: ProfileStat) {
  return (
    <div
      className={cn(
        "relative rounded-[20px] border px-4 py-4 sm:rounded-[24px] sm:px-5 sm:py-5",
        highlight
          ? "border-transparent bg-[#145d66]"
          : "border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171815]",
      )}
    >
      <p
        className={cn(
          "text-xs font-medium sm:text-sm",
          highlight ? "text-white/75" : "text-slate-500 dark:text-stone-400",
        )}
      >
        {label}
      </p>
      <p
        className={cn(
          "mt-3 text-3xl font-bold tracking-tight sm:mt-4 sm:text-4xl",
          highlight ? "text-white" : "text-slate-900 dark:text-stone-100",
        )}
      >
        {value}
      </p>
      <div
        className={cn(
          "mt-3 flex w-fit items-center gap-1 rounded-full px-2 py-1 text-[11px] sm:mt-4 sm:gap-1.5 sm:px-2.5 sm:text-xs",
          highlight ? "bg-white/15" : "bg-emerald-50 dark:bg-emerald-950/30",
        )}
      >
        <TrendingUp
          className={cn(
            "h-3 w-3 shrink-0",
            highlight ? "text-white/80" : "text-emerald-600 dark:text-emerald-400",
          )}
        />
        <span
          className={cn(
            "line-clamp-1",
            highlight ? "text-white/80" : "text-emerald-700 dark:text-emerald-400",
          )}
        >
          {trend}
        </span>
      </div>
    </div>
  );
}
