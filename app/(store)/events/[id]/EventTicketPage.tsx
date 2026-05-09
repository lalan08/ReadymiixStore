"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, MapPin, Ticket, Plus, Minus, ShoppingCart, Users } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Event {
  id: string;
  title: string;
  type: string;
  description: string | null;
  image: string;
  date: string;
  timeRange: string | null;
  location: string;
  price: number | null;
  maxTickets: number | null;
}

const TYPE_COLORS: Record<string, string> = {
  "SOIRÉE":     "bg-brand-gold text-white",
  "CONCERT":    "bg-brand-teal text-brand-darker font-bold",
  "FESTIVAL":   "bg-brand-purple text-white",
  "BRUNCH":     "bg-orange-500 text-white",
  "POOL PARTY": "bg-sky-500 text-white",
  "ÉVÉNEMENT":  "bg-brand-gold text-white",
};

function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function EventTicketPage({ event }: { event: Event }) {
  const [qty, setQty] = useState(1);
  const { addItem, openCart } = useCartStore();

  const isPaid      = event.price != null && event.price > 0;
  const isFree      = event.price === 0;
  const hasCap      = event.maxTickets != null;
  const badgeCls    = TYPE_COLORS[event.type] ?? "bg-brand-gold text-white";
  const totalPrice  = isPaid ? event.price! * qty : 0;

  function handleAdd() {
    if (!isPaid) return;
    addItem({
      id:    `ticket_${event.id}`,
      name:  `Billet — ${event.title}`,
      slug:  event.id,
      price: event.price!,
      image: event.image,
      quantity: qty,
    });
    toast.success(`${qty} billet${qty > 1 ? "s" : ""} ajouté${qty > 1 ? "s" : ""} au panier !`, {
      icon: "🎟️",
      style: { background: "#0E0E1C", color: "#F0F0F8", border: "1px solid #1E1E32" },
    });
    openCart();
  }

  return (
    <div className="min-h-screen bg-brand-darker pb-32 md:pb-16">
      {/* Hero */}
      <div className="relative w-full aspect-[4/3] md:aspect-[21/7] overflow-hidden bg-brand-card">
        {event.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-purple/60 via-brand-darker to-brand-gold/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/30 to-transparent" />

        {/* Back */}
        <Link
          href="/"
          className="absolute top-20 left-4 md:top-28 md:left-8 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-all active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Type badge */}
        <div className="absolute top-20 right-4 md:top-28">
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${badgeCls}`}>
            {event.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-6 md:mt-0 px-4 md:container-custom md:pt-8 max-w-2xl md:max-w-4xl mx-auto">
        <div className="md:grid md:grid-cols-[1fr_360px] md:gap-10 md:items-start">

          {/* Left: event info */}
          <div className="flex flex-col gap-5 mt-2">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-brand-text uppercase tracking-wide leading-tight">
              {event.title}
            </h1>

            {/* Meta pills */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 text-sm text-brand-muted">
                <Calendar className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="capitalize">{formatEventDate(event.date)}</span>
              </div>
              {event.timeRange && (
                <div className="flex items-center gap-2.5 text-sm text-brand-muted">
                  <Clock className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>{event.timeRange}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-sm text-brand-muted">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                <span>{event.location}</span>
              </div>
              {hasCap && (
                <div className="flex items-center gap-2.5 text-sm text-brand-muted">
                  <Users className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>Jauge limitée — {event.maxTickets} places</span>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div className="rounded-2xl bg-brand-card border border-brand-border p-4">
                <p className="text-sm text-brand-muted leading-relaxed">{event.description}</p>
              </div>
            )}

            {/* Free entry banner */}
            {isFree && (
              <div className="rounded-2xl bg-brand-teal/10 border border-brand-teal/25 px-4 py-3 flex items-center gap-3">
                <Ticket className="w-5 h-5 text-brand-teal shrink-0" />
                <p className="text-sm font-bold text-brand-teal">Entrée libre — Aucun billet requis !</p>
              </div>
            )}
          </div>

          {/* Right: ticket panel (desktop only) */}
          {isPaid && (
            <div className="hidden md:flex flex-col gap-4 sticky top-24 rounded-2xl bg-brand-card border border-brand-border p-5">
              <div className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-brand-gold" />
                <h2 className="font-display font-bold text-brand-text text-lg uppercase tracking-wide">Tes billets</h2>
              </div>

              {/* Price */}
              <div className="rounded-xl bg-brand-darker border border-brand-border px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-brand-muted">Prix par billet</span>
                <span className="font-bold text-brand-gold">{formatPrice(event.price!)}</span>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-text">Nombre de billets</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-darker border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/40 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-brand-text text-xl w-6 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-darker border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/40 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between border-t border-brand-border pt-3">
                <span className="font-bold text-brand-text">Total</span>
                <span className="font-display text-2xl font-bold text-brand-gold">{formatPrice(totalPrice)}</span>
              </div>

              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 bg-brand-gold text-white font-bold py-4 rounded-2xl shadow-gold hover:opacity-90 transition-all active:scale-[0.98] text-sm uppercase tracking-widest"
              >
                <ShoppingCart className="w-4 h-4" />
                Ajouter au panier
              </button>

              <p className="text-[10px] text-brand-muted/60 text-center">
                Paiement sécurisé · Billet numérique
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sticky CTA */}
      {isPaid && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-brand-darker/95 backdrop-blur-xl border-t border-brand-border flex items-center gap-3 z-40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-card border border-brand-border text-brand-muted"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-brand-text w-5 text-center">{qty}</span>
            <button
              onClick={() => setQty(qty + 1)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-card border border-brand-border text-brand-muted"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-gold text-white font-bold py-3.5 rounded-2xl shadow-gold hover:opacity-90 transition-all active:scale-[0.98] text-sm uppercase tracking-widest"
          >
            <Ticket className="w-4 h-4" />
            {qty} billet{qty > 1 ? "s" : ""} · {formatPrice(totalPrice)}
          </button>
        </div>
      )}
    </div>
  );
}
