import React from "react";
import { MessageCircle, ShieldCheck, Database, KeyRound, Info } from "lucide-react";
import { getMessengerUrl } from "@/lib/messenger/purchase";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const currentMessengerUrl = getMessengerUrl();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Cài đặt hệ thống
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Cấu hình liên kết kênh mua sắm Messenger và môi trường máy chủ
        </p>
      </div>

      {/* Messenger Config Card */}
      <div className="p-5 sm:p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <MessageCircle className="w-4 h-4 text-blue-500" />
          Kênh mua hàng chính: Facebook Messenger
        </h2>

        <div className="space-y-3 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          <p>
            Mọi thao tác bấm nút <strong>&quot;Mua&quot;</strong> của khách hàng trên toàn bộ website (ở Trang chủ, Danh sách sản phẩm, Chi tiết sản phẩm, hay Giỏ hàng) đều được dẫn hướng tới liên kết Messenger này:
          </p>

          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950 font-mono text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 break-all select-all">
            {currentMessengerUrl}
          </div>

          <div className="p-3.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-blue-900 dark:text-blue-200 space-y-1.5">
            <p className="font-semibold flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Cách thay đổi Messenger của shop:
            </p>
            <p>
              Mở file <code className="font-mono bg-blue-100 dark:bg-blue-900/60 px-1 py-0.5 rounded">.env</code> trong thư mục gốc của dự án và cập nhật biến:
            </p>
            <pre className="font-mono text-[11px] p-2 rounded bg-white/80 dark:bg-black/40 text-zinc-800 dark:text-zinc-200 select-all">
MESSENGER_URL=&quot;https://m.me/your_fanpage_or_profile_username&quot;
NEXT_PUBLIC_MESSENGER_URL=&quot;https://m.me/your_fanpage_or_profile_username&quot;
            </pre>
          </div>
        </div>
      </div>

      {/* Database & Security Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            Cơ sở dữ liệu
          </h3>
          <p className="text-zinc-500">
            Prisma ORM với SQLite (đang hoạt động). Dễ dàng chuyển đổi sang PostgreSQL bằng cách cấu hình <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">DATABASE_URL</code> trong file <code className="font-mono">.env</code>.
          </p>
          <div className="font-mono text-[11px] p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
            Trạng thái: Đã kết nối &amp; Seed dữ liệu đầy đủ
          </div>
        </div>

        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <h3 className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-500" />
            Bảo mật &amp; Phân quyền
          </h3>
          <p className="text-zinc-500">
            Bảo mật bằng mật khẩu băm bcrypt 10 vòng, Session JWT HTTP-Only Cookie thời hạn 7 ngày, kiểm tra quyền ADMIN nghiêm ngặt cả ở Server Components và Server API routes.
          </p>
          <div className="font-mono text-[11px] p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300">
            Chính sách: Khách hàng không thể tự nâng quyền Admin
          </div>
        </div>
      </div>
    </div>
  );
}
