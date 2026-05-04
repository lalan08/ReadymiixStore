"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, ChevronLeft, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

/* ─── Fallbacks (utilisés si la DB n'est pas encore initialisée) ── */
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
interface DbSoft  { id: string; name: string; slug: string; emoji: string; surcharge: number; }

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
  const [step, setStep]           = useState(1);
  const [sirop, setSirop]         = useState("");
  const [wantSoft, setWantSoft]   = useState<"non" | "oui" | "">("");
  const [soft, setSoft]           = useState("");
  const { addItem, openCart }     = useCartStore();

  const [sirops, setSirops]       = useState<DbSirop[]>([]);
  const [softs, setSofts]         = useState<DbSoft[]>([]);
  const [bonbonsText, setBonbonsText] = useState("Sélection variable selon le stock du jour — Haribo, Jitty Shocks, popping candy et bien d'autres surprises dans ton cup !");
  const [bonbonsItems, setBonbonsItems] = useState(["Haribo 🐻", "Jitty Shocks ⚡", "Popping Candy 🎆", "Surprise du jour 🎉"]);

  useEffect(() => {
    fetch("/api/sirops")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.length) setSirops(data); else setSirops(SIROPS_FALLBACK); })
      .catch(() => setSirops(SIROPS_FALLBACK));

    fetch("/api/softs")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data?.length) setSofts(data); else setSofts(SOFTS_FALLBACK); })
      .catch(() => setSofts(SOFTS_FALLBACK));

    fetch("/api/admin/config")
      .then((r) => r.ok ? r.json() : null)
      .then((cfg) => {
        if (!cfg) return;
        if (cfg.bonbons_text) setBonbonsText(cfg.bonbons_text);
        if (cfg.bonbons_items) {
          try { setBonbonsItems(JSON.parse(cfg.bonbons_items)); } catch { /* keep default */ }
        }
      })
      .catch(() => {/* keep defaults */});
  }, []);

  const selectedSirop = sirops.find((s) => s.id === s.slug ? s.slug === sirop : s.id === sirop) ?? sirops.find((s) => s.slug === sirop || s.id === sirop);
  const selectedSoft  = softs.find((s) => s.slug === soft || s.id === soft);
  const softPrice     = wantSoft === "oui" && selectedSoft ? selectedSoft.surcharge : 0;
  const totalPrice    = basePrice + softPrice;
  const isStep1Done   = sirop !== "";
  const isStep3Done   = wantSoft === "non" || (wantSoft === "oui" && soft !== "");
  const isComplete    = isStep1Done && isStep3Done;

  function reset() { setStep(1); setSirop(""); setWantSoft(""); setSoft(""); }
  function handleClose() { onClose(); setTimeout(reset, 350); }

  function handleAddToCart() {
    const siropLabel = selectedSirop?.name ?? sirop;
    const softLabel  = selectedSoft?.name ?? null;
    const name       = `Cocktail ${type === "light" ? "Light" : "Hard"} – ${siropLabel}${softLabel ? ` + ${softLabel}` : ""}`;
    const cartId     = `${type}-${sirop}-${wantSoft === "oui" ? soft : "nosoft"}`;

    addItem({
      id:      cartId,
      name,
      slug:    type === "light" ? "readymiix-light" : "readymiix-hard",
      price:   totalPrice,
      image:   type === "light"
        ? "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&q=80"
        : "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80",
      volume:  "Cup 50cl",
      options: { sirop, soft: wantSoft === "oui" ? soft : undefined },
    });
    toast.success(`${name} ajouté au panier !`);
    handleClose();
    openCart();
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="fixed bottom-0 left-0 right-0 z-[90] max-h-[92vh] flex flex-col rounded-t-3xl bg-brand-card border-t-2 border-brand-gold/30 overflow-hidden animate-slide-up">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-brand-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-brand-border shrink-0">
          <div>
            <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em] mb-0.5">
              🎯 Compose ton cocktail – choisis ton sirop, ton style, ton mood.
            </p>
            <h2 className="font-display text-xl text-white uppercase tracking-wide">
              Cocktail {type === "light" ? "Light 🍬" : "Hard 🔥"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-brand-border text-brand-muted hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 py-4 shrink-0">
          {[{ n: 1, label: "Sirop" }, { n: 2, label: "Bonbons" }, { n: 3, label: "Soft" }].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-1">
              <div className="flex flex-col items-center gap-1">
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                  step === n ? "bg-brand-gold text-white scale-110 shadow-gold-sm" :
                  step >  n ? "bg-brand-gold/30 text-brand-gold" :
                               "bg-brand-border text-brand-muted"
                )}>
                  {step > n ? <Check className="w-3.5 h-3.5" /> : n}
                </div>
                <span className={cn("text-[9px] uppercase tracking-wide font-bold", step === n ? "text-brand-gold" : "text-brand-muted")}>
                  {label}
                </span>
              </div>
              {n < 3 && (
                <div className={cn("w-10 h-px mb-4 transition-colors", step > n ? "bg-brand-gold/40" : "bg-brand-border")} />
              )}
            </div>
          ))}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 pb-2">

          {/* ── STEP 1 : Sirop ── */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-brand-text">🧃 Choix du sirop</p>
                  <p className="text-xs text-brand-muted">Sélection obligatoire — 1 seul choix</p>
                </div>
                <span className="text-[10px] text-brand-error font-bold bg-brand-error/10 border border-brand-error/20 px-2 py-1 rounded-full">
                  * Obligatoire
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {sirops.map((s) => {
                  const key     = s.slug ?? s.id;
                  const selected = sirop === key;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSirop(key)}
                      style={{
                        background:  selected ? hexToRgba(s.color, 0.12) : "transparent",
                        borderColor: selected ? s.color : "rgba(255,255,255,0.08)",
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left active:scale-[0.97]"
                    >
                      <span className="text-2xl shrink-0">{s.emoji}</span>
                      <span className="text-sm font-semibold text-white">{s.name}</span>
                      {selected && (
                        <Check className="w-4 h-4 ml-auto shrink-0" style={{ color: s.color }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 2 : Bonbons ── */}
          {step === 2 && (
            <div className="animate-fade-in">
              <p className="text-sm font-bold text-brand-text mb-4">🍬 Bonbons & surprises</p>
              <div className="bg-brand-darker rounded-2xl border border-brand-border p-6 text-center mb-4">
                <div className="text-5xl mb-3">🎁</div>
                <p className="font-display text-xl text-white uppercase tracking-wide mb-2">
                  Bonbons & surprises inclus
                </p>
                <p className="text-sm text-brand-muted leading-relaxed">{bonbonsText}</p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {bonbonsItems.map((b) => (
                  <span key={b} className="px-3 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-xs text-brand-muted">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3 : Soft ── */}
          {step === 3 && (
            <div className="animate-fade-in">
              <div className="mb-4">
                <p className="text-sm font-bold text-brand-text">🥤 Ajouter un soft ?</p>
                <p className="text-xs text-brand-muted">
                  {softs[0]?.surcharge ? `Supplément +${softs[0].surcharge.toFixed(2).replace(".", ",")}€` : "Inclus"}
                </p>
              </div>

              <div className="flex gap-3 mb-5">
                {(["non", "oui"] as const).map((choice) => (
                  <button
                    key={choice}
                    onClick={() => { setWantSoft(choice); if (choice === "non") setSoft(""); }}
                    className={cn(
                      "flex-1 py-4 rounded-xl border-2 font-bold text-sm transition-all",
                      wantSoft === choice
                        ? choice === "oui"
                          ? "bg-brand-gold/15 border-brand-gold text-brand-gold"
                          : "bg-white/5 border-white/20 text-white"
                        : "border-brand-border/50 text-brand-muted hover:border-brand-border"
                    )}
                  >
                    {choice === "non"
                      ? "Non merci"
                      : softs[0]?.surcharge
                        ? `Oui ! +${softs[0].surcharge.toFixed(2).replace(".", ",")}€`
                        : "Oui !"}
                  </button>
                ))}
              </div>

              {wantSoft === "oui" && (
                <div className="animate-fade-in">
                  <p className="text-xs text-brand-muted mb-3 font-semibold uppercase tracking-wide">Choisis ton soft :</p>
                  <div className="grid grid-cols-2 gap-3">
                    {softs.map((s) => {
                      const key      = s.slug ?? s.id;
                      const selected = soft === key;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setSoft(key)}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
                            selected
                              ? "bg-brand-teal/10 border-brand-teal text-brand-teal"
                              : "border-brand-border/50 text-brand-muted hover:border-brand-border"
                          )}
                        >
                          <span className="text-xl">{s.emoji}</span>
                          <span className="text-sm font-semibold flex-1 text-left">{s.name}</span>
                          {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer sticky */}
        <div className="px-5 py-4 border-t border-brand-border bg-brand-darker shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-brand-muted">
              {selectedSirop && (
                <span className="flex items-center gap-1">
                  <span>{selectedSirop.emoji}</span> {selectedSirop.name}
                  {wantSoft === "oui" && selectedSoft && ` + ${selectedSoft.name}`}
                </span>
              )}
            </div>
            <span className="font-display text-2xl text-brand-gold">
              {totalPrice.toFixed(2).replace(".", ",")}€
            </span>
          </div>

          <div className="flex gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1 px-4 py-3.5 rounded-xl border border-brand-border text-brand-muted hover:text-white text-sm font-medium transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Retour
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && !isStep1Done}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all",
                  step === 1 && !isStep1Done
                    ? "bg-brand-border text-brand-muted cursor-not-allowed"
                    : "bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white hover:shadow-gold active:scale-[0.98]"
                )}
              >
                Suivant <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={!isComplete}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all",
                  !isComplete
                    ? "bg-brand-border text-brand-muted cursor-not-allowed"
                    : "bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white hover:shadow-gold active:scale-[0.98]"
                )}
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
