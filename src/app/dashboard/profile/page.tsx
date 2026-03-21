import { Pencil } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

import { PROFILE_STATS } from "@/features/profile/data/profile-data";
import { StatCard } from "@/features/profile/components/stat-card";
import { ProfileHeroCard } from "@/features/profile/components/profile-hero-card";
import { PersonalInfoCard } from "@/features/profile/components/personal-info-card";
import { AccountSecurityCard } from "@/features/profile/components/account-security-card";
import { RecentActivityCard } from "@/features/profile/components/recent-activity-card";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#11120f]">
      <DashboardTopbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Profile
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Manage your personal information and account preferences.
            </p>
          </div>
          <button className="flex w-fit items-center gap-2 rounded-full bg-[#145d66] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0e4d55] dark:hover:bg-[#1a7a86]">
            <Pencil className="h-3.5 w-3.5" />
            Edit Profile
          </button>
        </div>

        {/* Profile hero */}
        <div className="mt-5 sm:mt-6">
          <ProfileHeroCard />
        </div>

        {/* Stat cards — 2-col on mobile, 4-col on xl */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4 xl:grid-cols-4">
          {PROFILE_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Info columns */}
        <div className="mt-4 grid gap-4 sm:mt-6 lg:grid-cols-2">
          <PersonalInfoCard />
          <AccountSecurityCard />
        </div>

        {/* Recent activity */}
        <div className="mt-4 pb-6 sm:pb-8">
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
}
