import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getTopProductSlugs } from "@/lib/db/cached";
import ProductDetailView from "@/components/ProductDetail/ProductDetailView";

export const revalidate = 120; // Cache product page for 2 minutes

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    return await getTopProductSlugs();
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Không tìm thấy sản phẩm - Tâm Store",
    };
  }

  const imageUrl = product.images[0]?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop";

  return {
    title: `${product.name} | Tâm Store Chính Hãng`,
    description: product.shortDescription || `${product.name} chính hãng từ thương hiệu ${product.brand.name}. Tư vấn và mua hàng trực tiếp qua Messenger.`,
    openGraph: {
      title: `${product.name} - Tâm Store`,
      description: product.shortDescription || `${product.name} chính hãng tại Tâm Store.`,
      images: [{ url: imageUrl }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product || product.status === "ARCHIVED") {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-zinc-500 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <Link href="/products" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
          Sản phẩm
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <span className="text-zinc-900 dark:text-zinc-200 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Detail View */}
      <ProductDetailView product={product} />
    </div>
  );
}
