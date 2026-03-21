"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Mail, Menu, User } from "lucide-react";
import { useSidebar } from "@/components/providers/sidebar-provider";

export function DashboardTopbar() {
  const router = useRouter();
  const { openMobile } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signOutModal, setSignOutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleSignOut() {
    setSignOutModal(false);
    router.push("/sign-in");
  }

  return (
    <>
      <div className="flex h-[60px] items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 dark:border-white/8 dark:bg-[#11120f] sm:px-6">
        {/* Hamburger — mobile only */}
        <button
          onClick={openMobile}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-white/8 dark:text-stone-400 dark:hover:bg-white/12 lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Right-side actions */}
        <div className="ml-auto flex items-center gap-2">
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-white/8 dark:text-stone-400 dark:hover:bg-white/12">
          <Mail className="h-4 w-4" />
        </button>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-white/8 dark:text-stone-400 dark:hover:bg-white/12">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#145d66] ring-2 ring-white dark:ring-[#11120f]" />
        </button>

        {/* Avatar + dropdown */}
        <div
          ref={dropdownRef}
          className="relative ml-2 border-l border-slate-200 pl-4 dark:border-white/8"
        >
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-3 rounded-full transition-opacity hover:opacity-80"
          >
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">Dariel M.</p>
              <p className="text-xs text-slate-400 dark:text-stone-500">dariel@scant.app</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#145d66] text-sm font-bold text-white shadow-sm">
              D
            </div>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1a1d1b]"
              >
                {/* Header */}
                <div className="border-b border-slate-100 px-4 py-3 dark:border-white/8">
                  <p className="text-sm font-semibold text-slate-900 dark:text-stone-100">
                    Dariel M.
                  </p>
                  <p className="text-xs text-slate-400 dark:text-stone-500">dariel@scant.app</p>
                </div>

                {/* Menu items */}
                <div className="p-1.5">
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-stone-300 dark:hover:bg-white/6"
                  >
                    <User className="h-4 w-4 text-slate-400 dark:text-stone-500" />
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setSignOutModal(true);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </div>{/* end right-side actions */}
      </div>{/* end topbar */}

      {/* Sign-out confirmation modal */}
      <AnimatePresence>
        {signOutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setSignOutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="mx-4 w-full max-w-sm rounded-[24px] border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#1a1d1b]"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-500/10">
                <LogOut className="h-5 w-5 text-rose-500 dark:text-rose-400" />
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-stone-100">
                Sign out?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-stone-400">
                You&apos;ll be redirected to the sign-in page. Any unsaved work may be lost.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSignOutModal(false)}
                  className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/6"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex-1 rounded-full bg-rose-500 py-2.5 text-sm font-medium text-white transition-colors hover:bg-rose-600"
                >
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
