"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";

const TABS = [
  { href: "/",     Icon: Home,       label: "Accueil"  },
  { href: "/shop", Icon: Store,      label: "Boutique" },
  { href: "/cart", Icon: ShoppingBag, label: "Panier"  },
];

export default function BottomNav() {
  const pathname  = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-darker/92 backdrop-blur-2xl border-t border-white/[0.06]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/35 to-transparent" />

      <div className="flex items-stretch h-16">
        {TABS.map(({ href, Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          const isCart   = href === "/cart";

          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 relative transition-all duration-200 cursor-pointer ${
                isActive ? "text-brand-gold" : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {/* Active top indicator */}
              {isActive && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-brand-gold"
                  style={{ boxShadow: "0 0 8px rgba(247,37,133,0.9)" }}
                />
              )}

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

              <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
