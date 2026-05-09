"use client";

import { useState, useRef } from "react";
import { Calendar, Clock, MapPin, ChevronRight, ChevronLeft } from "lucide-react";

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
  bookingUrl: string | null;
}

const TYPE_COLORS: Record<string, string> = {
  "SOIRÉE":       "bg-brand-gold text-white",
  "CONCERT":      "bg-brand-teal text-brand-darker",
  "FESTIVAL":     "bg-brand-purple text-white",
  "BRUNCH":       "bg-orange-500 text-white",
  "POOL PARTY":   "bg-sky-500 text-white",
  "ÉVÉNEMENT":    "bg-brand-gold text-white",
};

function formatEventDate(iso: string) {
  const d = new Date(iso);
  const day   = d.getDate().toString().padStart(2, "0");
  const month = d.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();
  const year  = d.getFullYear();
  return `${day} ${month}. ${year}`;
}

export default function EventsSlider({ events }: { events: Event[] }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  if (events.length === 0) return null;

  function goTo(idx: number) {
    const next = Math.max(0, Math.min(events.length - 1, idx));
    setActive(next);
    const card = trackRef.current?.children[next] as HTMLElement;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  return (
    <div className="relative">
      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
      >
        {events.map((ev, i) => {
          const badgeCls = TYPE_COLORS[ev.type] ?? "bg-brand-gold text-white";
          const dateStr  = formatEventDate(ev.date);

          return (
            <div
              key={ev.id}
              className="relative shrink-0 w-[85vw] sm:w-[420px] md:w-[460px] snap-start rounded-2xl overflow-hidden border border-brand-border bg-brand-card group cursor-pointer select-none"
              onClick={() => setActive(i)}
            >
              {/* Background image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                {ev.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-purple/60 via-brand-darker to-brand-gold/20" />
                )}
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/50 to-transparent" />

                {/* Type badge */}
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${badgeCls}`}>
                  {ev.type}
                </span>

                {/* Title on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-display text-2xl font-bold text-white uppercase leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {ev.title}
                  </h3>
                </div>
              </div>

              {/* Info strip */}
              <div className="p-4 flex flex-col gap-3">
                <div className="flex flex-wrap gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                    <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                    {dateStr}
                  </span>
                  {ev.timeRange && (
                    <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                      <Clock className="w-3.5 h-3.5 text-brand-gold" />
                      {ev.timeRange}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold" />
                    {ev.location}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  {ev.price != null ? (
                    <div>
                      <p className="text-[10px] text-brand-muted uppercase tracking-wider">À partir de</p>
                      <p className="font-display text-2xl font-bold text-brand-gold leading-none">{ev.price}€</p>
                    </div>
                  ) : (
                    <div />
                  )}

                  {ev.bookingUrl ? (
                    <a
                      href={ev.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 bg-brand-gold text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest shadow-gold-sm hover:opacity-90 transition-all active:scale-95 shrink-0"
                    >
                      Réserver <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 bg-brand-gold/20 border border-brand-gold/30 text-brand-gold font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest shrink-0">
                      Bientôt
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots + arrows */}
      {events.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            className="w-7 h-7 rounded-full bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text disabled:opacity-30 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex gap-1.5">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all ${
                  i === active ? "w-5 h-2 bg-brand-gold" : "w-2 h-2 bg-brand-border hover:bg-brand-muted"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(active + 1)}
            disabled={active === events.length - 1}
            className="w-7 h-7 rounded-full bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text disabled:opacity-30 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
