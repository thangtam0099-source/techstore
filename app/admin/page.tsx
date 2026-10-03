import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  PackageCheck,
  AlertTriangle,
  Users,
  PlusCircle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Star,
} from "lucide-react";
import prisma from "@/lib/db/prisma";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    totalProducts,
    activeProducts,
    outOfStockProducts,
    totalUsers,
    bestSellingProducts,
    recentProducts,
    recentReviews,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "ACTIVE" } }),
    prisma.product.count({ where: { stock: { lte: 0 } } }),
    prisma.user.count(),
    prisma.product.findMany({
      orderBy: { salesCount: "desc" },
      take: 5,
      include: {
        brand: { select: { name: true } },
        images: { take: 1 },
      },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        brand: { select: { name: true } },
        category: { select: { name: true } },
        images: { take: 1 },
      },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        user: { select: { name: true } },
        product: { select: { name: true, slug: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tổng quan cửa hàng
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Dữ liệu thống kê sản phẩm, kho hàng và người dùng thời gian thực
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-xs font-semibold transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm sản phẩm mới</span>
          </Link>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Tổng sản phẩm</span>
            <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">
            {totalProducts}
          </div>
          <div className="text-[11px] text-zinc-500 flex items-center gap-1">
            <span>Trong toàn bộ danh mục</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Đang mở bán</span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <PackageCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {activeProducts}
          </div>
          <div className="text-[11px] text-zinc-500">
            <span>Sẵn sàng hiển thị cho khách</span>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Hết hàng</span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {outOfStockProducts}
          </div>
          <div className="text-[11px] text-zinc-500">
            <Link
              href="/admin/inventory"
              className="text-amber-600 dark:text-amber-400 underline hover:no-underline font-medium"
            >
              Cần nhập thêm tồn kho →
            </Link>
          </div>
        </div>

        {/* Total Users */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Người dùng đăng ký</span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">
            {totalUsers}
          </div>
          <div className="text-[11px] text-zinc-500">
            <span>Tài khoản khách &amp; Admin</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Best Selling & Recently Added */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Best Selling Products */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Sản phẩm bán chạy nhất
            </h2>
            <Link
              href="/admin/products"
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-0.5"
            >
              <span>Xem tất cả</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {bestSellingProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                  <Image
                    src={p.images[0]?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"}
                    alt={p.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {p.brand.name} • SKU: {p.sku}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">
                    {formatCurrency(p.price)}
                  </p>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold">
                    Đã bán {p.salesCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Products */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-500" />
              Sản phẩm mới thêm gần đây
            </h2>
            <Link
              href="/admin/products"
              className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-0.5"
            >
              <span>Quản lý</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {recentProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                  <Image
                    src={p.images[0]?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"}
                    alt={p.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {p.category.name} • Kho: {p.stock}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">
                    {formatCurrency(p.price)}
                  </p>
                  <span className="text-[10px] text-zinc-400">
                    {formatDate(p.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity / Customer Reviews */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          Đánh giá &amp; Hoạt động gần đây từ khách hàng
        </h2>

        {recentReviews.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">Chưa có đánh giá nào.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentReviews.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-900 dark:text-white">
                    {r.user.name}
                  </span>
                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-zinc-500 truncate">
                  Sản phẩm: <span className="text-zinc-800 dark:text-zinc-200">{r.product.name}</span>
                </p>
                <p className="text-zinc-700 dark:text-zinc-300 italic line-clamp-2">
                  &ldquo;{r.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
