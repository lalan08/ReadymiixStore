"use client";

/**
 * Cinematic brand intro — neon light traces the triangle, then logo ignites
 *
 * Phases:
 *  black  0 ms   — pure black
 *  trace  150ms  — neon light draws the triangle outline (1 200ms)
 *  lit    1 400ms — triangle complete; logo PNG fades in with glow
 *  out    2 100ms — full overlay fades to black→transparent
 *  done   2 750ms — unmount
 */

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Phase = "black" | "trace" | "lit" | "out" | "done";

// Equilateral triangle — viewBox 200×200, circumradius 82, centroid at (100,106)
// Pointing upward, proportioned to match the ReadyMiix triangle logo
const TRI  = "M 100 18 L 171 152 L 29 152 Z";
const PERI = 424; // ≈ perimeter of the above triangle

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

    at(() => setPhase("trace"), 150);
    at(() => setPhase("lit"),   1400);
    at(() => setPhase("out"),   2100);
    at(() => setPhase("done"),  2750);

    return () => ids.forEach(clearTimeout);
  }, []);

  if (!mounted || phase === "done") return null;

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
        width:  "clamp(180px, 42vw, 240px)",
        height: "clamp(180px, 42vw, 240px)",
      }}>

        {/* ── Logo PNG — hidden until trace is complete ── */}
        <Image
          src="/logo.png"
          alt="ReadyMiix"
          fill
          priority
          style={{
            objectFit: "contain",
            opacity:   lit ? 1 : 0,
            filter: lit
              ? [
                  "drop-shadow(0 0 30px rgba(247,37,133,0.85))",
                  "drop-shadow(0 0 70px rgba(247,37,133,0.45))",
                  "drop-shadow(0 0 140px rgba(123,47,190,0.32))",
                ].join(" ")
              : "brightness(0)",
            transition: "opacity 650ms ease-out, filter 650ms ease-out",
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
            {/* Neon blur for the traced stroke */}
            <filter id="rm-neon" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            {/* Intense bloom for the leading dot */}
            <filter id="rm-dot" x="-400%" y="-400%" width="900%" height="900%">
              <feGaussianBlur stdDeviation="5.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ghost triangle — barely visible base */}
          <path
            d={TRI}
            fill="none"
            stroke="rgba(247,37,133,0.07)"
            strokeWidth="1"
          />

          {/* Animated neon stroke — draws itself via rmTrace CSS keyframe */}
          {(tracing || lit) && (
            <path
              d={TRI}
              fill="none"
              stroke={lit ? "rgba(247,37,133,0.35)" : "#F72585"}
              strokeWidth={lit ? 1.5 : 2}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#rm-neon)"
              style={{
                strokeDasharray: PERI,
                ...(tracing
                  ? { animation: `rmTrace 1200ms cubic-bezier(0.4,0,0.2,1) forwards` }
                  : { strokeDashoffset: 0, transition: "stroke 500ms ease-out, stroke-width 500ms ease-out" }),
              }}
            />
          )}

          {/* Leading glow dot — follows the triangle path during trace */}
          {tracing && (
            <>
              <path id="rm-tri" d={TRI} fill="none" stroke="none" />
              <g filter="url(#rm-dot)">
                <circle r="3" fill="white">
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
