import { Button } from "@/components/ui/button";
import { ACTIVITY_ITEMS } from "@/features/dashboard/data/dashboard-data";
import { StatusBadge } from "@/features/dashboard/components/status-badge";

export function TeamActivityCard() {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
      {/* Card header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
            Team Activity
          </h2>
          <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
            Latest operator extractions
          </p>
        </div>
        <Button
          size="sm"
          className="h-7 rounded-full bg-slate-100 px-3 text-xs font-medium text-slate-600 shadow-none hover:bg-slate-200 dark:bg-white/8 dark:text-stone-300 dark:hover:bg-white/12"
        >
          + Add Member
        </Button>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100 dark:divide-white/6">
        {ACTIVITY_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50/50 sm:gap-4 sm:px-6 sm:py-4 dark:hover:bg-white/3"
          >
            {/* Avatar */}
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white sm:h-10 sm:w-10"
              style={{ backgroundColor: item.color }}
            >
              {item.initials}
            </div>

            {/* Text + badge */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                  {item.source}
                </p>
                <StatusBadge status={item.status} />
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-stone-400">
                <span className="font-medium text-[#145d66] dark:text-[#86d0d8]">{item.id}</span>
                {" — "}
                {item.task}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
