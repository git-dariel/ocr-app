import type { InfoRowItem } from "@/features/profile/data/profile-data";

export function InfoRow({ icon: Icon, label, value, badge }: InfoRowItem) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/8">
          <Icon className="h-3.5 w-3.5 text-slate-500 dark:text-stone-400" />
        </div>
        <p className="text-sm text-slate-500 dark:text-stone-400">{label}</p>
      </div>
      <div className="flex items-center gap-2">
        {badge === "active" && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800/30">
            {value}
          </span>
        )}
        {badge === "enabled" && (
          <span className="rounded-full bg-[#145d66]/10 px-2.5 py-0.5 text-xs font-medium text-[#145d66] ring-1 ring-[#145d66]/20 dark:text-[#4db8c3]">
            {value}
          </span>
        )}
        {!badge && (
          <p className="text-right text-sm font-medium text-slate-900 dark:text-stone-100">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
