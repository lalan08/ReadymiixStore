import Link from "next/link";
import {
  Sparkles, LayoutDashboard, Package, ShoppingBag, Tag,
  LogOut, Droplets, Coffee, Settings, Image as ImageIcon,
  Users, Store,
} from "lucide-react";

const NAV_GROUPS = [
  {
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Accueil" },
    ],
  },
  {
    label: "BOUTIQUE",
    items: [
      { href: "/admin/articles",   icon: Store, label: "Articles" },
      { href: "/admin/categories", icon: Tag,   label: "Catégories" },
    ],
  },
  {
    label: "COMPOSER",
    items: [
      { href: "/admin/products", icon: Package,  label: "Cocktails" },
      { href: "/admin/sirops",   icon: Droplets, label: "Sirops" },
      { href: "/admin/softs",    icon: Coffee,   label: "Softs" },
    ],
  },
  {
    label: "COMMANDES",
    items: [
      { href: "/admin/orders",  icon: ShoppingBag, label: "Commandes" },
      { href: "/admin/clients", icon: Users,       label: "Clients" },
    ],
  },
  {
    label: "MARKETING",
    items: [
      { href: "/admin/media", icon: ImageIcon, label: "Médias & Visuels" },
    ],
  },
  {
    label: "SYSTÈME",
    items: [
      { href: "/admin/settings", icon: Settings, label: "Paramètres" },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-darker flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col bg-brand-card border-r border-brand-border">
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
        <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={gi > 0 ? "mt-3" : ""}>
              {group.label && (
                <p className="text-[9px] font-bold text-brand-muted uppercase tracking-[0.18em] px-3 mb-1.5">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-muted hover:text-brand-text hover:bg-white/5 transition-colors group"
                >
                  <item.icon className="w-4 h-4 group-hover:text-brand-gold transition-colors shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-brand-border flex flex-col gap-1">
          <Link
            href="/"
            target="_blank"
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
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-brand-card border-b border-brand-border">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-sm text-brand-text">
            Ready<span className="text-gold-gradient">Miix</span>
          </span>
        </Link>
        <div className="flex gap-1 overflow-x-auto">
          {NAV_GROUPS.flatMap((g) => g.items).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-white/5 transition-colors shrink-0"
            >
              <item.icon className="w-4 h-4" />
            </Link>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8">{children}</div>
      </main>
    </div>
  );
}
