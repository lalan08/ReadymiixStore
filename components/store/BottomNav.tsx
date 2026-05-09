"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Sparkles, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/lib/store";

const TABS = [
  { href: "/",         Icon: Home,         label: "Accueil"  },
  { href: "/shop",     Icon: ShoppingBag,  label: "Boutique" },
  { href: "/composer", Icon: Sparkles,     label: "Composer", highlight: true },
  { href: "/cart",     Icon: ShoppingCart, label: "Panier"   },
  { href: "/about",    Icon: User,         label: "Profil"   },
];

export default function BottomNav() {
  const pathname   = usePathname();
  const itemCount  = useCartStore((s) => s.itemCount());

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-brand-card/95 backdrop-blur-xl border-t border-brand-border">
      <div className="flex items-stretch h-16">
        {TABS.map(({ href, Icon, label, highlight }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          const isCart   = href === "/cart";

          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 relative transition-colors ${
                isActive && !highlight ? "text-brand-gold" : highlight ? "" : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {highlight ? (
                <div className={`w-12 h-12 -mt-7 rounded-full bg-gradient-to-br from-brand-gold-dark to-brand-gold flex items-center justify-center shadow-gold transition-transform ${isActive ? "scale-110" : "hover:scale-105"}`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {isCart && itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 rounded-full bg-brand-gold text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                      {itemCount > 9 ? "9+" : itemCount}
                    </span>
                  )}
                </div>
              )}
              <span className={`text-[9px] font-bold uppercase tracking-widest leading-none ${highlight ? "mt-1 text-brand-muted" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
