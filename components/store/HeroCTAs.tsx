"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function HeroCTAs() {
  return (
    <div className="animate-slide-in-up [animation-delay:420ms] flex flex-col items-stretch gap-4 w-full max-w-[340px] md:max-w-[360px]">

      {/* Single primary CTA — Boutique First */}
      <Link
        href="/shop"
        className="hero-cta-primary group relative w-full flex items-center justify-center gap-3 px-8 py-[16px] md:py-[20px] rounded-2xl font-display text-base md:text-lg uppercase tracking-widest overflow-hidden active:scale-[0.97]"
      >
        <ShoppingBag className="w-4 h-4 shrink-0 relative z-10" />
        <span className="relative z-10">Voir la boutique</span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[700ms] pointer-events-none" />
      </Link>

    </div>
  );
}
