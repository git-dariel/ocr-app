import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  Extracted: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  "In Review": "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Queued: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  "Needs Review": "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600",
      )}
    >
      {status}
    </span>
  );
}
