"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Save, AlertTriangle, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import { useToast } from "@/components/Toast/ToastContext";

interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  brand: { name: string };
  category: { name: string };
  images: Array<{ imageUrl: string }>;
}

export default function InventoryTable({
  initialProducts,
}: {
  initialProducts: InventoryProduct[];
}) {
  const { showToast } = useToast();
  const [products, setProducts] = useState(initialProducts);
  const [stockEdits, setStockEdits] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "out" | "low">("all");
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleStockChange = (id: string, value: number) => {
    setStockEdits((prev) => ({ ...prev, [id]: Math.max(0, value) }));
  };

  const handleSaveStock = async (product: InventoryProduct) => {
    const newStock = stockEdits[product.id];
    if (newStock === undefined) return;

    setSavingId(product.id);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, stock: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, stock: newStock } : p))
        );
        setStockEdits((prev) => {
          const next = { ...prev };
          delete next[product.id];
          return next;
        });
        showToast(`✓ Đã cập nhật tồn kho cho "${product.name}" thành ${newStock}!`);
      } else {
        showToast("Lỗi khi lưu tồn kho.", "error");
      }
    } catch {
      showToast("Lỗi kết nối", "error");
    } finally {
      setSavingId(null);
    }
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const currentStock = stockEdits[p.id] !== undefined ? stockEdits[p.id] : p.stock;

    if (filterType === "out") return matchesSearch && currentStock <= 0;
    if (filterType === "low") return matchesSearch && currentStock > 0 && currentStock <= 5;
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
              filterType === "all"
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                : "border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            Tất cả ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("out")}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
              filterType === "out"
                ? "bg-red-600 text-white"
                : "border border-zinc-200 dark:border-zinc-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            }`}
          >
            Hết hàng ({products.filter((p) => p.stock <= 0).length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("low")}
            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
              filterType === "low"
                ? "bg-amber-600 text-white"
                : "border border-zinc-200 dark:border-zinc-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
            }`}
          >
            Sắp hết (≤ 5)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Sản phẩm</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Giá bán</th>
              <th className="py-3 px-4">Trạng thái kho</th>
              <th className="py-3 px-4">Tồn kho hiện tại</th>
              <th className="py-3 px-4 text-right">Lưu thay đổi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {filtered.map((p) => {
              const currentStock =
                stockEdits[p.id] !== undefined ? stockEdits[p.id] : p.stock;
              const hasChanged =
                stockEdits[p.id] !== undefined && stockEdits[p.id] !== p.stock;

              return (
                <tr key={p.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                        <Image
                          src={p.images[0]?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"}
                          alt={p.name}
                          fill
                          unoptimized={Boolean(p.images[0]?.imageUrl?.startsWith("data:"))}
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <p className="font-semibold text-zinc-900 dark:text-white truncate">
                          {p.name}
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          {p.brand.name} • {p.category.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono text-zinc-600 dark:text-zinc-400">
                    {p.sku}
                  </td>

                  <td className="py-3 px-4 font-medium text-zinc-900 dark:text-white">
                    {formatCurrency(p.price)}
                  </td>

                  <td className="py-3 px-4">
                    {currentStock <= 0 ? (
                      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Hết hàng
                      </span>
                    ) : currentStock <= 5 ? (
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Sắp hết
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Dồi dào
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min={0}
                      value={currentStock}
                      onChange={(e) =>
                        handleStockChange(p.id, parseInt(e.target.value, 10) || 0)
                      }
                      className={`w-20 p-1.5 rounded-lg border text-center font-bold text-xs focus:outline-none ${
                        hasChanged
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100"
                          : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                      }`}
                    />
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      disabled={!hasChanged || savingId === p.id}
                      onClick={() => handleSaveStock(p)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        hasChanged
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
                      }`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingId === p.id ? "Đang lưu..." : "Cập nhật"}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
