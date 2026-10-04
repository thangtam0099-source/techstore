"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  // Complete progress on route change
  useEffect(() => {
    if (visible) {
      setProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  // Intercept click on internal links to give 0ms instant visual feedback
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Only trigger for same-window internal navigation
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("//") &&
        !href.startsWith("#") &&
        (!targetAttr || targetAttr === "_self")
      ) {
        // If clicking the current path without query change, do nothing
        const currentUrl = window.location.pathname + window.location.search;
        if (href === currentUrl) return;

        // Start progress immediately
        setVisible(true);
        setProgress(25);

        // Advance to 65% quickly
        setTimeout(() => {
          setProgress((prev) => (prev < 65 && prev > 0 ? 65 : prev));
        }, 150);

        // Advance to 85% if still waiting
        setTimeout(() => {
          setProgress((prev) => (prev < 85 && prev > 0 ? 85 : prev));
        }, 400);
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] pointer-events-none bg-transparent"
      role="progressbar"
      aria-hidden="true"
    >
      <div
        className="h-full bg-zinc-900 dark:bg-white shadow-[0_0_8px_rgba(0,0,0,0.4)] dark:shadow-[0_0_8px_rgba(255,255,255,0.6)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  );
}
