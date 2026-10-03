import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const { name, slug } = await req.json();

    const updated = await prisma.brand.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        slug: slug.trim(),
      },
    });

    return NextResponse.json({ success: true, brand: updated });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ error: "Lỗi cập nhật thương hiệu" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    await prisma.brand.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa thương hiệu" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ error: "Lỗi khi xóa thương hiệu" }, { status: 500 });
  }
}
