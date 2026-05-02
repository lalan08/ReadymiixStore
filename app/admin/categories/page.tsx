import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Tag, Plus, Edit } from "lucide-react";

export const metadata = { title: "Catégories" };
export const dynamic  = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-3xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-text">
            Catégories
          </h1>
          <p className="text-brand-muted text-sm mt-0.5">
            {categories.length} catégorie{categories.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-5 py-2.5 rounded-xl text-sm shadow-gold-sm"
        >
          <Plus className="w-4 h-4" />
          Nouvelle catégorie
        </Link>
      </div>

      <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden">
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Tag className="w-12 h-12 text-brand-muted" />
            <p className="text-brand-muted text-sm">Aucune catégorie</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                  Nom
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-brand-muted uppercase tracking-wide hidden md:table-cell">
                  Slug
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-brand-muted uppercase tracking-wide">
                  Produits
                </th>
                <th className="text-right px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-brand-text">{cat.name}</p>
                    {cat.description && (
                      <p className="text-xs text-brand-muted line-clamp-1 mt-0.5">
                        {cat.description}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-xs font-mono text-brand-muted bg-brand-border px-2 py-0.5 rounded">
                      /{cat.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-brand-gold font-bold">{cat._count.products}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/categories/${cat.id}/edit`}
                      className="inline-flex items-center gap-1.5 p-2 rounded-lg text-brand-muted hover:text-brand-gold hover:bg-brand-gold/5 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
