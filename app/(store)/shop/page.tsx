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
      <div className="sticky top-0 z-30 bg-brand-darker/95 backdrop-blur-2xl border-b border-white/[0.06] pt-20 md:pt-24 pb-0">
        {/* Subtle top accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent" />

        <div className="container-custom">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.25em] mb-0.5">
                ReadyMiix
              </p>
              <h1 className="font-display text-2xl text-brand-text tracking-wide">
                Boutique
              </h1>
            </div>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/[0.08] text-brand-muted hover:text-brand-text hover:border-brand-gold/30 transition-all duration-200 cursor-pointer"
              aria-label="Rechercher"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* ── Category tabs ── */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {/* Tout */}
            <Link
              href="/shop"
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                !activeCat && !view
                  ? "text-white"
                  : "bg-white/[0.05] border border-white/[0.08] text-brand-muted hover:text-brand-text hover:border-brand-gold/30"
              }`}
              style={!activeCat && !view ? {
                background: "linear-gradient(135deg, #C5006A, #F72585)",
                boxShadow: "0 0 16px rgba(247,37,133,0.45)",
              } : {}}
            >
              Tout
            </Link>

            {/* DB categories */}
            {categories.filter((c) => c._count.products > 0).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?cat=${cat.slug}`}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeCat === cat.slug
                    ? "text-white"
                    : "bg-white/[0.05] border border-white/[0.08] text-brand-muted hover:text-brand-text hover:border-brand-gold/30"
                }`}
                style={activeCat === cat.slug ? {
                  background: "linear-gradient(135deg, #C5006A, #F72585)",
                  boxShadow: "0 0 16px rgba(247,37,133,0.45)",
                } : {}}
              >
                {cat.name}
              </Link>
            ))}

            {/* Special tabs */}
            {specialTabs.map((t) => (
              <Link
                key={t.key}
                href={t.href}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  view === t.key
                    ? "text-white"
                    : "bg-white/[0.05] border border-white/[0.08] text-brand-muted hover:text-brand-text hover:border-brand-gold/30"
                }`}
                style={view === t.key ? {
                  background: "linear-gradient(135deg, #C5006A, #F72585)",
                  boxShadow: "0 0 16px rgba(247,37,133,0.45)",
                } : {}}
              >
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
            <h2 className="font-display text-lg text-brand-text tracking-wide">
              {activeCat || view ? activeLabel : "Nos articles"}
            </h2>
            <p className="text-xs text-brand-muted/70 mt-0.5">
              {products.length} article{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          {(activeCat || view) && (
            <Link
              href="/shop"
              className="text-xs text-brand-gold font-bold hover:text-brand-gold-light transition-colors duration-200 cursor-pointer"
            >
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
