import React from "react";
import prisma from "@/lib/db/prisma";
import { formatDate } from "@/lib/utils/format";
import { Users, Shield, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      createdAt: true,
      _count: { select: { reviews: true } },
    },
  });

  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const userCount = users.length - adminCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Quản lý người dùng
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Danh sách tất cả tài khoản đã đăng ký trên hệ thống ({users.length} tài khoản)
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-800 dark:text-zinc-200">
            {adminCount} Admin
          </span>
          <span className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-semibold text-zinc-800 dark:text-zinc-200">
            {userCount} Khách hàng
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Tài khoản</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Số điện thoại</th>
                <th className="py-3 px-4">Địa chỉ</th>
                <th className="py-3 px-4">Vai trò</th>
                <th className="py-3 px-4">Ngày tạo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {users.map((u) => {
                const isAdmin = u.role === "ADMIN";

                return (
                  <tr key={u.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            isAdmin
                              ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          {isAdmin ? (
                            <Shield className="w-3.5 h-3.5" />
                          ) : (
                            <User className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-white">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-zinc-400">
                            {u._count.reviews} đánh giá
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-zinc-600 dark:text-zinc-400">
                      {u.email}
                    </td>

                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">
                      {u.phone || "—"}
                    </td>

                    <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400 max-w-xs truncate">
                      {u.address || "—"}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          isAdmin
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-zinc-500">
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
