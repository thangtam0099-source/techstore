"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  PlusCircle,
  CheckCircle,
  EyeOff,
  Filter,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { useToast } from "@/components/Toast/ToastContext";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  status: string;
  brand: { name: string };
  category: { name: string; slug: string };
  images: Array<{ imageUrl: string }>;
}

interface ProductManagementTableProps {
  initialProducts: ProductRow[];
  categories: Array<{ id: string; name: string; slug: string }>;
}

export default function ProductManagementTable({
  initialProducts,
  categories,
}: ProductManagementTableProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<ProductRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      selectedCategory === "all" || p.category.slug === selectedCategory;

    const matchesStatus =
      selectedStatus === "all" || p.status === selectedStatus;

    return matchesSearch && matchesCat && matchesStatus;
  });

  // Toggle Active / Draft status
  const handleToggleStatus = async (product: ProductRow) => {
    const nextStatus = product.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === product.id ? { ...item, status: nextStatus } : item
          )
        );
        showToast(
          nextStatus === "ACTIVE"
            ? "Đã kích hoạt hiển thị sản phẩm."
            : "Đã chuyển sản phẩm sang trạng thái ẩn (Draft)."
        );
      } else {
        showToast("Lỗi khi cập nhật trạng thái.", "error");
      }
    } catch {
      showToast("Lỗi kết nối", "error");
    }
  };

  // Delete product confirmation
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        showToast("✓ Đã xóa sản phẩm thành công!");
        setDeleteTarget(null);
      } else {
        showToast("Không thể xóa sản phẩm.", "error");
      }
    } catch {
      showToast("Lỗi kết nối", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, SKU, thương hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-2 px-3 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang bán (ACTIVE)</option>
            <option value="DRAFT">Bản nháp / Ẩn (DRAFT)</option>
          </select>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-xs font-semibold transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Thêm mới</span>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Sản phẩm</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Giá</th>
                <th className="py-3 px-4">Tồn kho</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-400">
                    Không tìm thấy sản phẩm nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  const isActive = p.status === "ACTIVE";

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      {/* Product image & name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-md bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200/50 dark:border-zinc-800">
                            <Image
                              src={p.images[0]?.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"}
                              alt={p.name}
                              fill
                              unoptimized={Boolean(p.images[0]?.imageUrl?.startsWith("data:"))}
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-zinc-900 dark:text-white truncate">
                              {p.name}
                            </p>
                            <p className="text-[11px] text-zinc-400 truncate">
                              {p.brand.name} • {p.category.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-4 font-mono text-zinc-600 dark:text-zinc-400">
                        {p.sku}
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-zinc-900 dark:text-white block">
                          {formatCurrency(p.price)}
                        </span>
                        {p.salePrice && p.salePrice > p.price && (
                          <span className="text-[10px] text-zinc-400 line-through">
                            {formatCurrency(p.salePrice)}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                            isOutOfStock
                              ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                              : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                          }`}
                        >
                          {isOutOfStock ? "Hết hàng (0)" : `Còn ${p.stock}`}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(p)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                            isActive
                              ? "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200"
                              : "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                          }`}
                          title="Bấm để chuyển đổi Ẩn / Hiện"
                        >
                          {isActive ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Đang bán</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3.5 h-3.5 text-amber-500" />
                              <span>Bản nháp</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/products/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTarget(p)}
                            className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-400 hover:text-red-600 transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này khỏi hệ thống? Dữ liệu hình ảnh và biến thể liên quan cũng sẽ bị xóa vĩnh viễn."
        itemName={deleteTarget?.name}
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
