import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "../../ProductForm";

export const metadata = { title: "Modifier le produit" };

interface Props { params: { id: string } }

export default async function EditProductPage({ params }: Props) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: params.id } }),
    prisma.category.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-brand-text mb-6">
        Modifier : {product.name}
      </h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
