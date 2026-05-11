"use client";

/**
 * Cinematic brand intro — light-from-darkness reveal.
 *
 * The logo is always present but invisible in the black.
 * A light source slowly intensifies (brightness 0→1), like a spotlight
 * warming up on stage — no opacity fade, which feels web-like.
 * The premium comes from the black, the silence and the slow timing.
 *
 * Phases:
 *  black  0 ms   — deep black silence (SSR-rendered, prevents flash)
 *  in     400ms  — brightness builds over 1 600ms
 *  out    2 100ms — overlay dissolves over 550ms
 *  done   2 680ms — unmount + data-intro removed
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

    at(() => setPhase("in"),  400);   // 400ms black silence before anything
    at(() => setPhase("out"), 2100);  // hold the logo fully lit
    at(() => { unlockPage(); setPhase("done"); }, 2680);

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
        background: "#000000",
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none",
        opacity:    out ? 0 : 1,
        transition: out ? "opacity 550ms ease-in-out" : "none",
      }}
    >
      {/* Atmospheric ambient — a barely-there glow in the background.
          Builds very slowly (2s) so it never feels like a flash. */}
      <div style={{
        position: "absolute", inset: 0,
        background: [
          "radial-gradient(ellipse 55% 45% at 50% 50%,",
          "  rgba(247,37,133,0.07) 0%,",
          "  rgba(123,47,190,0.04) 45%,",
          "  transparent 70%)",
        ].join(""),
        opacity:    lit ? 1 : 0,
        transition: "opacity 2200ms ease-out",
      }} />

      {/* Logo — brightness-only reveal, no opacity animation.
          The easing (0.04,0.62,0.23,0.98) keeps the logo nearly
          invisible for the first ~600ms then lets brightness build,
          mimicking a real light source warming up. */}
      <Image
        src="/logo.png"
        alt="ReadyMiix"
        width={320}
        height={320}
        priority
        style={{
          width:    "clamp(220px, 55vw, 320px)",
          height:   "auto",
          display:  "block",
          position: "relative",
          transform: lit ? "scale(1)" : "scale(1.04)",
          filter: lit
            ? [
                "brightness(1)",
                "saturate(1.10)",
                "blur(0px)",
                "drop-shadow(0 0 20px rgba(247,37,133,0.50))",
                "drop-shadow(0 0 60px rgba(247,37,133,0.20))",
                "drop-shadow(0 0 150px rgba(123,47,190,0.14))",
              ].join(" ")
            : [
                "brightness(0)",
                "saturate(0)",
                "blur(6px)",
                "drop-shadow(0 0 0px rgba(247,37,133,0))",
                "drop-shadow(0 0 0px rgba(247,37,133,0))",
                "drop-shadow(0 0 0px rgba(123,47,190,0))",
              ].join(" "),
          transition: [
            "filter    1600ms cubic-bezier(0.04, 0.62, 0.23, 0.98)",
            "transform 1400ms cubic-bezier(0.25, 1, 0.5, 1)",
          ].join(", "),
        }}
      />
    </div>
  );
}
