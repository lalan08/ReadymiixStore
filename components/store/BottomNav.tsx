"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Sparkles, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/lib/store";

const ALL_TABS = [
  { href: "/",         Icon: Home,         label: "Accueil"  },
  { href: "/shop",     Icon: ShoppingBag,  label: "Boutique" },
  { href: "/composer", Icon: Sparkles,     label: "Mixer",   highlight: true, composerOnly: true },
  { href: "/cart",     Icon: ShoppingCart, label: "Panier"   },
  { href: "/about",    Icon: User,         label: "Profil"   },
];

export default function BottomNav({ composerEnabled = true }: { composerEnabled?: boolean }) {
  const pathname  = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (pathname.startsWith("/admin")) return null;

  const TABS = ALL_TABS.filter((t) => composerEnabled || !t.composerOnly);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-darker/92 backdrop-blur-2xl border-t border-white/[0.06]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Subtle pink line at the very top of nav */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/35 to-transparent" />

      <div className="flex items-stretch h-16">
        {TABS.map(({ href, Icon, label, highlight }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          const isCart   = href === "/cart";

          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 relative transition-all duration-200 cursor-pointer ${
                isActive && !highlight
                  ? "text-brand-gold"
                  : highlight
                  ? ""
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {/* Active top indicator */}
              {isActive && !highlight && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand-gold"
                  style={{ boxShadow: "0 0 8px rgba(247,37,133,0.9)" }}
                />
              )}

              {highlight ? (
                <div
                  className={`relative w-12 h-12 -mt-7 rounded-full flex items-center justify-center transition-transform ${
                    isActive ? "scale-110" : "hover:scale-105"
                  }`}
                  style={{
                    background: "linear-gradient(135deg, #C5006A, #F72585)",
                    boxShadow: isActive
                      ? "0 0 30px rgba(247,37,133,0.75), 0 4px 16px rgba(0,0,0,0.4)"
                      : "0 0 20px rgba(247,37,133,0.5), 0 4px 12px rgba(0,0,0,0.3)",
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className={`relative transition-all duration-200 ${isActive ? "scale-110" : ""}`}>
                  <Icon className="w-5 h-5" />
                  {isCart && mounted && itemCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-brand-gold text-white text-[9px] font-bold flex items-center justify-center px-0.5"
                      style={{ boxShadow: "0 0 6px rgba(247,37,133,0.8)" }}
                    >
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </div>
              )}

              <span
                className={`text-[9px] font-bold uppercase tracking-widest leading-none ${
                  highlight ? "mt-1 text-brand-muted/60" : ""
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
