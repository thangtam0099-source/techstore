import React from "react";
import prisma from "@/lib/db/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Thêm sản phẩm mới
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Điền đầy đủ thông tin kỹ thuật, giá bán và hình ảnh sản phẩm
        </p>
      </div>

      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}
