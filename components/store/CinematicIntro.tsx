"use client";

/**
 * Cinematic brand intro — logo as the hero experience
 *
 * Phases:
 *  black  0 ms   – pure black, panels sealed
 *  glow   200ms  – smoke + pink/violet halo expand behind logo
 *  logo   580ms  – logo "neon-on": blur→sharp, dark→lit with glow
 *  text   1 400ms – READYMIIX + tagline fade in
 *  reveal 2 000ms – split panels slide up/down, stage fades
 *  done   3 000ms – unmount
 */

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Phase = "black" | "glow" | "logo" | "text" | "reveal" | "done";

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

    at(() => setPhase("glow"),   200);
    at(() => setPhase("logo"),   580);
    at(() => setPhase("text"),   1400);
    at(() => setPhase("reveal"), 2000);
    at(() => setPhase("done"),   3000);

    return () => ids.forEach(clearTimeout);
  }, []);

  if (!mounted || phase === "done") return null;

  const afterBlack = phase !== "black";
  const logoLit    = phase === "logo"  || phase === "text" || phase === "reveal";
  const showText   = phase === "text"  || phase === "reveal";
  const isReveal   = phase === "reveal";

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[200] overflow-hidden pointer-events-none">

      {/* ─── Split panels ─────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: "0 0 auto 0", height: "52%",
        background: "#020208",
        transition: isReveal ? "transform 920ms cubic-bezier(0.76,0,0.24,1)" : "none",
        transform:  isReveal ? "translateY(-102%)" : "translateY(0)",
      }} />
      <div style={{
        position: "absolute", inset: "auto 0 0 0", height: "52%",
        background: "#020208",
        transition: isReveal ? "transform 920ms cubic-bezier(0.76,0,0.24,1)" : "none",
        transform:  isReveal ? "translateY(102%)"  : "translateY(0)",
      }} />
      {/* seal the thin gap between panels */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: "49%", height: "4%",
        background: "#020208",
        opacity:    isReveal ? 0 : 1,
        transition: isReveal ? "opacity 300ms" : "none",
      }} />

      {/* ─── Stage (camera slow-zoom) ────────────────────────── */}
      {afterBlack && (
        <div
          className="rm-camera-in"
          style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            opacity:    isReveal ? 0 : 1,
            transition: isReveal ? "opacity 480ms ease-in" : "none",
          }}
        >
          {/* ── Tropical smoke — 3 layers ────────── */}
          <div style={{
            position: "absolute", bottom: "22%", left: "18%",
            width: 280, height: 90, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(247,37,133,0.07) 0%, transparent 70%)",
            filter: "blur(22px)",
            animation: "rmSmokeDrift 2.6s ease-in-out forwards",
          }} />
          <div style={{
            position: "absolute", bottom: "16%", right: "16%",
            width: 240, height: 80, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(123,47,190,0.07) 0%, transparent 70%)",
            filter: "blur(20px)",
            animation: "rmSmokeDrift 2.8s ease-in-out 0.25s forwards",
          }} />
          <div style={{
            position: "absolute", bottom: "10%", left: "38%",
            width: 320, height: 65, borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(0,210,200,0.04) 0%, transparent 70%)",
            filter: "blur(26px)",
            animation: "rmSmokeDrift 3.0s ease-in-out 0.1s forwards",
          }} />

          {/* ── Ambient glow halos ───────────────── */}
          {/* Central pink halo */}
          <div style={{
            position: "absolute",
            width: 360, height: 360, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(247,37,133,0.20) 0%, rgba(247,37,133,0.07) 40%, transparent 68%)",
            filter: "blur(38px)",
            transform: logoLit ? "scale(1)"   : "scale(0.25)",
            opacity:   logoLit ? 1             : 0,
            transition: "transform 1100ms cubic-bezier(0.22,1,0.36,1), opacity 1000ms ease-out",
          }} />
          {/* Secondary violet halo — offset */}
          <div style={{
            position: "absolute",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(123,47,190,0.16) 0%, transparent 62%)",
            filter: "blur(32px)",
            marginLeft: -120,
            transform: logoLit ? "scale(1)"   : "scale(0.2)",
            opacity:   logoLit ? 0.9           : 0,
            transition: "transform 1200ms cubic-bezier(0.22,1,0.36,1) 0.08s, opacity 1100ms ease-out 0.08s",
          }} />
          {/* Teal accent halo — offset opposite */}
          <div style={{
            position: "absolute",
            width: 240, height: 240, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,210,200,0.10) 0%, transparent 62%)",
            filter: "blur(28px)",
            marginLeft: 100,
            transform: logoLit ? "scale(1)"   : "scale(0.2)",
            opacity:   logoLit ? 0.7           : 0,
            transition: "transform 1300ms cubic-bezier(0.22,1,0.36,1) 0.12s, opacity 1200ms ease-out 0.12s",
          }} />

          {/* ── Ring pulse — expands outward on logo-lit ── */}
          {logoLit && (
            <div style={{
              position: "absolute",
              width: 132, height: 132, borderRadius: "50%",
              border: "1px solid rgba(247,37,133,0.55)",
              boxShadow: "0 0 10px rgba(247,37,133,0.35)",
              animation: "rmRingPulse 750ms ease-out forwards",
            }} />
          )}

          {/* ── Logo ─────────────────────────────── */}
          <div style={{ position: "relative", zIndex: 10 }}>
            <Image
              src="/logo.png"
              alt="ReadyMiix"
              width={136}
              height={136}
              priority
              className="w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 object-contain"
              style={{
                opacity:   logoLit ? 1 : 0,
                transform: logoLit ? "scale(1)" : "scale(1.08)",
                filter:    logoLit
                  ? [
                      "brightness(1)",
                      "blur(0px)",
                      "drop-shadow(0 0 55px rgba(247,37,133,0.98))",
                      "drop-shadow(0 0 120px rgba(247,37,133,0.55))",
                      "drop-shadow(0 0 240px rgba(123,47,190,0.35))",
                    ].join(" ")
                  : "brightness(0) blur(14px)",
                transition: [
                  "opacity 950ms ease-out",
                  "filter 1100ms ease-out",
                  "transform 950ms cubic-bezier(0.22,1,0.36,1)",
                ].join(", "),
              }}
            />
          </div>

          {/* ── Brand text ───────────────────────── */}
          <div style={{
            textAlign: "center",
            marginTop: 22,
            opacity:   showText ? 1 : 0,
            transform: showText ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 700ms ease-out, transform 700ms ease-out",
          }}>
            {/* Brand name */}
            <p style={{
              fontFamily: "var(--font-bebas, 'Bebas Neue', Impact, sans-serif)",
              fontSize: "clamp(1.1rem, 3.5vw, 1.9rem)",
              letterSpacing: "0.30em",
              color: "#ffffff",
              lineHeight: 1,
              textShadow: "0 0 50px rgba(255,255,255,0.10)",
            }}>
              READYMIIX
            </p>

            {/* Thin separator */}
            <div style={{
              margin: "9px auto",
              width: 32,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(247,37,133,0.6), transparent)",
              boxShadow: "0 0 6px rgba(247,37,133,0.4)",
            }} />

            {/* Tagline */}
            <p style={{
              fontSize: 8,
              fontWeight: 700,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
            }}>
              GUYANE 973 · COCKTAILS PREMIUM
            </p>
          </div>

          {/* ── Lateral neon columns ─────────────── */}
          {(["left", "right"] as const).map((side) => (
            <div key={side} style={{
              position: "absolute", top: 0, bottom: 0, [side]: "7%",
              width: 1,
              background: side === "left"
                ? "linear-gradient(to bottom, transparent 10%, rgba(247,37,133,0.14) 50%, transparent 90%)"
                : "linear-gradient(to bottom, transparent 10%, rgba(123,47,190,0.14) 50%, transparent 90%)",
              opacity:    showText ? 0.6 : 0,
              transition: "opacity 1400ms ease",
            }} />
          ))}
        </div>
      )}
    </div>
  );
}
