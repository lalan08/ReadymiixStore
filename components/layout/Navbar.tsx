"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import CartDrawer from "@/components/store/CartDrawer";

const allNavLinks = [
  { href: "/",          label: "Accueil" },
  { href: "/composer",  label: "Composer 🎯", composerOnly: true },
  { href: "/shop",      label: "Boutique" },
  { href: "/about",     label: "Notre histoire" },
  { href: "/contact",   label: "Contact" },
];

export default function Navbar({ composerEnabled = true }: { composerEnabled?: boolean }) {
  const navLinks = allNavLinks.filter((l) => composerEnabled || !l.composerOnly);

  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [mounted, setMounted]     = useState(false);
  const pathname                  = usePathname();
  const { itemCount, openCart }   = useCartStore();
  const count                     = itemCount();

  useEffect(() => { setMounted(true); }, []);

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
          {/* Compact navbar — logo lives in the hero, not here. Items are
              clustered to the right so they sit visually opposite the big
              neon mark in the hero. */}
          <nav className="flex items-center justify-end gap-3 md:gap-6 lg:gap-9 h-[52px] md:h-[60px] lg:h-[64px]">

            {/* Tablet + desktop links — gap tighter on tablet */}
            <ul className="hidden md:flex items-center md:gap-5 lg:gap-7">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "md:text-xs lg:text-sm font-medium transition-colors relative group",
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
                {mounted && count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-brand-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-fade-in">
                    {count}
                  </span>
                )}
              </button>

              <Link
                href="/shop"
                className="group hidden md:inline-flex items-center gap-2 relative text-white md:text-[11px] lg:text-sm font-bold md:px-4 md:py-2 lg:px-5 lg:py-2.5 rounded-xl active:scale-[0.97] uppercase tracking-wide overflow-hidden transition-transform duration-150"
                style={{
                  background: "linear-gradient(135deg, #C5006A, #F72585)",
                  boxShadow: "0 0 20px rgba(247,37,133,0.4)",
                }}
              >
                <span className="relative z-10">Commander</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none" />
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
