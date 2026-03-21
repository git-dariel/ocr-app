import { OcrActivityChart } from "@/features/dashboard/components/ocr-activity-chart";

export function OcrActivitySection() {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-6 dark:border-white/10 dark:bg-[#171815]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-stone-100">
            OCR Activity
          </h2>
          <p className="mt-0.5 text-sm text-slate-400 dark:text-stone-500">
            Daily extractions this week
          </p>
        </div>
        <span className="rounded-full bg-[#145d66]/10 px-3 py-1 text-xs font-semibold text-[#145d66] dark:bg-[#145d66]/20">
          Live
        </span>
      </div>

      <div className="mt-5">
        <OcrActivityChart />
      </div>

      <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-2xl border border-slate-100 bg-slate-50 dark:divide-white/6 dark:border-white/8 dark:bg-white/4">
        <div className="px-3 py-3 sm:px-5 sm:py-3.5">
          <p className="text-[11px] text-slate-400 sm:text-xs dark:text-stone-500">Total this week</p>
          <p className="mt-1 text-base font-bold text-slate-900 sm:text-lg dark:text-stone-100">
            68{" "}
            <span className="text-xs font-normal text-slate-400 sm:text-sm dark:text-stone-500">runs</span>
          </p>
        </div>
        <div className="px-3 py-3 sm:px-5 sm:py-3.5">
          <p className="text-[11px] text-slate-400 sm:text-xs dark:text-stone-500">Peak day</p>
          <p className="mt-1 text-base font-bold text-[#145d66] sm:text-lg">
            19{" "}
            <span className="text-xs font-normal text-slate-400 sm:text-sm dark:text-stone-500">on Tue</span>
          </p>
        </div>
        <div className="px-3 py-3 sm:px-5 sm:py-3.5">
          <p className="text-[11px] text-slate-400 sm:text-xs dark:text-stone-500">Daily avg</p>
          <p className="mt-1 text-base font-bold text-slate-900 sm:text-lg dark:text-stone-100">
            9.7{" "}
            <span className="text-xs font-normal text-slate-400 sm:text-sm dark:text-stone-500">runs</span>
          </p>
        </div>
      </div>
    </div>
  );
}
