import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, Truck, Award, Leaf, Star, ChevronRight, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where:   { featured: true, active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    });
  } catch {
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where:   { active: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
  } catch {
    return [];
  }
}

const features = [
  { icon: Truck,    title: "Livraison Guyane",   desc: "Livraison rapide dans toute la Guyane française" },
  { icon: Award,    title: "Bien frais",          desc: "Servi frais, prêt à mixer et savourer immédiatement" },
  { icon: Leaf,     title: "100% Naturel",        desc: "Sans colorants artificiels, sans conservateurs" },
  { icon: ShoppingBag, title: "Packs disponibles", desc: "En boutique et chez nos points de vente partenaires" },
];

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-dots opacity-40" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-teal/5 rounded-full blur-3xl" />

        <div className="container-custom relative z-10 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div className="flex flex-col items-start gap-6 animate-fade-in">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full glass border-glow-gold">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span className="text-xs font-semibold text-brand-gold uppercase tracking-wider">
                  Cocktails · Guyane 973
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] text-balance">
                Bien frais,{" "}
                <span className="text-gold-gradient">toujours prêt !</span>
              </h1>

              <p className="text-lg text-brand-muted max-w-lg leading-relaxed">
                Prêt à mixer, prêt à savourer. Les cocktails ReadyMiix sont faits
                en Guyane, pour la Guyane — avec des ingrédients frais et des
                saveurs tropicales authentiques.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-8 py-4 rounded-xl shadow-gold hover:shadow-gold transition-all active:scale-[0.98] text-base"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Explorer la boutique
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 border border-brand-border text-brand-text hover:border-brand-gold/40 hover:text-brand-gold font-semibold px-8 py-4 rounded-xl transition-all text-base"
                >
                  Notre histoire
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-brand-darker bg-gradient-brand"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                    ))}
                  </div>
                  <p className="text-xs text-brand-muted">
                    +200 clients satisfaits · Guyane 973
                  </p>
                </div>
              </div>
            </div>

            {/* Right: product image showcase */}
            <div className="relative hidden lg:flex justify-center items-center">
              <div className="relative w-96 h-96">
                {/* Glow rings */}
                <div className="absolute inset-8 rounded-full border border-brand-gold/10 animate-spin-slow" />
                <div className="absolute inset-16 rounded-full border border-brand-purple/10 animate-[spin_12s_linear_infinite_reverse]" />

                {/* Main image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-72 h-72 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(232,168,56,0.2)] animate-float">
                    <Image
                      src="https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80"
                      alt="ReadyMiix Cocktail"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/40 to-transparent" />
                  </div>
                </div>

                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 glass border-glow-gold rounded-2xl px-4 py-3 animate-[float_5s_ease-in-out_infinite]">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-brand-gold text-brand-gold" />
                    <span className="text-xs font-semibold text-brand-text">Best-seller</span>
                  </div>
                  <p className="text-[10px] text-brand-muted mt-0.5">Passion Punch</p>
                </div>

                <div className="absolute -bottom-4 -left-4 glass border-glow-purple rounded-2xl px-4 py-3 animate-[float_7s_ease-in-out_infinite_1s]">
                  <p className="text-xs font-bold text-brand-gold">À partir de 4,50€</p>
                  <p className="text-[10px] text-brand-muted">Livraison en Guyane</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-brand-gold/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold/50" />
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section className="bg-brand-card border-y border-brand-border py-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feat) => (
              <div key={feat.title} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shrink-0">
                  <feat.icon className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-text">{feat.title}</p>
                  <p className="text-xs text-brand-muted leading-snug">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {featuredProducts.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-2 block">
                  Nos créations
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-text">
                  Produits vedettes
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:flex items-center gap-2 text-brand-muted hover:text-brand-gold text-sm font-medium transition-colors group"
              >
                Voir tout
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="flex justify-center mt-8 md:hidden">
              <Link
                href="/shop"
                className="flex items-center gap-2 border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/40 text-sm font-medium px-6 py-2.5 rounded-xl transition-all"
              >
                Voir tous les cocktails
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORIES ── */}
      {categories.length > 0 && (
        <section className="section-padding bg-brand-card/50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-2 block">
                Collections
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-text">
                Explorez nos gammes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[16/9] md:aspect-square border border-brand-border"
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-brand opacity-30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-xl font-bold text-brand-text mb-1">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-xs text-brand-muted line-clamp-2">{cat.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-xs text-brand-gold font-semibold">
                        {cat._count.products} produits
                      </span>
                      <ChevronRight className="w-4 h-4 text-brand-gold transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── BRAND STORY ── */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80"
                  alt="ReadyMiix – Notre histoire"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/60 to-transparent" />
              </div>
              {/* Floating stat */}
              <div className="absolute -bottom-5 -right-5 glass border-glow-gold rounded-2xl p-5 hidden md:block">
                <p className="text-3xl font-display font-bold text-brand-gold">100%</p>
                <p className="text-xs text-brand-muted mt-1">Naturel & Artisanal</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <span className="text-xs font-semibold text-brand-gold uppercase tracking-widest">
                Notre histoire
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-text leading-tight">
                Nés en Guyane,{" "}
                <em className="text-gold-gradient not-italic">pour la Guyane</em>
              </h2>
              <p className="text-brand-muted leading-relaxed">
                ReadyMiix est née d&apos;une passion pour les saveurs tropicales authentiques de
                la Guyane française. Chaque cocktail est élaboré avec des fruits et épices
                locaux, pour capturer l&apos;essence même de notre territoire.
              </p>
              <p className="text-brand-muted leading-relaxed">
                Notre mission : démocratiser le cocktail premium en Guyane. Plus besoin
                d&apos;être barman pour profiter d&apos;un cocktail d&apos;exception — il suffit d&apos;ouvrir
                une ReadyMiix et de savourer.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { value: "7+", label: "Saveurs" },
                  { value: "200+", label: "Clients" },
                  { value: "100%", label: "Naturel" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 rounded-xl bg-brand-card border border-brand-border">
                    <p className="font-display text-2xl font-bold text-brand-gold">{stat.value}</p>
                    <p className="text-xs text-brand-muted mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light font-semibold transition-colors group"
              >
                Découvrir notre histoire
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/30 via-brand-card to-brand-gold/20" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-brand-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />

        <div className="container-custom relative z-10 text-center">
          <span className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-4 block">
            Offre spéciale
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-brand-text mb-4">
            Pack Découverte à{" "}
            <span className="text-gold-gradient">24€</span>
          </h2>
          <p className="text-brand-muted text-lg mb-8 max-w-xl mx-auto">
            6 cocktails ReadyMiix variés pour découvrir toutes nos saveurs tropicales.
            Le cadeau idéal ou la parfaite entrée en matière.
          </p>
          <Link
            href="/product/pack-decouverte-6"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-10 py-4 rounded-xl shadow-gold hover:shadow-gold transition-all active:scale-[0.98] text-lg"
          >
            Découvrir le pack
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
