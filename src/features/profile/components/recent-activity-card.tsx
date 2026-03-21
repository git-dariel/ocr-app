import { RECENT_ACTIVITY } from "@/features/profile/data/profile-data";

export function RecentActivityCard() {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-6 dark:border-white/10 dark:bg-[#171815]">
      <h3 className="font-semibold text-slate-900 dark:text-stone-100">Recent Activity</h3>
      <p className="mt-1 text-xs text-slate-400 dark:text-stone-500">
        Your latest extraction sessions
      </p>

      <div className="mt-4 space-y-2 sm:space-y-3">
        {RECENT_ACTIVITY.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50 sm:gap-4 sm:rounded-2xl sm:px-4 sm:py-3.5 dark:hover:bg-white/4"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-700 dark:text-stone-300">
                {item.label}
              </p>
            </div>
            {/* Date — hidden on xs, visible sm+ */}
            <span className="hidden shrink-0 text-xs text-slate-400 sm:inline dark:text-stone-500">
              {item.date}
            </span>
            {/* ID badge */}
            <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-500 dark:bg-white/8 dark:text-stone-400">
              {item.id}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
