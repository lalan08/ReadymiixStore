"use client";

import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown, Truck, Snowflake, Wine, Lock, Sparkles } from "lucide-react";
import CocktailConfigurator from "@/components/store/CocktailConfigurator";

const DEFAULT_LIGHT_IMG = "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80";
const DEFAULT_HARD_IMG  = "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&q=80";

/* ─── Data ─────────────────────────────────────────────────── */

const CARD_DEFAULTS = {
  light: {
    accent: "#00D2C8",
    title: "Light",
    base_price: 5,
    highlights: ["Léger & équilibré", "1 dose de Hennessy", "Surprises incluses 🍬"],
    detail: ["🍾 1 bouteille de Hennessy", "💧 Sirop au choix", "🍬 Bonbons & surprises", "🥤 1 gobelet ReadyMiix", "🥤 1 paille"],
  },
  hard: {
    accent: "#F72585",
    title: "Hard",
    base_price: 7,
    highlights: ["Plus intense 🔥", "2 doses de Hennessy", "Surprises incluses 🍬"],
    detail: ["🍾 2 bouteilles de Hennessy", "💧 Sirop au choix", "🍬 Bonbons & surprises", "🥤 1 gobelet ReadyMiix", "🥤 1 paille"],
  },
};

function parseList(raw: string | undefined, fallback: string[]): string[] {
  if (!raw) return fallback;
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : fallback; }
  catch { return fallback; }
}

const FEATURES = [
  { Icon: Truck,     label: "LIVRAISON RAPIDE", sub: "EN 24/48H",       color: "#F72585" },
  { Icon: Snowflake, label: "PRODUITS FRAIS",    sub: "QUALITÉ PREMIUM", color: "#00D2C8" },
  { Icon: Wine,      label: "SAVEURS EXOTIQUES", sub: "",                color: "#F72585" },
  { Icon: Lock,      label: "PAIEMENT SÉCURISÉ", sub: "100% SÉCURISÉ",   color: "#00D2C8" },
];

const INSPIRATIONS = [
  { name: "HENNY PASSION", emoji: "🍊🥃", desc: "Hard · parfum Passion + Freez rouge",    type: "hard"  as const },
  { name: "HENNY GRENADE", emoji: "🌹🥃", desc: "Hard · parfum Grenadine + Sprite",       type: "hard"  as const },
  { name: "LIGHT CURAÇAO", emoji: "🌊🍬", desc: "Light · parfum Curaçao + bonbons surprises", type: "light" as const },
  { name: "FRAISE MENTHE", emoji: "🍓🌿", desc: "Light · parfum Fraise + menthe fraîche",     type: "light" as const },
];

