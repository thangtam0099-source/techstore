import React from "react";

export default function RootLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="h-64 sm:h-80 w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />

      {/* Categories Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-zinc-100 dark:bg-zinc-800/50"
            />
          ))}
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="h-6 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 space-y-3"
            >
              <div className="aspect-square w-full rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
              <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800/40" />
              <div className="h-5 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
