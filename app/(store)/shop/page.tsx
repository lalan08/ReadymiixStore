import { prisma } from "@/lib/prisma";
import ShopCard from "@/components/store/ShopCard";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Boutique — ReadyMiix" };

// Categories reserved for the cocktail Composer — excluded from the boutique
const COMPOSER_SLUGS = ["light", "hard"];

interface Props {
  searchParams: { cat?: string };
}

export default async function ShopPage({ searchParams }: Props) {
  const activeCat = searchParams.cat;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        active: true,
        category: {
          slug: { notIn: COMPOSER_SLUGS },
          ...(activeCat ? { slug: activeCat } : {}),
        },
      },
      include: { category: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }).catch(() => []),
    prisma.category.findMany({
      where: {
        active: true,
        slug: { notIn: COMPOSER_SLUGS },
      },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: { where: { active: true } } } },
      },
    }).catch(() => []),
  ]);

  const totalActive = categories.reduce((s, c) => s + c._count.products, 0);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-text">
            Boutique
          </h1>
          <p className="text-brand-muted text-sm mt-1">
            {activeCat ? `${products.length} article${products.length !== 1 ? "s" : ""}` : `${totalActive} article${totalActive !== 1 ? "s" : ""} disponibles`}
          </p>
        </div>

        {/* Category tabs */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <Link
              href="/shop"
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                !activeCat
                  ? "bg-brand-gold text-brand-darker shadow-gold-sm"
                  : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/30"
              }`}
            >
              Tout voir
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?cat=${cat.slug}`}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeCat === cat.slug
                    ? "bg-brand-gold text-brand-darker shadow-gold-sm"
                    : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/30"
                }`}
              >
                {cat.name}
                <span className="text-xs opacity-60">
                  {cat._count.products}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-brand-muted" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-brand-text mb-1">
                {activeCat
                  ? "Aucun article dans cette catégorie"
                  : "La boutique arrive bientôt !"}
              </p>
              <p className="text-brand-muted text-sm">
                {activeCat
                  ? "Essayez une autre catégorie."
                  : "Revenez prochainement pour découvrir notre catalogue."}
              </p>
            </div>
            {activeCat && (
              <Link
                href="/shop"
                className="text-brand-gold text-sm font-semibold hover:underline"
              >
                Voir tous les articles
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <ShopCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
