"use client";

import { useState } from "react";
import { Search, Package, Loader2, User } from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";

interface TrackedItem {
  name: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface TrackedOrder {
  orderNumber: string;
  status: string;
  createdAt: string;
  customerName: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  items: TrackedItem[];
}

const STATUS: Record<string, { label: string; cls: string }> = {
  PENDING:    { label: "En attente",      cls: "bg-brand-warning/15 text-brand-warning" },
  CONFIRMED:  { label: "Confirmée",       cls: "bg-brand-teal/15 text-brand-teal" },
  PROCESSING: { label: "En préparation",  cls: "bg-brand-teal/15 text-brand-teal" },
  SHIPPED:    { label: "En livraison",    cls: "bg-brand-gold/15 text-brand-gold" },
  DELIVERED:  { label: "Livrée",          cls: "bg-brand-success/15 text-brand-success" },
  CANCELLED:  { label: "Annulée",         cls: "bg-brand-error/15 text-brand-error" },
};

export default function ProfilPage() {
  const [number, setNumber] = useState("");
  const [email, setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [order, setOrder]   = useState<TrackedOrder | null>(null);

  async function track(e: React.FormEvent) {
    e.preventDefault();
    if (!number.trim() || !email.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const r = await fetch(
        `/api/orders/track?number=${encodeURIComponent(number.trim())}&email=${encodeURIComponent(email.trim())}`,
      );
      const data = await r.json();
      if (!r.ok) {
        setError(data.error || "Erreur lors de la recherche.");
      } else {
        setOrder(data);
      }
    } catch {
      setError("Une erreur est survenue. Réessaie.");
    } finally {
      setLoading(false);
    }
  }

  const st = order ? (STATUS[order.status] ?? { label: order.status, cls: "bg-brand-border text-brand-muted" }) : null;

  return (
    <div className="min-h-screen bg-[#050510] pt-24 pb-24">
      <div className="container-custom max-w-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold-dark to-brand-gold mb-4">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-white uppercase tracking-wide mb-2">
            Mon espace
          </h1>
          <p className="text-brand-muted text-sm">
            Suis ta commande avec ton numéro de commande et ton email.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={track} className="bg-brand-card border border-brand-border rounded-2xl p-5 md:p-6 flex flex-col gap-4">
          <div>
            <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1.5">
              Numéro de commande
            </label>
            <input
              className="input-base"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="ex: RMX-XXXXXX"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1.5">
              Email utilisé à la commande
            </label>
            <input
              type="email"
              className="input-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.com"
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !number.trim() || !email.trim()}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white text-sm font-bold px-5 py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? "Recherche..." : "Suivre ma commande"}
          </button>

          {error && (
            <p className="text-sm text-brand-error text-center">{error}</p>
          )}
        </form>

        {/* Result */}
        {order && st && (
          <div className="mt-6 bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
            <div className="p-5 md:p-6 border-b border-brand-border flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-brand-muted">Commande</p>
                <p className="font-display text-xl text-white">{order.orderNumber}</p>
                <p className="text-xs text-brand-muted mt-1">
                  {formatDate(order.createdAt)} · {order.customerName}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${st.cls}`}>
                {st.label}
              </span>
            </div>

            <div className="p-5 md:p-6 flex flex-col gap-3">
              {order.items.map((it, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand-darker border border-brand-border overflow-hidden shrink-0 flex items-center justify-center">
                    {it.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-brand-muted" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-text truncate">{it.name}</p>
                    <p className="text-xs text-brand-muted">x{it.quantity}</p>
                  </div>
                  <p className="text-sm text-brand-text shrink-0">{formatPrice(it.price * it.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-2 border-t border-brand-border flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-brand-muted">
                <span>Sous-total</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-muted">
                <span>Livraison</span>
                <span>{order.deliveryFee > 0 ? formatPrice(order.deliveryFee) : "Offerte"}</span>
              </div>
              <div className="flex justify-between font-bold text-brand-text text-base mt-1">
                <span>Total</span><span className="text-brand-gold">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
