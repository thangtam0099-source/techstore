import React from "react";
import prisma from "@/lib/db/prisma";
import InventoryTable from "@/components/admin/InventoryTable";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    orderBy: { stock: "asc" },
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Quản lý tồn kho
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Theo dõi số lượng hàng hóa và cập nhật trực tiếp số lượng tồn kho của từng sản phẩm
        </p>
      </div>

      <InventoryTable initialProducts={products} />
    </div>
  );
}
