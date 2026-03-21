import {
  Bell,
  ChevronRight,
  Globe,
  Info,
  KeyRound,
  Moon,
  Palette,
  ShieldCheck,
  Sliders,
  UserCog,
  Wrench,
} from "lucide-react";

import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

const SETTING_SECTIONS = [
  {
    title: "Account",
    items: [
      {
        icon: UserCog,
        label: "Account preferences",
        description: "Manage your display name, email, and avatar.",
      },
      {
        icon: KeyRound,
        label: "Password & authentication",
        description: "Change your password and configure two-factor authentication.",
      },
      {
        icon: ShieldCheck,
        label: "Privacy & security",
        description: "Control who can see your activity and manage active sessions.",
      },
    ],
  },
  {
    title: "Appearance",
    items: [
      {
        icon: Palette,
        label: "Theme",
        description: "Switch between light and dark mode. Use the sidebar toggle for a quick change.",
      },
      {
        icon: Globe,
        label: "Language & region",
        description: "Set your preferred language, date format, and timezone.",
      },
    ],
  },
  {
    title: "Notifications",
    items: [
      {
        icon: Bell,
        label: "Email notifications",
        description: "Choose which events trigger an email to your inbox.",
      },
      {
        icon: Moon,
        label: "Do not disturb",
        description: "Set quiet hours to pause non-critical notifications.",
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        icon: Sliders,
        label: "OCR pipeline defaults",
        description: "Configure default processing profiles, confidence thresholds, and output formats.",
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#11120f]">
      <DashboardTopbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Settings
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Configure your account, appearance, and workspace preferences.
            </p>
          </div>

          {/* In-progress badge */}
          <span className="flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700 dark:border-amber-800/30 dark:bg-amber-950/30 dark:text-amber-400">
            <Wrench className="h-3.5 w-3.5" />
            Feature in progress
          </span>
        </div>

        {/* In-progress notice card */}
        <div className="mt-5 flex items-start gap-4 rounded-[20px] border border-amber-200 bg-amber-50/60 p-4 sm:mt-6 sm:rounded-[24px] sm:p-5 dark:border-amber-800/20 dark:bg-amber-950/10">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
            <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Settings are under construction
            </p>
            <p className="mt-0.5 text-sm text-amber-700/80 dark:text-amber-400/70">
              These settings are not yet functional. Full configuration controls including toggles, selectors, and save actions are coming soon.
            </p>
          </div>
        </div>

        {/* Settings sections */}
        <div className="mt-4 space-y-4 pb-6 sm:mt-6 sm:pb-8">
          {SETTING_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]"
            >
              {/* Section header */}
              <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                  {section.title}
                </h2>
              </div>

              {/* Section items */}
              <div className="divide-y divide-slate-100 dark:divide-white/6">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    disabled
                    className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-slate-50/60 disabled:cursor-not-allowed sm:px-6 dark:hover:bg-white/3"
                  >
                    {/* Icon */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/8">
                      <item.icon className="h-4 w-4 text-slate-500 dark:text-stone-400" />
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-stone-200">
                        {item.label}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400 dark:text-stone-500">
                        {item.description}
                      </p>
                    </div>

                    {/* Coming soon chip + chevron */}
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="hidden rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-400 sm:inline dark:bg-white/8 dark:text-stone-500">
                        Coming soon
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-300 dark:text-stone-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
