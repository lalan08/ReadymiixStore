"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, Check, MessageCircle, Clock, MapPin, AlertCircle, Ban } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { CAIPI_SIZES, CAIPI_PREPARATIONS } from "@/lib/caipiPricing";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP ?? "594694369615";
const BG   = "#010C14";
const PINK = "#F72585";

interface CaipiConfig {
  ordering_open: boolean;
  disabled_flavors: string[];
  supplement_bonbons_enabled: boolean;
  supplement_bonbons_price: number;
  supplement_sirop_enabled: boolean;
  supplement_sirop_price: number;
  price_classique_500ml: number;
  price_classique_700ml: number;
  price_classique_1litre: number;
  price_fruitee_500ml: number;
  price_fruitee_700ml: number;
  price_fruitee_1litre: number;
}

const DEFAULT_CONFIG: CaipiConfig = {
  ordering_open: true,
  disabled_flavors: [],
  supplement_bonbons_enabled: true,
  supplement_bonbons_price: 1,
  supplement_sirop_enabled: true,
  supplement_sirop_price: 2,
  price_classique_500ml: 10,
  price_classique_700ml: 12,
  price_classique_1litre: 18,
  price_fruitee_500ml: 12,
  price_fruitee_700ml: 14,
  price_fruitee_1litre: 20,
};

interface Flavor {
  id: string;
  name: string;
  sub?: string;
  category: string;
  emoji: string;
  color: string;
}

const FLAVORS: Flavor[] = [
  /* ── Classique ── */
  { id: "citron-vert",   name: "Caïpi Classique", sub: "Citron Vert",  category: "classique", emoji: "🍋", color: "#a8e063" },
  /* ── Fruité ── */
  { id: "fraise",        name: "Fraise",          category: "fruitee", emoji: "🍓", color: "#FF4444" },
  { id: "peche",         name: "Pêche",           category: "fruitee", emoji: "🍑", color: "#FFAA55" },
  { id: "mangue",        name: "Mangue",          category: "fruitee", emoji: "🥭", color: "#FFB347" },
  { id: "maracudja",     name: "Maracudja",       category: "fruitee", emoji: "🍊", color: "#E84393" },
  { id: "ananas",        name: "Ananas",          category: "fruitee", emoji: "🍍", color: "#FFD700" },
  { id: "fruits-rouges", name: "Fruits Rouges",   category: "fruitee", emoji: "🫐", color: "#CC2244" },
  { id: "coco",          name: "Coco",            category: "fruitee", emoji: "🥥", color: "#D4C8AA" },
  { id: "kiwi",          name: "Kiwi",            category: "fruitee", emoji: "🥝", color: "#5FA000" },
  { id: "framboise",     name: "Framboise",       category: "fruitee", emoji: "🍇", color: "#FF3366" },
  { id: "cerise",        name: "Cerise",          category: "fruitee", emoji: "🍒", color: "#990022" },
  { id: "myrtille",      name: "Myrtille",        category: "fruitee", emoji: "🫐", color: "#6B21A8" },
  { id: "pomme-verte",   name: "Pomme Verte",     category: "fruitee", emoji: "🍏", color: "#3A9500" },
  { id: "litchi",        name: "Litchi",          category: "fruitee", emoji: "🍈", color: "#FFB0C8" },
  { id: "banane",        name: "Banane",          category: "fruitee", emoji: "🍌", color: "#FFE066" },
  { id: "poire",         name: "Poire",           category: "fruitee", emoji: "🍐", color: "#CCDD55" },
];

const ALL_CLASSIQUE_FLAVORS = FLAVORS.filter(f => f.category === "classique");
const ALL_FRUITEE_FLAVORS   = FLAVORS.filter(f => f.category === "fruitee");
const ALL_SIROP_FLAVORS     = FLAVORS.filter(f => f.category !== "classique");

const TOAST_STYLE = { style: { background: "#050D16", color: "#E0F8FF", border: "1px solid rgba(0,200,255,0.2)" } };

function getCaipiPriceFromConfig(config: CaipiConfig, category: string, sizeId: string): number {
  const key = `price_${category === "classique" ? "classique" : "fruitee"}_${sizeId}` as keyof CaipiConfig;
  return (config[key] as number) ?? 0;
}

