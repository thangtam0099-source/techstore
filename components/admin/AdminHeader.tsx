"use client";

import React from "react";
import { Menu, Shield } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import { useAuth } from "@/components/Auth/AuthContext";

export default function AdminHeader({
  setMobileOpen,
}: {
  setMobileOpen: (open: boolean) => void;
}) {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Hệ thống Quản Trị - Nexus Gaming
        </span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-zinc-200 dark:border-zinc-800 text-xs">
            <div className="w-7 h-7 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold flex items-center justify-center">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="font-semibold text-zinc-900 dark:text-white leading-none">
                {user.name}
              </p>
              <p className="text-[10px] text-zinc-400 leading-tight">Admin</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
