import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import AdminLayoutClient from "@/components/admin/AdminLayoutClient";

export const metadata = {
  title: "Admin Dashboard - TechStore",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // STRICT SERVER-SIDE AUTHORIZATION CHECK
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-zinc-900 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h1 className="text-lg font-bold text-zinc-900 dark:text-white">
              Bạn không có quyền truy cập trang này.
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Khu vực quản trị chỉ dành riêng cho tài khoản quản trị viên (ADMIN). Nếu bạn là chủ shop, vui lòng đăng nhập bằng tài khoản Admin.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center text-xs font-semibold">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Về trang chủ</span>
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Đăng nhập Admin</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
