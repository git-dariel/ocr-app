import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-[#11120f] dark:text-stone-100">
          <DashboardSidebar />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
