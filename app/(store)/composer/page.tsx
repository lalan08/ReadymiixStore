"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, Truck, Snowflake, Wine, Lock, Sparkles } from "lucide-react";
import CocktailConfigurator from "@/components/store/CocktailConfigurator";

/* ─── Data ─────────────────────────────────────────────────── */

const CARDS = [
  {
    type: "light" as const,
    accent: "#00D2C8",
    title: "Light",
    dose: "1 DOSE DE HENNESSY",
    taglineIcon: "⚖️",
    tagline: "LÉGER & ÉQUILIBRÉ",
    taglineSub: "PARFAIT POUR CHILLER.",
    // Remplacer par /images/light-kit.jpg quand la vraie photo est uploadée
    heroImg: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80",
    sideIcons: [
      { icon: "🍾", label: "1 DOSE\nDE HENNESSY" },
      { icon: "🍬", label: "BONBONS &\nSURPRISES" },
      { icon: "🥤", label: "GOBELET\nREADYMIIX" },
    ],
  },
  {
    type: "hard" as const,
    accent: "#F72585",
    title: "Hard",
    dose: "2 DOSES DE HENNESSY",
    taglineIcon: "🔥",
    tagline: "PLUS INTENSE & PUISSANT",
    taglineSub: "À TOI DE CRÉER L'EXPÉRIENCE.",
    // Remplacer par /images/hard-kit.jpg quand la vraie photo est uploadée
    heroImg: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&q=80",
    sideIcons: [
      { icon: "🍾", label: "2 DOSES\nDE HENNESSY" },
      { icon: "🍬", label: "BONBONS &\nSURPRISES" },
      { icon: "🥤", label: "GOBELET\nREADYMIIX" },
    ],
  },
];

const FEATURES = [
  { Icon: Truck,     label: "LIVRAISON RAPIDE", sub: "EN 24/48H",       color: "#F72585" },
  { Icon: Snowflake, label: "PRODUITS FRAIS",    sub: "QUALITÉ PREMIUM", color: "#00D2C8" },
  { Icon: Wine,      label: "SAVEURS EXOTIQUES", sub: "",                color: "#F72585" },
  { Icon: Lock,      label: "PAIEMENT SÉCURISÉ", sub: "100% SÉCURISÉ",   color: "#00D2C8" },
];

const INSPIRATIONS = [
  { name: "HENNY PASSION", emoji: "🍊🥃", desc: "Hennessy + sirop Passion + Freez rouge",    type: "hard"  as const },
  { name: "HENNY GRENADE", emoji: "🌹🥃", desc: "Hennessy + sirop Grenadine + Sprite",       type: "hard"  as const },
  { name: "LIGHT CURAÇAO", emoji: "🌊🍬", desc: "Light + sirop Curaçao + bonbons surprises", type: "light" as const },
  { name: "FRAISE MENTHE", emoji: "🍓🌿", desc: "Light + sirop Fraise + menthe fraîche",     type: "light" as const },
];

