"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import ShopCard from "@/components/store/ShopCard";

interface TabCategory {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  stock: number;
  featured: boolean;
  active: boolean;
  volume: string | null;
  alcohol: string | null;
  tags: string;
  productType: string;
  hasSoftChoice: boolean;
  createdAt: string | Date;
}

interface Props {
  allProducts: Product[];
  categories: TabCategory[];
}

const ACTIVE_STYLE = {
  background: "linear-gradient(135deg, #C5006A, #F72585)",
  boxShadow: "0 0 16px rgba(247,37,133,0.45)",
};

export default function ShopClient({ allProducts, categories }: Props) {
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat") ?? undefined;
  const view = searchParams.get("view") ?? undefined;

  const products = useMemo(() => {
    if (activeCat) return allProducts.filter((p) => p.category.slug === activeCat);
    if (view === "populaires") return allProducts.filter((p) => p.featured);
    if (view === "nouveautes")
      return [...allProducts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 12);
    return allProducts;
  }, [allProducts, activeCat, view]);

  const activeLabel =
    activeCat
      ? (categories.find((c) => c.slug === activeCat)?.name ?? activeCat)
      : view === "populaires" ? "Populaires"
      : view === "nouveautes" ? "Nouveautés"
      : "Tout";

  return (
    <div className="min-h-screen bg-brand-darker">
      {/* ── Header ── */}
      <div className="sticky top-0 z-30 bg-brand-darker/95 backdrop-blur-2xl border-b border-white/[0.06] pt-20 md:pt-24 pb-0">
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
            <Link
              href="/shop"
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                !activeCat && !view
                  ? "text-white"
                  : "bg-white/[0.05] border border-white/[0.08] text-brand-muted hover:text-brand-text hover:border-brand-gold/30"
              }`}
              style={!activeCat && !view ? ACTIVE_STYLE : {}}
            >
              Tout
            </Link>

            {categories.filter((c) => c._count.products > 0).map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?cat=${cat.slug}`}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeCat === cat.slug
                    ? "text-white"
                    : "bg-white/[0.05] border border-white/[0.08] text-brand-muted hover:text-brand-text hover:border-brand-gold/30"
                }`}
                style={activeCat === cat.slug ? ACTIVE_STYLE : {}}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="container-custom py-6">
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
