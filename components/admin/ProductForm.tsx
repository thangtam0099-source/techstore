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
  UploadCloud,
  Loader2,
  Star,
} from "lucide-react";
import { useToast } from "@/components/Toast/ToastContext";
import { compressImage } from "@/lib/utils/image";

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
  const [brandName, setBrandName] = useState(() => {
    if (initialData?.brandId) {
      const found = brands.find((b) => b.id === initialData.brandId);
      if (found) return found.name;
    }
    return brands[0]?.name || "";
  });
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

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generatedSlug);
  };

  // Specifications
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(() => {
    if (initialData?.specifications) {
      try {
        const parsed = JSON.parse(initialData.specifications);
        if (typeof parsed === "object" && parsed !== null) {
          return Object.entries(parsed).map(([key, value]) => ({
            key,
            value: String(value),
          }));
        }
      } catch (_) {}
    }
    return [
      { key: "Thương hiệu", value: "" },
      { key: "Bảo hành", value: "12 tháng" },
    ];
  });

  // Variants
  const [variants, setVariants] = useState<
    Array<{ name: string; value: string; price: string; stock: string }>
  >(() => {
    if (initialData?.variants && initialData.variants.length > 0) {
      return initialData.variants.map((v) => ({
        name: v.name,
        value: v.value,
        price: v.price ? String(v.price) : "",
        stock: String(v.stock),
      }));
    }
    return [];
  });

  // Images list
  const [images, setImages] = useState<string[]>(
    initialData?.images?.map((i) => i.imageUrl) || []
  );
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Upload and compress local files
  const handleUploadFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) {
      showToast("Vui lòng chọn file hình ảnh (JPG, PNG, WEBP).", "error");
      return;
    }

    setUploadingImages(true);
    try {
      // 1. Tự động nén ảnh sang định dạng WebP trực tiếp trên trình duyệt
      const compressedImages: string[] = [];
      for (const file of files) {
        const compressedBase64 = await compressImage(file, 1200, 1200, 0.85);
        compressedImages.push(compressedBase64);
      }

      // 2. Gửi lên API upload
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: compressedImages }),
      });

      const data = await res.json();
      if (res.ok && data.urls) {
        setImages((prev) => [...prev, ...data.urls]);
        showToast(`✓ Đã thêm ${data.urls.length} ảnh trực tiếp từ máy tính!`);
      } else {
        // Fallback: nếu API có vấn đề, lưu trực tiếp base64 đã nén siêu nhẹ
        setImages((prev) => [...prev, ...compressedImages]);
        showToast(`✓ Đã thêm ${compressedImages.length} ảnh từ máy tính!`);
      }
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi xử lý ảnh tải lên.", "error");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFiles(e.target.files);
      e.target.value = ""; // reset input
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
    showToast("✓ Đã chọn làm ảnh đại diện chính của sản phẩm!");
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
    const effectiveBrandName = brandName.trim();
    if (!name.trim() || !sku.trim() || !effectiveBrandName || !categoryId || !price) {
      showToast("Vui lòng điền đầy đủ các mục bắt buộc (*).", "error");
      return;
    }

    setLoading(true);

    // Auto-generate clean slug from name if needed
    const finalSlug = (slug || name)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") || `sp-${Date.now()}`;

    // Build specs JSON object
    const specsObject: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specsObject[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      name: name.trim(),
      slug: finalSlug,
      sku: sku.trim(),
      brandId,
      brandName: effectiveBrandName,
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

              <div>
                <label className="font-semibold block mb-1">
                  Mã SKU *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Ví dụ: IP16PM-256"
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
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
              <span className="text-[11px] text-zinc-500 font-normal">
                Ảnh đầu tiên là ảnh đại diện chính
              </span>
            </h2>

            <div className="space-y-4 text-xs">
              {/* Direct File Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                    : "border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-950/50 hover:border-zinc-400 dark:hover:border-zinc-600"
                }`}
              >
                <input
                  id="direct-image-upload"
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploadingImages}
                />

                <label
                  htmlFor="direct-image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-700 dark:text-zinc-200">
                    {uploadingImages ? (
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    ) : (
                      <UploadCloud className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
                      {uploadingImages
                        ? "Đang xử lý và tối ưu ảnh..."
                        : "Bấm để chọn ảnh từ máy tính"}
                    </p>
                    <p className="text-zinc-500 text-[11px] mt-0.5">
                      Hoặc kéo thả nhiều file ảnh trực tiếp vào đây
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-medium shadow-sm hover:opacity-90 transition-opacity mt-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Chọn ảnh từ thiết bị</span>
                  </span>
                </label>
              </div>

              {/* Images preview grid */}
              {images.length > 0 ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500">
                    <span>Danh sách ảnh đã tải lên:</span>
                    <span>Bấm &quot;Đặt làm ảnh chính&quot; để đổi ảnh bìa</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((url, idx) => {
                      const isPrimary = idx === 0;

                      return (
                        <div
                          key={idx}
                          className={`relative aspect-square rounded-lg border overflow-hidden group transition-all ${
                            isPrimary
                              ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm"
                              : "border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950"
                          }`}
                        >
                          <Image
                            src={url}
                            alt={`Ảnh ${idx + 1}`}
                            fill
                            sizes="180px"
                            unoptimized={url.startsWith("data:")}
                            className="object-cover"
                          />

                          {/* Primary Badge */}
                          {isPrimary ? (
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold shadow-sm flex items-center gap-1">
                              <Star className="w-3 h-3 fill-white" />
                              Ảnh chính
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(idx)}
                              className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-black/60 hover:bg-black/90 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Đặt làm ảnh đại diện chính"
                            >
                              Đặt làm ảnh chính
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            title="Xóa ảnh này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-3 text-center text-zinc-400 text-xs italic">
                  Chưa có ảnh nào. Vui lòng tải lên ít nhất 1 ảnh cho sản phẩm.
                </div>
              )}
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
                <input
                  type="text"
                  required
                  list="brands-datalist"
                  value={brandName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBrandName(val);
                    const found = brands.find(
                      (b) => b.name.toLowerCase() === val.trim().toLowerCase()
                    );
                    if (found) setBrandId(found.id);
                  }}
                  placeholder="Nhập thương hiệu (e.g. Apple, ASUS, Xiaomi...)"
                  className="w-full p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                />
                <datalist id="brands-datalist">
                  {brands.map((b) => (
                    <option key={b.id} value={b.name} />
                  ))}
                </datalist>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Gõ tên thương hiệu từ bàn phím hoặc chọn từ danh sách gợi ý.
                </p>
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
