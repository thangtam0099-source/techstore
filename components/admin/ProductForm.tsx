"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { useToast } from "@/components/Toast/ToastContext";

interface BrandOption {
  id: string;
  name: string;
}

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: {
    id?: string;
    name: string;
    slug: string;
    sku: string;
    brandId: string;
    categoryId: string;
    price: number;
    salePrice?: number | null;
    importPrice?: number | null;
    stock: number;
    status: string;
    isFeatured: boolean;
    shortDescription?: string | null;
    description: string;
    specifications: string;
    images: Array<{ imageUrl: string }>;
    variants: Array<{
      name: string;
      value: string;
      price?: number | null;
      stock: number;
    }>;
  };
  brands: BrandOption[];
  categories: CategoryOption[];
  isEdit?: boolean;
}

export default function ProductForm({
  initialData,
  brands,
  categories,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [brandId, setBrandId] = useState(
    initialData?.brandId || (brands[0]?.id ?? "")
  );
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId || (categories[0]?.id ?? "")
  );
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : "");
  const [salePrice, setSalePrice] = useState(
    initialData?.salePrice ? String(initialData.salePrice) : ""
  );
  const [importPrice, setImportPrice] = useState(
    initialData?.importPrice ? String(initialData.importPrice) : ""
  );
  const [stock, setStock] = useState(
    initialData?.stock !== undefined ? String(initialData.stock) : "10"
  );
  const [status, setStatus] = useState(initialData?.status || "ACTIVE");
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || ""
  );
  const [description, setDescription] = useState(initialData?.description || "");

  // Image URLs list
  const [images, setImages] = useState<string[]>(
    initialData?.images?.map((i) => i.imageUrl) || [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState("");

  // Key-value specifications
  const parseInitialSpecs = (): Array<{ key: string; value: string }> => {
    try {
      if (initialData?.specifications) {
        const obj = JSON.parse(initialData.specifications);
        return Object.entries(obj).map(([key, value]) => ({
          key,
          value: String(value),
        }));
      }
    } catch {
      // fallback
    }
    return [
      { key: "Màn hình", value: "" },
      { key: "Vi xử lý", value: "" },
      { key: "RAM", value: "" },
      { key: "Bộ nhớ", value: "" },
    ];
  };

  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(
    parseInitialSpecs()
  );

  // Variants list
  const [variants, setVariants] = useState<
    Array<{ name: string; value: string; price: string; stock: string }>
  >(
    initialData?.variants?.map((v) => ({
      name: v.name,
      value: v.value,
      price: v.price ? String(v.price) : "",
      stock: String(v.stock),
    })) || []
  );

  // Auto-generate slug from name if empty
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit && !slug) {
      const generated = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
    }
  };

  // Add Image
  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Specs handlers
  const handleAddSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const handleUpdateSpec = (index: number, field: "key" | "value", val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // Variant handlers
  const handleAddVariant = () => {
    setVariants([...variants, { name: "Phiên bản", value: "", price: "", stock: "5" }]);
  };

  const handleUpdateVariant = (
    index: number,
    field: "name" | "value" | "price" | "stock",
    val: string
  ) => {
    const updated = [...variants];
    updated[index][field] = val;
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !brandId || !categoryId || !price) {
      showToast("Vui lòng điền đầy đủ các mục bắt buộc (*).", "error");
      return;
    }

    setLoading(true);

    // Build specs JSON object
    const specsObject: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsObject[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      name,
      slug,
      sku,
      brandId,
      categoryId,
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      importPrice: importPrice ? parseFloat(importPrice) : null,
      stock: parseInt(stock, 10) || 0,
      status,
      isFeatured,
      shortDescription,
      description,
      specifications: JSON.stringify(specsObject),
      images: images.filter(Boolean),
      variants: variants
        .filter((v) => v.value.trim())
        .map((v) => ({
          name: v.name || "Phiên bản",
          value: v.value.trim(),
          price: v.price ? parseFloat(v.price) : null,
          stock: parseInt(v.stock, 10) || 0,
        })),
    };

    try {
      const endpoint = isEdit
        ? `/api/admin/products/${initialData?.id}`
        : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Lỗi khi lưu sản phẩm.", "error");
      } else {
        showToast(
          isEdit ? "✓ Đã cập nhật sản phẩm thành công!" : "✓ Đã tạo sản phẩm mới thành công!"
        );
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      showToast("Lỗi kết nối máy chủ", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      {/* Top action header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "Đang lưu..." : isEdit ? "Lưu thay đổi" : "Tạo sản phẩm"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column (Left - 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Basic Info */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Thông tin cơ bản
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ví dụ: iPhone 16 Pro Max"
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">
                    Slug URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="iphone-16-pro-max"
                    className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">
                    Mã SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="IP16PM-256"
                    className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Mô tả ngắn
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Điểm nhấn chính của sản phẩm..."
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Mô tả chi tiết sản phẩm
                </label>
                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Chi tiết tính năng, công nghệ, hiệu năng..."
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400 leading-relaxed font-sans"
                />
              </div>
            </div>
          </div>

          {/* 2. Images Gallery */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
              <span>Hình ảnh sản phẩm ({images.length})</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Dán link ảnh (HTTPS URL)..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                >
                  Thêm ảnh
                </button>
              </div>

              {/* Images preview grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 overflow-hidden group"
                  >
                    <Image
                      src={url}
                      alt={`Ảnh ${idx + 1}`}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-zinc-900/90 text-white text-[9px] font-bold">
                        Ảnh chính
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Specifications Table Builder */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                Bảng thông số kỹ thuật
              </h2>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm thông số
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Tên thông số (e.g. Màn hình)"
                    value={spec.key}
                    onChange={(e) => handleUpdateSpec(idx, "key", e.target.value)}
                    className="w-1/3 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Chi tiết (e.g. 6.3 inch OLED)"
                    value={spec.value}
                    onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-2 text-zinc-400 hover:text-red-500 rounded"
                    title="Xóa dòng"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Product Variants */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Biến thể sản phẩm (Màu sắc / Dung lượng...)
                </h2>
                <p className="text-[11px] text-zinc-500">
                  Thêm các tùy chọn để khách hàng lựa chọn khi bấm Mua
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm biến thể
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {variants.map((v, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800">
                  <input
                    type="text"
                    placeholder="Loại (e.g. Màu sắc)"
                    value={v.name}
                    onChange={(e) => handleUpdateVariant(idx, "name", e.target.value)}
                    className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  />
                  <input
                    type="text"
                    placeholder="Giá trị (e.g. Titan Đen - 256GB)"
                    value={v.value}
                    onChange={(e) => handleUpdateVariant(idx, "value", e.target.value)}
                    className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  />
                  <input
                    type="number"
                    placeholder="Giá bán riêng (VNĐ)"
                    value={v.price}
                    onChange={(e) => handleUpdateVariant(idx, "price", e.target.value)}
                    className="p-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="Kho"
                      value={v.stock}
                      onChange={(e) => handleUpdateVariant(idx, "stock", e.target.value)}
                      className="w-16 p-1.5 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-1 text-zinc-400 hover:text-red-500"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column (Right - 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Pricing & Stock Card */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Giá &amp; Tồn kho
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">
                  Giá bán hiện tại (VNĐ) *
                </label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="29990000"
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-semibold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Giá khuyến mãi / Giá cũ (VNĐ)
                </label>
                <input
                  type="number"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="34990000"
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Giá nhập (VNĐ) (Nội bộ)
                </label>
                <input
                  type="number"
                  value={importPrice}
                  onChange={(e) => setImportPrice(e.target.value)}
                  placeholder="25000000"
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Số lượng tồn kho *
                </label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="10"
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
              </div>
            </div>
          </div>

          {/* Classification & Status Card */}
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-3">
              Phân loại &amp; Hiển thị
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">
                  Thương hiệu *
                </label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Danh mục *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">
                  Trạng thái
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none"
                >
                  <option value="ACTIVE">Đang mở bán (ACTIVE)</option>
                  <option value="DRAFT">Bản nháp / Tạm ẩn (DRAFT)</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-zinc-900 focus:ring-0"
                  />
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    Đánh dấu Sản phẩm Nổi bật
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
