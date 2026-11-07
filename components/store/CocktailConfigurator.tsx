"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";

const SIROPS_FALLBACK: DbSirop[] = [
  { id: "passion",   slug: "passion",   name: "Passion",   emoji: "🍊", color: "#F97316" },
  { id: "grenadine", slug: "grenadine", name: "Grenadine", emoji: "🌹", color: "#E11D48" },
  { id: "curacao",   slug: "curacao",   name: "Curaçao",   emoji: "🌊", color: "#3B82F6" },
  { id: "menthe",    slug: "menthe",    name: "Menthe",    emoji: "🌿", color: "#22C55E" },
  { id: "peche",     slug: "peche",     name: "Pêche",     emoji: "🍑", color: "#FBBF24" },
  { id: "fraise",    slug: "fraise",    name: "Fraise",    emoji: "🍓", color: "#F43F5E" },
  { id: "citron",    slug: "citron",    name: "Citron",    emoji: "🍋", color: "#EAB308" },
  { id: "coco",      slug: "coco",      name: "Coco",      emoji: "🥥", color: "#A3A3A3" },
];
const SOFTS_FALLBACK: DbSoft[] = [
  { id: "freez-rouge", slug: "freez-rouge", name: "Freez Rouge",       emoji: "🔴", surcharge: 1.5 },
  { id: "sprite",      slug: "sprite",      name: "Sprite",            emoji: "🍋", surcharge: 1.5 },
  { id: "cola",        slug: "cola",        name: "Cola",              emoji: "🥤", surcharge: 1.5 },
  { id: "schweppes",   slug: "schweppes",   name: "Schweppes Agrumes", emoji: "🍊", surcharge: 1.5 },
];

interface DbSirop { id: string; name: string; slug: string; emoji: string; color: string; }
interface DbSoft  { id: string; name: string; slug: string; emoji: string; image?: string | null; surcharge: number; }

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "light" | "hard";
  basePrice: number;
}

