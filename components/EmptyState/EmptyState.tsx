import React from "react";
import Link from "next/link";
import { PackageX } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = "Không tìm thấy sản phẩm",
  description = "Không có sản phẩm nào phù hợp với lựa chọn hoặc từ khóa tìm kiếm của bạn.",
  actionText = "Xem tất cả sản phẩm",
  actionHref = "/products",
}: EmptyStateProps) {
  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
        <PackageX className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mb-5">
        {description}
      </p>
      {actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-colors"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}
