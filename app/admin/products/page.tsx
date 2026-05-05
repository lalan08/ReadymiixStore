import { prisma } from "@/lib/prisma";
import ProductsClient from "./ProductsClient";

export const metadata = { title: "Produits" };
export const dynamic  = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ProductsClient initialProducts={products as any} categories={categories} />;
}
