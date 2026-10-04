import React from "react";

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="space-y-2">
          <div className="h-7 w-56 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-36 rounded bg-zinc-100 dark:bg-zinc-800/50" />
        </div>
        <div className="h-8 w-36 rounded-lg bg-zinc-100 dark:bg-zinc-800" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filter Skeleton */}
        <aside className="space-y-6">
          <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-5">
            <div className="h-4 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-8 w-full rounded-lg bg-zinc-100 dark:bg-zinc-800/60" />
            <div className="space-y-2 pt-2">
              <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-6 w-full rounded bg-zinc-100 dark:bg-zinc-800/40" />
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Skeleton */}
        <main className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3 space-y-3 bg-white dark:bg-zinc-900"
              >
                <div className="aspect-square w-full rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
                <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-1/2 rounded bg-zinc-100 dark:bg-zinc-800/40" />
                <div className="h-5 w-2/5 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-8 w-full rounded-md bg-zinc-100 dark:bg-zinc-800/60 pt-2" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
