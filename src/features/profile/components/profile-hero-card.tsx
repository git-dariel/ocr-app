import { ArrowUpRight, Mail } from "lucide-react";

export function ProfileHeroCard() {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[28px] dark:border-white/10 dark:bg-[#171815]">
      {/* Banner */}
      <div className="h-20 rounded-t-[20px] bg-linear-to-br from-[#145d66] via-[#0e4d55] to-[#0a3a42] sm:h-28 sm:rounded-t-[28px]" />

      {/* Avatar + info row */}
      <div className="flex flex-col gap-4 px-4 pb-4 sm:flex-row sm:items-end sm:gap-8 sm:px-6 sm:pb-6">
        {/* Avatar */}
        <div className="-mt-8 shrink-0 sm:-mt-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#145d66] text-2xl font-bold text-white shadow-lg ring-4 ring-white sm:h-[80px] sm:w-[80px] sm:rounded-[22px] sm:text-3xl dark:ring-[#171815]">
            D
          </div>
        </div>

        {/* Name / email */}
        <div className="flex flex-1 flex-col gap-1 sm:pb-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-stone-100">
              Dariel M.
            </h2>
            <span className="rounded-full bg-[#145d66]/10 px-2.5 py-0.5 text-xs font-semibold text-[#145d66] ring-1 ring-[#145d66]/20 dark:text-[#4db8c3]">
              Admin
            </span>
          </div>
          <p className="text-sm text-slate-400 dark:text-stone-500">dariel@scant.app</p>
        </div>

        {/* Send email button */}
        <a
          href="mailto:dariel@scant.app"
          className="flex w-fit items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:self-end dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
        >
          <Mail className="h-3.5 w-3.5" />
          Send email
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
        </a>
      </div>
    </div>
  );
}
