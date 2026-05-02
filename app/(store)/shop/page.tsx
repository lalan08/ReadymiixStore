import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import Link from "next/link";
import { Filter, Search } from "lucide-react";

interface ShopPageProps {
  searchParams: { category?: string; q?: string; sort?: string };
}

export const metadata = { title: "Boutique" };

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, q, sort } = searchParams;

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
      ? { price: "desc" as const }
      : sort === "newest"
      ? { createdAt: "desc" as const }
      : { featured: "desc" as const };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        active: true,
        ...(category && { category: { slug: category } }),
        ...(q && {
          OR: [
            { name: { contains: q } },
            { description: { contains: q } },
          ],
        }),
      },
      include: { category: true },
      orderBy,
    }),
    prisma.category.findMany({
      where:   { active: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: { where: { active: true } } } } },
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-2 block">
            {activeCategory ? activeCategory.name : "Toute la gamme"}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-text mb-3">
            {activeCategory ? activeCategory.name : "Nos cocktails ReadyMiix"}
          </h1>
          {activeCategory?.description && (
            <p className="text-brand-muted max-w-xl">{activeCategory.description}</p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0 flex flex-col gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <form method="GET">
                {category && <input type="hidden" name="category" value={category} />}
                {sort && <input type="hidden" name="sort" value={sort} />}
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Rechercher..."
                  className="input-base pl-10"
                />
              </form>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-brand-text mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-gold" />
                Catégories
              </h3>
              <ul className="flex flex-col gap-1">
                <li>
                  <Link
                    href="/shop"
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                      !category
                        ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/30"
                        : "text-brand-muted hover:text-brand-text hover:bg-white/5"
                    }`}
                  >
                    <span>Tout voir</span>
                    <span className="text-xs opacity-60">{products.length}</span>
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                        category === cat.slug
                          ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/30"
                          : "text-brand-muted hover:text-brand-text hover:bg-white/5"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs opacity-60">{cat._count.products}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-sm font-semibold text-brand-text mb-3">Trier par</h3>
              <ul className="flex flex-col gap-1">
                {[
                  { value: "",           label: "Recommandés" },
                  { value: "newest",     label: "Nouveautés" },
                  { value: "price_asc",  label: "Prix croissant" },
                  { value: "price_desc", label: "Prix décroissant" },
                ].map((option) => (
                  <li key={option.value}>
                    <Link
                      href={`/shop?${category ? `category=${category}&` : ""}${q ? `q=${q}&` : ""}sort=${option.value}`}
                      className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                        (sort ?? "") === option.value
                          ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/30"
                          : "text-brand-muted hover:text-brand-text hover:bg-white/5"
                      }`}
                    >
                      {option.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
                  <Search className="w-8 h-8 text-brand-muted" />
                </div>
                <p className="font-display text-xl font-bold text-brand-text">Aucun produit trouvé</p>
                <p className="text-brand-muted text-sm">Essayez de modifier vos filtres</p>
                <Link
                  href="/shop"
                  className="text-brand-gold text-sm font-medium hover:underline"
                >
                  Voir tous les produits
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-brand-muted mb-5">
                  {products.length} produit{products.length > 1 ? "s" : ""}
                  {q && ` pour "${q}"`}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
