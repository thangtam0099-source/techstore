"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, Copy, Check, X } from "lucide-react";
import { usePurchaseModal } from "./PurchaseModalContext";
import { copyPurchaseMessage, openMessenger } from "@/lib/messenger/purchase";
import { useToast } from "@/components/Toast/ToastContext";

export default function PurchaseModal() {
  const { isOpen, message, closePurchaseModal } = usePurchaseModal();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCopied(false);
      // Disable body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closePurchaseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closePurchaseModal]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const success = await copyPurchaseMessage(message);
    if (success) {
      setCopied(true);
      showToast("✓ Đã sao chép nội dung đơn hàng");
    } else {
      showToast("Không thể sao chép tự động, vui lòng thử lại.", "error");
    }
  };

  const handleOpenMessenger = async () => {
    await openMessenger(message);
    showToast("✓ Đã sao chép nội dung và mở Messenger");
    closePurchaseModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Mua sản phẩm
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Chọn cách liên hệ với shop
            </p>
          </div>
          <button
            onClick={closePurchaseModal}
            className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm flex-1">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                Nội dung tin nhắn gửi shop:
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Đã sao chép
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép nhanh</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-mono text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
              {message}
            </pre>
          </div>

          {copied && (
            <div className="p-3 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 rounded-lg text-xs text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span>Hãy mở Messenger và gửi nội dung vừa sao chép cho shop.</span>
              <button
                type="button"
                onClick={handleOpenMessenger}
                className="font-medium text-zinc-900 dark:text-white underline hover:no-underline ml-2 whitespace-nowrap"
              >
                Mở Messenger ngay →
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={handleOpenMessenger}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Mở Messenger</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? "Đã sao chép" : "Sao chép nội dung"}</span>
          </button>

          <button
            type="button"
            onClick={closePurchaseModal}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors sm:w-auto text-center"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
