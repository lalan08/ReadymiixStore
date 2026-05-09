import { prisma } from "@/lib/prisma";
import ShopCard from "@/components/store/ShopCard";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Boutique — ReadyMiix" };

const COMPOSER_SLUGS = ["light", "hard"];

// Emoji per category slug
const CAT_EMOJI: Record<string, string> = {
  cocktails:   "🍹",
  softs:       "🥤",
  kids:        "🧃",
  accessoires: "🎁",
  packs:       "📦",
  food:        "🍟",
};

interface Props { searchParams: { cat?: string; view?: string } }

export default async function ShopPage({ searchParams }: Props) {
  const { cat: activeCat, view } = searchParams;

  const [allProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        active: true,
        category: { slug: { notIn: COMPOSER_SLUGS } },
      },
      include: { category: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    }).catch(() => []),
    prisma.category.findMany({
      where: { active: true, slug: { notIn: COMPOSER_SLUGS } },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: { where: { active: true } } } } },
    }).catch(() => []),
  ]);

  // Filter products based on active tab
  let products = allProducts;
  if (activeCat) {
    products = allProducts.filter((p) => p.category.slug === activeCat);
  } else if (view === "populaires") {
    products = allProducts.filter((p) => p.featured);
  } else if (view === "nouveautes") {
    products = [...allProducts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 12);
  }

  const activeLabel =
    activeCat
      ? categories.find((c) => c.slug === activeCat)?.name ?? activeCat
      : view === "populaires" ? "Populaires"
      : view === "nouveautes" ? "Nouveautés"
      : "Tout";

  // Build tab list
  const specialTabs = [
    { key: "populaires", label: "Populaires", emoji: "🔥", href: "/shop?view=populaires" },
    { key: "nouveautes", label: "Nouveautés", emoji: "⭐", href: "/shop?view=nouveautes" },
  ];

  return (
    <div className="min-h-screen bg-brand-darker">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-brand-darker/95 backdrop-blur-xl border-b border-brand-border pt-20 md:pt-24 pb-0">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-display text-2xl font-bold text-brand-text tracking-wide">
              Boutique
            </h1>
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* ── Category tabs ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {/* Tout */}
            <Link
              href="/shop"
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                !activeCat && !view
                  ? "bg-brand-gold text-white shadow-gold-sm"
                  : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/30"
              }`}
            >
              <span>🛍️</span> Tout
            </Link>

            {/* DB categories */}
            {categories.filter((c) => c._count.products > 0).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?cat=${cat.slug}`}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  activeCat === cat.slug
                    ? "bg-brand-gold text-white shadow-gold-sm"
                    : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/30"
                }`}
              >
                <span>{CAT_EMOJI[cat.slug] ?? "🎯"}</span>
                {cat.name}
              </Link>
            ))}

            {/* Special tabs */}
            {specialTabs.map((t) => (
              <Link
                key={t.key}
                href={t.href}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  view === t.key
                    ? "bg-brand-gold text-white shadow-gold-sm"
                    : "bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/30"
                }`}
              >
                <span>{t.emoji}</span>
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="container-custom py-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-lg font-bold text-brand-text">
              {activeCat || view ? activeLabel : "Nos articles"}
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              {products.length} article{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          {(activeCat || view) && (
            <Link href="/shop" className="text-xs text-brand-gold font-semibold hover:underline">
              Voir tout →
            </Link>
          )}
        </div>

        {/* Empty */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-brand-muted/40" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-brand-text mb-1">
                {activeCat ? "Aucun article dans cette catégorie" : "Boutique bientôt disponible"}
              </p>
              <p className="text-brand-muted text-sm">
                {activeCat ? "Essaie une autre catégorie." : "Reviens prochainement !"}
              </p>
            </div>
            {activeCat && (
              <Link href="/shop" className="px-6 py-3 rounded-full bg-brand-gold text-white font-bold text-sm">
                Voir tout
              </Link>
            )}
          </div>
        ) : (
          /* ── Grid 2 cols mobile, 3 tablet, 4 desktop ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 md:gap-5">
            {products.map((product) => (
              <ShopCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
