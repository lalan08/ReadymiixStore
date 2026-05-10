"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Phase = "black" | "in" | "out" | "done";

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

    at(() => setPhase("in"),   80);
    at(() => setPhase("out"),  1400);
    at(() => setPhase("done"), 2050);

    return () => ids.forEach(clearTimeout);
  }, []);

  if (!mounted || phase === "done") return null;

  const visible = phase === "in" || phase === "out";
  const leaving = phase === "out";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        opacity:    leaving ? 0 : 1,
        transition: leaving ? "opacity 580ms ease-in-out" : "none",
      }}
    >
      <Image
        src="/logo.png"
        alt="ReadyMiix"
        width={240}
        height={240}
        priority
        style={{
          width:     "clamp(160px, 40vw, 240px)",
          height:    "auto",
          opacity:   visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(1.10)",
          filter:    visible
            ? [
                "drop-shadow(0 0 40px rgba(247,37,133,0.85))",
                "drop-shadow(0 0 90px rgba(247,37,133,0.45))",
                "drop-shadow(0 0 180px rgba(123,47,190,0.35))",
              ].join(" ")
            : "brightness(0) blur(10px)",
          transition: [
            "opacity 900ms ease-out",
            "transform 900ms cubic-bezier(0.22,1,0.36,1)",
            "filter 900ms ease-out",
          ].join(", "),
        }}
      />
    </div>
  );
}
