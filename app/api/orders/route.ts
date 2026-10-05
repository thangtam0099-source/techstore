import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ hasPurchased: false, canReview: false });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (productId) {
      if (user.role === "ADMIN") {
        return NextResponse.json({ hasPurchased: true, canReview: true, isAdmin: true });
      }

      const purchase = await prisma.orderItem.findFirst({
        where: {
          productId,
          order: {
            userId: user.id,
            status: { not: "CANCELLED" },
          },
        },
      });

      return NextResponse.json({
        hasPurchased: Boolean(purchase),
        canReview: Boolean(purchase),
        isAdmin: false,
      });
    }

    // List user orders
    const orders = await prisma.order.findMany({
      where: user.role === "ADMIN" ? {} : { userId: user.id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, images: { take: 1 } },
            },
          },
        },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Lỗi tải đơn hàng" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để ghi nhận đơn hàng." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items, productId, price, quantity = 1 } = body;

    let orderItemsData: Array<{ productId: string; quantity: number; price: number }> = [];

    if (Array.isArray(items) && items.length > 0) {
      orderItemsData = items
        .filter((it: { productId?: string }) => it.productId)
        .map((it: { productId: string; quantity?: number; price?: number }) => ({
          productId: it.productId,
          quantity: it.quantity || 1,
          price: it.price || 0,
        }));
    } else if (productId) {
      orderItemsData = [
        {
          productId,
          quantity: quantity || 1,
          price: price || 0,
        },
      ];
    }

    if (orderItemsData.length === 0) {
      return NextResponse.json(
        { error: "Không có sản phẩm nào trong đơn hàng." },
        { status: 400 }
      );
    }

    const totalAmount = orderItemsData.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: "COMPLETED",
        totalAmount,
        items: {
          create: orderItemsData.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            price: it.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order,
      message: "Đã ghi nhận đơn hàng thành công!",
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Lỗi ghi nhận đơn hàng." },
      { status: 500 }
    );
  }
}
