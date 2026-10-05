import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const user = await getCurrentUser();

    if (!productId) {
      if (user?.role === "ADMIN") {
        const query = searchParams.get("q")?.toLowerCase();
        const ratingFilter = searchParams.get("rating");

        const whereClause: any = {};
        if (ratingFilter) {
          whereClause.rating = parseInt(ratingFilter, 10);
        }

        const reviews = await prisma.review.findMany({
          where: whereClause,
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
            product: { select: { id: true, name: true, slug: true, images: { take: 1 } } },
          },
          orderBy: { createdAt: "desc" },
        });

        // Optional text filter
        let filtered = reviews;
        if (query) {
          filtered = reviews.filter(
            (r) =>
              r.comment.toLowerCase().includes(query) ||
              r.user?.name.toLowerCase().includes(query) ||
              r.product?.name.toLowerCase().includes(query)
          );
        }

        return NextResponse.json({ reviews: filtered });
      }
      return NextResponse.json({ error: "Thiếu productId" }, { status: 400 });
    }
    let canReview = false;
    let hasPurchased = false;

    if (user) {
      if (user.role === "ADMIN") {
        canReview = true;
        hasPurchased = true;
      } else {
        const purchase = await prisma.orderItem.findFirst({
          where: {
            productId,
            order: {
              userId: user.id,
              status: { not: "CANCELLED" },
            },
          },
        });
        hasPurchased = Boolean(purchase);
        canReview = hasPurchased;
      }
    }

    return NextResponse.json({
      canReview,
      hasPurchased,
      isAdmin: user?.role === "ADMIN",
      isLoggedIn: Boolean(user),
    });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ error: "Lỗi kiểm tra quyền đánh giá." }, { status: 500 });
  }
}

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

    // Kiểm tra quyền: Chỉ người đã mua sản phẩm (hoặc Admin) mới được đánh giá
    if (user.role !== "ADMIN") {
      const purchase = await prisma.orderItem.findFirst({
        where: {
          productId,
          order: {
            userId: user.id,
            status: { not: "CANCELLED" },
          },
        },
      });

      if (!purchase) {
        return NextResponse.json(
          {
            error:
              "Chỉ những khách hàng đã mua sản phẩm này tại Nexus Gaming mới có thể viết đánh giá nhằm đảm bảo tính xác thực và trải nghiệm thực tế.",
          },
          { status: 403 }
        );
      }
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
        user: { select: { id: true, name: true, role: true } },
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

export async function DELETE(req: NextRequest) {
  try {
    // Chỉ quản trị viên (Admin) mới có quyền xóa đánh giá không đúng
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // empty body fallback
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "Vui lòng cung cấp mã ID của đánh giá cần xóa." },
        { status: 400 }
      );
    }

    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: "Đánh giá không tồn tại hoặc đã bị xóa trước đó." },
        { status: 404 }
      );
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Đã xóa đánh giá thành công.",
    });
  } catch (error) {
    console.error("Review deletion error:", error);
    return NextResponse.json(
      { error: "Không có quyền thực hiện hoặc đã xảy ra lỗi khi xóa đánh giá." },
      { status: 403 }
    );
  }
}
