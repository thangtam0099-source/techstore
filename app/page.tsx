import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Watch,
  Mouse,
  Cpu,
  Wifi,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Truck,
} from "lucide-react";
import prisma from "@/lib/db/prisma";
import { getCachedCategories } from "@/lib/db/cached";
import ProductGrid from "@/components/ProductGrid/ProductGrid";

export const revalidate = 60; // ISR cache

const categoryIconMap: Record<string, React.ReactNode> = {
  "dien-thoai": <Smartphone className="w-5 h-5" />,
  laptop: <Laptop className="w-5 h-5" />,
  tablet: <Tablet className="w-5 h-5" />,
  "tai-nghe": <Headphones className="w-5 h-5" />,
  "dong-ho-thong-minh": <Watch className="w-5 h-5" />,
  "phu-kien": <Mouse className="w-5 h-5" />,
  "linh-kien-may-tinh": <Cpu className="w-5 h-5" />,
  "thiet-bi-mang": <Wifi className="w-5 h-5" />,
};

export default async function HomePage() {
  const [categories, featuredProducts, newProducts] = await Promise.all([
    getCachedCategories(),
    prisma.product.findMany({
      where: { status: "ACTIVE", isFeatured: true },
      take: 8,
      orderBy: { salesCount: "desc" },
      include: {
        brand: { select: { name: true } },
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        brand: { select: { name: true } },
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        reviews: { select: { rating: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Cửa hàng công nghệ cá nhân chính hãng
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
                Thiết bị công nghệ cho cuộc sống hiện đại
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                Khám phá tuyển tập điện thoại, laptop, âm thanh và phụ kiện công nghệ cao cấp. Mua sắm dễ dàng, kết nối trực tiếp với chủ shop qua Messenger để nhận tư vấn chi tiết và ưu đãi tốt nhất.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-colors shadow-sm"
                >
                  <span>Xem sản phẩm</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/products?featured=true"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 transition-colors"
                >
                  Sản phẩm nổi bật
                </Link>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
                  <span>Chính hãng 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
                  <span>Chat Messenger nhanh</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-zinc-700 dark:text-zinc-300 shrink-0" />
                  <span>Giao toàn quốc</span>
                </div>
              </div>
            </div>

            {/* Right Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop"
                  alt="Thiết bị công nghệ hiện đại"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center"
                />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-white/90 dark:bg-zinc-900/90 backdrop-blur border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white">
                      MacBook Pro M3 &amp; iPhone 16 Pro
                    </p>
                    <p className="text-[11px] text-zinc-500">Sẵn hàng - Giá cực tốt khi liên hệ</p>
                  </div>
                  <Link
                    href="/products/macbook-pro-14-m3-pro"
                    className="text-xs font-medium text-zinc-900 dark:text-white underline hover:no-underline ml-2"
                  >
                    Xem →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 sm:space-y-16">
        {/* 2. DANH MỤC SẢN PHẨM */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Danh mục sản phẩm
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Lựa chọn thiết bị theo nhu cầu của bạn
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group flex flex-col items-center justify-center p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors text-center"
              >
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center group-hover:scale-105 transition-transform mb-2">
                  {categoryIconMap[cat.slug] || <Smartphone className="w-5 h-5" />}
                </div>
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white truncate w-full">
                  {cat.name}
                </span>
                <span className="text-[10px] text-zinc-400 mt-0.5">
                  {cat._count.products} sản phẩm
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. SẢN PHẨM NỔI BẬT */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Sản phẩm nổi bật
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Các sản phẩm bán chạy và được quan tâm nhiều nhất
              </p>
            </div>
            <Link
              href="/products?featured=true"
              className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ProductGrid products={featuredProducts} />
        </section>

        {/* 4. SẢN PHẨM MỚI VỀ */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Mới cập bến
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Công nghệ thế hệ mới vừa có mặt tại shop
              </p>
            </div>
            <Link
              href="/products?sort=newest"
              className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Xem thêm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <ProductGrid products={newProducts} />
        </section>

        {/* 5. MÔ HÌNH MUA HÀNG TIỆN LỢI */}
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
              Mua sắm đơn giản qua Messenger
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
              Không cần đăng ký thẻ thanh toán phức tạp hay qua nhiều bước checkout. Bạn chỉ cần chọn sản phẩm, sao chép hoặc mở Messenger để nhắn tin trực tiếp với shop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/80">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center mb-3">
                1
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                Chọn sản phẩm
              </h4>
              <p className="text-xs text-zinc-500">
                Tìm kiếm, lọc danh mục và chọn biến thể cấu hình phù hợp với nhu cầu.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/80">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center mb-3">
                2
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                Bấm nút &quot;Mua&quot;
              </h4>
              <p className="text-xs text-zinc-500">
                Website tự động soạn sẵn đầy đủ thông tin: tên máy, SKU, giá và link sản phẩm.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-100 dark:border-zinc-800/80">
              <div className="w-8 h-8 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold flex items-center justify-center mb-3">
                3
              </div>
              <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-1">
                Gửi Messenger cho shop
              </h4>
              <p className="text-xs text-zinc-500">
                Chủ shop phản hồi trực tiếp, tư vấn bảo hành và tiến hành ship hàng nhanh chóng.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
