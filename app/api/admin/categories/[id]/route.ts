import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { name, slug, description } = await req.json();

    const updated = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, category: updated });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Lỗi cập nhật danh mục" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa danh mục" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Lỗi khi xóa danh mục" }, { status: 500 });
  }
}
