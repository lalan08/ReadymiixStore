"use client";

import { useState } from "react";
import { X, ChevronRight, ChevronLeft, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const SOFT_SUPPLEMENT = 1.5;

const SIROPS = [
  { id: "passion",   label: "Passion",   emoji: "🍊", accent: "#F97316", bg: "rgba(249,115,22,0.12)",  border: "rgba(249,115,22,0.5)"  },
  { id: "grenadine", label: "Grenadine", emoji: "🌹", accent: "#E11D48", bg: "rgba(225,29,72,0.12)",   border: "rgba(225,29,72,0.5)"   },
  { id: "curacao",   label: "Curaçao",   emoji: "🌊", accent: "#3B82F6", bg: "rgba(59,130,246,0.12)",  border: "rgba(59,130,246,0.5)"  },
  { id: "menthe",    label: "Menthe",    emoji: "🌿", accent: "#22C55E", bg: "rgba(34,197,94,0.12)",   border: "rgba(34,197,94,0.5)"   },
  { id: "peche",     label: "Pêche",     emoji: "🍑", accent: "#FBBF24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.5)"  },
  { id: "fraise",    label: "Fraise",    emoji: "🍓", accent: "#F43F5E", bg: "rgba(244,63,94,0.12)",   border: "rgba(244,63,94,0.5)"   },
  { id: "citron",    label: "Citron",    emoji: "🍋", accent: "#EAB308", bg: "rgba(234,179,8,0.12)",   border: "rgba(234,179,8,0.5)"   },
  { id: "coco",      label: "Coco",      emoji: "🥥", accent: "#A3A3A3", bg: "rgba(163,163,163,0.12)", border: "rgba(163,163,163,0.5)" },
];

const SOFTS = [
  { id: "freez-rouge", label: "Freez Rouge",       emoji: "🔴" },
  { id: "sprite",      label: "Sprite",            emoji: "🍋" },
  { id: "cola",        label: "Cola",              emoji: "🥤" },
  { id: "schweppes",   label: "Schweppes Agrumes", emoji: "🍊" },
];

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

  const softPrice  = wantSoft === "oui" ? SOFT_SUPPLEMENT : 0;
  const totalPrice = basePrice + softPrice;
  const isStep1Done = sirop !== "";
  const isStep3Done = wantSoft === "non" || (wantSoft === "oui" && soft !== "");
  const isComplete  = isStep1Done && isStep3Done;

  function reset() {
    setStep(1); setSirop(""); setWantSoft(""); setSoft("");
  }

  function handleClose() {
    onClose();
    setTimeout(reset, 350);
  }

  function handleAddToCart() {
    const siropLabel = SIROPS.find((s) => s.id === sirop)?.label ?? sirop;
    const softLabel  = soft ? SOFTS.find((s) => s.id === soft)?.label : null;
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

  const selectedSirop = SIROPS.find((s) => s.id === sirop);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      {/* Bottom sheet */}
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
          {[
            { n: 1, label: "Sirop" },
            { n: 2, label: "Bonbons" },
            { n: 3, label: "Soft" },
          ].map(({ n, label }) => (
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
                <span className={cn(
                  "text-[9px] uppercase tracking-wide font-bold",
                  step === n ? "text-brand-gold" : "text-brand-muted"
                )}>{label}</span>
              </div>
              {n < 3 && (
                <div className={cn(
                  "w-10 h-px mb-4 transition-colors",
                  step > n ? "bg-brand-gold/40" : "bg-brand-border"
                )} />
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
                {SIROPS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSirop(s.id)}
                    style={{
                      background:   sirop === s.id ? s.bg   : "transparent",
                      borderColor:  sirop === s.id ? s.accent : "rgba(255,255,255,0.08)",
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left active:scale-[0.97]"
                  >
                    <span className="text-2xl shrink-0">{s.emoji}</span>
                    <span className="text-sm font-semibold text-white">{s.label}</span>
                    {sirop === s.id && (
                      <Check className="w-4 h-4 ml-auto shrink-0" style={{ color: s.accent }} />
                    )}
                  </button>
                ))}
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
                <p className="text-sm text-brand-muted leading-relaxed">
                  Sélection variable selon le stock du jour — Haribo, Jitty Shocks,
                  popping candy et bien d&apos;autres surprises dans ton cup !
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Haribo 🐻", "Jitty Shocks ⚡", "Popping Candy 🎆", "Surprise du jour 🎉"].map((b) => (
                  <span
                    key={b}
                    className="px-3 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-xs text-brand-muted"
                  >
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
                <p className="text-xs text-brand-muted">Supplément +{SOFT_SUPPLEMENT.toFixed(2).replace(".", ",")}€</p>
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
                    {choice === "non" ? "Non merci" : `Oui ! +${SOFT_SUPPLEMENT.toFixed(2).replace(".", ",")}€`}
                  </button>
                ))}
              </div>

              {wantSoft === "oui" && (
                <div className="animate-fade-in">
                  <p className="text-xs text-brand-muted mb-3 font-semibold uppercase tracking-wide">Choisis ton soft :</p>
                  <div className="grid grid-cols-2 gap-3">
                    {SOFTS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSoft(s.id)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
                          soft === s.id
                            ? "bg-brand-teal/10 border-brand-teal text-brand-teal"
                            : "border-brand-border/50 text-brand-muted hover:border-brand-border"
                        )}
                      >
                        <span className="text-xl">{s.emoji}</span>
                        <span className="text-sm font-semibold flex-1 text-left">{s.label}</span>
                        {soft === s.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer sticky */}
        <div className="px-5 py-4 border-t border-brand-border bg-brand-darker shrink-0">
          {/* Price recap */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-brand-muted">
              {selectedSirop && (
                <span className="flex items-center gap-1">
                  <span>{selectedSirop.emoji}</span> {selectedSirop.label}
                  {wantSoft === "oui" && soft && ` + ${SOFTS.find((s) => s.id === soft)?.label}`}
                </span>
              )}
            </div>
            <span className="font-display text-2xl text-brand-gold">
              {totalPrice.toFixed(2).replace(".", ",")}€
            </span>
          </div>

          {/* Navigation */}
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
