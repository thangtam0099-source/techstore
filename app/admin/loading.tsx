import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-64 rounded bg-zinc-100 dark:bg-zinc-800/50" />
        </div>
        <div className="h-9 w-28 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3"
          >
            <div className="h-4 w-24 rounded bg-zinc-100 dark:bg-zinc-800/60" />
            <div className="h-8 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        ))}
      </div>

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <div className="h-5 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 w-full rounded-lg bg-zinc-100 dark:bg-zinc-800/40" />
          ))}
        </div>
      </div>
    </div>
  );
}
