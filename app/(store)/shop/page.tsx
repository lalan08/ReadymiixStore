import { prisma } from "@/lib/prisma";
import ShopClient from "./ShopClient";
import { Suspense } from "react";

export const revalidate = 60;
export const metadata = { title: "Boutique — ReadyMiix" };

const COMPOSER_SLUGS = ["light", "hard"];

export default async function ShopPage() {
  const [allProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        active: true,
        category: { slug: { notIn: COMPOSER_SLUGS } },
      },
      include: { category: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }).catch(() => []),
    prisma.category.findMany({
      where: { active: true, slug: { notIn: COMPOSER_SLUGS } },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: { where: { active: true } } } } },
    }).catch(() => []),
  ]);

  return (
    <Suspense>
      <ShopClient allProducts={allProducts} categories={categories} />
    </Suspense>
  );
}
