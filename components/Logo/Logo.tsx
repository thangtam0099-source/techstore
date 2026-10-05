import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, SITE_LOGO_URL } from "@/lib/constants";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  href?: string | null;
  textClassName?: string;
  className?: string;
}

export default function Logo({
  size = "md",
  showText = true,
  href = "/",
  textClassName = "",
  className = "",
}: LogoProps) {
  const sizeMap = {
    sm: { container: "w-7 h-7", px: 28, text: "text-sm" },
    md: { container: "w-8 h-8", px: 32, text: "text-base font-bold" },
    lg: { container: "w-11 h-11", px: 44, text: "text-xl font-extrabold" },
  };

  const { container, px, text } = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`relative ${container} rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700/80 bg-zinc-900 shadow-sm shrink-0`}
      >
        <Image
          src={SITE_LOGO_URL}
          alt={`${SITE_NAME} Logo`}
          fill
          sizes={`${px}px`}
          priority
          className="object-cover"
        />
      </div>
      {showText && (
        <span
          className={`tracking-tight text-zinc-900 dark:text-white font-bold leading-none ${text} ${textClassName}`}
        >
          {SITE_NAME}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
