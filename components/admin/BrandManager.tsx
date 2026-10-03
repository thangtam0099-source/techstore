"use client";

import React, { useState } from "react";
import { Tag, Edit2, Trash2 } from "lucide-react";
import { useToast } from "@/components/Toast/ToastContext";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

export default function BrandManager({
  initialBrands,
}: {
  initialBrands: BrandItem[];
}) {
  const { showToast } = useToast();
  const [brands, setBrands] = useState<BrandItem[]>(initialBrands);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BrandItem | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const endpoint = editId
        ? `/api/admin/brands/${editId}`
        : "/api/admin/brands";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Thao tác thất bại", "error");
      } else {
        showToast(
          editId ? "✓ Đã cập nhật thương hiệu!" : "✓ Đã thêm thương hiệu mới!"
        );
        if (editId) {
          setBrands((prev) =>
            prev.map((b) => (b.id === editId ? { ...b, ...data.brand } : b))
          );
        } else {
          setBrands((prev) => [
            ...prev,
            { ...data.brand, _count: { products: 0 } },
          ]);
        }
        handleCancelEdit();
      }
    } catch {
      showToast("Lỗi kết nối", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand: BrandItem) => {
    setEditId(brand.id);
    setName(brand.name);
    setSlug(brand.slug);
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setName("");
    setSlug("");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/brands/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBrands((prev) => prev.filter((b) => b.id !== deleteTarget.id));
        showToast("✓ Đã xóa thương hiệu thành công!");
        setDeleteTarget(null);
      } else {
        showToast("Không thể xóa thương hiệu.", "error");
      }
    } catch {
      showToast("Lỗi kết nối", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Brand Form */}
      <div className="lg:col-span-4 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-zinc-100 dark:border-zinc-800">
          <Tag className="w-4 h-4 text-zinc-500" />
          {editId ? "Sửa thương hiệu" : "Thêm thương hiệu mới"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Tên thương hiệu *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editId) {
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)+/g, "")
                  );
                }
              }}
              placeholder="e.g. Sony, Logitech"
              className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Slug URL *</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="sony"
              className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-4 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? "Đang lưu..." : editId ? "Cập nhật" : "Thêm thương hiệu"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="py-2 px-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Brands List Table */}
      <div className="lg:col-span-8 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Tên thương hiệu</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Số sản phẩm</th>
              <th className="py-3 px-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
            {brands.map((b) => (
              <tr key={b.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-white">
                  {b.name}
                </td>
                <td className="py-3 px-4 font-mono text-zinc-500">{b.slug}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold">
                    {b._count.products} sp
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(b)}
                      className="p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                      title="Sửa"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(b)}
                      className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-400 hover:text-red-600"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Xóa thương hiệu"
        message="Bạn có chắc chắn muốn xóa thương hiệu này?"
        itemName={deleteTarget?.name}
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
