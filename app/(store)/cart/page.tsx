"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ChevronLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const cartTotal   = total();
  const deliveryFee = cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const orderTotal  = cartTotal + deliveryFee;
  const itemCount   = items.reduce((s, i) => s + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-darker flex flex-col items-center justify-center px-4 pb-20 md:pb-0">
        {/* Background glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative flex flex-col items-center text-center gap-6 max-w-xs">
          <div className="w-24 h-24 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-brand-muted" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-text uppercase mb-2">
              Panier vide
            </h1>
            <p className="text-brand-muted text-sm">
              Aucun article dans ton panier. Commence par parcourir la boutique !
            </p>
          </div>
          <Link
            href="/shop"
            className="w-full py-4 rounded-2xl bg-brand-gold text-white font-bold text-center uppercase tracking-wide shadow-gold-sm hover:opacity-90 transition-all active:scale-[0.98]"
          >
            Voir la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-darker pb-24 md:pb-10">
      {/* ── Background glows ── */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative container-custom pt-24 md:pt-28 pb-6">
        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/shop" className="p-2 rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-display text-2xl font-bold text-brand-text uppercase">
                Ton Panier
              </h1>
              <p className="text-xs text-brand-muted">
                {itemCount} article{itemCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <span className="w-8 h-8 rounded-full bg-brand-gold text-white text-sm font-bold flex items-center justify-center shadow-gold-sm">
            {itemCount > 9 ? "9+" : itemCount}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Items ── */}
          <div className="flex-1 flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-2xl bg-brand-card border border-brand-border"
              >
                {/* Image */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-brand-darker border border-brand-border">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-purple/30 to-brand-gold/10" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display font-bold text-brand-text text-sm uppercase tracking-wide leading-snug">
                        {item.name}
                      </p>
                      {(item.volume || item.options?.soft) && (
                        <p className="text-xs text-brand-muted mt-0.5">
                          {item.options?.soft && (
                            <span className="text-brand-teal font-medium">{item.options.soft}</span>
                          )}
                          {item.options?.soft && item.volume && " · "}
                          {item.volume}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        removeItem(item.id);
                        toast.success("Article retiré");
                      }}
                      className="p-1.5 text-brand-muted hover:text-brand-error transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-brand-darker border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/40 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-brand-text w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-brand-darker border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/40 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    {/* Price */}
                    <p className="font-bold text-brand-gold">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Summary ── */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-24 rounded-2xl bg-brand-card border border-brand-border p-5 flex flex-col gap-4">
              <h2 className="font-display font-bold text-brand-text text-lg uppercase tracking-wide">
                Récapitulatif
              </h2>

              {/* Delivery progress */}
              {cartTotal < FREE_DELIVERY_THRESHOLD && (
                <div className="rounded-xl bg-brand-darker border border-brand-border p-3">
                  <p className="text-xs text-brand-muted mb-2">
                    Plus que{" "}
                    <span className="text-brand-gold font-bold">
                      {formatPrice(FREE_DELIVERY_THRESHOLD - cartTotal)}
                    </span>{" "}
                    pour la livraison gratuite !
                  </p>
                  <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-gold-dark to-brand-gold rounded-full transition-all"
                      style={{ width: `${Math.min((cartTotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {cartTotal >= FREE_DELIVERY_THRESHOLD && (
                <div className="rounded-xl bg-brand-success/10 border border-brand-success/20 px-3 py-2">
                  <p className="text-xs text-brand-success font-semibold">✓ Livraison gratuite débloquée !</p>
                </div>
              )}

              {/* Totals */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-brand-muted">
                  <span>Sous-total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Livraison</span>
                  <span className={deliveryFee === 0 ? "text-brand-success font-semibold" : ""}>
                    {deliveryFee === 0 ? "Gratuite !" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-brand-text border-t border-brand-border pt-3 mt-1 text-base">
                  <span>TOTAL</span>
                  <span className="text-brand-gold text-xl font-display">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 bg-brand-gold text-white font-bold py-4 rounded-2xl shadow-gold hover:opacity-90 transition-all active:scale-[0.98] text-sm uppercase tracking-widest"
              >
                Valider ma commande
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 text-brand-muted text-sm hover:text-brand-text transition-colors text-center"
              >
                ← Continuer mes achats
              </Link>

              <p className="text-[10px] text-brand-muted/60 text-center">
                Paiement sécurisé · Livraison en Guyane
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
