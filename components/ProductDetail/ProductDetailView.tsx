"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  MessageCircle,
  Trash2,
  Lock,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import { formatCurrency, calculateDiscount, formatDate } from "@/lib/utils/format";
import { usePurchaseModal } from "@/components/PurchaseModal/PurchaseModalContext";
import { useCart } from "@/components/Cart/CartContext";
import { useToast } from "@/components/Toast/ToastContext";
import { useAuth } from "@/components/Auth/AuthContext";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    salesCount: number;
    description: string;
    shortDescription?: string | null;
    specifications: string;
    brand: { name: string };
    category: { name: string; slug: string };
    images: Array<{ id: string; imageUrl: string; sortOrder: number }>;
    variants: Array<{
      id: string;
      name: string;
      value: string;
      price?: number | null;
      stock: number;
    }>;
    reviews: Array<{
      id: string;
      rating: number;
      comment: string;
      createdAt: Date | string;
      user: { name: string };
    }>;
  };
}

export default function ProductDetailView({ product }: ProductDetailProps) {
  const { openSinglePurchase } = usePurchaseModal();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { user } = useAuth();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants.length > 0 ? product.variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);

  // Review submission state
  const [userRating, setUserRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewsList, setReviewsList] = useState(product.reviews);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  // Quyền đánh giá: Chỉ khách hàng đã mua sản phẩm (hoặc Admin) mới được đánh giá
  const [eligibility, setEligibility] = useState<{
    canReview: boolean;
    hasPurchased: boolean;
    isAdmin: boolean;
    isLoggedIn: boolean;
  } | null>(null);
  const [checkingEligibility, setCheckingEligibility] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const checkEligible = async () => {
      setCheckingEligibility(true);
      try {
        const res = await fetch(`/api/reviews?productId=${product.id}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setEligibility(data);
        }
      } catch (e) {
        console.error("Failed to check review eligibility", e);
      } finally {
        if (isMounted) setCheckingEligibility(false);
      }
    };
    checkEligible();
    return () => {
      isMounted = false;
    };
  }, [product.id, user]);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;
  const discount = calculateDiscount(currentPrice, product.salePrice);

  const images = product.images.length > 0 ? product.images : [
    { id: "def", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop", sortOrder: 0 }
  ];

  const mainImageUrl = images[selectedImageIndex]?.imageUrl || images[0].imageUrl;

  // Technical Specs parsing
  let specsObj: Record<string, string> = {};
  try {
    specsObj = JSON.parse(product.specifications);
  } catch {
    specsObj = {};
  }

  // Reviews calculation
  const totalReviews = reviewsList.length;
  const avgRating =
    totalReviews > 0
      ? (reviewsList.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
      : "5.0";

  // Star breakdown
  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewsList.filter((r) => r.rating === star).length,
    percentage:
      totalReviews > 0
        ? Math.round((reviewsList.filter((r) => r.rating === star).length / totalReviews) * 100)
        : 0,
  }));

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    openSinglePurchase(
      {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: currentPrice,
        slug: product.slug,
      },
      quantity,
      selectedVariant ? selectedVariant.value : null
    );
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: currentPrice,
      image: mainImageUrl,
      variant: selectedVariant ? selectedVariant.value : null,
      quantity,
      stock: currentStock,
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast("Vui lòng viết nội dung đánh giá.", "error");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: userRating,
          comment: reviewComment.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Bạn chưa có quyền đánh giá sản phẩm này.", "error");
      } else {
        setReviewsList((prev) => [data.review, ...prev]);
        setReviewComment("");
        showToast("✓ Cảm ơn bạn đã gửi đánh giá sản phẩm!");
      }
    } catch {
      showToast("Lỗi khi gửi đánh giá.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Quản trị viên (Admin) xóa đánh giá không đúng
  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không? Thao tác này sẽ gỡ bỏ đánh giá khỏi hệ thống.")) {
      return;
    }
    setDeletingReviewId(reviewId);
    try {
      const res = await fetch(`/api/reviews?id=${reviewId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setReviewsList((prev) => prev.filter((r) => r.id !== reviewId));
        showToast("✓ Đã xóa đánh giá sản phẩm thành công.");
      } else {
        showToast(data.error || "Không thể xóa đánh giá.", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi xóa đánh giá.", "error");
    } finally {
      setDeletingReviewId(null);
    }
  };

  return (
    <div className="space-y-12">
      {/* SECTION 1: TOP MAIN GALLERY + BUY SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <Image
              src={mainImageUrl}
              alt={product.name}
              fill
              priority
              unoptimized={mainImageUrl.startsWith("data:")}
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover object-center"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">
                -{discount}%
              </span>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
                <span className="px-4 py-2 rounded-lg bg-zinc-900 text-white text-sm font-semibold uppercase tracking-wider">
                  Hết hàng tạm thời
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? "border-zinc-900 dark:border-white ring-1 ring-zinc-900 dark:ring-white"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.imageUrl}
                    alt={`Ảnh thumbnail ${idx + 1}`}
                    fill
                    unoptimized={img.imageUrl.startsWith("data:")}
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Info */}
        <div className="lg:col-span-6 flex flex-col space-y-5">
          {/* Brand & SKU */}
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span className="uppercase tracking-wider font-semibold text-zinc-700 dark:text-zinc-300">
              {product.brand.name}
            </span>
            <span className="font-mono">SKU: {product.sku}</span>
          </div>

          {/* Product Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-snug">
            {product.name}
          </h1>

          {/* Ratings & Sales count */}
          <div className="flex items-center gap-3 text-xs text-zinc-500 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(Number(avgRating))
                        ? "fill-amber-400"
                        : "text-zinc-300 dark:text-zinc-700"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">{avgRating}</span>
              <span className="text-zinc-400">({totalReviews} đánh giá)</span>
            </div>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span>Đã bán {product.salesCount}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className={isOutOfStock ? "text-red-500 font-medium" : "text-emerald-600 dark:text-emerald-400 font-medium"}>
              {isOutOfStock ? "Tạm hết hàng" : `Còn hàng (${currentStock})`}
            </span>
          </div>

          {/* Price Area */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800 space-y-1">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
                {formatCurrency(currentPrice)}
              </span>
              {product.salePrice && product.salePrice > currentPrice && (
                <span className="text-sm text-zinc-400 line-through">
                  {formatCurrency(product.salePrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 font-semibold">
                  Tiết kiệm {discount}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-500">
              * Giá đã bao gồm đầy đủ VAT và phụ kiện chuẩn hãng
            </p>
          </div>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Variants Selector */}
          {product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider block">
                {product.variants[0].name || "Lựa chọn cấu hình"}:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariantId === v.id;
                  const isVarOutOfStock = v.stock <= 0;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                        isSelected
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                          : isVarOutOfStock
                          ? "border-zinc-200 dark:border-zinc-800 text-zinc-400 line-through opacity-60"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{v.value}</span>
                      {v.price && v.price !== product.price && (
                        <span className="text-[10px] opacity-80">
                          ({formatCurrency(v.price)})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider block">
              Số lượng:
            </label>
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors rounded-l-lg"
                  aria-label="Giảm số lượng"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={currentStock}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) {
                      setQuantity(Math.max(1, Math.min(val, currentStock)));
                    }
                  }}
                  className="w-12 text-center text-xs font-semibold bg-transparent focus:outline-none text-zinc-900 dark:text-white"
                />
                <button
                  type="button"
                  disabled={quantity >= currentStock || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  className="p-2 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors rounded-r-lg"
                  aria-label="Tăng số lượng"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-zinc-400">
                {currentStock > 0 ? `(Kho sẵn: ${currentStock})` : ""}
              </span>
            </div>
          </div>

          {/* Actions: "Mua" and "Thêm vào giỏ" */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`flex-1 py-3 px-6 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                isOutOfStock
                  ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                  : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 shadow-sm"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isOutOfStock ? "Hết hàng" : "Mua"}</span>
            </button>

            {!isOutOfStock && (
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3 px-5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Thêm vào giỏ</span>
              </button>
            )}
          </div>

          {/* Service Commitments */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              <span>Chính hãng 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              <span>Giao hàng tận nơi</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              <span>Đổi mới 30 ngày lỗi</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SPECIFICATIONS & DESCRIPTION TABS */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Detailed Description */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Mô tả chi tiết sản phẩm
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Specifications Table */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
              Thông số kỹ thuật
            </h2>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-xs">
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50">
                    <td className="py-2.5 px-4 font-semibold text-zinc-600 dark:text-zinc-400 w-1/3">
                      Thương hiệu
                    </td>
                    <td className="py-2.5 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                      {product.brand.name}
                    </td>
                  </tr>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800/80">
                    <td className="py-2.5 px-4 font-semibold text-zinc-600 dark:text-zinc-400">
                      Model / Tên
                    </td>
                    <td className="py-2.5 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                      {product.name}
                    </td>
                  </tr>
                  {Object.entries(specsObj).map(([specKey, specVal], idx) => (
                    <tr
                      key={specKey}
                      className={`border-b border-zinc-100 dark:border-zinc-800/80 ${
                        idx % 2 === 0 ? "bg-zinc-50 dark:bg-zinc-900/50" : ""
                      }`}
                    >
                      <td className="py-2.5 px-4 font-semibold text-zinc-600 dark:text-zinc-400">
                        {specKey}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-zinc-900 dark:text-zinc-100">
                        {specVal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: REVIEWS & RATINGS */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-10 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Đánh giá từ khách hàng ({totalReviews})
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Nhận xét thực tế từ người dùng đã trải nghiệm sản phẩm
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 dark:border-zinc-800 pb-4 md:pb-0 md:pr-4">
            <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
              {avgRating}
            </span>
            <div className="flex items-center gap-1 my-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(Number(avgRating))
                      ? "fill-amber-400"
                      : "text-zinc-300 dark:text-zinc-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-zinc-400">{totalReviews} lượt đánh giá</span>
          </div>

          <div className="md:col-span-8 space-y-2 text-xs flex flex-col justify-center">
            {starCounts.map((item) => (
              <div key={item.star} className="flex items-center gap-3">
                <span className="w-12 font-medium text-zinc-600 dark:text-zinc-400">
                  {item.star} sao
                </span>
                <div className="flex-1 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-zinc-400">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Form / Eligibility States */}
        {checkingEligibility ? (
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-500 animate-pulse">
            Đang kiểm tra quyền gửi đánh giá...
          </div>
        ) : !eligibility?.isLoggedIn ? (
          /* Case 1: Chưa đăng nhập */
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Đăng nhập để viết đánh giá
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  Chỉ những khách hàng đã mua sản phẩm này tại Nexus Gaming mới có quyền gửi nhận xét, nhằm ngăn chặn tình trạng đánh giá không đúng thực tế.
                </p>
              </div>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-medium shrink-0 transition-colors"
            >
              Đăng nhập ngay
            </Link>
          </div>
        ) : !eligibility?.canReview ? (
          /* Case 2: Đã đăng nhập nhưng chưa mua sản phẩm này */
          <div className="p-4 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-xs flex items-start gap-3">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-900 dark:text-amber-200">
                Đánh giá dành riêng cho khách hàng đã mua sản phẩm
              </p>
              <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                Tài khoản của bạn chưa có lịch sử mua sản phẩm này tại Nexus Gaming. Để bảo vệ trải nghiệm của người mua và tránh đánh giá sai lệch, hệ thống chỉ cho phép khách hàng đã đặt mua thành công gửi đánh giá.
              </p>
            </div>
          </div>
        ) : (
          /* Case 3: Đã mua sản phẩm hoặc là Admin - Cho phép gửi đánh giá */
          <form
            onSubmit={handleReviewSubmit}
            className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                Viết đánh giá của bạn
              </h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {eligibility?.isAdmin
                    ? "Quản trị viên (Admin)"
                    : "✓ Người mua đã xác minh"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500">Mức độ hài lòng:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-0.5 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= userRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-300 dark:text-zinc-700"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm (chất lượng, đóng gói, trải nghiệm sử dụng)..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />

            <button
              type="submit"
              disabled={submittingReview}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-colors disabled:opacity-50"
            >
              {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </form>
        )}

        {/* Customer Reviews List */}
        <div className="space-y-4">
          {reviewsList.length === 0 ? (
            <p className="text-xs text-zinc-500 py-6 text-center">
              Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên trải nghiệm và chia sẻ nhận xét!
            </p>
          ) : (
            reviewsList.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 relative group"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {rev.user?.name || "Khách hàng"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Đã mua tại Nexus Gaming
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400">{formatDate(rev.createdAt)}</span>

                    {/* Nút xóa đánh giá cho Admin */}
                    {user?.role === "ADMIN" && (
                      <button
                        type="button"
                        onClick={() => handleDeleteReview(rev.id)}
                        disabled={deletingReviewId === rev.id}
                        className="inline-flex items-center gap-1 text-[11px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 px-2 py-1 rounded transition-colors"
                        title="Xóa đánh giá này (Dành cho Admin)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Xóa</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? "fill-amber-400"
                          : "text-zinc-200 dark:text-zinc-800"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
