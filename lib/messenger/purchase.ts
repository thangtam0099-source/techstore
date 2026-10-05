import { formatCurrency } from "@/lib/utils/format";

export interface SingleProductPurchaseInfo {
  id?: string;
  name: string;
  sku: string;
  price: number;
  slug: string;
}

export interface CartPurchaseItem {
  productId?: string;
  name: string;
  variant?: string | null;
  quantity: number;
  price: number;
}

export function getMessengerUrl(): string {
  if (typeof window !== "undefined" && (window as unknown as { __MESSENGER_URL__?: string }).__MESSENGER_URL__) {
    return (window as unknown as { __MESSENGER_URL__?: string }).__MESSENGER_URL__!;
  }
  return (
    process.env.NEXT_PUBLIC_MESSENGER_URL ||
    process.env.MESSENGER_URL ||
    "https://m.me/your_username"
  );
}

/**
 * Format tin nhắn khi mua 1 sản phẩm cụ thể
 */
export function generatePurchaseMessage(
  product: SingleProductPurchaseInfo,
  quantity: number = 1,
  variant?: string | null
): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const productUrl = `${origin}/products/${product.slug}`;

  let message = `Xin chào shop, mình muốn mua sản phẩm:

Sản phẩm: ${product.name}
SKU: ${product.sku}
Giá: ${formatCurrency(product.price)}
Số lượng: ${quantity}`;

  if (variant && variant.trim()) {
    message += `\nPhân loại: ${variant}`;
  }

  message += `\n\nLink sản phẩm:\n${productUrl}\n\nShop kiểm tra giúp mình sản phẩm này còn hàng không ạ?`;

  return message;
}

/**
 * Format tin nhắn khi mua nhiều sản phẩm từ giỏ hàng
 */
export function generateCartPurchaseMessage(items: CartPurchaseItem[]): string {
  if (!items || items.length === 0) return "";

  let total = 0;
  const itemsText = items
    .map((item, index) => {
      const itemSubtotal = item.price * item.quantity;
      total += itemSubtotal;
      let text = `${index + 1}. ${item.name}`;
      if (item.variant && item.variant.trim()) {
        text += `\n   Phân loại: ${item.variant}`;
      }
      text += `\n   Số lượng: ${item.quantity}`;
      text += `\n   Giá: ${formatCurrency(item.price)}`;
      return text;
    })
    .join("\n\n");

  return `Xin chào shop, mình muốn mua các sản phẩm sau:\n\n${itemsText}\n\nTổng tiền dự kiến: ${formatCurrency(
    total
  )}\n\nShop kiểm tra giúp mình các sản phẩm trên còn hàng không ạ?`;
}

/**
 * Sao chép nội dung tin nhắn vào clipboard
 */
export async function copyPurchaseMessage(message: string): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
      return true;
    }
    // Fallback cho trình duyệt cũ
    const textArea = document.createElement("textarea");
    textArea.value = message;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    textArea.remove();
    return successful;
  } catch (err) {
    console.error("Lỗi khi sao chép nội dung:", err);
    return false;
  }
}

/**
 * Mở Messenger của shop
 * Tự động copy nội dung đơn hàng vào clipboard trước để người dùng paste ngay vào Messenger
 */
export async function openMessenger(message?: string): Promise<void> {
  if (message) {
    await copyPurchaseMessage(message);
  }
  const url = getMessengerUrl();
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
