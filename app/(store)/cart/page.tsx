"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import {
  Trash2, Plus, Minus, ArrowRight, ChevronLeft,
  CreditCard, Banknote, CheckCircle2, Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

const BG   = "#010C14";
const PINK = "#F72585";

const TOAST_STYLE = {
  style: { background: "#050D16", color: "#E0F8FF", border: "1px solid rgba(0,200,255,0.2)" },
};

const CARD_ENABLED = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 19; h <= 23; h++) {
    slots.push(`${h}h00`);
    if (h < 23) slots.push(`${h}h30`);
  }
  return slots;
})();

type Step = "cart" | "retrait" | "payment";
type PayChoice = "cash" | "card" | null;

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();

  const [step, setStep]           = useState<Step>("cart");
  const [prenom, setPrenom]       = useState("");
  const [telephone, setTelephone] = useState("");
  const [heure, setHeure]         = useState("");
  const [payChoice, setPayChoice] = useState<PayChoice>(null);
  const [submitting, setSubmitting] = useState(false);

  const cartTotal  = total();
  const itemCount  = items.reduce((s, i) => s + i.quantity, 0);

  /* ── Validation retrait → payment step ─────────────────── */
  function goToPayment() {
    if (!prenom.trim())    { toast.error("Entre ton prénom", TOAST_STYLE); return; }
    if (!telephone.trim()) { toast.error("Entre ton téléphone", TOAST_STYLE); return; }
    if (!heure)            { toast.error("Choisis une heure", TOAST_STYLE); return; }
    setStep("payment");
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 50);
  }

  /* ── Confirm espèces ───────────────────────────────────── */
  async function confirmCash() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders/caipi", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:  prenom,
          customerPhone: telephone,
          pickupTime:    heure,
          paymentMethod: "cash_on_pickup",
          items,
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      const order = await res.json();
      clearCart();
      router.push(`/order-confirmation/${order.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la commande, réessaie", TOAST_STYLE);
      setSubmitting(false);
    }
  }

  /* ── Confirm carte → Stripe checkout ─────────────────────── */
  async function confirmCard() {
    setSubmitting(true);
    try {
      // 1. Create order
      const orderRes = await fetch("/api/orders/caipi", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:  prenom,
          customerPhone: telephone,
          pickupTime:    heure,
          paymentMethod: "card_online",
          items,
        }),
      });

      if (!orderRes.ok) throw new Error(await orderRes.text());
      const order = await orderRes.json();

      // 2. Create Stripe session
      const checkoutRes = await fetch("/api/payment/checkout", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      if (!checkoutRes.ok) throw new Error(await checkoutRes.text());
      const { url } = await checkoutRes.json();

      clearCart();
      window.location.href = url;
    } catch (err) {
      console.error(err);
      toast.error("Erreur paiement, réessaie", TOAST_STYLE);
      setSubmitting(false);
    }
  }


  /* ── PANIER VIDE ─────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-5 pb-24"
        style={{ background: BG }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(247,37,133,0.08)", border: "1px solid rgba(247,37,133,0.2)" }}
        >
          <span className="text-3xl">🧊</span>
        </div>
        <h1
          className="font-sans font-black text-white text-xl mb-2 text-center"
          style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
        >
          Ton panier est vide
        </h1>
        <p className="text-sm text-center mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
          Compose ta première Frozen Caïpi !
        </p>

        <Link
          href="/frozen-caipi"
          className="w-full max-w-xs flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold text-sm mb-4 active:scale-[0.97] transition-transform"
          style={{
            background: `linear-gradient(135deg, #C5006A, ${PINK})`,
            boxShadow:  "0 4px 24px rgba(247,37,133,0.4)",
          }}
        >
          Composer ma caïpi <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/shop"
          className="text-sm font-medium transition-opacity hover:opacity-80"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Voir les boissons et extras
        </Link>
      </div>
    );
  }

  /* ── PANIER REMPLI ───────────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: BG, paddingBottom: "140px" }}>

      {/* Header sticky */}
      <div
        className="sticky top-0 z-30 px-5 pt-16 pb-4"
        style={{
          background:     "rgba(1,12,20,0.96)",
          backdropFilter: "blur(16px)",
          borderBottom:   "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          {step !== "cart" ? (
            <button
              onClick={() => { setStep(step === "payment" ? "retrait" : "cart"); setPayChoice(null); }}
              className="p-2 rounded-xl cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
          ) : (
            <Link
              href="/shop"
              className="p-2 rounded-xl cursor-pointer"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </Link>
          )}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: PINK }}>
              ReadyMiix
            </p>
            <h1
              className="font-sans font-black text-white text-lg leading-none"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {step === "cart"    && "Mon panier"}
              {step === "retrait" && "Heure de retrait"}
              {step === "payment" && "Paiement"}
            </h1>
          </div>
          <span className="ml-auto text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
            {itemCount} article{itemCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 max-w-lg mx-auto">

        {/* ── STEP CART : articles ── */}
        {step === "cart" && (
          <>
            <div className="flex flex-col gap-3 mb-4">
              {items.map((item) => {
                const c = item.options?.caipi;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm leading-tight mb-1">{item.name}</p>
                        {c ? (
                          <div className="flex flex-col gap-0.5">
                            <p className="text-xs" style={{ color: "rgba(0,210,200,0.9)" }}>
                              {c.taille} · {c.preparation}
                            </p>
                            {c.supplements.length > 0 && (
                              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                                + {c.supplements.join(", ")}
                              </p>
                            )}
                          </div>
                        ) : item.volume && (
                          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{item.volume}</p>
                        )}
                      </div>
                      <button
                        onClick={() => { removeItem(item.id); toast.success("Article retiré", TOAST_STYLE); }}
                        className="p-1.5 rounded-lg cursor-pointer transition-opacity hover:opacity-100 opacity-50 shrink-0"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                          aria-label="Moins"
                        >
                          <Minus className="w-3 h-3 text-white" />
                        </button>
                        <span className="text-white font-bold w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-xl cursor-pointer"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                          aria-label="Plus"
                        >
                          <Plus className="w-3 h-3 text-white" />
                        </button>
                      </div>
                      <p className="font-black text-lg" style={{ color: PINK }}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="/frozen-caipi"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold mb-6 cursor-pointer active:scale-[0.98] transition-transform"
              style={{
                background: "rgba(247,37,133,0.07)",
                border:     "1px dashed rgba(247,37,133,0.3)",
                color:      PINK,
              }}
            >
              + Ajouter une caïpi
            </Link>
          </>
        )}

        {/* ── STEP RETRAIT ── */}
        {step === "retrait" && (
          <div
            className="p-4 rounded-2xl mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Click &amp; Collect · Mar–Dim · 19h–23h · Matoury
            </p>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Ton prénom"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <input
                type="tel"
                placeholder="Ton téléphone"
                value={telephone}
                onChange={e => setTelephone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <select
                value={heure}
                onChange={e => setHeure(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border:     "1px solid rgba(255,255,255,0.1)",
                  color:      heure ? "white" : "rgba(255,255,255,0.3)",
                }}
              >
                <option value="" disabled>Heure de retrait</option>
                {TIME_SLOTS.map(t => (
                  <option key={t} value={t} style={{ background: "#010C14", color: "white" }}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ── STEP PAYMENT ── */}
        {step === "payment" && (
          <div className="flex flex-col gap-4">
            {/* Récap retrait */}
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(0,210,200,0.06)", border: "1px solid rgba(0,210,200,0.15)" }}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#00D2C8" }} />
              <div>
                <p className="text-xs font-semibold text-white">{prenom} · {heure}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Click &amp; Collect · Matoury
                </p>
              </div>
              <button
                onClick={() => { setStep("retrait"); setPayChoice(null); }}
                className="ml-auto text-xs cursor-pointer"
                style={{ color: "rgba(0,210,200,0.7)" }}
              >
                Modifier
              </button>
            </div>

            <p
              className="text-xs font-black uppercase tracking-widest mt-1"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Comment veux-tu payer ?
            </p>

            {/* Espèces */}
            <button
              onClick={() => setPayChoice(payChoice === "cash" ? null : "cash")}
              className="w-full flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98]"
              style={{
                background: payChoice === "cash"
                  ? "rgba(247,37,133,0.12)"
                  : "rgba(255,255,255,0.03)",
                border: payChoice === "cash"
                  ? `1.5px solid ${PINK}`
                  : "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(247,37,133,0.12)" }}
              >
                <Banknote className="w-5 h-5" style={{ color: PINK }} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-sm">Espèces au retrait</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {formatPrice(cartTotal)} à régler sur place
                </p>
              </div>
              {payChoice === "cash" && (
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: PINK }} />
              )}
            </button>

            {/* Carte */}
            <button
              onClick={() => {
                if (!CARD_ENABLED) {
                  toast("Paiement par carte bientôt disponible", { icon: "💳", ...TOAST_STYLE });
                  return;
                }
                setPayChoice(payChoice === "card" ? null : "card");
              }}
              className="w-full flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98]"
              style={{
                background: payChoice === "card"
                  ? "rgba(247,37,133,0.12)"
                  : "rgba(255,255,255,0.03)",
                border: payChoice === "card"
                  ? `1.5px solid ${PINK}`
                  : "1px solid rgba(255,255,255,0.1)",
                opacity: !CARD_ENABLED ? 0.5 : 1,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(247,37,133,0.12)" }}
              >
                <CreditCard className="w-5 h-5" style={{ color: PINK }} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-bold text-sm">Carte bancaire en ligne</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {!CARD_ENABLED ? "Bientôt disponible" : "Paiement sécurisé"}
                </p>
              </div>
              {payChoice === "card" && (
                <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: PINK }} />
              )}
            </button>

            {/* Confirm buttons */}
            {payChoice === "cash" && (
              <button
                onClick={confirmCash}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm uppercase tracking-widest cursor-pointer active:scale-[0.98] transition-transform disabled:opacity-60"
                style={{
                  background: `linear-gradient(135deg, #C5006A, ${PINK})`,
                  boxShadow:  "0 0 25px rgba(247,37,133,0.35)",
                }}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Confirmer ma commande · {formatPrice(cartTotal)} en espèces</>
                )}
              </button>
            )}

            {payChoice === "card" && (
              <button
                onClick={confirmCard}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm uppercase tracking-widest cursor-pointer active:scale-[0.98] transition-transform disabled:opacity-60"
                style={{
                  background: `linear-gradient(135deg, #C5006A, ${PINK})`,
                  boxShadow:  "0 0 25px rgba(247,37,133,0.35)",
                }}
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <><CreditCard className="w-4 h-4" /> Payer {formatPrice(cartTotal)} par carte</>
                )}
              </button>
            )}
          </div>
        )}

      </div>

      {/* ── Barre fixe bas ── */}
      <div
        className="fixed bottom-16 left-0 right-0 z-40 px-5 py-3"
        style={{
          background:     "rgba(1,12,20,0.96)",
          backdropFilter: "blur(16px)",
          borderTop:      "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>Total</p>
            <p className="font-black text-2xl leading-none" style={{ color: PINK }}>
              {formatPrice(cartTotal)}
            </p>
          </div>

          {step === "cart" && (
            <button
              onClick={() => {
                setStep("retrait");
                setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 50);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white uppercase tracking-widest cursor-pointer active:scale-[0.98] transition-transform"
              style={{
                background: `linear-gradient(135deg, #C5006A, ${PINK})`,
                boxShadow:  "0 0 25px rgba(247,37,133,0.35)",
              }}
            >
              Choisir mon heure <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === "retrait" && (
            <button
              onClick={goToPayment}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white uppercase tracking-widest cursor-pointer active:scale-[0.98] transition-transform"
              style={{
                background: `linear-gradient(135deg, #C5006A, ${PINK})`,
                boxShadow:  "0 0 25px rgba(247,37,133,0.35)",
              }}
            >
              Continuer <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === "payment" && (
            <div className="flex-1 text-center">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                {payChoice ? "Choix confirmé ↑" : "Choisis un mode de paiement ↑"}
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
