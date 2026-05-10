"use client";

/**
 * Cinematic brand intro — logo as the only hero element
 *
 * Phases:
 *  black  0 ms   — pure black, panels sealed
 *  logo   300ms  — logo neon-on + glow halos expand + smoke drifts
 *  reveal 1800ms — split panels slide up/down, stage fades out
 *  done   2900ms — unmount
 */

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Phase = "black" | "logo" | "reveal" | "done";

export default function CinematicIntro() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase]     = useState<Phase>("black");
  const timers                = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setMounted(true);

    try {
      if (sessionStorage.getItem("rm_intro")) { setPhase("done"); return; }
      sessionStorage.setItem("rm_intro", "1");
    } catch { setPhase("done"); return; }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done"); return;
    }

    const ids = timers.current;
    const at  = (fn: () => void, ms: number) => { ids.push(setTimeout(fn, ms)); };

    at(() => setPhase("logo"),   300);
    at(() => setPhase("reveal"), 1800);
    at(() => setPhase("done"),   2900);

    return () => ids.forEach(clearTimeout);
  }, []);

  if (!mounted || phase === "done") return null;

  const logoVisible = phase === "logo" || phase === "reveal";
  const isReveal    = phase === "reveal";

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[200] overflow-hidden pointer-events-none">

      {/* ── Split panels ───────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: "0 0 auto 0", height: "52%",
        background: "#020208",
        transition: isReveal ? "transform 900ms cubic-bezier(0.76,0,0.24,1)" : "none",
        transform:  isReveal ? "translateY(-102%)" : "translateY(0)",
      }} />
      <div style={{
        position: "absolute", inset: "auto 0 0 0", height: "52%",
        background: "#020208",
        transition: isReveal ? "transform 900ms cubic-bezier(0.76,0,0.24,1)" : "none",
        transform:  isReveal ? "translateY(102%)"  : "translateY(0)",
      }} />
      {/* seal the thin gap between panels */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: "49%", height: "4%",
        background: "#020208",
        opacity:    isReveal ? 0 : 1,
        transition: isReveal ? "opacity 280ms" : "none",
      }} />

      {/* ── Stage (camera slow-zoom) ────────────────────────────── */}
      <div
        className="rm-camera-in"
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity:    isReveal ? 0 : 1,
          transition: isReveal ? "opacity 450ms ease-in" : "none",
        }}
      >
        {/* ── Glow halos — expand when logo ignites ── */}

        {/* Pink — central */}
        <div style={{
          position: "absolute",
          width: 440, height: 440, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247,37,133,0.22) 0%, rgba(247,37,133,0.07) 42%, transparent 68%)",
          filter: "blur(42px)",
          transform: logoVisible ? "scale(1)"   : "scale(0.15)",
          opacity:   logoVisible ? 1             : 0,
          transition: "transform 1300ms cubic-bezier(0.22,1,0.36,1), opacity 1100ms ease-out",
        }} />

        {/* Violet — offset left */}
        <div style={{
          position: "absolute",
          width: 360, height: 360, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(123,47,190,0.18) 0%, transparent 62%)",
          filter: "blur(36px)",
          marginLeft: -140,
          transform: logoVisible ? "scale(1)"   : "scale(0.15)",
          opacity:   logoVisible ? 0.85          : 0,
          transition: "transform 1400ms cubic-bezier(0.22,1,0.36,1) 0.06s, opacity 1200ms ease-out 0.06s",
        }} />

        {/* Teal — offset right */}
        <div style={{
          position: "absolute",
          width: 280, height: 280, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,210,200,0.10) 0%, transparent 62%)",
          filter: "blur(30px)",
          marginLeft: 120,
          transform: logoVisible ? "scale(1)"   : "scale(0.15)",
          opacity:   logoVisible ? 0.60          : 0,
          transition: "transform 1500ms cubic-bezier(0.22,1,0.36,1) 0.10s, opacity 1300ms ease-out 0.10s",
        }} />

        {/* ── Smoke wisps — conditional so animation restarts cleanly ── */}
        {logoVisible && (
          <>
            <div style={{
              position: "absolute", bottom: "26%", left: "20%",
              width: 260, height: 80, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(247,37,133,0.07) 0%, transparent 70%)",
              filter: "blur(22px)",
              animation: "rmSmokeDrift 2.4s ease-in-out forwards",
            }} />
            <div style={{
              position: "absolute", bottom: "20%", right: "18%",
              width: 220, height: 70, borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(123,47,190,0.07) 0%, transparent 70%)",
              filter: "blur(20px)",
              animation: "rmSmokeDrift 2.6s ease-in-out 0.18s forwards",
            }} />
          </>
        )}

        {/* ── Logo — the only hero ── */}
        <div style={{ position: "relative", zIndex: 10 }}>
          <Image
            src="/logo.png"
            alt="ReadyMiix"
            width={192}
            height={192}
            priority
            className="w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48 object-contain"
            style={{
              opacity:   logoVisible ? 1    : 0,
              transform: logoVisible ? "scale(1)" : "scale(1.14)",
              filter: logoVisible
                ? [
                    "brightness(1)",
                    "blur(0px)",
                    "drop-shadow(0 0 48px rgba(247,37,133,1))",
                    "drop-shadow(0 0 110px rgba(247,37,133,0.65))",
                    "drop-shadow(0 0 240px rgba(123,47,190,0.42))",
                  ].join(" ")
                : "brightness(0) blur(12px)",
              transition: [
                "opacity 1050ms ease-out",
                "filter 1200ms ease-out",
                "transform 1050ms cubic-bezier(0.22,1,0.36,1)",
              ].join(", "),
            }}
          />
        </div>
      </div>
    </div>
  );
}
