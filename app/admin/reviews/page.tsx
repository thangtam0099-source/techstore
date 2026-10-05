"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Trash2,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import { useToast } from "@/components/Toast/ToastContext";

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{ imageUrl: string }>;
  };
}

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/api/reviews";
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (ratingFilter !== "all") params.set("rating", ratingFilter);

      const qs = params.toString();
      if (qs) url += `?${qs}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      } else {
        showToast("Không thể tải danh sách đánh giá.", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi tải đánh giá.", "error");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, ratingFilter, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchReviews();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn xóa đánh giá này không? Đánh giá sai lệch hoặc vi phạm sẽ bị gỡ bỏ vĩnh viễn khỏi hệ thống."
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/reviews?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        showToast("✓ Đã xóa đánh giá thành công.");
      } else {
        showToast(data.error || "Không thể xóa đánh giá.", "error");
      }
    } catch {
      showToast("Lỗi kết nối khi xóa đánh giá.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // Stats calculation
  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : "0";
  const lowRatingCount = reviews.filter((r) => r.rating <= 2).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
            Quản lý đánh giá sản phẩm
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Kiểm duyệt và xóa những đánh giá không đúng, sai sự thật hoặc mang tính phá hoại
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchReviews()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1">
          <p className="text-xs font-medium text-zinc-500">Tổng số đánh giá</p>
          <p className="text-2xl font-black text-zinc-900 dark:text-white">
            {totalReviews}
          </p>
          <p className="text-[11px] text-zinc-400">Trên toàn bộ sản phẩm</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1">
          <p className="text-xs font-medium text-zinc-500">Điểm trung bình</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-zinc-900 dark:text-white">
              {avgRating} / 5
            </span>
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <p className="text-[11px] text-zinc-400">Mức độ hài lòng chung</p>
        </div>

        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1">
          <p className="text-xs font-medium text-zinc-500">Đánh giá tiêu cực (1-2 sao)</p>
          <p className="text-2xl font-black text-red-600 dark:text-red-400">
            {lowRatingCount}
          </p>
          <p className="text-[11px] text-zinc-400">Cần kiểm duyệt và xem xét</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo khách hàng, sản phẩm, nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="all">Tất cả số sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>
        </div>
      </div>

      {/* Reviews Table / List */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-zinc-500 animate-pulse">
            Đang tải dữ liệu đánh giá...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              Không tìm thấy đánh giá nào
            </p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Không có đánh giá phù hợp với từ khóa hoặc bộ lọc đã chọn.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {reviews.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                {/* Left: Product & User Info */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  {/* Top meta */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {item.user?.name || "Khách hàng"}
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-500">{item.user?.email}</span>
                    <span className="text-zinc-400">•</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Đã mua hàng
                    </span>
                    <span className="text-zinc-400">•</span>
                    <span className="text-zinc-400">{formatDate(item.createdAt)}</span>
                  </div>

                  {/* Product Tag */}
                  <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                    <span className="font-medium text-zinc-500">Sản phẩm:</span>
                    <Link
                      href={`/products/${item.product.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                    >
                      <span>{item.product.name}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </Link>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < item.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-zinc-200 dark:text-zinc-700"
                        }`}
                      />
                    ))}
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 ml-1">
                      {item.rating}/5 sao
                    </span>
                  </div>

                  {/* Review Content */}
                  <p className="text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed bg-zinc-50 dark:bg-zinc-950/60 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/80">
                    {item.comment}
                  </p>
                </div>

                {/* Right: Actions */}
                <div className="shrink-0 flex items-center md:flex-col gap-2 pt-2 md:pt-0">
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200/80 dark:border-red-900/40 transition-colors disabled:opacity-50"
                    title="Xóa đánh giá này khỏi hệ thống"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{deletingId === item.id ? "Đang xóa..." : "Xóa đánh giá"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
