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

const TYPE_STYLES: Record<string, { pill: string; glow: string }> = {
  "SOIRÉE":     { pill: "bg-brand-gold text-white",          glow: "rgba(247,37,133,0.5)" },
  "CONCERT":    { pill: "bg-brand-teal text-brand-darker",   glow: "rgba(0,210,200,0.45)" },
  "FESTIVAL":   { pill: "bg-brand-purple text-white",        glow: "rgba(123,47,190,0.5)" },
  "BRUNCH":     { pill: "bg-orange-500 text-white",          glow: "rgba(249,115,22,0.45)" },
  "POOL PARTY": { pill: "bg-sky-500 text-white",             glow: "rgba(14,165,233,0.45)" },
  "ÉVÉNEMENT":  { pill: "bg-brand-gold text-white",          glow: "rgba(247,37,133,0.5)" },
};

function formatEventDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, "0")} ${
    d.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase()
  }. ${d.getFullYear()}`;
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
      {/* ── Card track ── */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
      >
        {events.map((ev, i) => {
          const style  = TYPE_STYLES[ev.type] ?? TYPE_STYLES["ÉVÉNEMENT"];
          const dateStr = formatEventDate(ev.date);
          const isFree  = ev.price === 0;

          return (
            <Link
              key={ev.id}
              href={`/events/${ev.id}`}
              onClick={() => setActive(i)}
              className="relative shrink-0 w-[72vw] sm:w-[300px] md:w-[320px] snap-start rounded-3xl overflow-hidden group cursor-pointer"
              style={{
                boxShadow: active === i
                  ? `0 0 0 1px ${style.glow}, 0 24px 60px rgba(0,0,0,0.6)`
                  : "0 8px 32px rgba(0,0,0,0.5)",
                transition: "box-shadow 0.4s ease",
              }}
            >
              {/* Full-bleed image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                {ev.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={ev.image}
                    alt={ev.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/80 via-brand-darker to-brand-gold/30" />
                )}

                {/* Cinematic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/10" />

                {/* Hover glow vignette */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at bottom, ${style.glow.replace("0.5", "0.15")} 0%, transparent 70%)` }}
                />

                {/* ── Type badge — top left ── */}
                <div className="absolute top-3.5 left-3.5">
                  <span className={`text-[9px] font-black px-2.5 py-1.5 rounded-full uppercase tracking-[0.2em] ${style.pill}`}>
                    {ev.type}
                  </span>
                </div>

                {/* ── Date pill — top right ── */}
                <div className="absolute top-3.5 right-3.5">
                  <span className="flex items-center gap-1.5 bg-black/55 backdrop-blur-sm border border-white/10 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full">
                    <Calendar className="w-2.5 h-2.5 shrink-0" />
                    {dateStr}
                  </span>
                </div>

                {/* ── Bottom content overlay ── */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2.5">
                  {/* Title */}
                  <h3 className="font-display text-[clamp(1.3rem,4.5vw,1.65rem)] text-white uppercase leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,1)]">
                    {ev.title}
                  </h3>

                  {/* Location + time */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-white/60 font-medium">
                      <MapPin className="w-3 h-3 shrink-0" />
                      {ev.location}
                    </span>
                    {ev.timeRange && (
                      <span className="flex items-center gap-1 text-[11px] text-white/60 font-medium">
                        <Clock className="w-3 h-3 shrink-0" />
                        {ev.timeRange}
                      </span>
                    )}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div>
                      {isFree ? (
                        <p className="font-display text-base text-brand-teal uppercase tracking-wide"
                           style={{ textShadow: "0 0 12px rgba(0,210,200,0.6)" }}>
                          Entrée libre
                        </p>
                      ) : ev.price != null ? (
                        <div>
                          <p className="text-[8px] text-white/40 uppercase tracking-wider">À partir de</p>
                          <p className="font-display text-xl text-white leading-none">{ev.price}€</p>
                        </div>
                      ) : null}
                    </div>

                    <span
                      className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#C5006A] to-[#F72585] text-white font-bold px-4 py-2.5 rounded-xl text-[10px] uppercase tracking-widest shrink-0 transition-all duration-300"
                      style={{ boxShadow: `0 0 18px ${style.glow.replace("0.5", "0.4")}` }}
                    >
                      <Ticket className="w-3 h-3" />
                      Réserver
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Navigation ── */}
      {events.length > 1 && (
        <div className="flex items-center justify-center gap-3 mt-5">
          <button
            onClick={() => goTo(active - 1)}
            disabled={active === 0}
            className="w-8 h-8 rounded-full glass border border-white/10 text-white/50 hover:text-white disabled:opacity-20 flex items-center justify-center transition-all hover:border-brand-gold/30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-1.5 items-center">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-6 h-2 bg-brand-gold shadow-[0_0_8px_rgba(247,37,133,0.65)]"
                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => goTo(active + 1)}
            disabled={active === events.length - 1}
            className="w-8 h-8 rounded-full glass border border-white/10 text-white/50 hover:text-white disabled:opacity-20 flex items-center justify-center transition-all hover:border-brand-gold/30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
