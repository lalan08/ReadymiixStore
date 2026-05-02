import Link from "next/link";
import { Sparkles, LayoutDashboard, Package, ShoppingBag, Tag, LogOut, Menu } from "lucide-react";

const navItems = [
  { href: "/admin",          icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/admin/products", icon: Package,         label: "Produits" },
  { href: "/admin/orders",   icon: ShoppingBag,     label: "Commandes" },
  { href: "/admin/categories", icon: Tag,           label: "Catégories" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-darker flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col bg-brand-card border-r border-brand-border">
        {/* Logo */}
        <div className="p-5 border-b border-brand-border">
          <Link href="/admin" className="flex items-center gap-2">
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
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-muted hover:text-brand-text hover:bg-white/5 transition-colors group"
            >
              <item.icon className="w-4 h-4 group-hover:text-brand-gold transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-brand-border flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-muted hover:text-brand-text hover:bg-white/5 transition-colors"
          >
            <Menu className="w-4 h-4" />
            Voir la boutique
          </Link>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-muted hover:text-brand-error hover:bg-brand-error/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-brand-card border-b border-brand-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-sm text-brand-text">
              Ready<span className="text-gold-gradient">Miix</span> Admin
            </span>
          </Link>
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-white/5 transition-colors"
              >
                <item.icon className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex-1 p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