export default function FrozenCaipiPage() {
  const [config, setConfig]       = useState<CaipiConfig>(DEFAULT_CONFIG);
  const [step, setStep]           = useState<0 | 1>(0);
  const [flavorId, setFlavorId]   = useState<string | null>(null);
  const [sizeId, setSizeId]       = useState<string | null>(null);
  const [prepId, setPrepId]       = useState<string | null>(null);
  const [supplements, setSupplements] = useState<string[]>([]);
  const [siropFlavorId, setSiropFlavorId] = useState<string | null>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetch("/api/caipi-config")
      .then(r => r.json())
      .then(setConfig)
      .catch(() => {});
  }, []);

  // Filter flavors based on config
  const CLASSIQUE_FLAVORS = ALL_CLASSIQUE_FLAVORS.filter(f => !config.disabled_flavors.includes(f.id));
  const FRUITEE_FLAVORS   = ALL_FRUITEE_FLAVORS.filter(f => !config.disabled_flavors.includes(f.id));
  const SIROP_FLAVORS     = ALL_SIROP_FLAVORS.filter(f => !config.disabled_flavors.includes(f.id));
  const ACTIVE_FLAVORS    = FLAVORS.filter(f => !config.disabled_flavors.includes(f.id));

  const supplements_list = [
    ...(config.supplement_bonbons_enabled ? [{ id: "bonbons", label: "Bonbons", price: config.supplement_bonbons_price }] : []),
    ...(config.supplement_sirop_enabled   ? [{ id: "sirop",   label: "Sirop fruité", price: config.supplement_sirop_price }] : []),
  ];

  const flavor = FLAVORS.find(f => f.id === flavorId) ?? null;
  const categoryLabel = flavor?.category === "classique" ? "CLASSIQUE" : "FRUITÉ";
  const basePrice = flavor && sizeId ? getCaipiPriceFromConfig(config, flavor.category, sizeId) : null;
  const suppTotal = supplements.reduce(
    (sum, s) => sum + (supplements_list.find(x => x.id === s)?.price ?? 0),
    0
  );
  const unitPrice = basePrice !== null ? basePrice + suppTotal : null;
  const isStep1Ready = !!flavorId && !!sizeId && !!prepId;

  function toggleSupp(id: string) {
    setSupplements(prev => {
      if (prev.includes(id)) {
        if (id === "sirop") setSiropFlavorId(null);
        return prev.filter(x => x !== id);
      }
      return [...prev, id];
    });
  }

  function getSuppLabel(id: string): string {
    if (id === "sirop" && siropFlavorId) {
      const sf = FLAVORS.find(f => f.id === siropFlavorId);
      return sf ? `Sirop ${sf.name}` : "Sirop";
    }
    return supplements_list.find(s => s.id === id)?.label ?? id;
  }

  function handleSelectFlavor(id: string) {
    setFlavorId(id);
    setStep(1);
  }

  function handleNext() {
    if (!flavorId || !flavor) { toast.error("Choisis un parfum", TOAST_STYLE); return; }
    if (!sizeId)   { toast.error("Choisis une taille", TOAST_STYLE); return; }
    if (!prepId)   { toast.error("Choisis une préparation", TOAST_STYLE); return; }

    const suppsSorted = [...supplements].sort();
    const siropSuffix = suppsSorted.includes("sirop") && siropFlavorId ? `-${siropFlavorId}` : "";
    const cartId = `caipi-${flavorId}-${sizeId}-${prepId}${suppsSorted.length ? "-" + suppsSorted.join("-") : ""}${siropSuffix}`;
    const suppLabels = suppsSorted.map((id: string) => getSuppLabel(id));
    const flavorDisplay = flavor.sub ? `${flavor.name} ${flavor.sub}` : flavor.name;

    addItem({
      id:       cartId,
      name:     `Frozen Caïpi ${flavorDisplay}`,
      slug:     "frozen-caipi",
      price:    unitPrice!,
      image:    "",
      quantity: 1,
      options: {
        caipi: {
          parfum:      flavorDisplay,
          taille:      CAIPI_SIZES.find(s => s.id === sizeId)!.label,
          preparation: CAIPI_PREPARATIONS.find(p => p.id === prepId)!.label,
          supplements: suppLabels,
        },
      },
    });

    toast.custom(
      (t) => (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg transition-all ${t.visible ? "opacity-100" : "opacity-0"}`}
          style={{ background: "#050D16", border: "1px solid rgba(0,200,255,0.2)", color: "#E0F8FF", maxWidth: "320px" }}
        >
          <span className="text-lg">🧊</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Ajouté au panier !</p>
            <p className="text-xs" style={{ color: "rgba(0,210,200,0.8)" }}>{flavorDisplay}</p>
          </div>
          <a
            href="/cart"
            className="text-xs font-bold shrink-0 px-2.5 py-1 rounded-lg"
            style={{ background: "rgba(247,37,133,0.15)", color: "#F72585" }}
            onClick={() => toast.dismiss(t.id)}
          >
            Voir →
          </a>
        </div>
      ),
      { duration: 3500 },
    );
    setStep(0);
  }

  /* ─────── shared flavor card (used on landing) ─────── */
  function FlavorCard({ f }: { f: Flavor }) {
    const startPrice = getCaipiPriceFromConfig(config, f.category, "500ml");
    return (
      <button
        onClick={() => handleSelectFlavor(f.id)}
        className="relative flex items-center gap-3 p-3 rounded-2xl text-left active:scale-[0.97] transition-transform cursor-pointer w-full"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="w-12 h-14 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: `linear-gradient(160deg, ${f.color}60, ${f.color}20)`, border: `1px solid ${f.color}30` }}>
          {f.emoji}
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm leading-tight truncate">{f.name}</p>
          {f.sub && <p className="text-white/40 text-[10px] uppercase tracking-wider">{f.sub}</p>}
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            Dès {formatPrice(startPrice)}
          </p>
        </div>
      </button>
    );
  }

  /* ═══════════════════════════════════════════════════ */

  return (
    <div className="min-h-screen" style={{ background: BG, paddingBottom: step === 1 ? 120 : 40 }}>

      {/* BG glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-10"
          style={{ background: "#00C8FF" }} />
        <div className="absolute top-60 -right-40 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.08]"
          style={{ background: PINK }} />
      </div>

      {/* ══════════════ STEP 0 — LANDING ══════════════ */}
      {step === 0 && (
        <div className="relative px-5 pt-20 pb-10 max-w-lg mx-auto">

          {/* Closed banner */}
          {!config.ordering_open && (
            <div
              className="flex items-center gap-3 p-4 rounded-2xl mb-6"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <Ban className="w-5 h-5 shrink-0 text-red-400" />
              <div>
                <p className="font-bold text-red-300 text-sm">Commandes fermées pour le moment</p>
                <p className="text-xs text-white/40 mt-0.5">
                  Reviens plus tard ou contacte-nous sur WhatsApp.
                </p>
              </div>
            </div>
          )}

          {/* Click & Collect badge */}
          <div className="flex justify-center mb-6">
            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full"
              style={{ background: "rgba(247,37,133,0.1)", border: "1px solid rgba(247,37,133,0.3)", color: PINK }}>
              <MapPin className="w-3 h-3" />
              Click &amp; Collect · Matoury
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-center leading-none mb-3">
            <span className="block text-[52px] md:text-[64px] text-white tracking-tight">Ta caïpi.</span>
            <span className="block text-[52px] md:text-[64px] tracking-tight" style={{ color: PINK }}>
              À ton goût.
            </span>
          </h1>
          <p className="text-center text-xs text-white/40 mb-8">
            Givrée, fruitée, préparée pour toi. · 16 parfums disponibles
          </p>

          {/* Cup hero — photo bannière */}
          <div className="relative mb-5 mx-3 rounded-2xl overflow-hidden" style={{ height: "155px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/frozen-banner.png"
              alt="Frozen Caïpis — fraise, mangue, kiwi"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Fade bottom edge into page bg */}
            <div
              className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none"
              style={{ background: `linear-gradient(to bottom, transparent, ${BG})` }}
            />
          </div>

          {/* Choisis ton parfum */}
          <div className="mb-5 mx-3">
            <h2
              className="font-sans font-black text-white"
              style={{ fontSize: "clamp(1.1rem, 5vw, 1.4rem)", fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Choisis ton parfum
            </h2>
            <div className="mt-1.5 h-[2px] w-10 rounded-full" style={{ background: "linear-gradient(90deg, #F72585, rgba(247,37,133,0.2))" }} />
          </div>

          {/* Hours + WhatsApp */}
          <div className="flex flex-col items-center gap-1 mb-8">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
              <span className="text-xs text-white/30">Mar–Dim · 19h–23h</span>
            </div>
            <a
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold"
              style={{ color: "#25D366" }}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              0694 36 96 15
            </a>
          </div>

          {/* Important notice */}
          <div className="flex items-start gap-3 p-4 rounded-2xl mb-8"
            style={{ background: "rgba(247,37,133,0.07)", border: "1px solid rgba(247,37,133,0.2)" }}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: PINK }} />
            <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              <span className="font-bold text-white">Uniquement sur commande · Pas de surplace.</span>
              {" "}Prépare au minimum 15 min avant ton passage pour une fraîcheur optimale.
            </div>
          </div>

          {/* CLASSIQUE */}
          {CLASSIQUE_FLAVORS.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-black uppercase tracking-[0.25em]" style={{ color: "#a8e063cc" }}>
                  🍋 Classique
                </span>
                <span className="text-[10px] text-white/30">
                  {formatPrice(config.price_classique_500ml)} / {formatPrice(config.price_classique_700ml)} / {formatPrice(config.price_classique_1litre)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {CLASSIQUE_FLAVORS.map(f => <FlavorCard key={f.id} f={f} />)}
              </div>
            </div>
          )}

          {/* FRUITÉ */}
          {FRUITEE_FLAVORS.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-black uppercase tracking-[0.25em]" style={{ color: `${PINK}cc` }}>
                  🍓 Fruité
                </span>
                <span className="text-[10px] text-white/30">
                  {formatPrice(config.price_fruitee_500ml)} / {formatPrice(config.price_fruitee_700ml)} / {formatPrice(config.price_fruitee_1litre)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {FRUITEE_FLAVORS.map(f => <FlavorCard key={f.id} f={f} />)}
              </div>
            </div>
          )}

          {/* Boissons & extras */}
          <Link href="/shop"
            className="flex items-center justify-between p-4 rounded-2xl cursor-pointer"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-3">
              <span className="text-xl">🥤</span>
              <span className="text-white font-semibold text-sm">Boissons &amp; extras</span>
            </div>
            <span className="text-white/30 text-sm">→</span>
          </Link>
        </div>
      )}

      {/* ══════════════ STEP 1 — PERSONNALISER ══════════════ */}
      {step === 1 && (
        <div className="relative">
          <div className="px-5 pt-20 pb-4">
            <button onClick={() => setStep(0)}
              className="flex items-center gap-1.5 text-sm font-semibold text-white/50 hover:text-white/80 mb-6 cursor-pointer">
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
            <p className="text-xs font-black uppercase tracking-[0.3em] mb-1"
              style={{ color: flavor ? flavor.color + "cc" : "rgba(247,37,133,0.7)" }}>
              {flavor ? categoryLabel : "CHOISIS TON PARFUM"}
            </p>
            <h2 className="font-display text-4xl text-white uppercase mb-0.5">
              {flavor ? flavor.name : "Personnaliser"}
            </h2>
            {flavor?.sub && (
              <p className="text-sm text-white/50 uppercase tracking-widest">{flavor.sub}</p>
            )}
          </div>

          <div className="px-5 max-w-lg mx-auto flex flex-col gap-4">

            {/* Parfum */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-black uppercase tracking-widest text-white/50">Parfum</p>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {ACTIVE_FLAVORS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFlavorId(f.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 active:scale-95 cursor-pointer"
                    style={{
                      background:  flavorId === f.id ? PINK + "30" : "rgba(255,255,255,0.05)",
                      border:      `1px solid ${flavorId === f.id ? PINK : "rgba(255,255,255,0.1)"}`,
                      color:       flavorId === f.id ? PINK : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {flavorId === f.id && <Check className="w-3.5 h-3.5" />}
                    <span>{f.emoji} {f.sub ? `${f.name} ${f.sub}` : f.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Taille */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-black uppercase tracking-widest text-white/50">Taille</p>
              <div className="grid grid-cols-3 gap-2">
                {CAIPI_SIZES.map(s => {
                  const price  = flavor ? getCaipiPriceFromConfig(config, flavor.category, s.id) : null;
                  const active = sizeId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSizeId(s.id)}
                      className="flex flex-col items-center gap-1 py-3 rounded-xl transition-all active:scale-95 cursor-pointer relative"
                      style={{
                        background: active ? PINK + "20" : "rgba(255,255,255,0.05)",
                        border:     `1px solid ${active ? PINK : "rgba(255,255,255,0.1)"}`,
                      }}
                    >
                      {s.id === "1litre" && (
                        <span className="absolute -top-2 -right-1 text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full"
                          style={{ background: PINK, color: "#fff" }}>
                          NEW
                        </span>
                      )}
                      {active && <Check className="w-3.5 h-3.5" style={{ color: PINK }} />}
                      <span className="text-sm font-semibold text-white">{s.label}</span>
                      {price !== null && (
                        <span className="text-xs font-bold" style={{ color: PINK }}>
                          {formatPrice(price)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Préparation */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-black uppercase tracking-widest text-white/50">Préparation</p>
              <div className="grid grid-cols-2 gap-2">
                {CAIPI_PREPARATIONS.map(p => {
                  const active = prepId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPrepId(p.id)}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer"
                      style={{
                        background: active ? PINK : "rgba(255,255,255,0.05)",
                        border:     `1px solid ${active ? PINK : "rgba(255,255,255,0.1)"}`,
                        color:      active ? "#fff" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {active && <Check className="w-3.5 h-3.5" />}
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suppléments */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-black uppercase tracking-widest text-white/50">
                Toppings{" "}
                <span className="text-white/25 normal-case font-normal">(optionnel)</span>
              </p>
              <div className="flex flex-col gap-4">
                {supplements_list.map(s => {
                  const active = supplements.includes(s.id);
                  return (
                    <div key={s.id}>
                      {/* Full-row tap target */}
                      <button
                        onClick={() => toggleSupp(s.id)}
                        className="flex items-center justify-between gap-4 w-full cursor-pointer active:opacity-80 transition-opacity"
                      >
                        <div className="text-left">
                          <p className="text-white font-semibold text-sm">{s.label}</p>
                          <p className="text-xs" style={{ color: PINK }}>+{formatPrice(s.price)}</p>
                        </div>
                        {/* Toggle track: 44 × 26 px */}
                        <div
                          className="relative shrink-0 rounded-full"
                          style={{
                            width: "44px",
                            height: "26px",
                            background: active ? PINK : "rgba(255,255,255,0.14)",
                            transition: "background 0.2s",
                            flexShrink: 0,
                          }}
                        >
                          {/* Thumb: 20 × 20 px, 3 px from top, left or right */}
                          <span
                            className="absolute rounded-full bg-white"
                            style={{
                              width: "20px",
                              height: "20px",
                              top: "3px",
                              ...(active
                                ? { right: "3px", left: "auto" }
                                : { left: "3px", right: "auto" }),
                              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                              transition: "left 0.2s, right 0.2s",
                            }}
                          />
                        </div>
                      </button>

                      {/* Flavor picker — sirop only */}
                      {s.id === "sirop" && active && (
                        <div className="mt-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
                            Parfum du sirop
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {SIROP_FLAVORS.length > 0 ? SIROP_FLAVORS.map(f => {
                              const sel = siropFlavorId === f.id;
                              return (
                                <button
                                  key={f.id}
                                  onClick={() => setSiropFlavorId(f.id)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all active:scale-95"
                                  style={{
                                    background: sel ? `${f.color}40` : "rgba(255,255,255,0.05)",
                                    border:     `1px solid ${sel ? f.color : "rgba(255,255,255,0.1)"}`,
                                    color:      sel ? "#fff" : "rgba(255,255,255,0.5)",
                                  }}
                                >
                                  {f.emoji} {f.name}
                                </button>
                              );
                            }) : <span className="text-xs text-white/30">Aucun parfum disponible</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fixed bottom bar */}
          <div className="fixed bottom-16 left-0 right-0 z-40 px-5 py-3"
            style={{ background: "rgba(1,12,20,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="max-w-lg mx-auto flex items-center gap-4">
              <div className="shrink-0">
                <p className="text-white/40 text-[10px] uppercase tracking-wide">Total</p>
                <p className="font-display text-2xl font-bold leading-none"
                  style={{ color: unitPrice !== null ? PINK : "rgba(255,255,255,0.25)" }}>
                  {unitPrice !== null ? formatPrice(unitPrice) : "—"}
                </p>
              </div>
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm uppercase tracking-widest active:scale-[0.98] transition-transform cursor-pointer"
                style={{
                  background:  isStep1Ready ? `linear-gradient(135deg, #C5006A, ${PINK})` : "rgba(255,255,255,0.08)",
                  color:       isStep1Ready ? "#fff" : "rgba(255,255,255,0.3)",
                  boxShadow:   isStep1Ready ? "0 0 25px rgba(247,37,133,0.35)" : "none",
                }}
              >
                Ajouter au panier →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
