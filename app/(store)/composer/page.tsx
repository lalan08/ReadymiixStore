"use client";

import { useState } from "react";
import Image from "next/image";
import { Flame, Candy, Sparkles, ChevronRight } from "lucide-react";
import CocktailConfigurator from "@/components/store/CocktailConfigurator";

const PRODUCTS = [
  {
    type:        "light" as const,
    name:        "Cocktail Light",
    emoji:       "🍬",
    basePrice:   5,
    description: "🍹 Léger, élégant et parfaitement équilibré. Une touche de Hennessy pour un moment chill et raffiné.",
    image:       "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&q=80",
    accent:      "#00D2C8",
    tags:        ["Smooth", "Bonbons inclus", "Chill"],
    Icon:        Candy,
  },
  {
    type:        "hard" as const,
    name:        "Cocktail Hard",
    emoji:       "🔥",
    basePrice:   7,
    description: "🔥 Plus intense, plus puissant. Double dose de Hennessy pour une expérience forte et assumée.",
    image:       "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800&q=80",
    accent:      "#F72585",
    tags:        ["Strong", "Hennessy", "Premium"],
    Icon:        Flame,
  },
];

const INSPIRATIONS = [
  { name: "HENNY PASSION",  emoji: "🍊🥃", desc: "Hennessy + sirop Passion + Freez rouge",   type: "hard"  as const },
  { name: "HENNY GRENADE",  emoji: "🌹🥃", desc: "Hennessy + sirop Grenadine + Sprite",      type: "hard"  as const },
  { name: "LIGHT CURAÇAO",  emoji: "🌊🍬", desc: "Light + sirop Curaçao + bonbons surprises", type: "light" as const },
  { name: "FRAISE MENTHE",  emoji: "🍓🌿", desc: "Light + sirop Fraise + menthe fraîche",    type: "light" as const },
];

export default function ComposerPage() {
  const [cfg, setCfg] = useState<{ open: boolean; type: "light" | "hard" }>({
    open: false, type: "light",
  });

  return (
    <div className="min-h-screen bg-brand-darker pt-24 pb-20 overflow-x-hidden">
      <div className="container-custom">

        {/* ── Header ── */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-teal/40 bg-brand-teal/10 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
            <span className="text-xs font-bold text-brand-teal uppercase tracking-[0.2em]">
              Personnalise ton cup
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl text-white uppercase tracking-wide leading-none mb-4">
            Compose ton{" "}
            <span className="text-gold-gradient">cocktail</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-xl mx-auto">
            🎯 Choisis ton sirop, ton style, ton mood.
          </p>
        </div>

        {/* ── Product cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {PRODUCTS.map((product) => (
            <div
              key={product.type}
              className="group relative rounded-3xl overflow-hidden border transition-all duration-300"
              style={{ borderColor: `${product.accent}25` }}
            >
              {/* Image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/20 to-transparent" />

                {/* Emoji badge */}
                <div className="absolute top-4 left-4 text-4xl drop-shadow-lg">{product.emoji}</div>

                {/* Price */}
                <div className="absolute top-4 right-4 glass border border-white/10 px-3 py-1.5 rounded-full">
                  <span className="text-white font-bold text-sm">à partir de {product.basePrice}€</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-brand-card">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="font-display text-3xl text-white uppercase tracking-wide">
                    {product.name}
                  </h2>
                  <product.Icon className="w-6 h-6 shrink-0 mt-1" style={{ color: product.accent }} />
                </div>

                <p className="text-brand-muted text-sm leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full border font-medium"
                      style={{
                        background:  `${product.accent}12`,
                        borderColor: `${product.accent}35`,
                        color:        product.accent,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => setCfg({ open: true, type: product.type })}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white uppercase tracking-wide text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: product.type === "hard"
                      ? "linear-gradient(135deg, #C5006A, #F72585)"
                      : "linear-gradient(135deg, #00A8A0, #00D2C8)",
                    boxShadow: product.type === "hard"
                      ? "0 0 30px rgba(247,37,133,0.3)"
                      : "0 0 30px rgba(0,210,200,0.3)",
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  Composer mon cocktail
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Inspiration section ── */}
        <div className="mb-8">
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
