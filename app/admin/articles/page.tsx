import { prisma } from "@/lib/prisma";
import ArticlesClient from "./ArticlesClient";

export const metadata = { title: "Articles Boutique" };
export const dynamic  = "force-dynamic";

// Composer-only categories — excluded from the boutique articles list
const COMPOSER_SLUGS = ["light", "hard"];

export default async function AdminArticlesPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        category: { slug: { notIn: COMPOSER_SLUGS } },
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: {
        active: true,
        slug: { notIn: COMPOSER_SLUGS },
      },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ArticlesClient initialProducts={products as any} categories={categories} />;
}
