import React from "react";

export default function CartLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 space-y-2">
        <div className="h-7 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-60 rounded bg-zinc-100 dark:bg-zinc-800/50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-4 items-center"
            >
              <div className="w-20 h-20 rounded-lg bg-zinc-100 dark:bg-zinc-800/70 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-1/3 rounded bg-zinc-100 dark:bg-zinc-800/50" />
                <div className="h-4 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
            <div className="h-5 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800/50" />
            <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800/50" />
            <div className="h-11 w-full rounded-xl bg-zinc-200 dark:bg-zinc-800 pt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
