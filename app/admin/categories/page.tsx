import React from "react";
import prisma from "@/lib/db/prisma";
import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Quản lý danh mục sản phẩm
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Tạo và chỉnh sửa các danh mục phân loại thiết bị
        </p>
      </div>

      <CategoryManager initialCategories={categories} />
    </div>
  );
}
