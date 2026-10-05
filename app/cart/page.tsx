"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowLeft, MessageCircle, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/Cart/CartContext";
import { usePurchaseModal } from "@/components/PurchaseModal/PurchaseModalContext";
import { formatCurrency } from "@/lib/utils/format";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalPrice, totalItems } = useCart();
  const { openCartPurchase } = usePurchaseModal();

  const handleCheckout = () => {
    if (items.length === 0) return;
    openCartPurchase(
      items.map((it) => ({
        productId: it.productId,
        name: it.name,
        variant: it.variant,
        quantity: it.quantity,
        price: it.price,
      }))
    );
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-2">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
          Giỏ hàng của bạn đang trống
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mx-auto">
          Chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá danh mục và thêm các sản phẩm bạn quan tâm.
        </p>
        <div className="pt-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Xem sản phẩm ngay</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Giỏ hàng ({totalItems})
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Xem lại các sản phẩm đã chọn trước khi gửi tin nhắn cho shop
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Products List (Left) */}
        <div className="lg:col-span-8 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-3 sm:gap-4 items-center"
            >
              {/* Image */}
              <Link
                href={`/products/${item.slug}`}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 shrink-0"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  unoptimized={Boolean(item.image?.startsWith("data:"))}
                  sizes="100px"
                  className="object-cover"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate block"
                >
                  {item.name}
                </Link>
                {item.variant && (
                  <p className="text-xs text-zinc-500">Phân loại: {item.variant}</p>
                )}
                <p className="text-xs font-mono text-zinc-400">SKU: {item.sku}</p>

                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {formatCurrency(item.price)}
                  </span>
                </div>
              </div>

              {/* Quantity & Delete */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                <div className="inline-flex items-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 sm:p-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-l-md"
                    aria-label="Giảm số lượng"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-semibold text-zinc-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 sm:p-1.5 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-r-md"
                    aria-label="Tăng số lượng"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right sm:w-28">
                  <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white block">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                  title="Xóa khỏi giỏ"
                  aria-label="Xóa sản phẩm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Tiếp tục xem các sản phẩm khác</span>
            </Link>
          </div>
        </div>

        {/* Order Summary (Right) */}
        <div className="lg:col-span-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4 sticky top-24">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white pb-3 border-b border-zinc-100 dark:border-zinc-800">
            Tóm tắt đơn hàng
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-zinc-500">
              <span>Tổng số lượng sản phẩm:</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {totalItems} món
              </span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Hình thức mua sắm:</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                Nhắn tin Messenger
              </span>
            </div>
            <div className="flex justify-between text-zinc-500">
              <span>Phí vận chuyển:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                Shop báo khi chốt đơn
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-baseline">
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              Tổng tiền dự kiến:
            </span>
            <span className="text-xl font-black text-zinc-900 dark:text-white">
              {formatCurrency(totalPrice)}
            </span>
          </div>

          <p className="text-[11px] text-zinc-400 leading-relaxed">
            * Nhấn &quot;Mua&quot; để tạo tin nhắn tổng hợp danh sách các món trên gửi trực tiếp tới shop qua Messenger.
          </p>

          <button
            type="button"
            onClick={handleCheckout}
            className="w-full py-3 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Mua (Gửi danh sách qua Messenger)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
