"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, ChevronLeft, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP ?? "594694369615";
const BG   = "#010C14";
const PINK = "#F72585";

const TOAST_STYLE = {
  style: { background: "#050D16", color: "#E0F8FF", border: "1px solid rgba(0,200,255,0.2)" },
};

const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 19; h <= 23; h++) {
    slots.push(`${h}h00`);
    if (h < 23) slots.push(`${h}h30`);
  }
  return slots;
})();

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const [showRetrait, setShowRetrait] = useState(false);
  const [prenom, setPrenom]           = useState("");
  const [telephone, setTelephone]     = useState("");
  const [heure, setHeure]             = useState("");

  const cartTotal = total();
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  function handleWhatsApp() {
    if (!prenom)    { toast.error("Entre ton prénom", TOAST_STYLE); return; }
    if (!telephone) { toast.error("Entre ton téléphone", TOAST_STYLE); return; }
    if (!heure)     { toast.error("Choisis une heure", TOAST_STYLE); return; }

    const lines: string[] = [
      "Bonjour ReadyMiix 🧊",
      "",
      "Je voudrais commander :",
      "",
    ];

    items.forEach(item => {
      const c = item.options?.caipi;
      if (c) {
        lines.push(`- Frozen Caïpi ${c.parfum} · ${c.taille} · ${c.preparation}`);
        if (c.supplements.length > 0) lines.push(`  + ${c.supplements.join(", ")}`);
        lines.push(`  × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`);
      } else {
        lines.push(`- ${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`);
      }
      lines.push("");
    });

    lines.push(
      `Total : ${formatPrice(cartTotal)}`,
      "",
      `Prénom : ${prenom}`,
      `Téléphone : ${telephone}`,
      `Heure de passage : ${heure}`,
      "",
      "Merci !",
    );

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`, "_blank");
  }

  /* ── PANIER VIDE ───────────────────────────────────── */
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
            boxShadow: "0 4px 24px rgba(247,37,133,0.4)",
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

  /* ── PANIER REMPLI ─────────────────────────────────── */
  return (
    <div className="min-h-screen" style={{ background: BG, paddingBottom: "140px" }}>

      {/* Header sticky */}
      <div
        className="sticky top-0 z-30 px-5 pt-16 pb-4"
        style={{
          background: "rgba(1,12,20,0.96)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <Link
            href="/shop"
            className="p-2 rounded-xl cursor-pointer"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </Link>
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.25em]"
              style={{ color: PINK }}
            >
              ReadyMiix
            </p>
            <h1
              className="font-sans font-black text-white text-lg leading-none"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              Mon panier
            </h1>
          </div>
          <span className="ml-auto text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
            {itemCount} article{itemCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="px-5 py-4 max-w-lg mx-auto">

        {/* ── Liste des articles ── */}
        <div className="flex flex-col gap-3 mb-4">
          {items.map((item) => {
            const c = item.options?.caipi;
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Nom + Supprimer */}
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
                    ) : (
                      item.volume && (
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                          {item.volume}
                        </p>
                      )
                    )}
                  </div>
                  <button
                    onClick={() => {
                      removeItem(item.id);
                      toast.success("Article retiré", TOAST_STYLE);
                    }}
                    className="p-1.5 rounded-lg cursor-pointer transition-opacity hover:opacity-100 opacity-50 shrink-0"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* Quantité + Prix */}
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
                    <span className="text-white font-bold w-6 text-center text-sm">
                      {item.quantity}
                    </span>
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

        {/* Lien ajouter */}
        <Link
          href="/frozen-caipi"
          className="flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-semibold mb-6 cursor-pointer active:scale-[0.98] transition-transform"
          style={{
            background: "rgba(247,37,133,0.07)",
            border: "1px dashed rgba(247,37,133,0.3)",
            color: PINK,
          }}
        >
          + Ajouter une caïpi
        </Link>

        {/* ── Formulaire retrait (affiché quand le bouton du bas est cliqué) ── */}
        {showRetrait && (
          <div
            className="p-4 rounded-2xl mb-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Ton retrait · Mar–Dim · 19h–23h · Matoury
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
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: heure ? "white" : "rgba(255,255,255,0.3)",
                }}
              >
                <option value="" disabled>Heure de passage</option>
                {TIME_SLOTS.map(t => (
                  <option key={t} value={t} style={{ background: "#010C14", color: "white" }}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleWhatsApp}
              className="mt-4 w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm uppercase tracking-widest cursor-pointer active:scale-[0.98] transition-transform"
              style={{
                background: "linear-gradient(135deg, #128C7E, #25D366)",
                boxShadow: "0 0 24px rgba(37,211,102,0.3)",
              }}
            >
              <MessageCircle className="w-4 h-4" /> Envoyer sur WhatsApp
            </button>
          </div>
        )}

      </div>

      {/* ── Barre fixe bas — Total + CTA ── */}
      <div
        className="fixed bottom-16 left-0 right-0 z-40 px-5 py-3"
        style={{
          background: "rgba(1,12,20,0.96)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <div className="shrink-0">
            <p className="text-[10px] uppercase tracking-wide" style={{ color: "rgba(255,255,255,0.35)" }}>Total</p>
            <p className="font-black text-2xl leading-none" style={{ color: PINK }}>
              {formatPrice(cartTotal)}
            </p>
          </div>
          <button
            onClick={() => {
              setShowRetrait(s => !s);
              if (!showRetrait) {
                setTimeout(() => {
                  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                }, 50);
              }
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white uppercase tracking-widest cursor-pointer active:scale-[0.98] transition-transform"
            style={{
              background: `linear-gradient(135deg, #C5006A, ${PINK})`,
              boxShadow: "0 0 25px rgba(247,37,133,0.35)",
            }}
          >
            {showRetrait ? "Masquer" : "Choisir mon heure"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
