import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, brands, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
      },
    }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Chỉnh sửa sản phẩm
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Cập nhật thông tin: {product.name} (SKU: {product.sku})
        </p>
      </div>

      <ProductForm
        initialData={product}
        brands={brands}
        categories={categories}
        isEdit={true}
      />
    </div>
  );
}
