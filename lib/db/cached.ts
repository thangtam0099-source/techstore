import { cache } from "react";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/db/prisma";

// Cached Categories (Revalidated every 1 hour or on revalidation tag)
export const getCachedCategories = unstable_cache(
  async () => {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  },
  ["all-categories-cache"],
  { revalidate: 3600, tags: ["categories"] }
);

// Cached Brands (Revalidated every 1 hour or on revalidation tag)
export const getCachedBrands = unstable_cache(
  async () => {
    return prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
  },
  ["all-brands-cache"],
  { revalidate: 3600, tags: ["brands"] }
);

// Per-request deduplicated product query (solves double query in generateMetadata & Page)
export const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { price: "asc" } },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
});

// Get active product slugs for static generation
export async function getTopProductSlugs() {
  const products = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true },
    take: 50,
  });
  return products.map((p) => ({ slug: p.slug }));
}
