import React from "react";

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden animate-pulse">
      <div className="aspect-square w-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-3 sm:p-4 flex flex-col gap-2.5">
        <div className="h-3 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-4 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded" />
        <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded mt-1" />
        <div className="h-5 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded mt-2" />
        <div className="h-8 w-full bg-zinc-200 dark:bg-zinc-800 rounded mt-3" />
      </div>
    </div>
  );
}
