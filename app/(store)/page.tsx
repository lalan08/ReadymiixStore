import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, MapPin, Flame, Candy, Package, Star, ChevronRight, MessageCircle } from "lucide-react";
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

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "594694369615";

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════
          HERO — Full screen, flyer energy
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-brand-darker overflow-hidden">

        {/* Background: radial glow top-left (purple) + bottom-right (pink) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-brand-purple/25 blur-[120px]" />
          <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-brand-gold/20 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-teal/5 blur-[200px]" />
          {/* Diagonal grid lines */}
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>

        {/* Pink horizontal stripe accent at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold-dark via-brand-gold to-brand-teal" />

        <div className="container-custom relative z-10 pt-28 pb-20 flex flex-col items-center text-center">

          {/* Logo grand format */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-brand-gold/25 blur-3xl scale-125 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-brand-purple/20 blur-2xl scale-150" />
            <Image
              src="/logo.png"
              alt="ReadyMiix Store"
              width={200}
              height={200}
              className="relative z-10 object-contain w-[180px] h-[180px] md:w-[240px] md:h-[240px] drop-shadow-[0_0_50px_rgba(247,37,133,0.7)]"
              priority
            />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-teal/40 bg-brand-teal/10 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
            <span className="text-xs font-bold text-brand-teal uppercase tracking-[0.2em]">
              Guyane 973 · Cocktails prêts à déguster
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display uppercase leading-none tracking-wide mb-2">
            <span className="block text-[clamp(4rem,15vw,9rem)] text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              BIEN FRAIS
            </span>
            <span className="block text-[clamp(4rem,15vw,9rem)] text-gold-gradient drop-shadow-[0_0_60px_rgba(247,37,133,0.5)]">
              TOUJOURS PRÊT !
            </span>
          </h1>

          {/* Teal separator */}
          <div className="flex items-center gap-4 my-6">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-brand-teal/60" />
            <span className="text-brand-teal text-xs font-bold uppercase tracking-[0.3em]">ReadyMiix</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-brand-teal/60" />
          </div>

          <p className="text-lg md:text-xl text-brand-muted max-w-xl leading-relaxed mb-10">
            Des cups cocktail préparés en Guyane — Hard avec Hennessy, Light avec bonbons et surprises fruitées.
            <strong className="text-brand-text font-medium"> Commande, récupère, régale-toi.</strong>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white font-bold px-8 py-4 rounded-xl shadow-gold hover:shadow-[0_0_50px_rgba(247,37,133,0.5)] transition-all active:scale-[0.98] text-base uppercase tracking-wide"
            >
              <ShoppingBag className="w-5 h-5" />
              Commander maintenant
            </Link>
            <a
              href={`https://wa.me/${whatsapp}?text=Bonjour%20ReadyMiix%20!%20Je%20voudrais%20commander.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 border border-brand-border text-brand-text hover:border-green-500/40 hover:bg-green-500/5 font-semibold px-8 py-4 rounded-xl transition-all text-base"
            >
              <MessageCircle className="w-5 h-5 text-green-400" />
              WhatsApp
            </a>
          </div>

          {/* Social proof pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-10">
            {[
              { icon: "🔥", label: "Hard – Hennessy & alcool fort" },
              { icon: "🍬", label: "Light – Bonbons & fruits" },
              { icon: "🎁", label: "Packs soirée dispo" },
            ].map((pill) => (
              <span
                key={pill.label}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-card border border-brand-border text-sm text-brand-muted"
              >
                <span>{pill.icon}</span>
                {pill.label}
              </span>
            ))}
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-brand-gold" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          GAMMES BAND
      ══════════════════════════════════════ */}
      <section className="bg-brand-card border-y border-brand-border py-14">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Hard */}
            <div className="relative flex items-center gap-5 p-5 rounded-2xl border border-brand-gold/30 bg-brand-gold/5 hover:bg-brand-gold/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center shrink-0 text-2xl">
                🔥
              </div>
              <div>
                <h3 className="font-display text-xl text-brand-text uppercase tracking-wide">Hard</h3>
                <p className="text-sm text-brand-muted">Hennessy + alcools forts, pour les amateurs</p>
                <Link href="/shop?category=hard" className="text-xs text-brand-gold font-semibold mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Voir les cups <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <Flame className="absolute right-4 top-4 w-5 h-5 text-brand-gold/20" />
            </div>

            {/* Light */}
            <div className="relative flex items-center gap-5 p-5 rounded-2xl border border-brand-teal/30 bg-brand-teal/5 hover:bg-brand-teal/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-brand-teal/20 border border-brand-teal/30 flex items-center justify-center shrink-0 text-2xl">
                🍬
              </div>
              <div>
                <h3 className="font-display text-xl text-brand-text uppercase tracking-wide">Light</h3>
                <p className="text-sm text-brand-muted">Haribo, Jitty Shocks, popping candy & plus</p>
                <Link href="/shop?category=light" className="text-xs text-brand-teal font-semibold mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Voir les cups <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <Candy className="absolute right-4 top-4 w-5 h-5 text-brand-teal/20" />
            </div>

            {/* Packs */}
            <div className="relative flex items-center gap-5 p-5 rounded-2xl border border-brand-purple/30 bg-brand-purple/5 hover:bg-brand-purple/10 transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center shrink-0 text-2xl">
                🎁
              </div>
              <div>
                <h3 className="font-display text-xl text-brand-text uppercase tracking-wide">Packs</h3>
                <p className="text-sm text-brand-muted">Pack Duo, x4 ou x10 — idéal pour soirées</p>
                <Link href="/shop?category=packs" className="text-xs text-brand-purple-light font-semibold mt-1 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Voir les packs <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <Package className="absolute right-4 top-4 w-5 h-5 text-brand-purple/20" />
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PRODUITS VEDETTES
      ══════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-2">
                  — Nos créations
                </p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-wide">
                  Produits vedettes
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:flex items-center gap-2 text-brand-muted hover:text-brand-gold text-sm font-medium transition-colors group"
              >
                Voir tout <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
                className="flex items-center gap-2 border border-brand-border text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 text-sm font-medium px-6 py-3 rounded-xl transition-all"
              >
                Voir tous les cocktails <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          CATEGORIES GRID
      ══════════════════════════════════════ */}
      {categories.length > 0 && (
        <section className="section-padding bg-brand-card/40">
          <div className="container-custom">
            <div className="text-center mb-12">
              <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-2">— Collections</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-wide">
                Explorez nos gammes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] border border-brand-border hover:border-brand-gold/40 transition-colors"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/50 to-transparent" />
                  <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/5 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide mb-1">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-xs text-brand-muted line-clamp-2 mb-3">{cat.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-brand-gold uppercase tracking-wide">
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

      {/* ══════════════════════════════════════
          BRAND STORY — côte à côte
      ══════════════════════════════════════ */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80"
                  alt="ReadyMiix – Notre histoire"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/70 to-transparent" />
              </div>
              <div className="absolute -bottom-5 -right-5 glass border border-brand-gold/30 rounded-2xl p-5 hidden md:block shadow-gold-sm">
                <p className="font-display text-4xl font-bold text-brand-gold uppercase">100%</p>
                <p className="text-xs text-brand-muted mt-1">Fait en Guyane</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em]">— Notre histoire</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase leading-tight">
                Nés en Guyane,{" "}
                <span className="text-gold-gradient">pour la Guyane</span>
              </h2>
              <p className="text-brand-muted leading-relaxed">
                ReadyMiix est né d&apos;une passion pour les saveurs tropicales authentiques
                de la Guyane française. Chaque cup est préparé avec soin — Hard avec
                Hennessy pour les amateurs, Light avec bonbons et surprises fruitées pour tous.
              </p>
              <p className="text-brand-muted leading-relaxed">
                Le concept est simple : <strong className="text-brand-text">tu commandes, tu récupères, tu savoures.</strong>{" "}
                Bien frais, toujours prêt.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { value: "7+",    label: "Produits" },
                  { value: "200+",  label: "Clients" },
                  { value: "5",     label: "Points vente" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-4 rounded-xl bg-brand-card border border-brand-border">
                    <p className="font-display text-3xl font-bold text-brand-gold uppercase">{stat.value}</p>
                    <p className="text-xs text-brand-muted mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light font-semibold transition-colors group self-start"
              >
                Découvrir notre histoire
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          POINTS DE VENTE BAND
      ══════════════════════════════════════ */}
      <section className="py-14 bg-brand-card border-y border-brand-border">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="shrink-0">
              <p className="text-xs font-bold text-brand-teal uppercase tracking-[0.2em] mb-2">— Disponible ici</p>
              <h2 className="font-display text-3xl font-bold text-white uppercase tracking-wide">
                Points de vente
              </h2>
            </div>
            <div className="h-px md:h-16 w-full md:w-px bg-brand-border shrink-0" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
              {[
                "Soula Market",
                "Proxi Madeleine",
                "Rapid Market Raban",
                "Rapid Market (en face Melkior)",
                "Barb'Or – CC Family Plaza, Montjoly",
              ].map((point) => (
                <div key={point} className="flex items-center gap-2 text-sm text-brand-muted">
                  <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA FINAL — BAND ROSE / NÉON
      ══════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-brand-darker" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 via-transparent to-brand-gold/15" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-gold/10 rounded-full blur-[100px]" />

        <div className="container-custom relative z-10 text-center">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.25em] mb-4">
            — Commande maintenant
          </p>
          <h2 className="font-display uppercase leading-none mb-6">
            <span className="block text-[clamp(2.5rem,8vw,5rem)] text-white tracking-wide">
              Tu es prêt ?
            </span>
            <span className="block text-[clamp(2.5rem,8vw,5rem)] text-gold-gradient tracking-wide">
              Ton cup t&apos;attend !
            </span>
          </h2>
          <p className="text-brand-muted text-lg mb-10 max-w-lg mx-auto">
            Commande en ligne ou retrouve-nous dans nos 5 points de vente à Cayenne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white font-bold px-10 py-4 rounded-xl shadow-gold hover:shadow-[0_0_50px_rgba(247,37,133,0.5)] transition-all active:scale-[0.98] text-lg uppercase tracking-wide"
            >
              <ShoppingBag className="w-5 h-5" />
              Commander
            </Link>
            <Link
              href="/shop?category=packs"
              className="inline-flex items-center justify-center gap-3 border border-brand-border text-brand-text hover:border-brand-gold/40 font-semibold px-10 py-4 rounded-xl transition-all text-lg"
            >
              Voir les packs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
            ))}
            <span className="text-sm text-brand-muted ml-2">+200 clients satisfaits en Guyane</span>
          </div>
        </div>
      </section>

    </div>
  );
}
