import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Vui lòng đăng nhập để gửi đánh giá sản phẩm." },
        { status: 401 }
      );
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !comment?.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập nội dung đánh giá." },
        { status: 400 }
      );
    }

    const validRating = Math.max(1, Math.min(5, parseInt(rating || 5, 10)));

    const review = await prisma.review.create({
      data: {
        productId,
        userId: user.id,
        rating: validRating,
        comment: comment.trim(),
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      review,
      message: "Gửi đánh giá thành công!",
    });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi gửi đánh giá." },
      { status: 500 }
    );
  }
}
