import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export const metadata = { title: "Cocktails Composer" };
export const dynamic  = "force-dynamic";

// Only the categories used by the cocktail Composer
const COMPOSER_SLUGS = ["light", "hard", "packs"];

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { category: { slug: { in: COMPOSER_SLUGS } } },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { active: true, slug: { in: COMPOSER_SLUGS } },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ProductsClient initialProducts={products as any} categories={categories} />;
}
