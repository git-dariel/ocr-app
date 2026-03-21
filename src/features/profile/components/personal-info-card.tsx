import { Pencil } from "lucide-react";

import { PERSONAL_INFO } from "@/features/profile/data/profile-data";
import { InfoRow } from "@/features/profile/components/info-row";

export function PersonalInfoCard() {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm sm:rounded-[24px] sm:p-6 dark:border-white/10 dark:bg-[#171815]">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-stone-100">Personal Information</h3>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-white/8 dark:text-stone-400 dark:hover:bg-white/12">
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-2 divide-y divide-slate-100 dark:divide-white/6">
        {PERSONAL_INFO.map((item) => (
          <InfoRow key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
