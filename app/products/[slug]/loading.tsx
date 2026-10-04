import React from "react";

export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-64 rounded bg-zinc-200 dark:bg-zinc-800" />

      {/* Main Grid: Left Gallery, Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Gallery Skeleton */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800/70" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800/50"
              />
            ))}
          </div>
        </div>

        {/* Right Info Skeleton */}
        <div className="lg:col-span-6 space-y-5">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-8 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-40 rounded bg-zinc-100 dark:bg-zinc-800/40" />
          </div>

          <div className="h-10 w-44 rounded-lg bg-zinc-200 dark:bg-zinc-800" />

          {/* Variants Skeleton */}
          <div className="space-y-3 pt-3">
            <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex gap-2">
              <div className="h-9 w-24 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-9 w-24 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
              <div className="h-9 w-24 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="pt-6 space-y-3">
            <div className="h-12 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-11 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
