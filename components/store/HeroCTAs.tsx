"use client";

import Link from "next/link";
import { Sparkles, Snowflake } from "lucide-react";

export default function HeroCTAs() {
  return (
    <div className="animate-slide-in-up [animation-delay:420ms] flex flex-col items-stretch gap-4 md:gap-5 w-full max-w-[340px] md:max-w-[360px]">

      {/* Primary CTA */}
      <Link
        href="/composer"
        className="hero-cta-primary group relative w-full flex items-center justify-center gap-3 px-8 py-[14px] md:py-[18px] rounded-2xl font-display text-base md:text-lg uppercase tracking-widest overflow-hidden active:scale-[0.97]"
      >
        <Sparkles className="w-4 h-4 shrink-0 relative z-10" />
        <span className="relative z-10">Composer mon ReadyMiix</span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[700ms] pointer-events-none" />
      </Link>

      {/* Secondary CTA */}
      <Link
        href="/shop?category=cocktails"
        className="hero-cta-secondary group w-full flex items-center justify-center gap-2.5 px-8 py-[12px] md:py-[16px] rounded-2xl font-display text-sm md:text-base uppercase tracking-widest active:scale-[0.97]"
      >
        <Snowflake className="w-4 h-4 shrink-0" />
        <span>Découvrir les Frozen Caipi</span>
      </Link>

    </div>
  );
}
