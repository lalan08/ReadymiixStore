"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import CartDrawer from "@/components/store/CartDrawer";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted]   = useState(false);
  const { itemCount, openCart } = useCartStore();
  const count                   = itemCount();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass shadow-[0_2px_30px_rgba(0,0,0,0.6)] border-b border-brand-border"
            : "bg-transparent"
        )}
      >
        <div className="container-custom">
          <nav className="flex items-center justify-between h-[72px] md:h-[80px] overflow-visible">

            {/* Logo — légèrement oversized pour déborder du header sans en changer la hauteur */}
            <Link href="/" aria-label="ReadyMiix Store — Accueil">
              <Image
                src="/logo.png"
                alt="ReadyMiix Store"
                width={96}
                height={96}
                priority
                className="w-[86px] h-[86px] md:w-[96px] md:h-[96px] object-contain"
              />
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              aria-label="Panier"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-brand-border/50 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all"
            >
              <ShoppingCart className="w-5 h-5 text-brand-muted" />
              {mounted && count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-brand-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-fade-in">
                  {count}
                </span>
              )}
            </button>

          </nav>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}
