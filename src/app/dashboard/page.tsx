import { Plus } from "lucide-react";
import Link from "next/link";

import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { Button } from "@/components/ui/button";

import { ExtractionTrendSection } from "@/features/dashboard/components/extraction-trend-section";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { OcrActivitySection } from "@/features/dashboard/components/ocr-activity-section";
import { RecentExtractionsCard } from "@/features/dashboard/components/recent-extractions-card";
import { TeamActivityCard } from "@/features/dashboard/components/team-activity-card";
import { KPI_STATS } from "@/features/dashboard/data/dashboard-data";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#11120f]">
      <DashboardTopbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Dashboard
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Plan, prioritize, and accomplish your OCR tasks with ease.
            </p>
          </div>
          <Button
            asChild
            className="w-fit rounded-full bg-[#145d66] px-5 text-white shadow-sm hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]"
          >
            <Link href="/dashboard/extract">
              <Plus className="mr-1.5 h-4 w-4" />
              New Extract
            </Link>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {KPI_STATS.map((stat) => (
            <KpiCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Middle row */}
        <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-[1fr_minmax(0,360px)]">
          <OcrActivitySection />
          <RecentExtractionsCard />
        </div>

        {/* Bottom row */}
        <div className="mt-4 grid gap-4 pb-6 sm:mt-6 sm:gap-6 sm:pb-8 xl:grid-cols-2">
          <TeamActivityCard />
          <ExtractionTrendSection />
        </div>
      </div>
    </div>
  );
}
