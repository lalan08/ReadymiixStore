import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetail from "./ProductDetail";
import ProductCard from "@/components/store/ProductCard";
import type { Metadata } from "next";

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true },
  });
  if (!product) return { title: "Produit introuvable" };
  return {
    title: product.name,
    description: product.description ?? undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, active: true },
    include: { category: true },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      active:     true,
      categoryId: product.categoryId,
      id:         { not: product.id },
    },
    include: { category: true },
    take: 4,
  });

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container-custom">
        <ProductDetail product={product} />

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-brand-text mb-8">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