/* ─── Side icon item ────────────────────────────────────────── */
function SideIcon({ icon, label, accent }: { icon: string; label: string; accent: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <span className="text-2xl leading-none">{icon}</span>
      <span
        className="text-[9px] font-bold uppercase leading-tight whitespace-pre-line tracking-wide"
        style={{ color: accent }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Product card ──────────────────────────────────────────── */
function ProductCard({
  type, accent, title, dose, taglineIcon, tagline, taglineSub, heroImg, sideIcons, onCompose,
}: {
  type: "light" | "hard";
  accent: string;
  title: string;
  dose: string;
  taglineIcon: string;
  tagline: string;
  taglineSub: string;
  heroImg: string;
  sideIcons: { icon: string; label: string }[];
  onCompose: () => void;
}) {
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "#0a0a14",
        border: `2px solid ${accent}`,
        boxShadow: `0 0 32px ${accent}50, inset 0 0 60px ${accent}06`,
      }}
    >
      {/* ── Header ── */}
      <div className="px-3 md:px-5 pt-3 md:pt-5 pb-2 md:pb-3 text-center">
        <h2 className="leading-none">
          <span className="font-display text-xl md:text-4xl text-white uppercase tracking-wider">
            COCKTAIL{" "}
          </span>
          <span
            className="text-2xl md:text-4xl font-bold"
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: accent,
              textShadow: `0 0 24px ${accent}90`,
            }}
          >
            {title}
          </span>
        </h2>
        <p
          className="text-[9px] md:text-xs font-bold uppercase tracking-[0.18em] mt-1.5"
          style={{ color: accent }}
        >
          — {dose} —
        </p>
      </div>

      {/* ── Body: [icônes | photo | icônes] desktop / photo seule mobile ── */}
      <div className="px-2 md:px-4 pb-1">

        {/* Desktop: 3 colonnes */}
        <div className="hidden md:grid grid-cols-[1fr_2.2fr_1fr] gap-3 items-center">
          {/* Colonne gauche */}
          <div className="flex flex-col justify-around h-full gap-5 py-2">
            {sideIcons.map((item) => (
              <SideIcon key={item.label} accent={accent} {...item} />
            ))}
          </div>

          {/* Photo centrale */}
          <div
            className="relative rounded-xl overflow-hidden"
            style={{
              aspectRatio: "3/4",
              boxShadow: `0 0 20px ${accent}30`,
              border: `1px solid ${accent}30`,
            }}
          >
            <Image
              src={heroImg}
              alt={`Kit Cocktail ${title}`}
              fill
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(to top, ${accent}25 0%, transparent 55%)` }}
            />
          </div>

          {/* Colonne droite (miroir) */}
          <div className="flex flex-col justify-around h-full gap-5 py-2">
            {sideIcons.map((item) => (
              <SideIcon key={item.label + "-r"} accent={accent} {...item} />
            ))}
          </div>
        </div>

        {/* Mobile: photo pleine largeur */}
        <div
          className="md:hidden relative rounded-xl overflow-hidden"
          style={{
            aspectRatio: "3/4",
            border: `1px solid ${accent}30`,
          }}
        >
          <Image
            src={heroImg}
            alt={`Kit Cocktail ${title}`}
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(to top, ${accent}25 0%, transparent 55%)` }}
          />
        </div>
      </div>

      {/* ── Tagline bar ── */}
      <div
        className="mx-2 md:mx-4 mt-2 md:mt-3 rounded-xl px-3 md:px-5 py-2 md:py-3 flex items-center justify-center gap-2 md:gap-3"
        style={{ background: "rgba(0,0,0,0.55)", border: `1px solid ${accent}25` }}
      >
        <span className="text-base md:text-2xl shrink-0">{taglineIcon}</span>
        <div className="text-center md:text-left">
          <p
            className="text-[9px] md:text-xs font-bold uppercase tracking-wider leading-tight"
            style={{ color: accent }}
          >
            {tagline}
          </p>
          <p className="text-[8px] md:text-[10px] text-white/50 uppercase tracking-wide mt-0.5">
            {taglineSub}
          </p>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="px-2 md:px-4 pt-2 md:pt-3 pb-3 md:pb-5">
        <button
          onClick={onCompose}
          className="w-full flex items-center justify-center gap-1.5 md:gap-2 py-3 md:py-4 rounded-xl font-bold text-white uppercase tracking-wider text-[10px] md:text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background:
              type === "hard"
                ? "linear-gradient(135deg, #C5006A, #F72585)"
                : "linear-gradient(135deg, #00A8A0, #00D2C8)",
            boxShadow: `0 4px 28px ${accent}55`,
          }}
        >
          <Sparkles className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
          <span className="hidden sm:inline">COMPOSER MON COCKTAIL</span>
          <span className="sm:hidden">COMPOSER</span>
          <ChevronRight className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function ComposerPage() {
  const [cfg, setCfg] = useState<{ open: boolean; type: "light" | "hard" }>({
    open: false,
    type: "light",
  });

  return (
    <div className="min-h-screen bg-[#050510] pt-20 md:pt-24 pb-20 overflow-x-hidden">
      <div className="container-custom">

        {/* ── Grid principal ── */}
        <div className="grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-5 items-start mb-12 md:mb-16">

          {/* Carte Light */}
          <ProductCard
            {...CARDS[0]}
            onCompose={() => setCfg({ open: true, type: "light" })}
          />

          {/* Logo centré entre les deux cartes — desktop uniquement */}
          <div className="hidden md:flex flex-col items-center justify-start gap-3 px-3 pt-6">
            <Image src="/logo.png" alt="ReadyMiix" width={90} height={90} className="object-contain" />
            <div className="text-center">
              <p className="font-display text-sm text-white uppercase tracking-[0.2em] leading-tight">
                READYMIIX
              </p>
              <p className="text-[11px] uppercase tracking-[0.15em]" style={{ color: "#00D2C8" }}>
                COCKTAILS
              </p>
            </div>
          </div>

          {/* Carte Hard */}
          <ProductCard
            {...CARDS[1]}
            onCompose={() => setCfg({ open: true, type: "hard" })}
          />

        </div>

        {/* ── Barre features ── */}
        <div
          className="rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden mb-12 md:mb-16"
          style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {FEATURES.map(({ Icon, label, sub, color }) => (
            <div key={label} className="flex items-center gap-2 md:gap-3 px-3 md:px-5 py-4 bg-[#0a0a18]">
              <Icon className="w-5 h-5 md:w-6 md:h-6 shrink-0" style={{ color }} />
              <div>
                <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wide leading-tight">
                  {label}
                </p>
                {sub && (
                  <p className="text-[9px] md:text-[10px] uppercase tracking-wide" style={{ color }}>
                    {sub}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Section Inspirations ── */}
        <div>
          <div className="text-center mb-8">
            <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.25em] mb-2">
              — Idées du moment
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-white uppercase tracking-wide mb-2">
              Inspiration du moment
            </h2>
            <p className="text-brand-muted text-sm">
              💡 Recrée ces cocktails ou invente le tien
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

      {/* Configurateur */}
      <CocktailConfigurator
        isOpen={cfg.open}
        onClose={() => setCfg((c) => ({ ...c, open: false }))}
        type={cfg.type}
        basePrice={cfg.type === "light" ? 5 : 7}
      />
    </div>
  );
}
