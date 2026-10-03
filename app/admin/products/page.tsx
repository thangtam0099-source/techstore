import React from "react";
import prisma from "@/lib/db/prisma";
import ProductManagementTable from "@/components/admin/ProductManagementTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        brand: { select: { name: true } },
        category: { select: { name: true, slug: true } },
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Quản lý sản phẩm
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Danh sách toàn bộ sản phẩm trong cửa hàng ({products.length} sản phẩm)
        </p>
      </div>

      <ProductManagementTable
        initialProducts={products}
        categories={categories}
      />
    </div>
  );
}