export default function CocktailConfigurator({ isOpen, onClose, type, basePrice }: Props) {
  const [step, setStep]     = useState(1);
  const [sirop, setSirop]   = useState("");
  const [soft, setSoft]     = useState("none"); // "none" = sans soft
  const { addItem, openCart } = useCartStore();

  const [sirops, setSirops] = useState<DbSirop[]>([]);
  const [softs, setSofts]   = useState<DbSoft[]>([]);

  useEffect(() => {
    fetch("/api/sirops")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setSirops(d?.length ? d : SIROPS_FALLBACK))
      .catch(() => setSirops(SIROPS_FALLBACK));

    fetch("/api/softs")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setSofts(d?.length ? d : SOFTS_FALLBACK))
      .catch(() => setSofts(SOFTS_FALLBACK));
  }, []);

  const selectedSirop = sirops.find((s) => s.slug === sirop || s.id === sirop);
  const selectedSoft  = softs.find((s) => s.slug === soft || s.id === soft);
  const softPrice     = selectedSoft ? selectedSoft.surcharge : 0;
  const totalPrice    = basePrice + softPrice;
  const accentColor   = type === "hard" ? "#F72585" : "#00D2C8";

  function reset() { setStep(1); setSirop(""); setSoft("none"); }
  function handleClose() { onClose(); setTimeout(reset, 350); }

  function handleAddToCart() {
    const siropLabel = selectedSirop?.name ?? sirop;
    const softLabel  = selectedSoft?.name ?? null;
    const name       = `Cocktail ${type === "light" ? "Light" : "Hard"} – ${siropLabel}${softLabel ? ` + ${softLabel}` : ""}`;
    addItem({
      id:      `${type}-${sirop}-${soft}`,
      name,
      slug:    type === "light" ? "readymiix-light" : "readymiix-hard",
      price:   totalPrice,
      image:   type === "light"
        ? "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&q=80"
        : "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80",
      volume:  "Cup 50cl",
      options: { sirop, soft: soft !== "none" ? soft : undefined },
    });
    toast.success(`${name} ajouté !`);
    handleClose();
    openCart();
  }

  if (!isOpen) return null;

  const STEPS = [
    { n: 1, label: "Parfum" },
    { n: 2, label: "Soft"   },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="fixed bottom-0 left-0 right-0 z-[90] max-h-[92vh] flex flex-col rounded-t-3xl overflow-hidden animate-slide-up"
        style={{ background: "#0e0e1c", borderTop: `2px solid ${accentColor}40` }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: accentColor + "40" }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-0.5" style={{ color: accentColor }}>
              Cocktail {type === "light" ? "Light" : "Hard"}
            </p>
            <h2 className="font-display text-xl text-white uppercase tracking-wide">
              {step === 1 ? "Choisis ton parfum" : "Ajoute un soft"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-3 py-3 shrink-0">
          {STEPS.map(({ n, label }) => (
            <div key={n} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300"
                  style={{
                    background: step === n ? accentColor : step > n ? accentColor + "30" : "rgba(255,255,255,0.06)",
                    color: step === n ? "#fff" : step > n ? accentColor : "rgba(255,255,255,0.3)",
                  }}
                >
                  {step > n ? <Check className="w-3 h-3" /> : n}
                </div>
                <span
                  className="text-[10px] uppercase tracking-wide font-bold"
                  style={{ color: step === n ? accentColor : "rgba(255,255,255,0.3)" }}
                >
                  {label}
                </span>
              </div>
              {n < 2 && (
                <div className="w-8 h-px" style={{ background: step > n ? accentColor + "40" : "rgba(255,255,255,0.08)" }} />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 pb-2">

          {/* STEP 1 — Parfum */}
          {step === 1 && (
            <div className="animate-fade-in">
              <p className="text-xs text-white/40 mb-4">Un seul parfum — celui qui te correspond.</p>
              <div className="grid grid-cols-2 gap-3">
                {sirops.map((s) => {
                  const key      = s.slug ?? s.id;
                  const selected = sirop === key;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSirop(key)}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left active:scale-[0.97]"
                      style={{
                        background:  selected ? hexToRgba(s.color, 0.12) : "rgba(255,255,255,0.03)",
                        borderColor: selected ? s.color : "rgba(255,255,255,0.07)",
                        boxShadow:   selected ? `0 0 18px ${s.color}30` : "none",
                      }}
                    >
                      <span className="text-2xl shrink-0">{s.emoji}</span>
                      <span className="text-sm font-semibold text-white leading-tight">{s.name}</span>
                      {selected && (
                        <Check className="w-4 h-4 ml-auto shrink-0" style={{ color: s.color }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2 — Soft (optionnel) */}
          {step === 2 && (
            <div className="animate-fade-in">
              <p className="text-xs text-white/40 mb-4">Optionnel — passe directement au panier si tu n&apos;en veux pas.</p>
              <div className="grid grid-cols-2 gap-3">
                {/* Sans soft */}
                <button
                  onClick={() => setSoft("none")}
                  className="flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left active:scale-[0.97]"
                  style={{
                    background:  soft === "none" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)",
                    borderColor: soft === "none" ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.07)",
                  }}
                >
                  <span className="text-2xl shrink-0">✨</span>
                  <span className="text-sm font-semibold text-white leading-tight">Sans soft</span>
                  {soft === "none" && <Check className="w-4 h-4 ml-auto shrink-0 text-white/60" />}
                </button>

                {softs.map((s) => {
                  const key      = s.slug ?? s.id;
                  const selected = soft === key;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSoft(key)}
                      className="flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left active:scale-[0.97]"
                      style={{
                        background:  selected ? hexToRgba(accentColor, 0.10) : "rgba(255,255,255,0.03)",
                        borderColor: selected ? accentColor : "rgba(255,255,255,0.07)",
                        boxShadow:   selected ? `0 0 18px ${accentColor}25` : "none",
                      }}
                    >
                      {s.image ? (
                        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 bg-white/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-2xl shrink-0 w-9 h-9 flex items-center justify-center">{s.emoji}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white leading-tight truncate">{s.name}</p>
                        <p className="text-[10px] text-white/40">+{s.surcharge.toFixed(2).replace(".", ",")}€</p>
                      </div>
                      {selected && (
                        <Check className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#09090f" }}>
          {/* Summary */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-white/40 flex items-center gap-1.5 flex-wrap">
              {selectedSirop && (
                <span className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5">
                  {selectedSirop.emoji} {selectedSirop.name}
                </span>
              )}
              {selectedSoft && (
                <span className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-0.5">
                  {selectedSoft.emoji} {selectedSoft.name}
                </span>
              )}
            </div>
            <span className="font-display text-2xl" style={{ color: accentColor }}>
              {totalPrice.toFixed(2).replace(".", ",")}€
            </span>
          </div>

          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1 px-4 py-3.5 rounded-xl text-white/40 hover:text-white text-sm font-medium transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                disabled={sirop === ""}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all"
                style={{
                  background: sirop === "" ? "rgba(255,255,255,0.05)" : `linear-gradient(135deg, ${accentColor}cc, ${accentColor})`,
                  color: sirop === "" ? "rgba(255,255,255,0.2)" : "#fff",
                  boxShadow: sirop !== "" ? `0 0 20px ${accentColor}40` : "none",
                  cursor: sirop === "" ? "not-allowed" : "pointer",
                }}
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}cc, ${accentColor})`,
                  color: "#fff",
                  boxShadow: `0 0 20px ${accentColor}40`,
                }}
              >
                <ShoppingCart className="w-4 h-4" /> Ajouter au panier
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
