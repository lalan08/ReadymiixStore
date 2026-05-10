"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

/* ── Phase sequence ────────────────────────────────────────────
   black  → pure black panels covering screen
   logo   → logo fades in with pink glow (150ms)
   title  → headline fades in below logo (900ms)
   scan   → neon scan line wipes in left→right (1500ms)
   reveal → split panels slide away, content fades (1850ms)
   done   → component unmounts (2800ms)
──────────────────────────────────────────────────────────────── */
type Phase = "black" | "logo" | "title" | "scan" | "reveal" | "done";

export default function CinematicIntro() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase]     = useState<Phase>("black");
  const timers                = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    setMounted(true);

    // Only once per browser session
    try {
      if (sessionStorage.getItem("rm_intro")) { setPhase("done"); return; }
      sessionStorage.setItem("rm_intro", "1");
    } catch { setPhase("done"); return; }

    // Respect user motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done"); return;
    }

    const ids = timers.current;
    const at = (fn: () => void, ms: number) => { ids.push(setTimeout(fn, ms)); };

    at(() => setPhase("logo"),   150);
    at(() => setPhase("title"),  900);
    at(() => setPhase("scan"),   1550);
    at(() => setPhase("reveal"), 1900);
    at(() => setPhase("done"),   2900);

    return () => ids.forEach(clearTimeout);
  }, []);

  if (!mounted || phase === "done") return null;

  const showLogo  = phase !== "black";
  const showTitle = phase === "title"  || phase === "scan" || phase === "reveal";
  const showScan  = phase === "scan"   || phase === "reveal";
  const isReveal  = phase === "reveal";

  /* Shared timing helpers */
  const fadeIn   = "opacity 700ms ease-out, transform 700ms ease-out";
  const revealFX = "opacity 550ms ease-in";

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[200] overflow-hidden pointer-events-none">

      {/* ── Top panel ── */}
      <div
        style={{
          position: "absolute", inset: "0 0 auto 0",
          height: "52%",
          background: "#020208",
          transition: isReveal ? "transform 920ms cubic-bezier(0.76,0,0.24,1)" : "none",
          transform: isReveal ? "translateY(-102%)" : "translateY(0)",
        }}
      />

      {/* ── Bottom panel ── */}
      <div
        style={{
          position: "absolute", inset: "auto 0 0 0",
          height: "52%",
          background: "#020208",
          transition: isReveal ? "transform 920ms cubic-bezier(0.76,0,0.24,1)" : "none",
          transform: isReveal ? "translateY(102%)" : "translateY(0)",
        }}
      />

      {/* ── Thin centre strip — seals panels gap ── */}
      <div
        style={{
          position: "absolute", left: 0, right: 0,
          top: "49%", height: "4%",
          background: "#020208",
          opacity: isReveal ? 0 : 1,
          transition: isReveal ? "opacity 400ms" : "none",
        }}
      />

      {/* ── Pink ambient glow ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: showLogo ? 1 : 0,
          transition: "opacity 1s ease",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: 340, height: 340,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(247,37,133,0.20) 0%, rgba(123,47,190,0.10) 45%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

      {/* ── Centre content — logo + scan + title ── */}
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          opacity: isReveal ? 0 : 1,
          transition: isReveal ? revealFX : "none",
        }}
      >
        {/* Logo */}
        <div
          style={{
            opacity: showLogo ? 1 : 0,
            transform: showLogo ? "translateY(0)" : "translateY(18px)",
            transition: fadeIn,
          }}
        >
          <Image
            src="/logo.png"
            alt="ReadyMiix"
            width={120}
            height={120}
            priority
            className="w-24 h-24 md:w-28 md:h-28 object-contain"
            style={{
              filter:
                "drop-shadow(0 0 50px rgba(247,37,133,0.95)) " +
                "drop-shadow(0 0 110px rgba(247,37,133,0.5))  " +
                "drop-shadow(0 0 220px rgba(123,47,190,0.3))",
            }}
          />
        </div>

        {/* Neon scan line — wipes left → right */}
        <div
          style={{
            width: "min(360px, 78vw)",
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(123,47,190,0.85) 25%, #F72585 50%, rgba(123,47,190,0.85) 75%, transparent 100%)",
            boxShadow: "0 0 14px 3px rgba(247,37,133,0.65)",
            transformOrigin: "left center",
            transform: showScan ? "scaleX(1)" : "scaleX(0)",
            opacity: showScan ? 1 : 0,
            transition: "transform 480ms cubic-bezier(0.22,1,0.36,1), opacity 300ms ease",
          }}
        />

        {/* Headline */}
        <div
          style={{
            textAlign: "center",
            opacity: showTitle ? 1 : 0,
            transform: showTitle ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 600ms ease-out, transform 600ms ease-out",
          }}
        >
          <p
            className="font-display uppercase tracking-tight"
            style={{
              fontSize: "clamp(2rem,8vw,4.5rem)",
              lineHeight: 0.9,
              color: "#ffffff",
              textShadow: "0 0 60px rgba(255,255,255,0.12)",
            }}
          >
            BIEN FRAIS
          </p>
          <p
            className="font-display uppercase tracking-tight"
            style={{
              fontSize: "clamp(2rem,8vw,4.5rem)",
              lineHeight: 0.9,
              background: "linear-gradient(135deg, #C5006A 0%, #F72585 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 28px rgba(247,37,133,0.75))",
            }}
          >
            TOUJOURS PRÊT
          </p>
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "rgba(255,255,255,0.28)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              marginTop: 12,
            }}
          >
            GUYANE 973 · COCKTAILS PREMIUM
          </p>
        </div>
      </div>

      {/* ── Side neon columns — appear with title ── */}
      {(["left", "right"] as const).map((side) => (
        <div
          key={side}
          style={{
            position: "absolute",
            top: 0, bottom: 0,
            [side]: "9%",
            width: 1,
            background:
              side === "left"
                ? "linear-gradient(to bottom, transparent, rgba(247,37,133,0.18), transparent)"
                : "linear-gradient(to bottom, transparent, rgba(123,47,190,0.18), transparent)",
            opacity: showTitle && !isReveal ? 0.7 : 0,
            transition: "opacity 1s ease",
          }}
        />
      ))}
    </div>
  );
}
