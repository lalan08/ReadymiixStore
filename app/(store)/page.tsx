import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

export const revalidate = 300;

export default function HomePage() {
  return (
    <div className="overflow-x-hidden bg-[#010C14]">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">

        {/* Dark base */}
        <div className="absolute inset-0 bg-[#010C14]" />

        {/* Pink glow top-right */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 85% 30%, rgba(197,0,106,0.28) 0%, rgba(247,37,133,0.12) 35%, transparent 65%)",
          }}
        />

        {/* Cocktail image — right side, prominent */}
        <div className="absolute right-0 top-0 bottom-0 w-[65%] md:w-[58%] pointer-events-none">
          <Image
            src="/Frozen%20.jpg.png"
            alt="Frozen Caïpi ReadyMiix"
            fill
            priority
            quality={95}
            sizes="(max-width: 768px) 65vw, 58vw"
            className="object-cover object-center"
            style={{ filter: "saturate(1.25) contrast(1.1) brightness(1.05)" }}
          />
          {/* Left fade over the image */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, #010C14 0%, rgba(1,12,20,0.85) 15%, rgba(1,12,20,0.40) 40%, rgba(1,12,20,0.10) 65%, transparent 85%)",
            }}
          />
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 pointer-events-none bg-gradient-to-t from-[#010C14] to-transparent" />

        {/* Content */}
        <div className="relative z-10 container-custom pt-28 pb-24 md:pt-32 md:pb-28">
          <div className="max-w-[90%] sm:max-w-[75%] md:max-w-[52%]">

            {/* Eyebrow label */}
            <p
              className="text-[10px] font-black uppercase tracking-[0.32em] mb-5"
              style={{ color: "#00D2C8", textShadow: "0 0 14px rgba(0,210,200,0.5)" }}
            >
              La sélection ReadyMiix
            </p>

            {/* Title */}
            <h1
              className="font-display leading-[0.95] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.6rem,10vw,5.2rem)" }}
            >
              <span
                className="block text-white"
                style={{ textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}
              >
                Du goût.
              </span>
              <span
                className="block text-white"
                style={{ textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}
              >
                De la fraîcheur.
              </span>
              <span
                className="block"
                style={{
                  color: "#F72585",
                  textShadow: "0 0 30px rgba(247,37,133,0.55), 0 4px 20px rgba(0,0,0,0.9)",
                }}
              >
                Des découvertes.
              </span>
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base text-white/60 leading-relaxed mb-8 max-w-[360px]"
              style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
              Des cocktails tropicaux créés en Guyane,
              prêts à mixer et à savourer.
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 mb-8">
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center gap-2 text-white font-bold text-sm px-7 py-4 rounded-2xl uppercase tracking-wide overflow-hidden active:scale-[0.97] transition-transform duration-150 w-full sm:w-auto"
                style={{
                  background: "linear-gradient(135deg, #C5006A, #F72585)",
                  boxShadow: "0 0 28px rgba(247,37,133,0.45), 0 4px 16px rgba(0,0,0,0.4)",
                }}
              >
                <span className="relative z-10">Découvrir la sélection</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              </Link>

              <Link
                href="/frozen-caipi"
                className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
              >
                Composer ma caïpi
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Info row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="flex items-center gap-1.5 text-xs text-white/45">
                <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                Click &amp; collect · Matoury
              </span>
              <span className="hidden sm:block w-px h-3.5 bg-white/20" />
              <span className="flex items-center gap-1.5 text-xs text-white/45">
                <Calendar className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                Mar–Dim · 19h–23h
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          À DÉCOUVRIR
      ══════════════════════════════════════ */}
      <section className="py-10 md:py-14 bg-[#010C14]">
        <div className="container-custom">

          {/* Section heading */}
          <div className="mb-6 md:mb-8">
            <h2
              className="font-display text-[clamp(1.6rem,5vw,2.8rem)] text-white uppercase tracking-wide inline-block relative"
            >
              À découvrir
              <span
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: "linear-gradient(90deg, #F72585, #C5006A, transparent)" }}
              />
            </h2>
          </div>

          {/* 2 cards */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">

            {/* Card 1 — Frozen Caïpis */}
            <Link
              href="/shop"
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] active:scale-[0.98] transition-transform duration-150 cursor-pointer"
              style={{
                background: "linear-gradient(145deg, #3D0022 0%, #1A0010 100%)",
              }}
            >
              {/* Background glow */}
              <div
                className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                style={{ background: "linear-gradient(145deg, rgba(247,37,133,0.35) 0%, rgba(197,0,106,0.15) 60%, transparent 100%)" }}
              />

              {/* Hero cocktail image */}
              <div className="absolute inset-0">
                <Image
                  src="/hero-cocktail.png"
                  alt="Frozen Caïpis"
                  fill
                  className="object-cover object-center opacity-60 group-hover:opacity-75 transition-opacity duration-500 group-hover:scale-105 transition-transform"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0010]/90 via-[#1A0010]/30 to-transparent" />

              {/* Border glow */}
              <div
                className="absolute inset-0 rounded-2xl border opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                style={{ borderColor: "rgba(247,37,133,0.4)" }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 mb-1">
                  Frozen · Premium
                </p>
                <h3 className="font-display text-[clamp(1.2rem,4vw,2rem)] text-white uppercase leading-tight tracking-wide">
                  Frozen<br />Caïpis
                </h3>
                <span
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: "#F72585" }}
                >
                  Voir <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>

            {/* Card 2 — Boissons & nouveautés */}
            <Link
              href="/shop"
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] active:scale-[0.98] transition-transform duration-150 cursor-pointer"
              style={{
                background: "linear-gradient(145deg, #001C1A 0%, #000E0D 100%)",
              }}
            >
              {/* Background glow */}
              <div
                className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                style={{ background: "linear-gradient(145deg, rgba(0,210,200,0.25) 0%, rgba(0,160,150,0.10) 60%, transparent 100%)" }}
              />

              {/* Border glow */}
              <div
                className="absolute inset-0 rounded-2xl border opacity-40 group-hover:opacity-80 transition-opacity duration-300"
                style={{ borderColor: "rgba(0,210,200,0.35)" }}
              />

              {/* Top accent */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,210,200,0.6), transparent)" }}
              />

              {/* Ice crystal */}
              <span className="absolute top-4 right-4 text-2xl opacity-15 group-hover:opacity-30 transition-opacity">❄</span>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-1">
                  Boissons · Nouveautés
                </p>
                <h3 className="font-display text-[clamp(1.2rem,4vw,2rem)] text-white uppercase leading-tight tracking-wide">
                  Boissons &amp;<br />nouveautés
                </h3>
                <span
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: "#00D2C8" }}
                >
                  Voir <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>

          </div>
        </div>
      </section>

    </div>
  );
}
