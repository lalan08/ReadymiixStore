"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { formatPrice, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/utils";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const cartTotal   = total();
  const deliveryFee = cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const orderTotal  = cartTotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container-custom flex flex-col items-center justify-center py-24 gap-6 text-center">
          <div className="w-24 h-24 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-brand-muted" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-text mb-2">
              Votre panier est vide
            </h1>
            <p className="text-brand-muted">
              Découvrez nos cocktails premium ReadyMiix et composez votre commande.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-8 py-3.5 rounded-xl shadow-gold transition-all"
          >
            Explorer la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container-custom">
        <div className="mb-8 flex items-center gap-3">
          <Link href="/shop" className="text-brand-muted hover:text-brand-text transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-text">
            Mon panier
          </h1>
          <span className="bg-brand-gold text-brand-darker text-xs font-bold px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-brand-card border border-brand-border">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-brand-border">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-brand opacity-30" />
                  )}
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-semibold text-brand-text">{item.name}</h3>
                      {item.volume && <p className="text-xs text-brand-muted">{item.volume}</p>}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-brand-muted hover:text-brand-error transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-brand-border hover:border-brand-gold/40 text-brand-muted hover:text-brand-text transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-bold text-brand-text w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-brand-border hover:border-brand-gold/40 text-brand-muted hover:text-brand-text transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-bold text-brand-gold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col gap-4">
              <h2 className="font-display font-bold text-brand-text text-lg">
                Résumé de la commande
              </h2>

              {/* Delivery progress */}
              {cartTotal < FREE_DELIVERY_THRESHOLD && (
                <div className="bg-brand-border/50 rounded-xl p-4">
                  <p className="text-xs text-brand-muted mb-2">
                    Plus que{" "}
                    <span className="text-brand-gold font-semibold">
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

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-brand-muted">
                  <span>Sous-total ({items.reduce((s, i) => s + i.quantity, 0)} articles)</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-brand-muted">
                  <span>Livraison</span>
                  <span className={deliveryFee === 0 ? "text-brand-success font-medium" : ""}>
                    {deliveryFee === 0 ? "Gratuite !" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-brand-text border-t border-brand-border pt-3 mt-1 text-base">
                  <span>Total</span>
                  <span className="text-brand-gold text-lg">{formatPrice(orderTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold py-4 rounded-xl shadow-gold hover:shadow-gold transition-all text-sm"
              >
                Passer la commande
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="flex items-center justify-center gap-2 text-brand-muted text-sm hover:text-brand-text transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Continuer mes achats
              </Link>

              <p className="text-[10px] text-brand-muted text-center">
                Paiement sécurisé · Livraison en Guyane
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
