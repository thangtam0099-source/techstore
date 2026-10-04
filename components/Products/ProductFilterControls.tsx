"use client";

import React, { useTransition, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

interface SortSelectProps {
  currentSort: string;
}

export function ProductSortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    params.delete("page"); // Reset to page 1

    startTransition(() => {
      router.push(`/products?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={currentSort}
        disabled={isPending}
        onChange={(e) => handleSortChange(e.target.value)}
        className="py-1.5 pl-3 pr-8 rounded-lg text-xs font-medium bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400 cursor-pointer disabled:opacity-60 transition-opacity"
      >
        <option value="newest">Mới nhất</option>
        <option value="price_asc">Giá: Thấp → Cao</option>
        <option value="price_desc">Giá: Cao → Thấp</option>
        <option value="sales">Bán chạy</option>
      </select>
      {isPending && (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400 absolute right-2 pointer-events-none" />
      )}
    </div>
  );
}

interface FilterSearchInputProps {
  initialQuery?: string;
}

export function ProductFilterSearchInput({ initialQuery = "" }: FilterSearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("q", value.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");

    startTransition(() => {
      router.push(`/products?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm tên, SKU..."
        className="w-full pl-8 pr-7 py-1.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-400 text-zinc-900 dark:text-zinc-100"
      />
      {isPending && (
        <Loader2 className="w-3 h-3 animate-spin text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
      )}
    </form>
  );
}
