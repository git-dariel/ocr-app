"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  Moon,
  MoreVertical,
  ScanSearch,
  Settings,
  Sun,
  UserCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useTheme } from "@/components/providers/theme-provider";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { cn } from "@/lib/utils";

type NavChild = {
  label: string;
  href: string;
};

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  children?: NavChild[];
};

const NAV_MAIN: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "extract",
    label: "Extract",
    icon: ScanSearch,
    children: [{ label: "Receipt OCR", href: "/dashboard/extract" }],
  },
];

const NAV_SETTINGS: NavItem[] = [
  {
    id: "profile",
    label: "Profile",
    icon: UserCircle,
    href: "/dashboard/profile",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    href: "/dashboard/notifications",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

// ─── Collapsed helpers (desktop-only) ────────────────────────────────────────

function CollapsedTooltip({ label, children }: { label: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-xl"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CollapsedFlyout({ item, pathname }: { item: NavItem; pathname: string }) {
  const [visible, setVisible] = useState(false);
  const isChildActive = item.children?.some((c) => pathname === c.href) ?? false;
  return (
    <div
      className="relative"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <button
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
          isChildActive
            ? "bg-[#145d66] text-white"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-stone-400 dark:hover:bg-white/8 dark:hover:text-stone-100",
        )}
      >
        <item.icon className="h-5 w-5" />
      </button>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-full top-0 z-50 ml-3 min-w-[164px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-white/10 dark:bg-[#252926]"
          >
            <p className="mb-1 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-stone-500">
              {item.label}
            </p>
            {item.children?.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === child.href
                    ? "bg-[#145d66] font-medium text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-stone-300 dark:hover:bg-white/8 dark:hover:text-stone-100",
                )}
              >
                {child.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Expanded nav item ────────────────────────────────────────────────────────

function ExpandedNavItem({
  item,
  pathname,
  openItems,
  onToggle,
  onLinkClick,
}: {
  item: NavItem;
  pathname: string;
  openItems: string[];
  onToggle: (id: string) => void;
  onLinkClick?: () => void;
}) {
  const isActive = item.href ? pathname === item.href : false;
  const isChildActive = item.children?.some((c) => pathname === c.href) ?? false;
  const isOpen = openItems.includes(item.id);

  if (item.href && !item.children) {
    return (
      <Link
        href={item.href}
        onClick={onLinkClick}
        className={cn(
          "flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
          isActive
            ? "bg-[#145d66] text-white"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-stone-400 dark:hover:bg-white/8 dark:hover:text-stone-100",
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => onToggle(item.id)}
        className={cn(
          "flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors",
          isChildActive || isOpen
            ? "text-slate-900 dark:text-stone-100"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-stone-400 dark:hover:bg-white/8 dark:hover:text-stone-100",
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 dark:text-stone-500",
            isOpen ? "rotate-180" : "",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="ml-5 mt-0.5 space-y-0.5 border-l border-slate-200 pl-4 dark:border-white/10">
              {item.children?.map((child) => (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={onLinkClick}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname === child.href
                      ? "bg-[#145d66]/10 font-medium text-[#145d66] dark:bg-[#145d66]/20 dark:text-[#86d0d8]"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-stone-500 dark:hover:bg-white/6 dark:hover:text-stone-300",
                  )}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Shared sidebar body ──────────────────────────────────────────────────────

function SidebarBody({
  collapsed,
  onLinkClick,
}: {
  collapsed: boolean;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [openItems, setOpenItems] = useState<string[]>(["extract"]);

  const isDark = theme === "dark";
  const toggleItem = (id: string) =>
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  function renderSection(items: NavItem[]) {
    if (collapsed) {
      return (
        <div className="flex flex-col items-center gap-0.5">
          {items.map((item) =>
            item.children ? (
              <CollapsedFlyout key={item.id} item={item} pathname={pathname} />
            ) : (
              <CollapsedTooltip key={item.id} label={item.label}>
                <Link
                  href={item.href!}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                    pathname === item.href
                      ? "bg-[#145d66] text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-stone-400 dark:hover:bg-white/8 dark:hover:text-stone-100",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </Link>
              </CollapsedTooltip>
            ),
          )}
        </div>
      );
    }
    return items.map((item) => (
      <ExpandedNavItem
        key={item.id}
        item={item}
        pathname={pathname}
        openItems={openItems}
        onToggle={toggleItem}
        onLinkClick={onLinkClick}
      />
    ));
  }

  return (
    <>
      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-6 overflow-y-auto overflow-x-hidden px-2 py-5">
        <div className="space-y-0.5">
          <AnimatePresence>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-stone-600"
              >
                Main
              </motion.p>
            )}
          </AnimatePresence>
          {renderSection(NAV_MAIN)}
        </div>

        <div className="space-y-0.5">
          <AnimatePresence>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 dark:text-stone-600"
              >
                Settings
              </motion.p>
            )}
          </AnimatePresence>
          {renderSection(NAV_SETTINGS)}
        </div>
      </nav>

      {/* Footer — theme toggle */}
      <div
        className={cn(
          "shrink-0 border-t border-slate-100 px-2 py-4 dark:border-white/6",
          collapsed && "flex justify-center",
        )}
      >
        {collapsed ? (
          <CollapsedTooltip label={isDark ? "Switch to Light" : "Switch to Dark"}>
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-stone-400 dark:hover:bg-white/8 dark:hover:text-stone-100"
            >
              {isDark ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
            </button>
          </CollapsedTooltip>
        ) : (
          <div className="flex h-10 items-center rounded-xl bg-slate-100 p-1 dark:bg-white/6">
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-medium transition-colors",
                !isDark
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-stone-500 dark:hover:text-stone-300",
              )}
            >
              <Sun className="h-3.5 w-3.5" />
              Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg py-1.5 text-xs font-medium transition-colors",
                isDark
                  ? "bg-[#252926] text-stone-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-stone-500 dark:hover:text-stone-300",
              )}
            >
              <Moon className="h-3.5 w-3.5" />
              Dark
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Logo bar ─────────────────────────────────────────────────────────────────

function SidebarLogo({
  collapsed,
  onClose,
  showCloseButton = false,
}: {
  collapsed: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-16 shrink-0 items-center border-b border-slate-100 px-3 dark:border-white/6",
        collapsed ? "justify-center" : "justify-between",
      )}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#145d66] text-white shadow-sm">
          s.
        </span>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap font-semibold lowercase tracking-tight text-slate-900 dark:text-stone-100"
            >
              ScanTalino.
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {!collapsed && (
        showCloseButton ? (
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-stone-600 dark:hover:bg-white/8 dark:hover:text-stone-400"
          >
            <X className="h-4 w-4" />
          </button>
        ) : (
          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-stone-600 dark:hover:bg-white/8 dark:hover:text-stone-400">
            <MoreVertical className="h-4 w-4" />
          </button>
        )
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function DashboardSidebar() {
  const { isMobileOpen, closeMobile } = useSidebar();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* ── Desktop sidebar (lg+) ─────────────────────────────────────────── */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-300 ease-in-out dark:border-white/8 dark:bg-[#11120f] lg:flex",
          collapsed ? "w-16" : "w-72",
        )}
      >
        <SidebarLogo collapsed={collapsed} />

        {/* Collapse toggle */}
        <div className="relative flex h-0 justify-end">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="absolute -right-3.5 top-0 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-white/12 dark:bg-[#1a1d1b] dark:text-stone-400 dark:hover:bg-[#252926] dark:hover:text-stone-200"
          >
            {collapsed ? (
              <ChevronsRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronsLeft className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <SidebarBody collapsed={collapsed} />
      </aside>

      {/* ── Mobile drawer (< lg) ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobile}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200 bg-white dark:border-white/8 dark:bg-[#11120f] lg:hidden"
            >
              <SidebarLogo collapsed={false} onClose={closeMobile} showCloseButton />
              <SidebarBody collapsed={false} onLinkClick={closeMobile} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
