"use client";

import { useCartStore } from "@/lib/store";
import { formatPrice, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/utils";
import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore();
  const cartTotal    = total();
  const deliveryFee  = cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const orderTotal   = cartTotal + deliveryFee;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-[70] flex flex-col glass border-l border-brand-border transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-brand-gold" />
            <h2 className="font-display font-bold text-brand-text">Mon panier</h2>
            {items.length > 0 && (
              <span className="bg-brand-gold text-brand-darker text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-brand-muted hover:text-brand-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-20 h-20 rounded-full bg-brand-card border border-brand-border flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-brand-muted" />
              </div>
              <div>
                <p className="text-brand-text font-medium mb-1">Votre panier est vide</p>
                <p className="text-brand-muted text-sm">
                  Découvrez nos cocktails premium ReadyMiix
                </p>
              </div>
              <Link
                href="/shop"
                onClick={closeCart}
                className="bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-semibold text-sm px-6 py-2.5 rounded-xl hover:shadow-gold transition-shadow"
              >
                Voir la boutique
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-xl bg-brand-card border border-brand-border"
              >
                {/* Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-brand-border">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-brand opacity-40" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-brand-text truncate">{item.name}</p>
                  {item.volume && (
                    <p className="text-xs text-brand-muted">{item.volume}</p>
                  )}
                  {item.options?.soft && (
                    <p className="text-xs text-brand-teal">+ {item.options.soft}</p>
                  )}
                  <p className="text-sm font-bold text-brand-gold mt-1">
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-md border border-brand-border hover:border-brand-gold/40 text-brand-muted hover:text-brand-text transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium text-brand-text w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center rounded-md border border-brand-border hover:border-brand-gold/40 text-brand-muted hover:text-brand-text transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto w-6 h-6 flex items-center justify-center rounded-md text-brand-muted hover:text-brand-error transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brand-border px-5 py-4 flex flex-col gap-3">
            {/* Delivery progress */}
            {cartTotal < FREE_DELIVERY_THRESHOLD && (
              <div className="bg-brand-card rounded-xl p-3 border border-brand-border">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-brand-muted">
                    Plus que{" "}
                    <span className="text-brand-gold font-semibold">
                      {formatPrice(FREE_DELIVERY_THRESHOLD - cartTotal)}
                    </span>{" "}
                    pour la livraison gratuite !
                  </span>
                </div>
                <div className="h-1.5 bg-brand-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-gold-dark to-brand-gold rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((cartTotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-brand-muted">
                <span>Sous-total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>Livraison</span>
                <span className={deliveryFee === 0 ? "text-brand-success" : ""}>
                  {deliveryFee === 0 ? "Gratuite !" : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-brand-text border-t border-brand-border pt-2 mt-2">
                <span>Total</span>
                <span className="text-brand-gold">{formatPrice(orderTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold text-sm py-3.5 rounded-xl text-center hover:shadow-gold transition-shadow"
            >
              Passer la commande
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-brand-muted text-sm hover:text-brand-text transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}
