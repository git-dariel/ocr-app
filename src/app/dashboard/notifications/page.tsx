import { Bell, CheckCheck, Clock, Info, Megaphone, Wrench } from "lucide-react";

import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

const PLACEHOLDER_NOTIFICATIONS = [
  {
    id: 1,
    icon: CheckCheck,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    title: "Extraction completed",
    description: "RCP-2417 from Warehouse Desk was extracted successfully.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: Info,
    iconBg: "bg-[#145d66]/10 dark:bg-[#145d66]/20",
    iconColor: "text-[#145d66] dark:text-[#86d0d8]",
    title: "New receipt queued",
    description: "RCP-2418 from Field Mobile has been added to the queue.",
    time: "15 min ago",
    unread: true,
  },
  {
    id: 3,
    icon: Wrench,
    iconBg: "bg-amber-50 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    title: "Review required",
    description: "RCP-2414 from Store Tablet needs manual review before processing.",
    time: "1 hr ago",
    unread: false,
  },
  {
    id: 4,
    icon: Megaphone,
    iconBg: "bg-violet-50 dark:bg-violet-950/30",
    iconColor: "text-violet-600 dark:text-violet-400",
    title: "System announcement",
    description: "Scheduled maintenance window on Saturday, Mar 22 from 2–4 AM UTC.",
    time: "3 hr ago",
    unread: false,
  },
  {
    id: 5,
    icon: Clock,
    iconBg: "bg-slate-100 dark:bg-white/8",
    iconColor: "text-slate-500 dark:text-stone-400",
    title: "Weekly summary ready",
    description: "Your OCR activity report for Mar 15–21 is ready to view.",
    time: "Yesterday",
    unread: false,
  },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#11120f]">
      <DashboardTopbar />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Page header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-stone-100">
              Notifications
            </h1>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-stone-400">
              Stay up to date with your extraction activity and system updates.
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
              Notifications are under construction
            </p>
            <p className="mt-0.5 text-sm text-amber-700/80 dark:text-amber-400/70">
              Real-time notifications, read/unread management, and preference controls are coming soon. The items below are placeholder previews only.
            </p>
          </div>
        </div>

        {/* Notification list */}
        <div className="mt-4 overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm sm:mt-6 sm:rounded-[24px] dark:border-white/10 dark:bg-[#171815]">
          {/* List header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5 dark:border-white/8">
            <div className="flex items-center gap-2.5">
              <Bell className="h-4 w-4 text-slate-400 dark:text-stone-500" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                All notifications
              </h2>
              <span className="rounded-full bg-[#145d66] px-2 py-0.5 text-[11px] font-bold text-white">
                2
              </span>
            </div>
            <button className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-600 dark:text-stone-500 dark:hover:text-stone-300">
              Mark all read
            </button>
          </div>

          {/* Items */}
          <div className="divide-y divide-slate-100 dark:divide-white/6">
            {PLACEHOLDER_NOTIFICATIONS.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 px-4 py-4 transition-colors hover:bg-slate-50/60 sm:gap-4 sm:px-6 dark:hover:bg-white/3"
              >
                {/* Unread dot */}
                <div className="relative mt-0.5">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconBg}`}
                  >
                    <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                  </div>
                  {item.unread && (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#145d66] ring-2 ring-white dark:ring-[#171815]" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm font-semibold ${item.unread ? "text-slate-900 dark:text-stone-100" : "text-slate-600 dark:text-stone-400"}`}
                    >
                      {item.title}
                    </p>
                    <span className="shrink-0 text-xs text-slate-400 dark:text-stone-500">
                      {item.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-stone-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 px-6 py-4 text-center dark:border-white/8">
            <p className="text-xs text-slate-400 dark:text-stone-500">
              Full notification history and filtering coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
