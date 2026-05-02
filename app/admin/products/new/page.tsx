import { prisma } from "@/lib/prisma";
import ProductForm from "../ProductForm";

export const metadata = { title: "Nouveau produit" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-brand-text mb-6">
        Nouveau produit
      </h1>
      <ProductForm categories={categories} />
    </div>
  );
}
