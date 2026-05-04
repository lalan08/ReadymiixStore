"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, Truck, Snowflake, Wine, Lock, Sparkles } from "lucide-react";
import CocktailConfigurator from "@/components/store/CocktailConfigurator";

/* ─── Data ─────────────────────────────────────────────────── */

const INGREDIENTS_LIGHT = [
  { num: 1, icon: "🍾", label: "1 BOUTEILLE DE HENNESSY" },
  { num: 2, icon: "💧", label: "SIROP AU CHOIX" },
  { num: 3, icon: "🍬", label: "BONBONS & SURPRISES" },
  { num: 4, icon: "🥤", label: "1 GOBELET READYMIIX" },
  { num: 5, icon: "/", label: "1 PAILLE" },
];

const INGREDIENTS_HARD = [
  { num: 1, icon: "🍾", label: "2 BOUTEILLES DE HENNESSY" },
  { num: 2, icon: "💧", label: "SIROP AU CHOIX" },
  { num: 3, icon: "🍬", label: "BONBONS & SURPRISES" },
  { num: 4, icon: "🥤", label: "1 GOBELET READYMIIX" },
  { num: 5, icon: "/", label: "1 PAILLE" },
];

const FEATURES = [
  { Icon: Truck,     label: "LIVRAISON RAPIDE",    sub: "EN 24/48H",          color: "#F72585" },
  { Icon: Snowflake, label: "PRODUITS FRAIS",       sub: "QUALITÉ PREMIUM",    color: "#00D2C8" },
  { Icon: Wine,      label: "SAVEURS EXOTIQUES",    sub: "",                   color: "#F72585" },
  { Icon: Lock,      label: "PAIEMENT SÉCURISÉ",    sub: "100% SÉCURISÉ",      color: "#00D2C8" },
];

const INSPIRATIONS = [
  { name: "HENNY PASSION",  emoji: "🍊🥃", desc: "Hennessy + sirop Passion + Freez rouge",    type: "hard"  as const },
  { name: "HENNY GRENADE",  emoji: "🌹🥃", desc: "Hennessy + sirop Grenadine + Sprite",       type: "hard"  as const },
  { name: "LIGHT CURAÇAO",  emoji: "🌊🍬", desc: "Light + sirop Curaçao + bonbons surprises", type: "light" as const },
  { name: "FRAISE MENTHE",  emoji: "🍓🌿", desc: "Light + sirop Fraise + menthe fraîche",     type: "light" as const },
];

/* ─── Ingredient list row ───────────────────────────────────── */
function IngredientRow({ num, icon, label, accent }: { num: number; icon: string; label: string; accent: string }) {
  return (
    <div className="flex items-center gap-1 md:gap-3">
      <span className="font-display text-sm md:text-2xl leading-none shrink-0 w-3 md:w-auto" style={{ color: accent }}>{num}</span>
      <span className="text-xs md:text-lg shrink-0">{icon === "/" ? "🥤" : icon}</span>
      <span className="text-[7px] md:text-xs font-bold text-white uppercase tracking-wide leading-tight">{label}</span>
    </div>
  );
}

