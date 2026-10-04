"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { formatCurrency, calculateDiscount } from "@/lib/utils/format";
import { usePurchaseModal } from "@/components/PurchaseModal/PurchaseModalContext";
import { useCart } from "@/components/Cart/CartContext";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  salesCount: number;
  brand?: { name: string } | null;
  images: Array<{ imageUrl: string }>;
  reviews?: Array<{ rating: number }>;
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { openSinglePurchase } = usePurchaseModal();
  const { addToCart } = useCart();

  const isOutOfStock = product.stock <= 0;
  const discount = calculateDiscount(product.price, product.salePrice);
  const imageUrl =
    product.images?.[0]?.imageUrl ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop";

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? (
          product.reviews.reduce((acc, curr) => acc + curr.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : "5.0";

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    openSinglePurchase({
      name: product.name,
      sku: product.sku,
      price: product.price,
      slug: product.slug,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      image: imageUrl,
      quantity: 1,
      stock: product.stock,
    });
  };

  return (
    <div className="group relative flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-all duration-150 hover:border-zinc-400 dark:hover:border-zinc-700">
      {/* Product Image */}
      <Link
        href={`/products/${product.slug}`}
        prefetch={true}
        className="relative aspect-square w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden block"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          unoptimized={imageUrl.startsWith("data:")}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-red-600 text-white shadow-sm">
            -{discount}%
          </div>
        )}

        {/* Out of Stock Badge */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-2.5 py-1 rounded bg-zinc-900/90 text-white text-xs font-semibold uppercase tracking-wider">
              Hết hàng
            </span>
          </div>
        )}
      </Link>

      {/* Info Container */}
      <div className="p-3 sm:p-4 flex flex-col flex-1">
        {/* Brand & Stock status */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">
          <span className="font-medium truncate">{product.brand?.name || "Tâm Store"}</span>
          <span className={isOutOfStock ? "text-red-500 font-medium" : "text-emerald-600 dark:text-emerald-400"}>
            {isOutOfStock ? "Hết hàng" : "Còn hàng"}
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          prefetch={true}
          className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating and Sales count */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{averageRating}</span>
          </div>
          <span className="text-zinc-300 dark:text-zinc-700">•</span>
          <span className="text-[11px]">Đã bán {product.salesCount}</span>
        </div>

        {/* Price Row */}
        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
              {formatCurrency(product.price)}
            </span>
            {product.salePrice && product.salePrice > product.price && (
              <span className="text-xs text-zinc-400 line-through">
                {formatCurrency(product.salePrice)}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleBuyClick}
            disabled={isOutOfStock}
            className={`flex-1 py-1.5 px-3 rounded-md text-xs font-semibold transition-colors text-center ${
              isOutOfStock
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900"
            }`}
          >
            {isOutOfStock ? "Hết hàng" : "Mua"}
          </button>

          {!isOutOfStock && (
            <button
              type="button"
              onClick={handleAddToCart}
              title="Thêm vào giỏ"
              className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Thêm vào giỏ"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
