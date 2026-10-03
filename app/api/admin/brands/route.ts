import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const brands = await prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ brands });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { name, slug } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: "Tên thương hiệu không được để trống" }, { status: 400 });
    }

    const cleanSlug =
      slug?.trim() ||
      name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const brand = await prisma.brand.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
      },
    });

    return NextResponse.json({ success: true, brand });
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json({ error: "Lỗi tạo thương hiệu" }, { status: 500 });
  }
}
