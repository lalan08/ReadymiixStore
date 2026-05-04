"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import CartDrawer from "@/components/store/CartDrawer";

const navLinks = [
  { href: "/",        label: "Accueil" },
  { href: "/shop",    label: "Boutique" },
  { href: "/about",   label: "Notre histoire" },
  { href: "/contact", label: "Contact" },
];

/* ── Logo SVG — style rétro néon, proche du vrai logo ── */
function RMXLogo({ size = 44 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        {/* Neon pink glow */}
        <filter id="pinkNeon" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Teal glow */}
        <filter id="tealNeon" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── Diamond outline (2 triangles = 1 losange) ── */}
      {/* Upper triangle */}
      <polygon
        points="100,10 185,100 15,100"
        fill="none"
        stroke="#FF1493"
        strokeWidth="3.5"
        filter="url(#pinkNeon)"
      />
      {/* Lower triangle */}
      <polygon
        points="15,100 185,100 100,190"
        fill="none"
        stroke="#FF1493"
        strokeWidth="3.5"
        filter="url(#pinkNeon)"
      />

      {/* ── Palm trees (simplified silhouettes) ── */}
      {/* Left palm trunk */}
      <rect x="62" y="55" width="5" height="45" fill="#7B2FBE" rx="2" />
      {/* Left palm leaves */}
      <ellipse cx="64" cy="52" rx="16" ry="8" fill="#7B2FBE" transform="rotate(-20,64,52)" />
      <ellipse cx="64" cy="52" rx="14" ry="7" fill="#7B2FBE" transform="rotate(15,64,52)" />
      <ellipse cx="64" cy="52" rx="12" ry="6" fill="#7B2FBE" transform="rotate(-50,64,52)" />

      {/* Center palm trunk */}
      <rect x="98" y="40" width="5" height="58" fill="#6B1FBE" rx="2" />
      {/* Center palm leaves */}
      <ellipse cx="100" cy="37" rx="20" ry="10" fill="#6B1FBE" transform="rotate(-10,100,37)" />
      <ellipse cx="100" cy="37" rx="18" ry="9" fill="#6B1FBE" transform="rotate(20,100,37)" />
      <ellipse cx="100" cy="37" rx="16" ry="8" fill="#6B1FBE" transform="rotate(-40,100,37)" />
      <ellipse cx="100" cy="37" rx="14" ry="7" fill="#6B1FBE" transform="rotate(45,100,37)" />

      {/* Right palm trunk */}
      <rect x="134" y="55" width="5" height="45" fill="#7B2FBE" rx="2" />
      {/* Right palm leaves */}
      <ellipse cx="136" cy="52" rx="16" ry="8" fill="#7B2FBE" transform="rotate(20,136,52)" />
      <ellipse cx="136" cy="52" rx="14" ry="7" fill="#7B2FBE" transform="rotate(-15,136,52)" />
      <ellipse cx="136" cy="52" rx="12" ry="6" fill="#7B2FBE" transform="rotate(50,136,52)" />

      {/* ── READYMIIX text ── */}
      <text
        x="100"
        y="124"
        textAnchor="middle"
        fill="#00D2C8"
        fontSize="26"
        fontWeight="900"
        fontFamily="'Arial Black', Impact, sans-serif"
        letterSpacing="1.5"
        filter="url(#tealNeon)"
      >
        READYMIIX
      </text>

      {/* ── Teal underline swoosh ── */}
      <path
        d="M 35,130 Q 100,138 165,130"
        fill="none"
        stroke="#00D2C8"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#tealNeon)"
      />

      {/* ── STORE text ── */}
      <text
        x="100"
        y="155"
        textAnchor="middle"
        fill="white"
        fontSize="20"
        fontStyle="italic"
        fontWeight="700"
        fontFamily="Georgia, 'Times New Roman', serif"
        letterSpacing="3"
      >
        STORE
      </text>
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pathname                  = usePathname();
  const { itemCount, openCart }   = useCartStore();
  const count                     = itemCount();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

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
          <nav className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center group" aria-label="ReadyMiix Store — Accueil">
              <RMXLogo size={56} />
            </Link>

            {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors relative group",
                      pathname === link.href
                        ? "text-brand-gold"
                        : "text-brand-muted hover:text-brand-text"
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-px bg-brand-gold transition-all duration-200",
                        pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={openCart}
                aria-label="Panier"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl border border-brand-border/50 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all"
              >
                <ShoppingCart className="w-5 h-5 text-brand-muted" />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-brand-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-fade-in">
                    {count}
                  </span>
                )}
              </button>

              <Link
                href="/shop"
                className="hidden md:inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold hover:from-brand-gold hover:to-brand-gold-light text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-gold-sm hover:shadow-gold transition-all active:scale-[0.98] uppercase tracking-wide"
              >
                Commander
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl border border-brand-border/50"
              >
                {menuOpen ? (
                  <X className="w-5 h-5 text-brand-text" />
                ) : (
                  <Menu className="w-5 h-5 text-brand-text" />
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden glass border-t border-brand-border animate-slide-up">
            <ul className="container-custom flex flex-col py-4 gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      pathname === link.href
                        ? "text-brand-gold bg-brand-gold/10"
                        : "text-brand-muted hover:text-brand-text hover:bg-white/5"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href="/shop"
                  className="flex items-center justify-center w-full bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white text-sm font-bold px-5 py-3 rounded-xl uppercase tracking-wide"
                >
                  Commander maintenant
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
