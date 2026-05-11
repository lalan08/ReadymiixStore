"use client";

/**
 * Cinematic brand intro — neon light traces the triangle, then logo ignites
 *
 * Phases:
 *  black  0 ms   — pure black (also rendered on SSR to prevent flash)
 *  trace  150ms  — neon light draws the triangle outline (1 200ms)
 *  lit    1 400ms — triangle done; logo fades to full brightness with glow
 *  out    2 100ms — full overlay fades out
 *  done   2 750ms — unmount + remove data-intro from <html>
 *
 * Flash prevention:
 *  - <html> and <body> have inline background:#000 in layout.tsx (first paint)
 *  - A sync <script> in (store)/layout sets html[data-intro] before React
 *  - This component starts at phase="black" on SSR (no mounted guard)
 *  - data-intro is removed when the component unmounts (intro complete)
 */

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Phase = "black" | "trace" | "lit" | "out" | "done";

// Inverted triangle matching the ReadyMiix logo — spans nearly full image area
// M top-left  L top-right  L bottom-center  Z
const TRI  = "M 10 15 L 190 15 L 100 185 Z";
const PERI = 565; // top 180 + left ~192 + right ~192

export default function CinematicIntro() {
  const [phase, setPhase] = useState<Phase>("black");
  const timers            = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    // Clean up data-intro when this component unmounts (phase=done → return null)
    const unlockPage = () =>
      document.documentElement.removeAttribute("data-intro");

    try {
      if (sessionStorage.getItem("rm_intro")) {
        unlockPage();
        setPhase("done");
        return;
      }
      sessionStorage.setItem("rm_intro", "1");
    } catch {
      unlockPage();
      setPhase("done");
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      unlockPage();
      setPhase("done");
      return;
    }

    const ids = timers.current;
    const at  = (fn: () => void, ms: number) => { ids.push(setTimeout(fn, ms)); };

    at(() => setPhase("trace"), 150);
    at(() => setPhase("lit"),   1400);
    at(() => setPhase("out"),   2100);
    at(() => { unlockPage(); setPhase("done"); }, 2750);

    return () => ids.forEach(clearTimeout);
  }, []);

  if (phase === "done") return null;

  const tracing = phase === "trace";
  const lit     = phase === "lit" || phase === "out";
  const out     = phase === "out";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "#000000",
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
        opacity:    out ? 0 : 1,
        transition: out ? "opacity 600ms ease-in-out" : "none",
      }}
    >
      <div style={{
        position: "relative",
        width:  "clamp(200px, 45vw, 260px)",
        height: "clamp(200px, 45vw, 260px)",
      }}>

        {/* ── Logo PNG ──
            black phase:  invisible
            trace phase:  very dim (brightness 0.10) — reveals the shape as a reference
            lit phase:    full color + neon glow
        ── */}
        <Image
          src="/logo.png"
          alt="ReadyMiix"
          fill
          priority
          style={{
            objectFit: "contain",
            opacity: lit ? 1 : tracing ? 0.85 : 0,
            filter: lit
              ? [
                  "drop-shadow(0 0 30px rgba(247,37,133,0.90))",
                  "drop-shadow(0 0 70px rgba(247,37,133,0.50))",
                  "drop-shadow(0 0 140px rgba(123,47,190,0.35))",
                ].join(" ")
              : tracing
              ? "brightness(0.10) saturate(0)"
              : "brightness(0)",
            transition: tracing
              ? "opacity 300ms ease-out, filter 300ms ease-out"
              : "opacity 700ms ease-out, filter 700ms ease-out",
          }}
        />

        {/* ── SVG triangle trace overlay ── */}
        <svg
          viewBox="0 0 200 200"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            overflow: "visible",
          }}
        >
          <defs>
            <filter id="rm-neon" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="rm-dot" x="-400%" y="-400%" width="900%" height="900%">
              <feGaussianBlur stdDeviation="5.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ghost outline — barely visible reference */}
          <path d={TRI} fill="none" stroke="rgba(247,37,133,0.06)" strokeWidth="1" />

          {/* Animated neon stroke */}
          {(tracing || lit) && (
            <path
              d={TRI}
              fill="none"
              stroke={lit ? "rgba(247,37,133,0.30)" : "#F72585"}
              strokeWidth={lit ? 1.5 : 2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#rm-neon)"
              style={{
                strokeDasharray: PERI,
                ...(tracing
                  ? { animation: "rmTrace 1200ms cubic-bezier(0.4,0,0.2,1) forwards" }
                  : { strokeDashoffset: 0, transition: "stroke 500ms ease-out, stroke-width 500ms ease-out" }),
              }}
            />
          )}

          {/* Leading glow dot */}
          {tracing && (
            <>
              <path id="rm-tri" d={TRI} fill="none" stroke="none" />
              <g filter="url(#rm-dot)">
                <circle r="3.5" fill="white">
                  <animateMotion
                    dur="1.2s"
                    fill="freeze"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines="0.4 0 0.2 1"
                  >
                    <mpath href="#rm-tri" />
                  </animateMotion>
                </circle>
              </g>
            </>
          )}
        </svg>
      </div>
    </div>
  );
}
