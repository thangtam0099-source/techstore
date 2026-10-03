import React from "react";
import Link from "next/link";
import prisma from "@/lib/db/prisma";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import { Filter, SlidersHorizontal, Search, X } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: {
    q?: string;
    category?: string;
    brand?: string;
    priceRange?: string;
    stock?: string;
    sort?: string;
    page?: string;
    featured?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = searchParams.q?.trim() || "";
  const categorySlug = searchParams.category || "";
  const brandSlug = searchParams.brand || "";
  const priceRange = searchParams.priceRange || "";
  const stockOnly = searchParams.stock === "in_stock";
  const sortBy = searchParams.sort || "newest";
  const isFeatured = searchParams.featured === "true";
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10));
  const pageSize = 12;

  // Build Prisma Where Clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    status: "ACTIVE",
  };

  if (isFeatured) {
    where.isFeatured = true;
  }

  if (stockOnly) {
    where.stock = { gt: 0 };
  }

  if (categorySlug && categorySlug !== "all") {
    where.category = { slug: categorySlug };
  }

  if (brandSlug && brandSlug !== "all") {
    where.brand = { slug: brandSlug };
  }

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { sku: { contains: query } },
      { brand: { name: { contains: query } } },
      { description: { contains: query } },
    ];
  }

  if (priceRange) {
    switch (priceRange) {
      case "under-5m":
        where.price = { lt: 5000000 };
        break;
      case "5m-15m":
        where.price = { gte: 5000000, lte: 15000000 };
        break;
      case "15m-30m":
        where.price = { gte: 15000000, lte: 30000000 };
        break;
      case "above-30m":
        where.price = { gt: 30000000 };
        break;
    }
  }

  // Order By
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "price_asc") orderBy = { price: "asc" };
  else if (sortBy === "price_desc") orderBy = { price: "desc" };
  else if (sortBy === "sales") orderBy = { salesCount: "desc" };

  const [products, totalCount, categories, brands] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
      include: {
        brand: { select: { name: true, slug: true } },
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Helper to build filter query string
  const createFilterUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (categorySlug) params.set("category", categorySlug);
    if (brandSlug) params.set("brand", brandSlug);
    if (priceRange) params.set("priceRange", priceRange);
    if (stockOnly) params.set("stock", "in_stock");
    if (sortBy !== "newest") params.set("sort", sortBy);
    if (isFeatured) params.set("featured", "true");

    Object.entries(overrides).forEach(([key, val]) => {
      if (!val || val === "all") {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    // Reset page to 1 unless page is explicitly changed
    if (!overrides.page) {
      params.delete("page");
    }

    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner / Breadcrumb & Search indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {isFeatured
              ? "Sản phẩm khuyến mãi & nổi bật"
              : categorySlug
              ? categories.find((c) => c.slug === categorySlug)?.name || "Danh mục sản phẩm"
              : "Tất cả sản phẩm"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Tìm thấy <span className="font-semibold text-zinc-900 dark:text-white">{totalCount}</span> sản phẩm
            {query && <span> cho từ khóa &quot;{query}&quot;</span>}
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 whitespace-nowrap">Sắp xếp:</span>
          <form method="GET" action="/products" className="inline-block">
            {query && <input type="hidden" name="q" value={query} />}
            {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
            {brandSlug && <input type="hidden" name="brand" value={brandSlug} />}
            {priceRange && <input type="hidden" name="priceRange" value={priceRange} />}
            {stockOnly && <input type="hidden" name="stock" value="in_stock" />}
            {isFeatured && <input type="hidden" name="featured" value="true" />}
            <select
              name="sort"
              defaultValue={sortBy}
              // auto-submit on change
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              onChange="this.form.submit()"
              className="py-1.5 px-3 rounded-lg text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá: Thấp → Cao</option>
              <option value="price_desc">Giá: Cao → Thấp</option>
              <option value="sales">Bán chạy</option>
            </select>
          </form>
        </div>
      </div>

      {/* Main Content: Filter Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <aside className="space-y-6">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Bộ lọc tìm kiếm
              </span>
              {(categorySlug || brandSlug || priceRange || stockOnly || query) && (
                <Link
                  href="/products"
                  className="text-[11px] text-zinc-500 hover:text-red-500 transition-colors"
                >
                  Xóa tất cả
                </Link>
              )}
            </div>

            {/* Keyword Search inside Filter */}
            <form method="GET" action="/products" className="relative">
              {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
              {brandSlug && <input type="hidden" name="brand" value={brandSlug} />}
              {priceRange && <input type="hidden" name="priceRange" value={priceRange} />}
              {stockOnly && <input type="hidden" name="stock" value="in_stock" />}
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Tìm tên, SKU..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </form>

            {/* Category Filter */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                Danh mục
              </h3>
              <div className="space-y-1 max-h-48 overflow-y-auto text-xs">
                <Link
                  href={createFilterUrl({ category: undefined })}
                  className={`block px-2 py-1.5 rounded transition-colors ${
                    !categorySlug || categorySlug === "all"
                      ? "bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  Tất cả danh mục
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={createFilterUrl({ category: c.slug })}
                    className={`block px-2 py-1.5 rounded transition-colors ${
                      categorySlug === c.slug
                        ? "bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                Thương hiệu
              </h3>
              <div className="space-y-1 max-h-40 overflow-y-auto text-xs">
                <Link
                  href={createFilterUrl({ brand: undefined })}
                  className={`block px-2 py-1.5 rounded transition-colors ${
                    !brandSlug || brandSlug === "all"
                      ? "bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  Tất cả thương hiệu
                </Link>
                {brands.map((b) => (
                  <Link
                    key={b.id}
                    href={createFilterUrl({ brand: b.slug })}
                    className={`block px-2 py-1.5 rounded transition-colors ${
                      brandSlug === b.slug
                        ? "bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                Khoảng giá
              </h3>
              <div className="space-y-1">
                {[
                  { id: undefined, label: "Tất cả mức giá" },
                  { id: "under-5m", label: "Dưới 5 triệu" },
                  { id: "5m-15m", label: "5 triệu - 15 triệu" },
                  { id: "15m-30m", label: "15 triệu - 30 triệu" },
                  { id: "above-30m", label: "Trên 30 triệu" },
                ].map((range) => (
                  <Link
                    key={range.id || "all"}
                    href={createFilterUrl({ priceRange: range.id })}
                    className={`block px-2 py-1.5 rounded transition-colors ${
                      (!priceRange && !range.id) || priceRange === range.id
                        ? "bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    {range.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Stock status Filter */}
            <div className="space-y-2 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs">
              <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                Tình trạng
              </h3>
              <div className="space-y-1">
                <Link
                  href={createFilterUrl({ stock: undefined })}
                  className={`block px-2 py-1.5 rounded transition-colors ${
                    !stockOnly
                      ? "bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  Tất cả sản phẩm
                </Link>
                <Link
                  href={createFilterUrl({ stock: "in_stock" })}
                  className={`block px-2 py-1.5 rounded transition-colors ${
                    stockOnly
                      ? "bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-white"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  Chỉ hiện Còn hàng
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Products Grid + Pagination */}
        <main className="lg:col-span-3 space-y-6">
          <ProductGrid products={products} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-xs">
              {currentPage > 1 && (
                <Link
                  href={createFilterUrl({ page: (currentPage - 1).toString() })}
                  className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  ← Trang trước
                </Link>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={createFilterUrl({ page: p.toString() })}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium transition-colors ${
                    p === currentPage
                      ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                      : "border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {p}
                </Link>
              ))}

              {currentPage < totalPages && (
                <Link
                  href={createFilterUrl({ page: (currentPage + 1).toString() })}
                  className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                >
                  Trang sau →
                </Link>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
