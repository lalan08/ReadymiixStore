"use client";

/**
 * Cinematic brand intro — Batman / Spider-Verse style logo reveal.
 *
 * The logo materialises from absolute darkness: brightness and focus
 * build slowly, atmospheric glow settles around the mark, then the
 * overlay dissolves. No bouncing, no particles, no pulse.
 * The premium comes from the black, the silence and the timing.
 *
 * Phases:
 *  black  0 ms   — deep black, silence (SSR-rendered, prevents flash)
 *  in     300ms  — logo emerges from shadow over 1 200ms
 *  out    1 800ms — overlay dissolves over 500ms
 *  done   2 350ms — unmount + remove data-intro
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

    at(() => setPhase("in"),  300);
    at(() => setPhase("out"), 1800);
    at(() => { unlockPage(); setPhase("done"); }, 2350);

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
        // Dissolve the overlay — not the logo — at the end
        opacity:    out ? 0 : 1,
        transition: out ? "opacity 500ms ease-in-out" : "none",
      }}
    >
      <Image
        src="/logo.png"
        alt="ReadyMiix"
        width={280}
        height={280}
        priority
        style={{
          width:   "clamp(200px, 52vw, 280px)",
          height:  "auto",
          display: "block",

          // Shadow state: completely dark, slightly blurred, fractionally larger
          // Lit state:    full colour, sharp, atmospheric glow settled around the mark
          opacity:   lit ? 1 : 0,
          transform: lit ? "scale(1)" : "scale(1.05)",

          // Filter functions MUST match in count and order between states
          // so the browser can interpolate each one smoothly.
          filter: lit
            ? [
                "brightness(1)",
                "saturate(1.08)",
                "blur(0px)",
                "drop-shadow(0 0 22px rgba(247,37,133,0.55))",
                "drop-shadow(0 0 70px rgba(247,37,133,0.22))",
                "drop-shadow(0 0 180px rgba(123,47,190,0.16))",
              ].join(" ")
            : [
                "brightness(0)",
                "saturate(0.4)",
                "blur(10px)",
                "drop-shadow(0 0 0px rgba(247,37,133,0))",
                "drop-shadow(0 0 0px rgba(247,37,133,0))",
                "drop-shadow(0 0 0px rgba(123,47,190,0))",
              ].join(" "),

          // Slow ease — the slowness IS the premium
          // filter runs 100ms longer than opacity/transform for the depth-of-field lag
          transition: [
            "opacity    1200ms cubic-bezier(0.16, 1, 0.3, 1)",
            "transform  1200ms cubic-bezier(0.16, 1, 0.3, 1)",
            "filter     1300ms cubic-bezier(0.16, 1, 0.3, 1)",
          ].join(", "),
        }}
      />
    </div>
  );
}
