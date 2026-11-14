"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles, ShoppingBag, Tag,
  LogOut, Settings, Store, Menu, X, IceCream2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS: {
  href: string;
  icon: React.ElementType;
  label: string;
  sub?: { href: string; icon: React.ElementType; label: string }[];
}[] = [
  {
    href:  "/admin/orders",
    icon:  ShoppingBag,
    label: "Commandes",
  },
  {
    href:  "/admin/caipi",
    icon:  IceCream2,
    label: "Frozen Caïpis",
  },
  {
    href:  "/admin/articles",
    icon:  Store,
    label: "Boutique",
    sub: [
      { href: "/admin/articles",   icon: Store, label: "Articles" },
      { href: "/admin/categories", icon: Tag,   label: "Catégories" },
    ],
  },
  {
    href:  "/admin/settings",
    icon:  Settings,
    label: "Paramètres",
  },
];

function NavSection({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const isParentActive = pathname === item.href
          || (item.sub?.some(s => pathname === s.href) ?? false);

        if (item.sub) {
          return (
            <div key={item.href}>
              {/* Parent — not a link, just a label */}
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                isParentActive ? "text-brand-gold" : "text-brand-muted"
              )}>
                <item.icon className={cn("w-4 h-4 shrink-0", isParentActive ? "text-brand-gold" : "")} />
                {item.label}
              </div>
              {/* Sub-items */}
              <div className="ml-4 flex flex-col gap-0.5 border-l border-brand-border/40 pl-3">
                {item.sub.map((sub) => {
                  const active = pathname === sub.href;
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors group",
                        active
                          ? "text-brand-gold bg-brand-gold/10"
                          : "text-brand-muted hover:text-brand-text hover:bg-white/5"
                      )}
                    >
                      <sub.icon className={cn("w-3.5 h-3.5 shrink-0 transition-colors", active ? "text-brand-gold" : "group-hover:text-brand-gold")} />
                      {sub.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }

        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group",
              active
                ? "text-brand-gold bg-brand-gold/10"
                : "text-brand-muted hover:text-brand-text hover:bg-white/5"
            )}
          >
            <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", active ? "text-brand-gold" : "group-hover:text-brand-gold")} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="p-3 border-t border-brand-border flex flex-col gap-1">
      <Link
        href="/"
        target="_blank"
        onClick={onNavigate}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-muted hover:text-brand-text hover:bg-white/5 transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        Voir la boutique
      </Link>
      <form action="/api/admin/logout" method="POST">
        <button
          type="submit"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-muted hover:text-brand-error hover:bg-brand-error/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </form>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  return (
    <div className="min-h-screen bg-brand-darker flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-brand-card border-r border-brand-border">
        {/* Logo */}
        <div className="p-5 border-b border-brand-border">
          <Link href="/admin/orders" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-brand-text leading-none">
                Ready<span className="text-gold-gradient">Miix</span>
              </p>
              <p className="text-[9px] text-brand-muted uppercase tracking-widest leading-none mt-0.5">
                Admin
              </p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
          <NavSection pathname={pathname} />
        </nav>

        {/* Bottom */}
        <SidebarFooter />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-brand-card border-b border-brand-border">
        <Link href="/admin/orders" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-sm text-brand-text">
            Ready<span className="text-gold-gradient">Miix</span>
          </span>
        </Link>
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex items-center justify-center w-10 h-10 rounded-xl border border-brand-border/50 text-brand-text hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={cn(
          "md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
      />

      {/* Mobile drawer panel */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] flex flex-col bg-brand-card border-r border-brand-border transition-transform duration-300 ease-out",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!drawerOpen}
      >
        {/* Drawer header (logo + close) */}
        <div className="p-5 border-b border-brand-border flex items-center justify-between">
          <Link href="/admin/orders" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-brand-text leading-none">
                Ready<span className="text-gold-gradient">Miix</span>
              </p>
              <p className="text-[9px] text-brand-muted uppercase tracking-widest leading-none mt-0.5">
                Admin
              </p>
            </div>
          </Link>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Fermer le menu"
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-brand-border/50 text-brand-text hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer nav */}
        <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
          <NavSection pathname={pathname} onNavigate={() => setDrawerOpen(false)} />
        </nav>

        {/* Drawer footer */}
        <SidebarFooter onNavigate={() => setDrawerOpen(false)} />
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
