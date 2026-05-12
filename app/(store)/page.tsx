import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag, MapPin, Star, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/store/ProductCard";
import EventsSlider from "@/components/store/EventsSlider";
import HeroCTAs from "@/components/store/HeroCTAs";

export const revalidate = 300; // 5 minutes

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
          HERO — Cinematic composition (3 zones)
      ══════════════════════════════════════ */}
      <section className="relative h-[100svh] min-h-[680px] md:min-h-[780px] flex flex-col bg-[#010108] overflow-hidden">

        {/* ── Background photo ── */}
        <Image
          src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1400&q=80&auto=format&fm=webp"
          alt="" fill priority sizes="100vw"
          className="object-cover object-center"
          style={{ filter: "brightness(0.22) saturate(1.4) contrast(1.08)" }}
        />

        {/* ── Sky-fade gradient — purple dusk over the top ── */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A0042]/95 via-[#0A0024]/65 to-[#010108]" />

        {/* ── Diagonal accent streak — soft pink crossing the frame ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(135deg, transparent 35%, rgba(247,37,133,0.10) 50%, transparent 65%)",
        }} />

        {/* ── Vignette — deeper, pulls focus to centre ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 78% 72% at 50% 52%, transparent 18%, rgba(1,1,8,0.85) 100%)",
        }} />

        {/* ── Top light beam — diffuse spotlight above the logo ── */}
        <div className="absolute -top-[180px] left-1/2 -translate-x-1/2 w-[900px] h-[760px] pointer-events-none" style={{
          background: "radial-gradient(ellipse at top, rgba(247,37,133,0.20) 0%, rgba(247,37,133,0.07) 30%, transparent 65%)",
          filter: "blur(20px)",
        }} />

        {/* ── Ambient orbs — 4 layers for depth ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-orb absolute -top-[280px] -left-[200px] w-[820px] h-[820px] rounded-full blur-[170px]"
            style={{ background: "rgba(70,0,150,0.22)", "--dur": "42s" } as React.CSSProperties} />
          <div className="hero-orb absolute -top-[140px] -right-[280px] w-[680px] h-[680px] rounded-full blur-[150px]"
            style={{ background: "rgba(247,37,133,0.12)", "--dur": "32s", animationDelay: "-8s" } as React.CSSProperties} />
          <div className="hero-orb absolute -bottom-[260px] left-1/2 -translate-x-1/2 w-[1200px] h-[700px] rounded-full blur-[200px]"
            style={{ background: "rgba(0,180,255,0.08)", "--dur": "55s", animationDelay: "-15s" } as React.CSSProperties} />
          <div className="hero-orb absolute bottom-[18%] -left-[120px] w-[420px] h-[420px] rounded-full blur-[140px]"
            style={{ background: "rgba(0,210,200,0.05)", "--dur": "48s", animationDelay: "-22s" } as React.CSSProperties} />

          {/* Grid texture — barely-there */}
          <div className="absolute inset-0 bg-grid opacity-[0.035]" />

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent" />
        </div>

        {/* ── Cold smoke at the bottom — slow drift ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[340px] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 blur-[60px]"
            style={{ background: "rgba(0,180,255,0.09)", animation: "ciDrift1 30s ease-in-out infinite", opacity: 0.7 }} />
          <div className="absolute inset-0 blur-[80px]"
            style={{ background: "rgba(247,37,133,0.07)", animation: "ciDrift2 38s ease-in-out infinite", opacity: 0.6 }} />
          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-[#010108] via-[#010108]/75 to-transparent" />
        </div>

        {/* ── Horizontal light streak behind the slogan ── */}
        <div className="absolute left-0 right-0 h-px pointer-events-none" style={{
          top: "52%",
          background: "linear-gradient(90deg, transparent 5%, rgba(247,37,133,0.45) 35%, rgba(0,180,255,0.30) 65%, transparent 95%)",
          opacity: 0.28,
        }} />

        {/* ══════════ CONTENT — 3 zones: top logo, centre slogan, bottom CTAs ══════════ */}
        <div className="relative z-10 flex-1 flex flex-col items-center text-center px-6 md:px-12 pt-[7svh] md:pt-[8svh] pb-[5svh] md:pb-[6svh]">

          {/* ─── TOP ZONE — Logo (atmospheric, smaller) + Eyebrow tagline ─── */}
          <div className="flex flex-col items-center gap-5 md:gap-7">

            {/* Logo */}
            <div className="relative animate-slide-in-up [animation-delay:0ms]">
              <div className="absolute inset-0 rounded-full bg-brand-gold/14 blur-[80px] scale-[2.4] animate-glow-breathe" />
              <Image
                src="/logo.png" alt="ReadyMiix" width={240} height={240} priority
                className="relative z-10 w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] md:w-[150px] md:h-[150px] lg:w-[170px] lg:h-[170px] object-contain"
                style={{ filter: "drop-shadow(0 0 50px rgba(247,37,133,0.55)) drop-shadow(0 0 20px rgba(247,37,133,0.30))" }}
              />
            </div>

            {/* Eyebrow tagline — frames the slogan, adds context */}
            <div className="animate-slide-in-up [animation-delay:120ms] flex items-center gap-3 opacity-90">
              <span className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-brand-gold/60" />
              <p className="text-[10px] md:text-[11px] font-black text-brand-gold uppercase tracking-[0.4em] whitespace-nowrap">
                ReadyMiix · Guyane 973
              </p>
              <span className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-brand-gold/60" />
            </div>
          </div>

          {/* ─── MIDDLE ZONE — Slogan DOMINANT (auto-centered via flex-1) ─── */}
          <div className="flex-1 flex items-center justify-center w-full">
            <h1 className="animate-slide-in-up [animation-delay:260ms] font-display uppercase leading-[0.85] tracking-tight">
              <span
                className="block text-[clamp(3.2rem,14vw,6.5rem)] md:text-[clamp(4.8rem,10vw,8.5rem)] lg:text-[clamp(6.5rem,11.5vw,12rem)] text-white mb-2 md:mb-4"
                style={{ textShadow: "0 0 80px rgba(255,255,255,0.15), 0 0 25px rgba(255,255,255,0.08)" }}
              >
                BIEN FRAIS
              </span>
              <span
                className="block text-[clamp(3.2rem,14vw,6.5rem)] md:text-[clamp(4.8rem,10vw,8.5rem)] lg:text-[clamp(6.5rem,11.5vw,12rem)] text-gold-gradient"
                style={{ filter: "drop-shadow(0 0 60px rgba(247,37,133,0.65)) drop-shadow(0 0 20px rgba(247,37,133,0.35))" }}
              >
                TOUJOURS PRÊT
              </span>
            </h1>
          </div>

          {/* ─── BOTTOM ZONE — CTAs with breathing room ─── */}
          <div className="w-full flex justify-center">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">

            {/* ── HARD portal ── */}
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

            {/* ── LIGHT portal ── */}
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

            {/* ── FROZEN CAIPI portal ── */}
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
          BRAND STORY
      ══════════════════════════════════════ */}
      <section className="py-12 md:py-14 lg:py-20">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=70&auto=format&fm=webp"
                  alt="ReadyMiix – Notre histoire"
                  fill
                  loading="lazy"
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
