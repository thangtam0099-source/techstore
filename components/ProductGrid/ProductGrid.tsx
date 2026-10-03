import React from "react";
import ProductCard, { ProductCardData } from "@/components/ProductCard/ProductCard";
import ProductCardSkeleton from "@/components/Skeleton/ProductCardSkeleton";
import EmptyState from "@/components/EmptyState/EmptyState";

interface ProductGridProps {
  products: ProductCardData[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export default function ProductGrid({
  products,
  loading = false,
  emptyTitle,
  emptyDescription,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