/* ─── Product card ──────────────────────────────────────────── */
function ProductCard({
  type, accent, title, doses, description, tagline, taglineIcon,
  ingredients, bottleImg, bottleImg2, candyImg,
  onCompose,
}: {
  type: "light" | "hard";
  accent: string;
  title: string;
  doses: string;
  description: string;
  tagline: string;
  taglineIcon: string;
  ingredients: typeof INGREDIENTS_LIGHT;
  bottleImg: string;
  bottleImg2?: string;
  candyImg: string;
  onCompose: () => void;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden relative"
      style={{
        background: "#0a0a14",
        border: `2px solid ${accent}`,
        boxShadow: `0 0 30px ${accent}40, inset 0 0 60px ${accent}08`,
      }}
    >
      {/* Header */}
      <div className="px-2 md:px-5 pt-3 md:pt-5 pb-2 md:pb-3">
        <h2 className="leading-none mb-1">
          <span className="font-display text-lg md:text-4xl text-white uppercase tracking-wider block">COCKTAIL</span>
          <span
            className="text-2xl md:text-4xl font-bold block"
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: accent,
              textShadow: `0 0 20px ${accent}80`,
            }}
          >
            {title}
          </span>
        </h2>

        <p className="text-[9px] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] mt-1 mb-0.5 md:mb-1" style={{ color: accent }}>
          — {doses} —
        </p>
        <p className="hidden md:block text-xs text-white/70 uppercase tracking-wide leading-relaxed">{description}</p>
      </div>

      {/* Ingredients list */}
      <div className="px-2 md:px-5 py-2 md:py-3 flex flex-col gap-1.5 md:gap-2.5 border-t border-white/5">
        {ingredients.map((ing) => (
          <IngredientRow key={ing.num} accent={accent} {...ing} />
        ))}
      </div>

      {/* Product images */}
      <div
        className="mx-1.5 md:mx-4 rounded-xl overflow-hidden flex items-end justify-center gap-1 md:gap-2 px-1.5 md:px-4 pt-2 md:pt-4 pb-1 md:pb-2"
        style={{ background: `linear-gradient(180deg, ${accent}08 0%, ${accent}18 100%)`, border: `1px solid ${accent}20` }}
      >
        {bottleImg2 && (
          <div className="relative w-9 h-14 md:w-20 md:h-28 shrink-0">
            <Image src={bottleImg2} alt="Hennessy" fill className="object-contain drop-shadow-lg" />
          </div>
        )}
        <div className="relative w-9 h-14 md:w-20 md:h-28 shrink-0">
          <Image src={bottleImg} alt="Hennessy" fill className="object-contain drop-shadow-lg" />
        </div>
        <div className="relative w-9 h-14 md:w-20 md:h-28 shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80"
            alt="Cup ReadyMiix"
            fill
            className="object-contain drop-shadow-lg"
          />
        </div>
        <div className="relative w-6 h-10 md:w-12 md:h-20 shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&q=80"
            alt="Sirop"
            fill
            className="object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Candy image */}
      <div className="mx-1.5 md:mx-4 mt-1.5 md:mt-2 rounded-xl overflow-hidden relative h-14 md:h-28">
        <Image
          src={candyImg}
          alt="Bonbons & surprises"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-1 md:bottom-2 left-2 md:left-3 right-2 md:right-3">
          <span className="text-[7px] md:text-xs text-white/60 uppercase tracking-wide">Bonbons inclus</span>
        </div>
      </div>

      {/* Tagline */}
      <div
        className="mx-1.5 md:mx-4 mt-1.5 md:mt-3 rounded-xl px-2 md:px-4 py-1.5 md:py-3 flex items-center gap-1.5 md:gap-3"
        style={{ border: `1px solid ${accent}40`, background: `${accent}10` }}
      >
        <span className="text-sm md:text-xl shrink-0">{taglineIcon}</span>
        <p className="text-[7px] md:text-xs font-bold uppercase tracking-wide leading-snug" style={{ color: accent }}>
          {tagline}
        </p>
      </div>

      {/* CTA */}
      <div className="px-1.5 md:px-4 pt-2 md:pt-3 pb-3 md:pb-5">
        <button
          onClick={onCompose}
          className="w-full flex items-center justify-center gap-1 md:gap-2 py-2.5 md:py-4 rounded-xl font-bold text-white uppercase tracking-wider text-[9px] md:text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: type === "hard"
              ? `linear-gradient(135deg, #C5006A, #F72585)`
              : `linear-gradient(135deg, #00A8A0, #00D2C8)`,
            boxShadow: `0 0 25px ${accent}50`,
          }}
        >
          <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">Composer mon cocktail</span>
          <span className="sm:hidden">Composer</span>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function ComposerPage() {
  const [cfg, setCfg] = useState<{ open: boolean; type: "light" | "hard" }>({
    open: false, type: "light",
  });

  return (
    <div className="min-h-screen bg-[#050510] pt-24 pb-20 overflow-x-hidden">
      <div className="container-custom">

        {/* ── Split product section ── */}
        <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-start mb-16">

          {/* Cocktail Light */}
          <ProductCard
            type="light"
            accent="#00D2C8"
            title="Light"
            doses="1 DOSE DE HENNESSY"
            description="LÉGER, ÉQUILIBRÉ, PARFAIT POUR CHILLER."
            taglineIcon="⚖️"
            tagline="1 DOSE, TON STYLE, TON COCKTAIL."
            ingredients={INGREDIENTS_LIGHT}
            bottleImg="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&q=80"
            candyImg="https://images.unsplash.com/photo-1582058091922-40a5dedc7a40?w=600&q=80"
            onCompose={() => setCfg({ open: true, type: "light" })}
          />

          {/* Logo centré (desktop only) */}
          <div className="hidden md:flex flex-col items-center justify-center gap-4 px-4 self-center">
            <Image src="/logo.png" alt="ReadyMiix" width={80} height={80} className="object-contain" />
            <div className="text-center">
              <p className="font-display text-xs text-white uppercase tracking-[0.2em]">ReadyMiix</p>
              <p className="text-[10px] text-brand-teal uppercase tracking-[0.15em]">Cocktails</p>
            </div>
          </div>

          {/* Cocktail Hard */}
          <ProductCard
            type="hard"
            accent="#F72585"
            title="Hard"
            doses="2 DOSES DE HENNESSY"
            description="PLUS INTENSE, PLUS PUISSANT. À TOI DE CRÉER UNE EXPÉRIENCE UNIQUE."
            taglineIcon="🔥"
            tagline="2 DOSES, TON STYLE, TON COCKTAIL."
            ingredients={INGREDIENTS_HARD}
            bottleImg="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&q=80"
            bottleImg2="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&q=80"
            candyImg="https://images.unsplash.com/photo-1582058091922-40a5dedc7a40?w=600&q=80"
            onCompose={() => setCfg({ open: true, type: "hard" })}
          />
        </div>

        {/* ── Bottom features bar ── */}
        <div
          className="rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden mb-16"
          style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {FEATURES.map(({ Icon, label, sub, color }) => (
            <div key={label} className="flex items-center gap-3 px-5 py-4 bg-[#0a0a18]">
              <Icon className="w-6 h-6 shrink-0" style={{ color }} />
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wide leading-tight">{label}</p>
                {sub && <p className="text-[10px] uppercase tracking-wide" style={{ color }}>{sub}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* ── Inspiration section ── */}
        <div>
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.25em] mb-2">— Idées du moment</p>
            <h2 className="font-display text-3xl md:text-4xl text-white uppercase tracking-wide mb-2">
              Inspiration du moment
            </h2>
            <p className="text-brand-muted text-sm">
              💡 Tu peux recréer ces cocktails ou inventer le tien
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {INSPIRATIONS.map((inspo) => (
              <button
                key={inspo.name}
                onClick={() => setCfg({ open: true, type: inspo.type })}
                className="group p-4 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all text-left active:scale-[0.97]"
              >
                <div className="text-3xl mb-3">{inspo.emoji}</div>
                <h3 className="font-display text-sm text-brand-gold uppercase tracking-wide mb-1 leading-tight">
                  {inspo.name}
                </h3>
                <p className="text-xs text-brand-muted leading-snug mb-3">{inspo.desc}</p>
                <div className="flex items-center gap-1 text-xs text-brand-gold/50 group-hover:text-brand-gold transition-colors font-semibold">
                  Essayer <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Configurator drawer */}
      <CocktailConfigurator
        isOpen={cfg.open}
        onClose={() => setCfg((c) => ({ ...c, open: false }))}
        type={cfg.type}
        basePrice={cfg.type === "light" ? 5 : 7}
      />
    </div>
  );
}
