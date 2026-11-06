"use client";

import { useState } from "react";
import { ChevronLeft, Check, MessageCircle, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { getCaipiPrice, CAIPI_SIZES, CAIPI_PREPARATIONS, CAIPI_SUPPLEMENTS } from "@/lib/caipiPricing";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP ?? "594694369615";
const BG   = "#010C14";
const PINK = "#F72585";

interface Flavor {
  id: string;
  name: string;
  category: string;
  emoji: string;
  desc: string;
  color: string;
}

const FLAVORS: Flavor[] = [
  { id: "citron-vert", name: "Citron vert", category: "classique", emoji: "🍋", desc: "Acidulé & glacé",      color: "#a8e063" },
  { id: "mangue",      name: "Mangue",      category: "fruitee",   emoji: "🥭", desc: "Doux & estival",        color: "#FFB347" },
  { id: "fraise",      name: "Fraise",      category: "fruitee",   emoji: "🍓", desc: "Fruité & sucré",        color: "#FF6B6B" },
  { id: "passion",     name: "Passion",     category: "fruitee",   emoji: "🍊", desc: "Exotique & tropical",   color: "#FF8C42" },
];

const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 19; h <= 23; h++) {
    slots.push(`${h}h00`);
    if (h < 23) slots.push(`${h}h30`);
  }
  return slots;
})();

const TOAST_STYLE = { style: { background: "#050D16", color: "#E0F8FF", border: "1px solid rgba(0,200,255,0.2)" } };

