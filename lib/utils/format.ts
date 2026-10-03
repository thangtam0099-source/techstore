export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return "0đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function calculateDiscount(price: number, salePrice?: number | null): number {
  if (!salePrice || salePrice <= price) return 0;
  return Math.round(((salePrice - price) / salePrice) * 100);
}
