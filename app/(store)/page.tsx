import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, MapPin, Flame, Candy, Package, Star, ChevronRight, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import EventsSlider from "@/components/store/EventsSlider";

export const revalidate = 60;

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where:   { featured: true, active: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    });
  } catch { return []; }
}

async function getCategories() {
  try {
    return await prisma.category.findMany({
      where:   { active: true },
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    });
  } catch { return []; }
}

async function getEvents() {
  try {
    return await prisma.event.findMany({
      where:   { active: true },
      orderBy: { date: "asc" },
    });
  } catch { return []; }
}

const TICKER_ITEMS = [
  "NIGHTLIFE", "✦", "COCKTAILS PREMIUM", "✦", "GUYANE 973", "✦",
  "READYMIIX", "✦", "BIEN FRAIS", "✦", "TOUJOURS PRÊT", "✦",
  "HARD & LIGHT", "✦", "SAVEURS TROPICALES", "✦",
];

export default async function HomePage() {
  const [featuredProducts, categories, events] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getEvents(),
  ]);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════
          HERO — Immersive aurora full-screen
      ══════════════════════════════════════ */}
      <section className="relative h-[100svh] min-h-[600px] md:min-h-[680px] lg:min-h-[750px] flex flex-col items-center justify-center bg-[#020208] overflow-hidden">

        {/* ── Cocktail background — cinematic mood ── */}
        <Image
          src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1920&q=80&auto=format"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ filter: "brightness(0.32) saturate(1.25)" }}
        />

        {/* ── Cinematic overlay stack ── */}
        {/* 1. Brand gradient — purple top, dark bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D003A]/65 via-transparent to-brand-darker/95" />
        {/* 2. Edge vignette — focuses on centre */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 75% 90% at 50% 50%, transparent 25%, rgba(5,2,15,0.52) 100%)" }}
        />
        {/* 3. Smoke mist at base */}
        <div
          className="absolute bottom-0 left-0 right-0 h-52 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 110% 100% at 50% 100%, rgba(247,37,133,0.055) 0%, rgba(123,47,190,0.03) 45%, transparent 70%)",
            filter: "blur(22px)",
          }}
        />

        {/* ── Aurora orbs — on top of photo, neon atmosphere ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Orb 1 — purple, top-left */}
          <div
            className="hero-orb absolute -top-[280px] -left-[200px] w-[750px] h-[750px] rounded-full bg-brand-purple/28 blur-[120px]"
            style={{ "--dur": "15s" } as React.CSSProperties}
          />
          {/* Orb 2 — pink, top-right */}
          <div
            className="hero-orb absolute -top-[150px] -right-[260px] w-[700px] h-[700px] rounded-full bg-brand-gold/22 blur-[110px]"
            style={{ "--dur": "11s", animationDelay: "-5s" } as React.CSSProperties}
          />
          {/* Orb 3 — teal, bottom-centre */}
          <div
            className="hero-orb absolute -bottom-[260px] left-1/2 -translate-x-1/2 w-[900px] h-[650px] rounded-full bg-brand-teal/12 blur-[140px]"
            style={{ "--dur": "19s", animationDelay: "-9s" } as React.CSSProperties}
          />
          {/* Deep purple depth — centre */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#1A004A]/50 blur-[90px]" />
          {/* Grid texture */}
          <div className="absolute inset-0 bg-grid opacity-[0.05]" />
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent" />
        </div>

        {/* ── Ambient light particles — premium nightlife ── */}

        {/* Cross flare — top left — neon pink */}
        <div className="pointer-events-none select-none absolute left-[5%] top-[20%] opacity-30 animate-float [animation-delay:0s]">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <line x1="14" y1="2" x2="14" y2="26" stroke="#F72585" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="2" y1="14" x2="26" y2="14" stroke="#F72585" strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="14" cy="14" r="2.5" fill="#F72585"/>
          </svg>
          <div className="absolute inset-[-4px] blur-[8px] bg-[#F72585]/25 rounded-full" />
        </div>

        {/* Glowing ring — top right — violet */}
        <div className="pointer-events-none select-none absolute right-[7%] top-[26%] animate-float [animation-delay:-3s] [animation-duration:9s]">
          <div
            className="w-11 h-11 rounded-full border border-[#7B2FBE]/55"
            style={{ boxShadow: "0 0 16px rgba(123,47,190,0.45), inset 0 0 10px rgba(123,47,190,0.18)" }}
          />
        </div>

        {/* Ice diamond — bottom left — teal */}
        <div className="pointer-events-none select-none absolute left-[11%] bottom-[18%] opacity-30 animate-float [animation-delay:-5s] [animation-duration:8s]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 1L21 11L11 21L1 11Z" stroke="#00D2C8" strokeWidth="1.2" strokeLinejoin="round"/>
            <circle cx="11" cy="11" r="2" fill="#00D2C8" opacity="0.7"/>
          </svg>
          <div className="absolute inset-[-6px] blur-[8px] bg-[#00D2C8]/20 rounded-full" />
        </div>

        {/* 4-point star flare — bottom right — pink */}
        <div className="pointer-events-none select-none absolute right-[5%] bottom-[30%] opacity-20 animate-float [animation-delay:-1.5s] [animation-duration:12s]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="#F72585"/>
          </svg>
          <div className="absolute inset-[-4px] blur-[7px] bg-[#F72585]/20 rounded-full" />
        </div>

        {/* Extra: small violet dot cluster — mid right */}
        <div className="pointer-events-none select-none absolute right-[12%] top-[55%] opacity-20 animate-float [animation-delay:-7s] [animation-duration:14s]">
          <div className="w-2 h-2 rounded-full bg-[#7B2FBE]" style={{ boxShadow: "0 0 10px 3px rgba(123,47,190,0.6)" }} />
        </div>

        {/* Extra: pink micro-dot — left center */}
        <div className="pointer-events-none select-none absolute left-[8%] top-[52%] opacity-20 animate-float [animation-delay:-10s] [animation-duration:16s]">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F72585]" style={{ boxShadow: "0 0 8px 3px rgba(247,37,133,0.55)" }} />
        </div>

        {/* ── Hero content ── */}
        <div className="relative z-10 flex flex-col items-center text-center px-5 md:px-8 lg:px-5 gap-4 md:gap-5 lg:gap-7">

          {/* Logo */}
          <div className="relative animate-slide-in-up [animation-delay:0ms]">
            <div className="absolute inset-0 rounded-full bg-brand-gold/15 blur-[80px] scale-[2.2] animate-glow-breathe" />
            <div className="absolute inset-0 rounded-full bg-brand-purple/10 blur-[110px] scale-[2.8]" />
            <Image
              src="/logo.png"
              alt="ReadyMiix"
              width={200}
              height={200}
              className="relative z-10 w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[148px] md:h-[148px] lg:w-[190px] lg:h-[190px] object-contain"
              style={{ filter: "drop-shadow(0 0 70px rgba(247,37,133,0.85)) drop-shadow(0 0 25px rgba(247,37,133,0.45))" }}
              priority
            />
          </div>

          {/* Live badge */}
          <div className="animate-slide-in-up [animation-delay:80ms]">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.05] backdrop-blur-sm text-[11px] font-bold text-brand-teal uppercase tracking-[0.2em]">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse shrink-0" />
              Guyane 973 · Cocktails premium
            </span>
          </div>

          {/* Main headline */}
          <div className="animate-slide-in-up [animation-delay:160ms]">
            <h1 className="font-display uppercase leading-[0.88] tracking-tight">
              <span
                className="block text-[clamp(3.2rem,13vw,5rem)] md:text-[clamp(3.5rem,8.5vw,6rem)] lg:text-[clamp(4.5rem,9vw,10rem)] text-white"
                style={{ textShadow: "0 0 80px rgba(255,255,255,0.1)" }}
              >
                BIEN FRAIS
              </span>
              <span
                className="block text-[clamp(3.2rem,13vw,5rem)] md:text-[clamp(3.5rem,8.5vw,6rem)] lg:text-[clamp(4.5rem,9vw,10rem)] text-gold-gradient"
                style={{ filter: "drop-shadow(0 0 50px rgba(247,37,133,0.55))" }}
              >
                TOUJOURS PRÊT
              </span>
            </h1>
          </div>

          {/* CTAs */}
          <div className="animate-slide-in-up [animation-delay:260ms] flex flex-col sm:flex-row gap-3 w-full max-w-[380px] md:max-w-[440px] lg:max-w-[480px]">
            {/* Primary — Composer */}
            <Link
              href="/composer"
              className="group relative flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#C5006A] to-[#F72585] text-white font-bold px-5 py-3.5 md:py-3 lg:py-4 rounded-2xl text-xs md:text-[11px] lg:text-sm uppercase tracking-widest shadow-[0_0_40px_rgba(247,37,133,0.45)] hover:shadow-[0_0_65px_rgba(247,37,133,0.7)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Composer mon cocktail</span>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            </Link>

            {/* Secondary — Boutique */}
            <Link
              href="/shop"
              className="flex-1 flex items-center justify-center gap-2.5 border border-white/15 bg-white/[0.05] backdrop-blur-sm text-white font-bold px-5 py-3.5 md:py-3 lg:py-4 rounded-2xl text-xs md:text-[11px] lg:text-sm uppercase tracking-widest hover:border-brand-teal/60 hover:bg-white/[0.09] hover:shadow-[0_0_28px_rgba(0,210,200,0.22)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97]"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>Voir la boutique</span>
            </Link>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.3em]">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-brand-gold" />
          <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-bounce" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          TICKER BAND — scrolling nightlife
      ══════════════════════════════════════ */}
      <div className="relative overflow-hidden border-y border-[#C5006A]/40 py-3 bg-gradient-to-r from-[#8B0038] via-brand-gold to-[#8B0038] shrink-0">
        <div className="animate-marquee inline-flex whitespace-nowrap">
          {[0, 1].map((rep) => (
            <span key={rep} className="inline-flex shrink-0">
              {TICKER_ITEMS.map((item, i) => (
                <span
                  key={i}
                  className={`font-display text-sm uppercase tracking-[0.22em] px-4 shrink-0 ${
                    item === "✦" ? "text-white/40" : "text-white"
                  }`}
                >
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          GAMMES BAND
      ══════════════════════════════════════ */}
      <section className="py-10 md:py-11 lg:py-14 bg-brand-card/50 border-b border-brand-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 lg:gap-5">

            {/* Hard */}
            <Link
              href="/shop?category=hard"
              className="group relative flex items-center gap-5 p-5 rounded-2xl border border-brand-gold/20 bg-gradient-to-br from-brand-gold/6 to-brand-darker hover:border-brand-gold/50 hover:shadow-[0_0_40px_rgba(247,37,133,0.15)] transition-all duration-400 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand-gold/20 group-hover:border-brand-gold/40 transition-all duration-300">
                <Flame className="w-7 h-7 text-brand-gold" />
              </div>
              <div className="relative flex flex-col gap-0.5">
                <h3 className="font-display text-xl text-brand-text uppercase tracking-wide group-hover:text-brand-gold transition-colors duration-200">Hard</h3>
                <p className="text-sm text-brand-muted leading-snug">Hennessy + alcools forts, pour les amateurs</p>
                <span className="mt-1.5 text-xs text-brand-gold font-bold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                  Voir les cups <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <Flame className="absolute right-4 top-4 w-5 h-5 text-brand-gold/15 group-hover:text-brand-gold/30 transition-colors" />
            </Link>

            {/* Light */}
            <Link
              href="/shop?category=light"
              className="group relative flex items-center gap-5 p-5 rounded-2xl border border-brand-teal/20 bg-gradient-to-br from-brand-teal/6 to-brand-darker hover:border-brand-teal/50 hover:shadow-[0_0_40px_rgba(0,210,200,0.12)] transition-all duration-400 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-teal/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-14 h-14 rounded-2xl bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand-teal/20 group-hover:border-brand-teal/40 transition-all duration-300">
                <Candy className="w-7 h-7 text-brand-teal" />
              </div>
              <div className="relative flex flex-col gap-0.5">
                <h3 className="font-display text-xl text-brand-text uppercase tracking-wide group-hover:text-brand-teal transition-colors duration-200">Light</h3>
                <p className="text-sm text-brand-muted leading-snug">Haribo, Jitty Shocks, popping candy & plus</p>
                <span className="mt-1.5 text-xs text-brand-teal font-bold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                  Voir les cups <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <Candy className="absolute right-4 top-4 w-5 h-5 text-brand-teal/15 group-hover:text-brand-teal/30 transition-colors" />
            </Link>

            {/* Packs */}
            <Link
              href="/shop?category=packs"
              className="group relative flex items-center gap-5 p-5 rounded-2xl border border-brand-purple/20 bg-gradient-to-br from-brand-purple/6 to-brand-darker hover:border-brand-purple/50 hover:shadow-[0_0_40px_rgba(123,47,190,0.15)] transition-all duration-400 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-14 h-14 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand-purple/20 group-hover:border-brand-purple/40 transition-all duration-300">
                <Package className="w-7 h-7 text-brand-purple-light" />
              </div>
              <div className="relative flex flex-col gap-0.5">
                <h3 className="font-display text-xl text-brand-text uppercase tracking-wide group-hover:text-brand-purple-light transition-colors duration-200">Packs</h3>
                <p className="text-sm text-brand-muted leading-snug">Pack Duo, x4 ou x10 — idéal pour soirées</p>
                <span className="mt-1.5 text-xs text-brand-purple-light font-bold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                  Voir les packs <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <Package className="absolute right-4 top-4 w-5 h-5 text-brand-purple/15 group-hover:text-brand-purple/30 transition-colors" />
            </Link>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ÉVÉNEMENTS DU MOMENT
      ══════════════════════════════════════ */}
      {events.length > 0 && (
        <section className="py-12 md:py-14 lg:py-20 overflow-hidden">
          <div className="container-custom">

            {/* Section header */}
            <div className="flex items-end justify-between mb-6 md:mb-7 lg:mb-8">
              <div>
                <p className="flex items-center gap-2.5 text-[10px] font-black text-brand-gold uppercase tracking-[0.28em] mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                  Nightlife & Events
                </p>
                <h2 className="font-display text-[clamp(1.8rem,5vw,4rem)] md:text-[clamp(2rem,4.5vw,3.5rem)] lg:text-[clamp(2rem,6vw,4rem)] text-white uppercase tracking-wide leading-none">
                  Événements du moment
                </h2>
              </div>
              <Link
                href="/events"
                className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-brand-muted hover:text-brand-gold uppercase tracking-widest transition-colors group"
              >
                Voir tous <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <EventsSlider events={events.map((e) => ({
              id: e.id, title: e.title, type: e.type, description: e.description,
              image: e.image, date: e.date.toISOString(), timeRange: e.timeRange,
              location: e.location, price: e.price, maxTickets: e.maxTickets,
            }))} />

          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          PRODUITS VEDETTES
      ══════════════════════════════════════ */}
      {featuredProducts.length > 0 && (
        <section className="py-12 md:py-14 lg:py-20">
          <div className="container-custom">
            <div className="flex items-end justify-between mb-8 md:mb-8 lg:mb-10">
              <div>
                <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-2">
                  — Nos créations
                </p>
                <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-wide">
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

            {/* mobile: 1 col | tablet: 2 col | desktop: 4 col */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
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
        <section className="py-12 md:py-14 lg:py-20 bg-brand-card/40">
          <div className="container-custom">
            <div className="text-center mb-8 md:mb-9 lg:mb-12">
              <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-2">— Collections</p>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white uppercase tracking-wide">
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
          BRAND STORY
      ══════════════════════════════════════ */}
      <section className="py-12 md:py-14 lg:py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
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
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white uppercase leading-tight">
                Nés en Guyane,{" "}
                <span className="text-gold-gradient">pour la Guyane</span>
              </h2>
              <p className="text-brand-muted leading-relaxed">
                ReadyMiix est né d&apos;une passion pour les saveurs tropicales authentiques
                de la Guyane française. Chaque cup est préparé avec soin — Hard avec
                Hennessy pour les amateurs, Light avec bonbons et surprises fruitées pour tous.
              </p>
              <p className="text-brand-muted leading-relaxed">
                Le concept est simple :{" "}
                <strong className="text-brand-text">tu commandes, tu récupères, tu savoures.</strong>{" "}
                Bien frais, toujours prêt.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-2">
                {[
                  { value: "7+",   label: "Produits" },
                  { value: "200+", label: "Clients" },
                  { value: "5",    label: "Points vente" },
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
      <section className="py-10 md:py-12 lg:py-14 bg-brand-card border-y border-brand-border">
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
          CTA FINAL — BAND NÉON
      ══════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
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
              className="group relative inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#C5006A] to-[#F72585] text-white font-bold px-10 py-4 rounded-2xl shadow-gold hover:shadow-[0_0_55px_rgba(247,37,133,0.6)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] text-sm uppercase tracking-widest overflow-hidden"
            >
              <ShoppingBag className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Commander</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
            </Link>
            <Link
              href="/shop?category=packs"
              className="inline-flex items-center justify-center gap-3 border border-brand-border text-brand-text hover:border-brand-gold/40 font-semibold px-10 py-4 rounded-2xl transition-all text-sm uppercase tracking-widest"
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
