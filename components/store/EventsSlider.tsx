"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Calendar, Clock, MapPin, ChevronRight, ChevronLeft, Ticket } from "lucide-react";

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
  "CONCERT":    "bg-brand-teal text-brand-darker",
  "FESTIVAL":   "bg-brand-purple text-white",
  "BRUNCH":     "bg-orange-500 text-white",
  "POOL PARTY": "bg-sky-500 text-white",
  "ÉVÉNEMENT":  "bg-brand-gold text-white",
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
          const hasFreeEntry = ev.price === 0;

          return (
            <Link
              key={ev.id}
              href={`/events/${ev.id}`}
              className="relative shrink-0 w-[85vw] sm:w-[420px] md:w-[460px] snap-start rounded-2xl overflow-hidden border border-brand-border bg-brand-card group"
              onClick={() => setActive(i)}
            >
              {/* Image */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/50 to-transparent" />

                {/* Type badge */}
                <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${badgeCls}`}>
                  {ev.type}
                </span>

                {/* Title overlaid on image */}
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
                    <Calendar className="w-3.5 h-3.5 text-brand-gold" /> {dateStr}
                  </span>
                  {ev.timeRange && (
                    <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                      <Clock className="w-3.5 h-3.5 text-brand-gold" /> {ev.timeRange}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                    <MapPin className="w-3.5 h-3.5 text-brand-gold" /> {ev.location}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  {ev.price != null ? (
                    <div>
                      {hasFreeEntry ? (
                        <p className="font-display text-xl font-bold text-brand-teal">ENTRÉE LIBRE</p>
                      ) : (
                        <>
                          <p className="text-[10px] text-brand-muted uppercase tracking-wider">À partir de</p>
                          <p className="font-display text-2xl font-bold text-brand-gold leading-none">{ev.price}€</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <div />
                  )}

                  <span className="flex items-center gap-1.5 bg-brand-gold text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest shadow-gold-sm group-hover:opacity-90 transition-all shrink-0">
                    <Ticket className="w-3.5 h-3.5" /> Réserver
                  </span>
                </div>
              </div>
            </Link>
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
