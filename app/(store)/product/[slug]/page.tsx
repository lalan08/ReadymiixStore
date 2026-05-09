import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetail from "./ProductDetail";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true },
  });
  if (!product) return { title: "Produit introuvable" };
  return {
    title: `${product.name} — ReadyMiix`,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const [product, softs, related] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: params.slug, active: true },
      include: { category: true },
    }),
    prisma.soft.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }).catch(() => []),
    prisma.product.findMany({
      where: {
        active: true,
        slug: { not: params.slug },
      },
      include: { category: true },
      take: 4,
      orderBy: { featured: "desc" },
    }).catch(() => []),
  ]);

  if (!product) notFound();

  const relatedFiltered = related.filter((p) => p.categoryId === product.categoryId);

  return (
    <ProductDetail
      product={product as Parameters<typeof ProductDetail>[0]["product"]}
      softs={softs}
      related={relatedFiltered}
    />
  );
}
