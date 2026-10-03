import React from "react";
import prisma from "@/lib/db/prisma";
import BrandManager from "@/components/admin/BrandManager";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Quản lý thương hiệu
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Danh sách các hãng sản xuất và thương hiệu thiết bị
        </p>
      </div>

      <BrandManager initialBrands={brands} />
    </div>
  );
}
