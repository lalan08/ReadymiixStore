import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, MapPin, Star, ChevronRight, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import EventsSlider from "@/components/store/EventsSlider";
import HeroCTAs from "@/components/store/HeroCTAs";
import { isComposerEnabled } from "@/lib/siteConfig";

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
  const [featuredProducts, categories, events, composerEnabled] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getEvents(),
    isComposerEnabled(),
  ]);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════
          HERO — Premium campaign poster
          • Big neon logo at the top-left, in the content flow
          • Cocktail anchored right, fills full hero height at native aspect
          • Dark, atmospheric left side for text overlay
          • Layered smoke + neon haze for nightlife realism
      ══════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex items-start bg-[#010108] overflow-hidden">

        {/* ── Deep black base ── */}
        <div className="absolute inset-0 bg-[#020208]" />

        {/* ── Cocktail poster ──
            mobile : fills the entire hero, object-position pushed left so
                     the cocktail subject sits in the right 2/3 of viewport.
                     scale + origin-left enlarges it and lets the right edge
                     bleed off-screen for a real campaign-poster feel.
            md+    : native portrait aspect, full hero height, anchored
                     to the right — cocktail subject reads at ~80% viewport */}
        <div className="absolute inset-x-0 top-0 bottom-[80px] md:bottom-0 md:left-auto md:right-0 md:aspect-[1023/1537] md:w-auto pointer-events-none">
          <Image
            src="/hero-cocktail.png"
            alt="ReadyMiix cocktail premium"
            fill priority
            quality={95}
            sizes="(max-width: 768px) 100vw, 67vh"
            className="object-cover object-[7%_center] md:object-center"
            style={{ filter: "saturate(1.32) contrast(1.12) brightness(1.04)" }}
          />
        </div>

        {/* ── Left-side dark mask — pulled back to 58% so the cocktail
              area (right half) is completely free of overlay ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #010108 0%, rgba(1,1,8,0.92) 15%, rgba(1,1,8,0.70) 30%, rgba(1,1,8,0.28) 45%, transparent 58%)",
          }}
        />

        {/* ── Pink glow bleed — discreet halo, no longer veils the photo ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 90% 75% at 78% 55%, rgba(247,37,133,0.10) 0%, rgba(247,37,133,0.04) 30%, rgba(0,180,255,0.03) 55%, transparent 78%)",
            mixBlendMode: "screen",
          }}
        />

        {/* ── Top fade — lighter so neon palms keep popping ── */}
        <div className="absolute inset-x-0 top-0 h-[160px] pointer-events-none bg-gradient-to-b from-[#010108]/35 to-transparent" />

        {/* ── Bottom fade — shorter and lighter so the wet floor stays visible ── */}
        <div className="absolute inset-x-0 bottom-0 h-[180px] pointer-events-none bg-gradient-to-t from-[#010108] via-[#010108]/30 to-transparent" />

        {/* ── Atmospheric smoke — slow drifting coloured clouds ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ mixBlendMode: "screen" }}>
          <div className="absolute -inset-[15%] blur-[110px] opacity-25"
            style={{
              background: "radial-gradient(ellipse 50% 35% at 28% 65%, rgba(247,37,133,0.22) 0%, transparent 60%)",
              animation: "ciDrift1 36s ease-in-out infinite",
            }} />
          <div className="absolute -inset-[15%] blur-[120px] opacity-30"
            style={{
              background: "radial-gradient(ellipse 55% 40% at 55% 38%, rgba(247,37,133,0.40) 0%, transparent 60%)",
              animation: "ciDrift2 42s ease-in-out infinite",
            }} />
          <div className="absolute -inset-[15%] blur-[130px] opacity-25"
            style={{
              background: "radial-gradient(ellipse 45% 35% at 22% 80%, rgba(0,180,255,0.40) 0%, transparent 60%)",
              animation: "ciDrift3 38s ease-in-out infinite",
            }} />
        </div>

        {/* ── Neon orbs — anchor the palette on the dark left side ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-orb absolute -bottom-[180px] -left-[140px] w-[640px] h-[500px] rounded-full blur-[180px]"
            style={{ background: "rgba(180,30,90,0.10)", "--dur": "48s" } as React.CSSProperties} />
          <div className="hero-orb absolute top-[10%] -left-[120px] w-[440px] h-[440px] rounded-full blur-[160px]"
            style={{ background: "rgba(247,37,133,0.10)", "--dur": "42s", animationDelay: "-14s" } as React.CSSProperties} />
          <div className="hero-orb absolute bottom-[10%] left-[35%] w-[380px] h-[380px] rounded-full blur-[150px]"
            style={{ background: "rgba(0,210,200,0.07)", "--dur": "50s", animationDelay: "-22s" } as React.CSSProperties} />

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
        </div>

        {/* ══════════ CONTENT — left-aligned column with logo on top ══════════ */}
        <div className="relative z-10 container-custom pt-4 pb-28 md:pt-6 md:pb-32 lg:pt-8 lg:pb-40 w-full">
          {/* Invisible composition zone — bounded left of the glass so text
              and CTA keep their presence without ever reaching the cocktail */}
          <div className="w-full max-w-[64%] sm:max-w-[54%] md:max-w-[45%] lg:max-w-[40%] xl:max-w-[37%]">

            {/* Big neon logo — replaces the old navbar logo, dominant brand mark */}
            <Link
              href="/"
              className="animate-slide-in-up [animation-delay:0ms] inline-block -ml-2 md:-ml-3 mb-4 md:mb-7 lg:mb-8"
              aria-label="ReadyMiix Store — Accueil"
            >
              <Image
                src="/logo.png"
                alt="ReadyMiix Store"
                width={320}
                height={320}
                priority
                className="w-[170px] h-[170px] sm:w-[200px] sm:h-[200px] md:w-[240px] md:h-[240px] lg:w-[280px] lg:h-[280px] object-contain"
              />
            </Link>

            {/* Eyebrow */}
            <p
              className="animate-slide-in-up [animation-delay:80ms] flex items-center gap-2 text-[11px] md:text-xs font-black text-brand-teal uppercase tracking-[0.28em] mb-7 md:mb-9"
              style={{ textShadow: "0 0 18px rgba(0,210,200,0.55), 0 2px 8px rgba(0,0,0,0.7)" }}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              Prêt à boire. Prêt à vivre.
            </p>

            {/* Slogan — dominant focal point */}
            <h1 className="animate-slide-in-up [animation-delay:180ms] font-display uppercase leading-[0.9] tracking-tight mb-8 md:mb-9">
              <span
                className="block text-[clamp(2.9rem,12vw,4.6rem)] md:text-[clamp(3.9rem,7vw,5.8rem)] lg:text-[clamp(4.8rem,6.2vw,7rem)] text-white"
                style={{ textShadow: "0 8px 40px rgba(0,0,0,0.85), 0 0 50px rgba(255,255,255,0.08)" }}
              >
                BIEN FRAIS
              </span>
              <span
                className="block text-[clamp(2.9rem,12vw,4.6rem)] md:text-[clamp(3.9rem,7vw,5.8rem)] lg:text-[clamp(4.8rem,6.2vw,7rem)] text-gold-gradient mt-1 md:mt-2"
                style={{ filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.85)) drop-shadow(0 0 40px rgba(247,37,133,0.50))" }}
              >
                TOUJOURS PRÊT
              </span>
            </h1>

            {/* Accent bar */}
            <div className="animate-slide-in-up [animation-delay:260ms] w-14 md:w-16 h-[3px] bg-gradient-to-r from-brand-gold via-brand-gold/70 to-transparent rounded-full mb-7 md:mb-8" />

            {/* Subtitle */}
            <p
              className="animate-slide-in-up [animation-delay:320ms] text-sm md:text-base lg:text-[17px] text-white/80 leading-relaxed max-w-[290px] md:max-w-[320px] mb-10 md:mb-12"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}
            >
              Des cocktails premium prêts à boire, pensés pour vos{" "}
              <span className="text-brand-gold font-semibold">meilleurs</span>{" "}
              moments.
            </p>

            {/* CTAs */}
            <HeroCTAs />

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 z-10">
          <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.3em]">Scroll</span>
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
          3 UNIVERSE PORTALS
      ══════════════════════════════════════ */}
      <section className="py-5 md:py-6" style={{ background: "#020208" }}>
        <div className="container-custom">
          <div className={`grid grid-cols-1 gap-3 md:gap-4 ${composerEnabled ? "md:grid-cols-3" : "md:grid-cols-1 max-w-xl mx-auto"}`}>

            {/* ── HARD portal — composer only ── */}
            {composerEnabled && (
            <Link
              href="/composer?type=hard"
              className="group relative overflow-hidden rounded-3xl flex flex-col justify-between p-5 md:p-7 cursor-pointer active:scale-[0.98] transition-transform duration-150"
              style={{ background: "linear-gradient(145deg, #1A000D 0%, #0A0007 100%)", minHeight: 148 }}
            >
              {/* Glow orb */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20 group-hover:opacity-35 transition-opacity duration-500"
                style={{ background: "#F72585" }} />
              {/* Border default */}
              <div className="absolute inset-0 rounded-3xl border transition-all duration-300"
                style={{ borderColor: "rgba(247,37,133,0.15)" }} />
              {/* Border hover */}
              <div className="absolute inset-0 rounded-3xl border opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ borderColor: "rgba(247,37,133,0.5)", boxShadow: "inset 0 0 30px rgba(247,37,133,0.05)" }} />
              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-6 right-6 h-px opacity-40 group-hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(90deg, transparent, #F72585, transparent)" }} />

              {/* Tag */}
              <p className="relative text-[9px] font-black uppercase tracking-[0.35em]"
                style={{ color: "rgba(247,37,133,0.55)" }}>
                Nightlife · Intense
              </p>

              {/* Bottom row */}
              <div className="relative flex items-end justify-between">
                <h3 className="font-display text-[64px] md:text-[72px] text-white uppercase leading-none tracking-tight"
                  style={{ textShadow: "0 0 40px rgba(247,37,133,0.25)" }}>
                  HARD
                </h3>
                <span className="flex items-center gap-1 text-[11px] font-bold mb-1.5 group-hover:gap-2 transition-all"
                  style={{ color: "#F72585" }}>
                  Composer <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
            )}

            {/* ── LIGHT portal — composer only ── */}
            {composerEnabled && (
            <Link
              href="/composer?type=light"
              className="group relative overflow-hidden rounded-3xl flex flex-col justify-between p-5 md:p-7 cursor-pointer active:scale-[0.98] transition-transform duration-150"
              style={{ background: "linear-gradient(145deg, #001814 0%, #000A0A 100%)", minHeight: 148 }}
            >
              {/* Glow orb */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-15 group-hover:opacity-30 transition-opacity duration-500"
                style={{ background: "#00D2C8" }} />
              {/* Border default */}
              <div className="absolute inset-0 rounded-3xl border transition-all duration-300"
                style={{ borderColor: "rgba(0,210,200,0.15)" }} />
              {/* Border hover */}
              <div className="absolute inset-0 rounded-3xl border opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ borderColor: "rgba(0,210,200,0.5)", boxShadow: "inset 0 0 30px rgba(0,210,200,0.05)" }} />
              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-6 right-6 h-px opacity-40 group-hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(90deg, transparent, #00D2C8, transparent)" }} />

              {/* Tag */}
              <p className="relative text-[9px] font-black uppercase tracking-[0.35em]"
                style={{ color: "rgba(0,210,200,0.55)" }}>
                Fun · Candy · Colorful
              </p>

              {/* Bottom row */}
              <div className="relative flex items-end justify-between">
                <h3 className="font-display text-[64px] md:text-[72px] text-white uppercase leading-none tracking-tight"
                  style={{ textShadow: "0 0 40px rgba(0,210,200,0.2)" }}>
                  LIGHT
                </h3>
                <span className="flex items-center gap-1 text-[11px] font-bold mb-1.5 group-hover:gap-2 transition-all"
                  style={{ color: "#00D2C8" }}>
                  Composer <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
            )}

            {/* ── FROZEN CAIPI portal — always shown (boutique) ── */}
            <Link
              href="/shop?category=cocktails"
              className="group relative overflow-hidden rounded-3xl flex flex-col justify-between p-5 md:p-7 cursor-pointer active:scale-[0.98] transition-transform duration-150"
              style={{ background: "linear-gradient(145deg, #001320 0%, #000A12 100%)", minHeight: 148 }}
            >
              {/* Glow orb */}
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-15 group-hover:opacity-30 transition-opacity duration-500"
                style={{ background: "#00C8FF" }} />
              {/* Second orb — tropical mint */}
              <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                style={{ background: "#00F0DC" }} />
              {/* Border default */}
              <div className="absolute inset-0 rounded-3xl border transition-all duration-300"
                style={{ borderColor: "rgba(0,200,255,0.12)" }} />
              {/* Border hover */}
              <div className="absolute inset-0 rounded-3xl border opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ borderColor: "rgba(0,200,255,0.45)", boxShadow: "inset 0 0 30px rgba(0,200,255,0.04)" }} />
              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-6 right-6 h-px opacity-40 group-hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(90deg, transparent, #00C8FF, transparent)" }} />
              {/* Ice crystal accent */}
              <span className="absolute top-4 right-5 text-xl opacity-20 group-hover:opacity-40 transition-opacity">❄</span>

              {/* Tag */}
              <p className="relative text-[9px] font-black uppercase tracking-[0.35em]"
                style={{ color: "rgba(0,200,255,0.55)" }}>
                Frozen · Tropical · Premium
              </p>

              {/* Bottom row */}
              <div className="relative flex items-end justify-between">
                <div className="leading-none">
                  <h3 className="font-display text-[46px] md:text-[52px] text-white uppercase leading-none tracking-tight"
                    style={{ textShadow: "0 0 40px rgba(0,200,255,0.25)" }}>
                    FROZEN
                  </h3>
                  <h3 className="font-display text-[46px] md:text-[52px] uppercase leading-none tracking-widest"
                    style={{ color: "#00C8FF", textShadow: "0 0 30px rgba(0,200,255,0.5)" }}>
                    CAIPI
                  </h3>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold mb-1.5 group-hover:gap-2 transition-all"
                  style={{ color: "#00C8FF" }}>
                  Découvrir <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
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
