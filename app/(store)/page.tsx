import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

export const revalidate = 300;

export default function HomePage() {
  return (
    <div className="bg-[#010C14] overflow-x-hidden">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative pt-[88px] pb-8 px-4 sm:px-6 overflow-hidden">

        {/* Pink-purple glow top-right */}
        <div
          className="absolute top-0 right-0 w-[70%] h-[65%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top right, rgba(197,0,106,0.35) 0%, rgba(120,0,70,0.15) 40%, transparent 70%)",
          }}
        />
        {/* Deep glow bottom-left */}
        <div
          className="absolute bottom-0 left-0 w-[50%] h-[40%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at bottom left, rgba(100,0,60,0.2) 0%, transparent 60%)",
          }}
        />

        <div className="max-w-[430px] mx-auto">

          {/* Label */}
          <p
            className="font-sans font-black text-[10px] uppercase tracking-[0.32em] mb-5"
            style={{ color: "#00D2C8" }}
          >
            La sélection ReadyMiix
          </p>

          {/* ── Split row: text LEFT | image RIGHT ── */}
          <div className="flex items-start gap-3">

            {/* Text column */}
            <div className="flex-1 min-w-0 pt-1">
              <h1
                className="font-sans font-black leading-[1.05] mb-4"
                style={{ fontSize: "clamp(1.75rem, 7.5vw, 2.5rem)", fontFamily: "var(--font-inter), system-ui, sans-serif" }}
              >
                <span className="block text-white">Du goût.</span>
                <span className="block text-white">De la fraîcheur.</span>
                <span
                  className="block"
                  style={{
                    color: "#F72585",
                    textShadow: "0 0 24px rgba(247,37,133,0.5)",
                  }}
                >
                  Des découvertes.
                </span>
              </h1>

              <p
                className="font-sans text-[13px] leading-relaxed"
                style={{ color: "rgba(240,240,248,0.60)" }}
              >
                Frozen caïpis, boissons de qualité et nouveautés sélectionnées pour toi.
              </p>
            </div>

            {/* Image column — object-contain so the full cup is visible */}
            <div className="relative shrink-0 w-[46%] sm:w-[44%]" style={{ aspectRatio: "3/4" }}>
              <Image
                src="/Frozen.jpg.PNG.PNG"
                alt="Frozen Caïpi ReadyMiix"
                fill
                priority
                quality={95}
                sizes="46vw"
                className="object-contain object-center drop-shadow-[0_8px_32px_rgba(247,37,133,0.35)]"
              />
            </div>
          </div>

          {/* ── Buttons + info — below the split row ── */}
          <div className="mt-6 flex flex-col gap-3">

            {/* Primary CTA */}
            <Link
              href="/shop"
              className="group relative w-full inline-flex items-center justify-center gap-2 text-white font-sans font-bold text-[15px] py-4 rounded-2xl overflow-hidden active:scale-[0.97] transition-transform duration-150"
              style={{
                background: "linear-gradient(135deg, #C5006A 0%, #F72585 100%)",
                boxShadow: "0 4px 24px rgba(247,37,133,0.45), 0 2px 8px rgba(0,0,0,0.5)",
              }}
            >
              <span className="relative z-10">Découvrir la sélection</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            </Link>

            {/* Secondary link */}
            <Link
              href="/frozen-caipi"
              className="font-sans font-semibold text-[14px] text-white/70 hover:text-white transition-colors text-center py-1 flex items-center justify-center gap-1.5"
            >
              Composer ma caïpi
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Info row */}
            <div className="flex items-center justify-center gap-4 mt-1">
              <span className="flex items-center gap-1.5 font-sans text-[12px]" style={{ color: "rgba(240,240,248,0.45)" }}>
                <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "#00D2C8" }} />
                Click &amp; collect · Matoury
              </span>
              <span className="w-px h-3.5 bg-white/15" />
              <span className="flex items-center gap-1.5 font-sans text-[12px]" style={{ color: "rgba(240,240,248,0.45)" }}>
                <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "#00D2C8" }} />
                Mar–Dim · 19h–23h
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          À DÉCOUVRIR
      ══════════════════════════════════════ */}
      <section className="px-4 sm:px-6 pb-32 md:pb-14">
        <div className="max-w-[430px] mx-auto">

          {/* Heading */}
          <div className="mb-5 mt-2">
            <h2
              className="font-sans font-black text-white inline-block relative"
              style={{ fontSize: "clamp(1.5rem, 6vw, 2rem)", fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              À découvrir
            </h2>
            <div
              className="mt-1 h-[3px] w-16 rounded-full"
              style={{ background: "linear-gradient(90deg, #F72585, rgba(247,37,133,0.3))" }}
            />
          </div>

          {/* 2 cards */}
          <div className="grid grid-cols-2 gap-3">

            {/* Card 1 — Frozen Caïpis */}
            <Link
              href="/shop"
              className="group relative overflow-hidden rounded-2xl active:scale-[0.97] transition-transform duration-150 cursor-pointer"
              style={{ aspectRatio: "3/4", background: "linear-gradient(145deg, #3D0022 0%, #1A0010 100%)" }}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src="/Frozen.jpg.PNG.PNG"
                  alt="Frozen Caïpis"
                  fill
                  sizes="(max-width: 430px) 47vw, 200px"
                  className="object-cover object-center opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0010]/95 via-[#1A0010]/40 to-transparent" />
              {/* Border */}
              <div
                className="absolute inset-0 rounded-2xl border opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                style={{ borderColor: "rgba(247,37,133,0.4)" }}
              />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3
                  className="font-sans font-black text-white leading-tight mb-2"
                  style={{ fontSize: "clamp(1rem,4vw,1.3rem)", fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                >
                  Frozen<br />Caïpis
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold font-sans" style={{ color: "#F72585" }}>
                  Voir <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>

            {/* Card 2 — Boissons & nouveautés */}
            <Link
              href="/shop"
              className="group relative overflow-hidden rounded-2xl active:scale-[0.97] transition-transform duration-150 cursor-pointer"
              style={{ aspectRatio: "3/4", background: "linear-gradient(145deg, #001C1A 0%, #000E0D 100%)" }}
            >
              {/* Teal glow */}
              <div
                className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity duration-500"
                style={{ background: "linear-gradient(145deg, rgba(0,210,200,0.22) 0%, transparent 60%)" }}
              />
              {/* Border */}
              <div
                className="absolute inset-0 rounded-2xl border opacity-40 group-hover:opacity-80 transition-opacity duration-300"
                style={{ borderColor: "rgba(0,210,200,0.35)" }}
              />
              {/* Top line */}
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,210,200,0.6), transparent)" }}
              />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-4">
                <h3
                  className="font-sans font-black text-white leading-tight mb-2"
                  style={{ fontSize: "clamp(1rem,4vw,1.3rem)", fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                >
                  Boissons &amp;<br />nouveautés
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold font-sans" style={{ color: "#00D2C8" }}>
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
