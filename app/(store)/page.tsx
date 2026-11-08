import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Calendar } from "lucide-react";

export const revalidate = 300;

export default function HomePage() {
  return (
    <div className="bg-[#010C14] overflow-x-hidden">

      {/* ══════════════════════════════════════
          SCÈNE HERO — image plein-cadre
          Technique padding-top : garantit une hauteur calculée
          en % de la largeur, ce qui permet h-full/inset-0 de marcher.
      ══════════════════════════════════════ */}
      <div
        className="relative bg-[#010C14] overflow-hidden"
        style={{ paddingTop: "108vw" }}  /* hauteur = 108% de la largeur */
      >
        {/* ── Image — couvre tout le bloc, gobelet ancré à droite ── */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Frozen.jpg.PNG.PNG"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: "contain", objectPosition: "right center" }}
        />

        {/* ── Dégradés de fondu — fond page = #010C14 ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, #010C14 0%, rgba(1,12,20,0.95) 16%, rgba(1,12,20,0.72) 36%, rgba(1,12,20,0.18) 58%, transparent 76%), " +
              "linear-gradient(to bottom, #010C14 0%, transparent 12%), " +
              "linear-gradient(to top,   #010C14 0%, transparent 12%), " +
              "linear-gradient(to left,  rgba(1,12,20,0.5) 0%, transparent 18%)",
          }}
        />

        {/* ── Halo rose haut-droite ── */}
        <div
          className="absolute top-0 right-0 w-[55%] h-[45%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at top right, rgba(197,0,106,0.28) 0%, transparent 65%)",
          }}
        />

        {/* ── Texte superposé — zone gauche sombre ── */}
        <div
          className="absolute top-0 left-0 z-10 px-5"
          style={{ paddingTop: "108px", maxWidth: "72%" }}
        >
          <p
            className="font-sans font-black uppercase tracking-[0.30em] mb-5"
            style={{ fontSize: "10px", color: "#00D2C8" }}
          >
            La sélection ReadyMiix
          </p>

          <h1
            className="font-sans font-black leading-[1.07] mb-5"
            style={{
              fontSize: "clamp(1.25rem, 5.8vw, 2.4rem)",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            }}
          >
            <span className="block text-white">Du goût.</span>
            <span className="block text-white">De la fraîcheur.</span>
            <span
              className="block"
              style={{ color: "#F72585", textShadow: "0 0 20px rgba(247,37,133,0.55)" }}
            >
              Des découvertes.
            </span>
          </h1>

          <p
            className="font-sans leading-relaxed"
            style={{ fontSize: "13px", color: "rgba(240,240,248,0.88)", maxWidth: "54%" }}
          >
            Frozen caïpis, boissons de qualité et nouveautés sélectionnées pour toi.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          BOUTONS — sous la scène
      ══════════════════════════════════════ */}
      <div className="bg-[#010C14] px-5 pt-2 pb-6">
        <div className="flex flex-col gap-3 max-w-[430px] mx-auto">

          {/* CTA principal */}
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

          {/* Lien secondaire */}
          <Link
            href="/frozen-caipi"
            className="font-sans font-semibold text-[14px] text-center flex items-center justify-center gap-1.5 py-1 transition-colors"
            style={{ color: "rgba(240,240,248,0.80)" }}
          >
            Composer ma caïpi
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Infos retrait — contraste renforcé */}
          <div className="flex items-center justify-center gap-5 mt-1">
            <span
              className="flex items-center gap-1.5 font-sans text-[12px] font-medium"
              style={{ color: "rgba(240,240,248,0.80)" }}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "#00D2C8" }} />
              Click &amp; collect · Matoury
            </span>
            <span className="w-px h-3.5" style={{ background: "rgba(240,240,248,0.2)" }} />
            <span
              className="flex items-center gap-1.5 font-sans text-[12px] font-medium"
              style={{ color: "rgba(240,240,248,0.80)" }}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: "#00D2C8" }} />
              Mar–Dim · 19h–23h
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          À DÉCOUVRIR
      ══════════════════════════════════════ */}
      <section className="px-5 pb-32 md:pb-14 bg-[#010C14]">
        <div className="max-w-[430px] mx-auto">

          {/* Titre section */}
          <div className="mb-5 mt-2">
            <h2
              className="font-sans font-black text-white inline-block"
              style={{
                fontSize: "clamp(1.5rem, 6vw, 2rem)",
                fontFamily: "var(--font-inter), system-ui, sans-serif",
              }}
            >
              À découvrir
            </h2>
            <div
              className="mt-1.5 h-[3px] w-16 rounded-full"
              style={{ background: "linear-gradient(90deg, #F72585, rgba(247,37,133,0.25))" }}
            />
          </div>

          {/* 2 cartes */}
          <div className="grid grid-cols-2 gap-3">

            {/* Carte 1 — Frozen Caïpis */}
            <Link
              href="/shop"
              className="group relative overflow-hidden rounded-2xl active:scale-[0.97] transition-transform duration-150 cursor-pointer"
              style={{ aspectRatio: "3/4", background: "linear-gradient(145deg, #3D0022 0%, #1A0010 100%)" }}
            >
              <div className="absolute inset-0">
                <Image
                  src="/Frozen.jpg.PNG.PNG"
                  fill
                  alt="Frozen Caïpis"
                  sizes="(max-width: 430px) 47vw, 200px"
                  className="object-cover object-center opacity-70 group-hover:opacity-85 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0010]/95 via-[#1A0010]/30 to-transparent" />
              <div
                className="absolute inset-0 rounded-2xl border opacity-50 group-hover:opacity-100 transition-opacity duration-300"
                style={{ borderColor: "rgba(247,37,133,0.4)" }}
              />
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

            {/* Carte 2 — Boissons & nouveautés */}
            <Link
              href="/shop"
              className="group relative overflow-hidden rounded-2xl active:scale-[0.97] transition-transform duration-150 cursor-pointer"
              style={{ aspectRatio: "3/4", background: "linear-gradient(145deg, #001C1A 0%, #000E0D 100%)" }}
            >
              <div
                className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity"
                style={{ background: "linear-gradient(145deg, rgba(0,210,200,0.22) 0%, transparent 60%)" }}
              />
              <div
                className="absolute inset-0 rounded-2xl border opacity-40 group-hover:opacity-80 transition-opacity"
                style={{ borderColor: "rgba(0,210,200,0.35)" }}
              />
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(0,210,200,0.6), transparent)" }}
              />
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
