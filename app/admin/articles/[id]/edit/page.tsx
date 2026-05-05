import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArticleEditForm from "./ArticleEditForm";

export const dynamic = "force-dynamic";

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { id: params.id }, select: { name: true } });
  return { title: product ? `Modifier : ${product.name}` : "Article introuvable" };
}

export default async function ArticleEditPage({ params }: Props) {
  const COMPOSER_SLUGS = ["light", "hard"];

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true },
    }),
    prisma.category.findMany({
      where: { active: true, slug: { notIn: COMPOSER_SLUGS } },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  if (!product) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ArticleEditForm product={product as any} categories={categories} />;
}
