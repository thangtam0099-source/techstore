import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
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

    if (!name || !sku || !resolvedBrandId || !categoryId || !price) {
      return NextResponse.json(
        { error: "Vui lòng điền đầy đủ các thông tin bắt buộc (Tên, SKU, Thương hiệu, Danh mục, Giá)." },
        { status: 400 }
      );
    }

    let cleanSlug =
      slug?.trim() ||
      name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") || `sp-${Date.now()}`;

    const existingSlug = await prisma.product.findUnique({ where: { slug: cleanSlug } });
    if (existingSlug) {
      cleanSlug = `${cleanSlug}-${Date.now().toString().slice(-4)}`;
    }

    const existingSku = await prisma.product.findUnique({ where: { sku: sku.trim() } });
    if (existingSku) {
      return NextResponse.json(
        { error: "Mã SKU này đã tồn tại trong hệ thống." },
        { status: 400 }
      );
    }

    const createdProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        sku: sku.trim(),
        brandId: resolvedBrandId,
        categoryId,
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        importPrice: importPrice ? parseFloat(importPrice) : null,
        stock: parseInt(stock, 10) || 0,
        status: status || "ACTIVE",
        isFeatured: Boolean(isFeatured),
        shortDescription: shortDescription?.trim() || null,
        description: description?.trim() || "",
        specifications:
          typeof specifications === "string" ? specifications : JSON.stringify(specifications || {}),
      },
    });

    // Create Images
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imgUrl = typeof images[i] === "string" ? images[i] : images[i].imageUrl;
        if (imgUrl && imgUrl.trim()) {
          await prisma.productImage.create({
            data: {
              productId: createdProduct.id,
              imageUrl: imgUrl.trim(),
              sortOrder: i,
            },
          });
        }
      }
    }

    // Create Variants
    if (Array.isArray(variants) && variants.length > 0) {
      for (const v of variants) {
        if (v.value && v.value.trim()) {
          await prisma.productVariant.create({
            data: {
              productId: createdProduct.id,
              name: v.name || "Phiên bản",
              value: v.value.trim(),
              price: v.price ? parseFloat(v.price) : null,
              stock: parseInt(v.stock, 10) || 0,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, product: createdProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Lỗi hệ thống khi tạo sản phẩm." }, { status: 500 });
  }
}
