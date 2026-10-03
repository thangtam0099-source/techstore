"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/AuthContext";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in
  if (user) {
    if (user.role === "ADMIN") {
      router.push("/admin");
    } else {
      router.push("/");
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || "Đăng nhập thất bại.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-6">
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-base flex items-center justify-center mx-auto mb-2">
            TS
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Đăng nhập TechStore
          </h1>
          <p className="text-xs text-zinc-500">
            Đăng nhập để theo dõi đánh giá và quản lý tài khoản
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-700 dark:text-zinc-300">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">Mật khẩu</label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Đang xử lý..." : "Đăng nhập"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Accounts Helper Card */}
        <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-xs space-y-1 text-zinc-500">
          <p className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            Tài khoản demo sẵn có:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 font-mono text-[11px]">
            <div>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Admin:</span>
              <br />
              admin@shop.com / admin123
            </div>
            <div>
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">User:</span>
              <br />
              user@shop.com / user123
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-semibold text-zinc-900 dark:text-white underline hover:no-underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
