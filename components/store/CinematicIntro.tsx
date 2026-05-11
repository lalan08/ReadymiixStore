"use client";

/**
 * Cinematic brand intro — the real logo illuminates itself
 *
 * No SVG triangle is drawn on screen. The logo PNG is the only visual.
 * A neon point travels an invisible triangle path while the logo
 * brightens from black — creating the illusion the light is energising
 * the triangle border that already exists inside the logo.
 *
 * Phases:
 *  black  0 ms   — pure black / SSR (prevents flash)
 *  trace  200ms  — logo brightens 0→dim over 1 300ms, neon dot travels 1 200ms
 *  lit    1 500ms — logo snaps to full color + pink/violet neon glow
 *  out    2 100ms — overlay fades out
 *  done   2 750ms — unmount, remove data-intro from <html>
 */

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Phase = "black" | "trace" | "lit" | "out" | "done";

// Motion path for the dot — matches the ReadyMiix inverted triangle.
// This path is NEVER rendered on screen; it only guides the animateMotion.
const MOTION_PATH = "M 8 12 L 192 12 L 100 188 Z";

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

    at(() => setPhase("trace"), 200);
    at(() => setPhase("lit"),   1500);
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
        width:  "clamp(220px, 55vw, 300px)",
        height: "clamp(220px, 55vw, 300px)",
      }}>

        {/* ── The real logo — only visual element on screen ──
            black : invisible
            trace : rises from pure black to dim (logo becomes faintly visible
                    as the neon dot travels, like it's being energised)
            lit   : full color + pink/violet neon glow
        ── */}
        <Image
          src="/logo.png"
          alt="ReadyMiix"
          fill
          priority
          style={{
            objectFit: "contain",
            opacity: phase === "black" ? 0 : 1,
            filter: tracing
              ? "brightness(0.18)"
              : lit
              ? [
                  "brightness(1)",
                  "drop-shadow(0 0 34px rgba(247,37,133,1))",
                  "drop-shadow(0 0 80px rgba(247,37,133,0.60))",
                  "drop-shadow(0 0 160px rgba(123,47,190,0.42))",
                ].join(" ")
              : "brightness(0)",
            // trace: logo eases from brightness(0) → brightness(0.18) over 1 300ms
            //        in sync with the dot travel (1 200ms)
            // lit:   snaps to full brightness in 750ms
            transition: phase === "black"
              ? "none"
              : tracing
              ? "opacity 60ms, filter 1300ms linear"
              : "filter 750ms ease-out",
          }}
        />

        {/* ── Neon traveling dot — only active during trace ──
            Uses an invisible SVG path as the motion guide.
            The dot itself is a bright bloomed point that creates
            the impression it is "lighting up" the triangle border.
        ── */}
        {tracing && (
          <svg
            viewBox="0 0 200 200"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              overflow: "visible",
            }}
          >
            <defs>
              {/* Large soft bloom — simulates a hot neon spark */}
              <filter id="rm-spark" x="-600%" y="-600%" width="1300%" height="1300%">
                <feGaussianBlur stdDeviation="9" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Hidden guide path — invisible, only drives animateMotion */}
            <path id="rm-guide" d={MOTION_PATH} fill="none" stroke="none" />

            {/* Outer pink bloom */}
            <circle r="6" fill="rgba(247,37,133,0.7)" filter="url(#rm-spark)">
              <animateMotion
                dur="1.2s" fill="freeze"
                calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"
              >
                <mpath href="#rm-guide" />
              </animateMotion>
            </circle>

            {/* Bright white core */}
            <circle r="2.5" fill="white">
              <animateMotion
                dur="1.2s" fill="freeze"
                calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1"
              >
                <mpath href="#rm-guide" />
              </animateMotion>
            </circle>
          </svg>
        )}
      </div>
    </div>
  );
}