export default function FrozenCaipiPage() {
  const [step, setStep]           = useState<0 | 1 | 2>(0);
  const [flavorId, setFlavorId]   = useState<string | null>(null);
  const [sizeId, setSizeId]       = useState<string | null>(null);
  const [prepId, setPrepId]       = useState<string | null>(null);
  const [supplements, setSupplements] = useState<string[]>([]);
  const [prenom, setPrenom]       = useState("");
  const [telephone, setTelephone] = useState("");
  const [heure, setHeure]         = useState("");
  const { addItem } = useCartStore();

  const flavor = FLAVORS.find(f => f.id === flavorId) ?? null;
  const categoryLabel = flavor?.category === "classique" ? "CLASSIQUE" : "FRUITÉE";
  const basePrice = flavor && sizeId ? getCaipiPrice(flavor.category, sizeId) : null;
  const suppTotal = supplements.reduce(
    (sum, s) => sum + (CAIPI_SUPPLEMENTS.find(x => x.id === s)?.price ?? 0),
    0
  );
  const unitPrice = basePrice !== null ? basePrice + suppTotal : null;
  const isStep1Ready = !!flavorId && !!sizeId && !!prepId;

  function toggleSupp(id: string) {
    setSupplements(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
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
    const cartId = `caipi-${flavorId}-${sizeId}-${prepId}${suppsSorted.length ? "-" + suppsSorted.join("-") : ""}`;
    const suppLabels = suppsSorted.map(id => CAIPI_SUPPLEMENTS.find(s => s.id === id)!.label);

    addItem({
      id:       cartId,
      name:     `Frozen Caïpi ${flavor.name}`,
      slug:     "frozen-caipi",
      price:    unitPrice!,
      image:    "",
      quantity: 1,
      options: {
        caipi: {
          parfum:       flavor.name,
          taille:       CAIPI_SIZES.find(s => s.id === sizeId)!.label,
          preparation:  CAIPI_PREPARATIONS.find(p => p.id === prepId)!.label,
          supplements:  suppLabels,
        },
      },
    });

    toast.success(`Frozen Caïpi ${flavor.name} ajoutée !`, { icon: "🧊", ...TOAST_STYLE });
    setStep(2);
  }

  function handleWhatsApp() {
    if (!prenom)    { toast.error("Entre ton prénom", TOAST_STYLE); return; }
    if (!telephone) { toast.error("Entre ton téléphone", TOAST_STYLE); return; }
    if (!heure)     { toast.error("Choisis une heure", TOAST_STYLE); return; }

    const sizeName  = CAIPI_SIZES.find(s => s.id === sizeId)?.label ?? "";
    const prepName  = CAIPI_PREPARATIONS.find(p => p.id === prepId)?.label ?? "";
    const suppNames = supplements
      .map(id => CAIPI_SUPPLEMENTS.find(s => s.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const lines = [
      "Bonjour ReadyMiix 🧊",
      "",
      "Je voudrais commander une Frozen Caïpi :",
      `- Parfum : ${flavor?.name}`,
      `- Taille : ${sizeName}`,
      `- Préparation : ${prepName}`,
      suppNames ? `- Suppléments : ${suppNames}` : null,
      `- Total : ${formatPrice(unitPrice ?? 0)}`,
      "",
      `Prénom : ${prenom}`,
      `Téléphone : ${telephone}`,
      `Heure souhaitée : ${heure}`,
      "",
      "Merci !",
    ].filter((l): l is string => l !== null);

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
  }

  /* ─────────────────────────────────────── */

  return (
    <div className="min-h-screen" style={{ background: BG, paddingBottom: step === 1 ? 120 : 40 }}>

      {/* BG glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[140px] opacity-10"
          style={{ background: "#00C8FF" }} />
        <div className="absolute top-60 -right-40 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.08]"
          style={{ background: PINK }} />
      </div>

      {/* ══════════════════════════════════════════
          STEP 0 — LANDING
      ══════════════════════════════════════════ */}
      {step === 0 && (
        <div className="relative px-5 pt-20 pb-10 max-w-lg mx-auto">

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
            Givrée, fruitée, préparée pour toi.
          </p>

          {/* Cup hero */}
          <div className="flex justify-center gap-3 mb-8">
            {(["#FF6B6B", "#FFB347", "#F72585"] as const).map((c, i) => (
              <div key={i}
                className="w-20 h-28 rounded-b-3xl rounded-t-lg flex items-end justify-center pb-2 text-2xl"
                style={{ background: `linear-gradient(160deg, ${c}80, ${c}25)`, border: `1px solid ${c}40` }}>
                🧊
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => setStep(1)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-display font-bold text-white text-base uppercase tracking-widest mb-3 active:scale-[0.98] transition-transform"
            style={{ background: `linear-gradient(135deg, #C5006A, ${PINK}, #FF5BA3)`, boxShadow: `0 0 40px rgba(247,37,133,0.4)` }}
          >
            Composer ma caïpi →
          </button>

          {/* Hours */}
          <div className="flex items-center justify-center gap-1.5 mb-10">
            <Clock className="w-3.5 h-3.5" style={{ color: "rgba(255,255,255,0.3)" }} />
            <span className="text-xs text-white/30">Mar–Dim · 19h–23h</span>
          </div>

          {/* Flavor cards */}
          <p className="text-white font-bold text-lg mb-4">Choisis ton parfum</p>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {FLAVORS.map(f => {
              const startPrice = getCaipiPrice(f.category, "500ml");
              return (
                <button
                  key={f.id}
                  onClick={() => handleSelectFlavor(f.id)}
                  className="relative flex items-center gap-3 p-3 rounded-2xl text-left active:scale-[0.97] transition-transform cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="w-12 h-14 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: `linear-gradient(160deg, ${f.color}60, ${f.color}20)`, border: `1px solid ${f.color}30` }}>
                    {f.emoji}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{f.name}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Dès {formatPrice(startPrice)}</p>
                  </div>
                </button>
              );
            })}
          </div>

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

      {/* ══════════════════════════════════════════
          STEP 1 — PERSONNALISER
      ══════════════════════════════════════════ */}
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
            <h2 className="font-display text-4xl text-white uppercase mb-1">
              {flavor ? flavor.name : "Personnaliser"}
            </h2>
            {flavor && <p className="text-sm text-white/40">{flavor.desc}</p>}
          </div>

          <div className="px-5 max-w-lg mx-auto flex flex-col gap-4">

            {/* Parfum */}
            <div className="flex flex-col gap-3 p-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-xs font-black uppercase tracking-widest text-white/50">Parfum</p>
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {FLAVORS.map(f => (
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
                    <span>{f.emoji} {f.name}</span>
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
                  const price  = flavor ? getCaipiPrice(flavor.category, s.id) : null;
                  const active = sizeId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSizeId(s.id)}
                      className="flex flex-col items-center gap-1 py-3 rounded-xl transition-all active:scale-95 cursor-pointer"
                      style={{
                        background: active ? PINK + "20" : "rgba(255,255,255,0.05)",
                        border:     `1px solid ${active ? PINK : "rgba(255,255,255,0.1)"}`,
                      }}
                    >
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
                Suppléments{" "}
                <span className="text-white/25 normal-case font-normal">(optionnel)</span>
              </p>
              <div className="flex flex-col gap-4">
                {CAIPI_SUPPLEMENTS.map(s => {
                  const active = supplements.includes(s.id);
                  return (
                    <div key={s.id} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-white font-semibold text-sm">{s.label}</p>
                        <p className="text-xs" style={{ color: PINK }}>+{formatPrice(s.price)}</p>
                      </div>
                      <button
                        onClick={() => toggleSupp(s.id)}
                        className="relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer"
                        style={{ background: active ? PINK : "rgba(255,255,255,0.12)" }}
                      >
                        <span
                          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform"
                          style={{ transform: `translateX(${active ? "22px" : "2px"})` }}
                        />
                      </button>
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

      {/* ══════════════════════════════════════════
          STEP 2 — RETRAIT
      ══════════════════════════════════════════ */}
      {step === 2 && (
        <div className="px-5 pt-20 pb-10 max-w-lg mx-auto">
          <button onClick={() => setStep(1)}
            className="flex items-center gap-1.5 text-sm font-semibold text-white/50 hover:text-white/80 mb-6 cursor-pointer">
            <ChevronLeft className="w-4 h-4" /> Retour
          </button>
          <h2 className="font-display text-3xl text-white uppercase mb-6">Ton retrait</h2>

          {/* Order summary */}
          <div className="flex items-center gap-4 p-4 rounded-2xl mb-6"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: flavor ? `linear-gradient(160deg, ${flavor.color}60, ${flavor.color}20)` : "rgba(255,255,255,0.05)" }}>
              {flavor?.emoji ?? "🧊"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">
                {flavor?.name} · {CAIPI_SIZES.find(s => s.id === sizeId)?.label}
              </p>
              <p className="text-white/40 text-xs">
                {CAIPI_PREPARATIONS.find(p => p.id === prepId)?.label}
                {supplements.length > 0 && ` · ${supplements.map(id => CAIPI_SUPPLEMENTS.find(s => s.id === id)?.label).join(", ")}`}
              </p>
            </div>
            <p className="font-bold text-lg shrink-0" style={{ color: PINK }}>
              {formatPrice(unitPrice ?? 0)}
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Prénom</label>
              <input
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                placeholder="Ex. : Lucas"
                className="w-full px-4 py-3.5 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Téléphone</label>
              <input
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                placeholder="Ex. : 0694 36 96 15"
                type="tel"
                className="w-full px-4 py-3.5 rounded-xl text-white text-sm placeholder-white/20 focus:outline-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-white/50 mb-2">Heure souhaitée</label>
              <select
                value={heure}
                onChange={e => setHeure(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none appearance-none"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border:     "1px solid rgba(255,255,255,0.1)",
                  color:      heure ? "#fff" : "rgba(255,255,255,0.3)",
                }}
              >
                <option value="" disabled style={{ color: "#666", background: "#050D16" }}>
                  Choisir une heure
                </option>
                {TIME_SLOTS.map(t => (
                  <option key={t} value={t} style={{ background: "#050D16" }}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 p-4 rounded-2xl mb-6"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#00C8FF" }} />
            <div>
              <p className="text-white font-semibold text-sm">Retrait à Matoury</p>
              <p className="text-white/40 text-xs">Prévoir au moins 15 min. Heure à confirmer.</p>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-white font-bold text-lg">Total</p>
            <p className="font-display text-2xl font-bold" style={{ color: PINK }}>
              {formatPrice(unitPrice ?? 0)}
            </p>
          </div>

          {/* WhatsApp CTA */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-sm uppercase tracking-widest active:scale-[0.98] transition-transform mb-4 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #128C7E, #25D366)", boxShadow: "0 0 30px rgba(37,211,102,0.3)" }}
          >
            <MessageCircle className="w-5 h-5" />
            Continuer sur WhatsApp
          </button>

          <p className="text-center text-white/25 text-xs leading-relaxed">
            Ta commande est enregistrée sur le site.<br />
            Envoie ensuite le message WhatsApp pour confirmation.
          </p>
        </div>
      )}
    </div>
  );
}
