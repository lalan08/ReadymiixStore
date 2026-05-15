"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Check, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";

const ACCENT  = "#00C8FF";
const ACCENT2 = "#00F0DC";
const BG      = "#010C14";

const FLAVORS = [
  { id: "citron-vert", name: "Citron Vert", emoji: "🍋", desc: "Le classique — acidulé & glacé" },
  { id: "passion",     name: "Passion",     emoji: "🍊", desc: "Exotique & tropical" },
  { id: "fraise",      name: "Fraise",      emoji: "🍓", desc: "Fruité & sucré" },
  { id: "mangue",      name: "Mangue",      emoji: "🥭", desc: "Doux & estival" },
];

const PRICE = 6.5;

const INCLUDES = [
  "🧊 Cachaça premium bien fraîche",
  "🍋 Parfum au choix",
  "🧊 Crushed ice & texture veloutée",
  "🥤 Gobelet ReadyMiix 50cl",
  "🥤 Paille bambou",
];

function hexToRgba(hex: string, a: number) {
  const h = hex.replace("#", "");
  return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`;
}

export default function FrozenCaipiPage() {
  const [flavor, setFlavor] = useState("");
  const [qty,    setQty]    = useState(1);
  const { addItem, openCart } = useCartStore();

  const selected = FLAVORS.find(f => f.id === flavor);

  function handleAdd() {
    if (!selected) return;
    addItem({
      id:       `frozen-caipi-${flavor}`,
      name:     `Frozen Caipi – ${selected.name}`,
      slug:     "frozen-caipi",
      price:    PRICE,
      image:    "",
      volume:   "Cup 50cl",
      quantity: qty,
      options:  { sirop: selected.name },
    });
    toast.success(`Frozen Caipi ${selected.name} ajouté ! 🧊`, {
      style: { background: "#050D16", color: "#E0F8FF", border: `1px solid ${hexToRgba(ACCENT, 0.3)}` },
    });
    openCart();
  }

  return (
    <div className="min-h-screen pb-32" style={{ background: BG }}>

      {/* ── Atmospheric background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-10"
          style={{ background: ACCENT }} />
        <div className="absolute top-60 -right-40 w-[400px] h-[400px] rounded-full blur-[120px] opacity-8"
          style={{ background: ACCENT2 }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] opacity-6"
          style={{ background: ACCENT }} />
      </div>

      {/* ── Back nav ── */}
      <div className="relative px-5 pt-20 pb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest transition-opacity hover:opacity-70"
          style={{ color: hexToRgba(ACCENT, 0.7) }}
        >
          <ChevronLeft className="w-4 h-4" /> Accueil
        </Link>
      </div>

      {/* ── Hero ── */}
      <div className="relative px-5 pt-6 pb-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] mb-3" style={{ color: hexToRgba(ACCENT, 0.6) }}>
          Frozen · Tropical · Premium
        </p>

        {/* Frost visual */}
        <div className="relative mx-auto mb-6 w-64 h-64 md:w-80 md:h-80">
          <div className="absolute inset-0 rounded-full blur-[60px] opacity-20" style={{ background: `radial-gradient(circle, ${ACCENT}, ${ACCENT2})` }} />
          <div className="absolute inset-4 rounded-full border opacity-15" style={{ borderColor: ACCENT }} />
          <div className="absolute inset-8 rounded-full border opacity-10" style={{ borderColor: ACCENT2 }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="font-display text-[80px] md:text-[100px] leading-none text-white uppercase tracking-tight drop-shadow-2xl"
                style={{ textShadow: `0 0 60px ${hexToRgba(ACCENT, 0.5)}` }}>
                🧊
              </div>
            </div>
          </div>
          {/* Frost particles */}
          {["top-6 left-8", "top-4 right-12", "bottom-8 left-4", "bottom-6 right-6", "top-1/2 right-2"].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-base opacity-30`} style={{ color: ACCENT2 }}>❄</div>
          ))}
        </div>

        <h1 className="font-display leading-none uppercase text-white mb-2">
          <span className="block text-[72px] md:text-[96px] tracking-tight"
            style={{ textShadow: `0 0 40px ${hexToRgba(ACCENT, 0.4)}` }}>
            FROZEN
          </span>
          <span className="block text-[56px] md:text-[72px] tracking-widest"
            style={{ color: ACCENT, textShadow: `0 0 30px ${hexToRgba(ACCENT, 0.6)}` }}>
            CAIPI
          </span>
        </h1>
        <p className="text-sm text-white/40 max-w-xs mx-auto leading-relaxed">
          La caipirinha revisitée — crushed ice, cachaça premium et parfums tropicaux.
        </p>
      </div>

      {/* ── Content ── */}
      <div className="relative px-5 max-w-lg mx-auto flex flex-col gap-6">

        {/* Flavor selector */}
        <div className="rounded-3xl p-5 border" style={{
          background: hexToRgba(ACCENT, 0.04),
          borderColor: hexToRgba(ACCENT, 0.12),
        }}>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4" style={{ color: hexToRgba(ACCENT, 0.7) }}>
            Choisis ton parfum
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {FLAVORS.map(f => {
              const active = flavor === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setFlavor(f.id)}
                  className="relative flex flex-col gap-1 p-4 rounded-2xl text-left transition-all active:scale-[0.97]"
                  style={{
                    background:  active ? hexToRgba(ACCENT, 0.12) : hexToRgba("#ffffff", 0.03),
                    border:      `2px solid ${active ? ACCENT : hexToRgba("#ffffff", 0.07)}`,
                    boxShadow:   active ? `0 0 20px ${hexToRgba(ACCENT, 0.2)}` : "none",
                  }}
                >
                  <span className="text-2xl">{f.emoji}</span>
                  <span className="text-sm font-bold text-white leading-tight">{f.name}</span>
                  <span className="text-[10px] text-white/40 leading-snug">{f.desc}</span>
                  {active && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: ACCENT }}>
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity + Price */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty(q => Math.max(1, q - 1))}
              className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors"
              style={{ background: hexToRgba(ACCENT, 0.06), borderColor: hexToRgba(ACCENT, 0.15) }}
            >
              <Minus className="w-4 h-4" style={{ color: ACCENT }} />
            </button>
            <span className="font-display text-2xl text-white w-6 text-center">{qty}</span>
            <button
              onClick={() => setQty(q => Math.min(10, q + 1))}
              className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors"
              style={{ background: hexToRgba(ACCENT, 0.06), borderColor: hexToRgba(ACCENT, 0.15) }}
            >
              <Plus className="w-4 h-4" style={{ color: ACCENT }} />
            </button>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/30 uppercase tracking-wide">Total</p>
            <p className="font-display text-3xl" style={{ color: ACCENT }}>
              {(PRICE * qty).toFixed(2).replace(".", ",")}€
            </p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleAdd}
          disabled={!flavor}
          className="flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98]"
          style={{
            background: flavor
              ? `linear-gradient(135deg, #0090C0, ${ACCENT}, ${ACCENT2})`
              : hexToRgba("#ffffff", 0.05),
            color:      flavor ? "#000" : "rgba(255,255,255,0.2)",
            boxShadow:  flavor ? `0 0 30px ${hexToRgba(ACCENT, 0.35)}` : "none",
            cursor:     flavor ? "pointer" : "not-allowed",
          }}
        >
          <ShoppingCart className="w-4 h-4" />
          {flavor ? "Ajouter au panier" : "Choisis un parfum"}
          {flavor && <ChevronRight className="w-4 h-4" />}
        </button>

        {/* What's included */}
        <div className="rounded-3xl p-5 border" style={{
          background: hexToRgba("#ffffff", 0.02),
          borderColor: hexToRgba("#ffffff", 0.06),
        }}>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-white/40">
            Ce qui est inclus
          </p>
          <ul className="flex flex-col gap-2">
            {INCLUDES.map(item => (
              <li key={item} className="flex items-center gap-2 text-xs text-white/55 leading-snug">
                <span className="shrink-0">{item.split(" ")[0]}</span>
                <span>{item.split(" ").slice(1).join(" ")}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
