"use client";

import Link from "next/link";
import { Sparkles, Snowflake } from "lucide-react";

export default function HeroCTAs() {
  return (
    <div className="animate-slide-in-up [animation-delay:240ms] flex flex-col items-center gap-3 w-full max-w-[380px]">

      {/* Primary CTA */}
      <Link
        href="/composer"
        className="hero-cta-primary group relative w-full flex items-center justify-center gap-3 px-8 py-[18px] rounded-full font-bold text-[11px] md:text-[12px] uppercase tracking-[0.18em] overflow-hidden active:scale-[0.97]"
      >
        <Sparkles className="w-4 h-4 shrink-0 relative z-10" />
        <span className="relative z-10">Composer mon ReadyMiix</span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[700ms] pointer-events-none" />
      </Link>

      {/* Secondary CTA */}
      <Link
        href="/shop?category=cocktails"
        className="hero-cta-secondary group w-full flex items-center justify-center gap-2.5 px-8 py-[16px] rounded-full font-semibold text-[10px] md:text-[11px] uppercase tracking-[0.2em] active:scale-[0.97]"
      >
        <Snowflake className="w-4 h-4 shrink-0" />
        <span>Découvrir les Frozen Caipi</span>
      </Link>

    </div>
  );
}