/* ─── Product card ──────────────────────────────────────────── */
function ProductCard({
  type, accent, title, highlights, detail, heroImg, onCompose,
}: {
  type: "light" | "hard";
  accent: string;
  title: string;
  highlights: readonly string[];
  detail: readonly string[];
  heroImg: string;
  onCompose: () => void;
}) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "#0a0a14",
        border: `2px solid ${accent}`,
        boxShadow: `0 0 30px ${accent}40`,
      }}
    >
      {/* Title */}
      <div className="px-3 md:px-5 pt-3 md:pt-5 pb-2 text-center">
        <span className="font-display text-base md:text-2xl text-white uppercase tracking-wider">COCKTAIL </span>
        <span
          className="text-xl md:text-3xl font-bold"
          style={{ fontFamily: "'Dancing Script', cursive", color: accent, textShadow: `0 0 20px ${accent}80` }}
        >
          {title}
        </span>
      </div>

      {/* Hero image */}
      <div
        className="relative mx-2 md:mx-4 overflow-hidden"
        style={{ aspectRatio: "4/3", borderRadius: 16, background: "#050510" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImg}
          alt={`Cocktail ${title}`}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "cover", objectPosition: "center", transform: "scale(0.92)" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to top, ${accent}30 0%, transparent 60%)` }}
        />
      </div>

      {/* 3 highlights */}
      <div className="px-3 md:px-5 pt-3 pb-2 flex flex-col gap-1.5 md:gap-2">
        {highlights.map((h) => (
          <div key={h} className="flex items-center gap-2">
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full shrink-0" style={{ background: accent }} />
            <span className="text-[10px] md:text-sm font-semibold text-white">{h}</span>
          </div>
        ))}
      </div>

      {/* Voir le détail toggle */}
      <div className="px-3 md:px-5 pb-2">
        <button
          onClick={() => setShowDetail((v) => !v)}
          className="flex items-center gap-1 text-[9px] md:text-xs font-semibold uppercase tracking-wide transition-opacity hover:opacity-80"
          style={{ color: accent }}
        >
          {showDetail ? "Masquer" : "Voir le détail"}
          <ChevronDown
            className="w-3 h-3 transition-transform duration-200"
            style={{ transform: showDetail ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </button>

        {showDetail && (
          <ul className="mt-2 flex flex-col gap-1 pl-1">
            {detail.map((item) => (
              <li key={item} className="text-[9px] md:text-xs text-white/60">{item}</li>
            ))}
          </ul>
        )}
      </div>

      {/* CTA */}
      <div className="px-2 md:px-4 pt-1 pb-3 md:pb-5 mt-auto">
        <button
          onClick={onCompose}
          className="w-full flex items-center justify-center gap-1 md:gap-2 py-3 md:py-4 rounded-xl font-bold text-white uppercase tracking-wider text-[10px] md:text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: type === "hard"
              ? "linear-gradient(135deg, #C5006A, #F72585)"
              : "linear-gradient(135deg, #00A8A0, #00D2C8)",
            boxShadow: `0 0 25px ${accent}50`,
          }}
        >
          <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
          Composer
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
  const [siteCfg, setSiteCfg] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.ok ? r.json() : {})
      .then((data: Record<string, string>) => setSiteCfg(data))
      .catch(() => {});
  }, []);

  const CARDS = [
    {
      type: "light" as const,
      accent:     siteCfg.light_accent    || CARD_DEFAULTS.light.accent,
      title:      siteCfg.light_title     || CARD_DEFAULTS.light.title,
      highlights: parseList(siteCfg.light_highlights, CARD_DEFAULTS.light.highlights),
      detail:     parseList(siteCfg.light_detail,     CARD_DEFAULTS.light.detail),
      heroImg:    siteCfg.light_card_image || DEFAULT_LIGHT_IMG,
    },
    {
      type: "hard" as const,
      accent:     siteCfg.hard_accent    || CARD_DEFAULTS.hard.accent,
      title:      siteCfg.hard_title     || CARD_DEFAULTS.hard.title,
      highlights: parseList(siteCfg.hard_highlights, CARD_DEFAULTS.hard.highlights),
      detail:     parseList(siteCfg.hard_detail,     CARD_DEFAULTS.hard.detail),
      heroImg:    siteCfg.hard_card_image || DEFAULT_HARD_IMG,
    },
  ];

  const lightPrice = parseFloat(siteCfg.light_base_price || "") || CARD_DEFAULTS.light.base_price;
  const hardPrice  = parseFloat(siteCfg.hard_base_price  || "") || CARD_DEFAULTS.hard.base_price;

  return (
    <div className="min-h-screen bg-[#050510] pt-24 pb-20 overflow-x-hidden">
      <div className="container-custom">

        {/* ── Hero heading ── */}
        <div className="text-center mb-8">
          <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.25em] mb-2">— ReadyMiix Cocktails</p>
          <h1 className="font-display text-3xl md:text-5xl text-white uppercase tracking-wide mb-2">
            Compose ton ReadyMiix 🍹
          </h1>
          <p className="text-sm text-white/50">Choisis ton style et ton parfum.</p>
        </div>

        {/* ── Split product section ── */}
        <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-6 items-start mb-16">

          <ProductCard
            {...CARDS[0]}
            onCompose={() => setCfg({ open: true, type: "light" })}
          />

          {/* Logo centré — entre les deux cartes sur desktop, invisible sur mobile */}
          <div className="hidden md:flex flex-col items-center justify-center gap-4 px-4 self-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="ReadyMiix" width={80} height={80} className="object-contain" />
            <div className="text-center">
              <p className="font-display text-xs text-white uppercase tracking-[0.2em]">ReadyMiix</p>
              <p className="text-[10px] text-brand-teal uppercase tracking-[0.15em]">Cocktails</p>
            </div>
          </div>

          <ProductCard
            {...CARDS[1]}
            onCompose={() => setCfg({ open: true, type: "hard" })}
          />

        </div>

        {/* ── Bottom features bar ── */}
        <div
          className="rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden mb-16"
          style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {FEATURES.map(({ Icon, label, sub, color }) => (
            <div key={label} className="flex items-center gap-3 px-4 py-4 bg-[#0a0a18]">
              <Icon className="w-5 h-5 md:w-6 md:h-6 shrink-0" style={{ color }} />
              <div>
                <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wide leading-tight">{label}</p>
                {sub && <p className="text-[9px] md:text-[10px] uppercase tracking-wide" style={{ color }}>{sub}</p>}
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
            <p className="text-brand-muted text-sm">💡 Recrée ces cocktails ou invente le tien</p>
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
        basePrice={cfg.type === "light" ? lightPrice : hardPrice}
      />
    </div>
  );
}
