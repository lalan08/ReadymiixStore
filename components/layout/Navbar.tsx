"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
              <Image
                src="/logo.png"
                alt="ReadyMiix Store"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
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
