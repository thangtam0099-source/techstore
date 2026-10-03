import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const { productId, stock } = await req.json();

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { stock: Math.max(0, parseInt(stock, 10)) },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return NextResponse.json({ error: "Lỗi cập nhật tồn kho" }, { status: 500 });
  }
}
