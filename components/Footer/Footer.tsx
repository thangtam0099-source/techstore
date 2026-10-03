import React from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getMessengerUrl } from "@/lib/messenger/purchase";

export default function Footer() {
  const messengerUrl = getMessengerUrl();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 text-sm transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-white"
            >
              <span className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-black text-xs">
                TS
              </span>
              <span>TechStore</span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-sm">
              Cửa hàng thiết bị công nghệ cá nhân cao cấp. Xem sản phẩm, chọn cấu hình và
              liên hệ trực tiếp với chủ shop qua Messenger để được tư vấn và giao hàng nhanh
              chóng.
            </p>
            <div className="pt-2">
              <a
                href={messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Chat Messenger với shop</span>
              </a>
            </div>
          </div>

          {/* Col 2: Danh mục */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
              Danh mục
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=dien-thoai" className="hover:text-zinc-900 dark:hover:text-white">
                  Điện thoại
                </Link>
              </li>
              <li>
                <Link href="/products?category=laptop" className="hover:text-zinc-900 dark:hover:text-white">
                  Laptop
                </Link>
              </li>
              <li>
                <Link href="/products?category=tai-nghe" className="hover:text-zinc-900 dark:hover:text-white">
                  Tai nghe
                </Link>
              </li>
              <li>
                <Link href="/products?category=phu-kien" className="hover:text-zinc-900 dark:hover:text-white">
                  Phụ kiện công nghệ
                </Link>
              </li>
              <li>
                <Link href="/products?category=linh-kien-may-tinh" className="hover:text-zinc-900 dark:hover:text-white">
                  Linh kiện máy tính
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hỗ trợ & Mua hàng */}
          <div>
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-3">
              Quy trình mua hàng
            </h4>
            <ul className="space-y-2 text-xs">
              <li>1. Xem và chọn sản phẩm</li>
              <li>2. Bấm nút &quot;Mua&quot;</li>
              <li>3. Gửi tin nhắn qua Messenger</li>
              <li>4. Shop xác nhận &amp; giao hàng</li>
              <li className="pt-2 text-zinc-500">
                Cam kết chính hãng 100%, bảo hành uy tín.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} TechStore. Thiết bị công nghệ cho cuộc sống hiện đại.</p>
          <p className="text-zinc-400">Thiết kế tối giản &amp; Tối ưu trải nghiệm mua hàng</p>
        </div>
      </div>
    </footer>
  );
}
