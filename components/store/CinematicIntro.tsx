"use client";

/**
 * Cinematic brand intro — atmosphere-first, light-from-darkness reveal.
 *
 * Deep black silence → organic fog slowly rises → logo materialises via
 * brightness (no opacity — opacity feels digital, brightness feels physical).
 * A blurred radial halo behind the logo replaces drop-shadow, giving a real
 * light-source feel instead of a CSS glow. Film grain and a vignette add
 * depth without motion.
 *
 * Phases:
 *  black   0ms  — pure silence
 *  in    600ms  — fog + halo + logo all begin building
 *  out  3400ms  — full overlay dissolves over 1100ms
 *  done 4500ms  — unmount + data-intro removed
 */

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Phase = "black" | "in" | "out" | "done";

export default function CinematicIntro() {
  const [phase, setPhase] = useState<Phase>("black");
  const timers            = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const unlockPage = () =>
      document.documentElement.removeAttribute("data-intro");

    try {
      if (sessionStorage.getItem("rm_intro")) {
        unlockPage(); setPhase("done"); return;
      }
      sessionStorage.setItem("rm_intro", "1");
    } catch {
      unlockPage(); setPhase("done"); return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      unlockPage(); setPhase("done"); return;
    }

    const ids = timers.current;
    const at  = (fn: () => void, ms: number) => { ids.push(setTimeout(fn, ms)); };

    at(() => setPhase("in"),  600);   // 600ms of pure black silence
    at(() => setPhase("out"), 3400);  // logo fully lit ~1400ms → holds until 3400ms
    at(() => { unlockPage(); setPhase("done"); }, 4500); // 1100ms slow dissolve

    return () => ids.forEach(clearTimeout);
  }, []);

  if (phase === "done") return null;

  const lit = phase === "in" || phase === "out";
  const out = phase === "out";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "#000",
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
        opacity:    out ? 0 : 1,
        transition: out ? "opacity 1100ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
      }}
    >
      {/* Film grain — static fractal noise adds organic, analogue texture */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.048 }}
      >
        <filter id="ci-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#ci-grain)" />
      </svg>

      {/* Vignette — darkened corners push eye to centre, classic cinema look */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 68% 68% at 50% 50%, transparent 32%, rgba(0,0,0,0.82) 100%)",
      }} />

      {/* Atmospheric fog — 3 large, slow-drifting clouds of coloured haze.
          Opacity transition is very long so they materialise like real smoke. */}
      <div style={{
        position: "absolute", inset: 0,
        opacity: lit ? 1 : 0,
        transition: "opacity 3400ms ease-out",
      }}>
        <div style={{
          position: "absolute",
          top: "26%", left: "12%",
          width: "58vw", height: "46vw",
          background: "radial-gradient(ellipse, rgba(247,37,133,0.048) 0%, transparent 65%)",
          filter: "blur(52px)",
          animation: "ciDrift1 14s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          top: "30%", left: "40%",
          width: "52vw", height: "38vw",
          background: "radial-gradient(ellipse, rgba(123,47,190,0.038) 0%, transparent 65%)",
          filter: "blur(60px)",
          animation: "ciDrift2 19s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute",
          top: "36%", left: "26%",
          width: "46vw", height: "36vw",
          background: "radial-gradient(ellipse, rgba(200,18,95,0.028) 0%, transparent 68%)",
          filter: "blur(68px)",
          animation: "ciDrift3 24s ease-in-out infinite",
        }} />
      </div>

      {/* Logo halo — blurred radial gradient BEHIND the logo simulates a real
          physical light source; far softer and more organic than drop-shadow. */}
      <div style={{
        position: "absolute",
        width: "clamp(310px, 74vw, 460px)",
        height: "clamp(310px, 74vw, 460px)",
        background: "radial-gradient(ellipse, rgba(247,37,133,0.09) 0%, rgba(123,47,190,0.045) 48%, transparent 72%)",
        filter: "blur(44px)",
        opacity: lit ? 1 : 0,
        transition: "opacity 2800ms cubic-bezier(0.04, 0.62, 0.23, 0.98)",
      }} />

      {/* Logo — brightness-only reveal (no opacity), mimics stage light warming up.
          Cubic-bezier keeps it near-invisible for ~700ms then builds deliberately. */}
      <Image
        src="/logo.png"
        alt="ReadyMiix"
        width={320}
        height={320}
        priority
        style={{
          width:    "clamp(196px, 44vw, 284px)",
          height:   "auto",
          display:  "block",
          position: "relative",
          transform: lit ? "scale(1)" : "scale(1.07)",
          filter: lit
            ? [
                "brightness(1)",
                "saturate(1.02)",
                "blur(0px)",
                "drop-shadow(0 0 8px rgba(247,37,133,0.20))",
                "drop-shadow(0 0 28px rgba(247,37,133,0.06))",
                "drop-shadow(0 0 80px rgba(123,47,190,0.04))",
              ].join(" ")
            : [
                "brightness(0)",
                "saturate(0)",
                "blur(7px)",
                "drop-shadow(0 0 0px rgba(247,37,133,0))",
                "drop-shadow(0 0 0px rgba(247,37,133,0))",
                "drop-shadow(0 0 0px rgba(123,47,190,0))",
              ].join(" "),
          transition: [
            "filter    1950ms cubic-bezier(0.04, 0.62, 0.23, 0.98)",
            "transform 1750ms cubic-bezier(0.25, 1, 0.5, 1)",
          ].join(", "),
        }}
      />
    </div>
  );
}
