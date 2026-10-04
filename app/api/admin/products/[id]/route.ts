import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: true,
        brand: true,
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Không tìm thấy sản phẩm" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await req.json();

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Error updating product status:", error);
    return NextResponse.json({ error: "Lỗi cập nhật sản phẩm" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Đã xóa sản phẩm thành công" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Lỗi khi xóa sản phẩm" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();
    const body = await req.json();

    const {
      name,
      slug,
      sku,
      brandId,
      brandName,
      categoryId,
      price,
      salePrice,
      importPrice,
      stock,
      status,
      isFeatured,
      shortDescription,
      description,
      specifications,
      images,
      variants,
    } = body;

    let resolvedBrandId = brandId;
    if (brandName && typeof brandName === "string" && brandName.trim()) {
      const trimmedBrand = brandName.trim();
      const allBrands = await prisma.brand.findMany();
      const matched = allBrands.find(
        (b) => b.name.toLowerCase() === trimmedBrand.toLowerCase()
      );
      if (matched) {
        resolvedBrandId = matched.id;
      } else {
        const brandSlug =
          trimmedBrand
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "") || `brand-${Date.now()}`;

        const existingSlug = allBrands.find((b) => b.slug === brandSlug);
        const finalBrandSlug = existingSlug ? `${brandSlug}-${Date.now().toString().slice(-4)}` : brandSlug;

        const newBrand = await prisma.brand.create({
          data: {
            name: trimmedBrand,
            slug: finalBrandSlug,
          },
        });
        resolvedBrandId = newBrand.id;
      }
    }

    let cleanSlug = slug?.trim();
    if (!cleanSlug && name) {
      cleanSlug = name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }
    if (cleanSlug) {
      const existingSlug = await prisma.product.findFirst({
        where: { slug: cleanSlug, NOT: { id: params.id } },
      });
      if (existingSlug) {
        cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
      }
    }

    // Update main product
    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        slug: cleanSlug,
        sku,
        brandId: resolvedBrandId,
        categoryId,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        importPrice: importPrice ? parseFloat(importPrice) : null,
        stock: parseInt(stock, 10) || 0,
        status: status || "ACTIVE",
        isFeatured: Boolean(isFeatured),
        shortDescription,
        description,
        specifications: typeof specifications === "string" ? specifications : JSON.stringify(specifications),
      },
    });

    // Update images if provided
    if (Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: params.id } });
      for (let i = 0; i < images.length; i++) {
        const imgUrl = typeof images[i] === "string" ? images[i] : images[i].imageUrl;
        if (imgUrl && imgUrl.trim()) {
          await prisma.productImage.create({
            data: {
              productId: params.id,
              imageUrl: imgUrl.trim(),
              sortOrder: i,
            },
          });
        }
      }
    }

    // Update variants if provided
    if (Array.isArray(variants)) {
      await prisma.productVariant.deleteMany({ where: { productId: params.id } });
      for (const v of variants) {
        if (v.value && v.value.trim()) {
          await prisma.productVariant.create({
            data: {
              productId: params.id,
              name: v.name || "Phiên bản",
              value: v.value.trim(),
              price: v.price ? parseFloat(v.price) : null,
              stock: parseInt(v.stock, 10) || 0,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error("Error editing product:", error);
    return NextResponse.json({ error: "Lỗi cập nhật sản phẩm" }, { status: 500 });
  }
}
