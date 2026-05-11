"use client";

/**
 * Cinematic brand intro — fade in, glow, subtle pulse, fade out.
 *
 * Phases:
 *  black  0 ms   — pure black (SSR-rendered to prevent flash)
 *  in     150ms  — logo fades in with neon glow (950ms ease)
 *  out    1 700ms — overlay fades out (600ms)
 *  done   2 350ms — unmount + remove data-intro from <html>
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

    at(() => setPhase("in"),  150);
    at(() => setPhase("out"), 1700);
    at(() => { unlockPage(); setPhase("done"); }, 2350);

    return () => ids.forEach(clearTimeout);
  }, []);

  if (phase === "done") return null;

  const visible = phase === "in" || phase === "out";
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
      {/*
        Wrapper: carries the pulse animation (starts after fade-in completes).
        Image:   carries the fade-in transition.
        Separating them avoids animation/transition conflicts on the same property.
      */}
      <div style={{
        animation: visible
          ? "rmLogoPulse 2.8s ease-in-out 980ms infinite"
          : "none",
      }}>
        <Image
          src="/logo.png"
          alt="ReadyMiix"
          width={280}
          height={280}
          priority
          style={{
            width:   "clamp(190px, 52vw, 280px)",
            height:  "auto",
            display: "block",
            opacity:   visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(1.07)",
            filter: visible
              ? [
                  "drop-shadow(0 0 30px rgba(247,37,133,0.95))",
                  "drop-shadow(0 0 70px rgba(247,37,133,0.55))",
                  "drop-shadow(0 0 140px rgba(123,47,190,0.40))",
                  "drop-shadow(0 0 220px rgba(0,200,220,0.18))",
                ].join(" ")
              : "brightness(0) blur(10px)",
            transition: [
              "opacity 950ms ease-out",
              "transform 950ms cubic-bezier(0.22,1,0.36,1)",
              "filter 950ms ease-out",
            ].join(", "),
          }}
        />
      </div>
    </div>
  );
}
