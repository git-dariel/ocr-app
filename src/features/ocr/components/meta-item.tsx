import { Label } from "@/components/ui/label";

export function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-slate-100 bg-slate-50 px-4 py-4 dark:border-white/8 dark:bg-white/4">
      <Label className="text-xs font-medium uppercase tracking-widest text-slate-400 dark:text-stone-500">
        {label}
      </Label>
      <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-stone-100">{value}</p>
    </div>
  );
}
