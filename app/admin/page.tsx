import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import Link from "next/link";
import {
  ShoppingBag, Package, TrendingUp, Users,
  ArrowRight, AlertTriangle, Clock,
} from "lucide-react";

export const metadata = { title: "Tableau de bord" };
export const dynamic  = "force-dynamic";

async function getDashboardData() {
  const [
    totalOrders,
    pendingOrders,
    totalProducts,
    recentOrders,
    lowStockProducts,
    revenue,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.count({ where: { active: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: { select: { quantity: true } } },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 }, active: true },
      orderBy: { stock: "asc" },
      take: 5,
    }),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  return {
    totalOrders,
    pendingOrders,
    totalProducts,
    recentOrders,
    lowStockProducts,
    totalRevenue: revenue._sum.total ?? 0,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const stats = [
    {
      label:   "Chiffre d'affaires",
      value:   formatPrice(data.totalRevenue),
      icon:    TrendingUp,
      color:   "text-brand-gold",
      bg:      "bg-brand-gold/10 border-brand-gold/20",
    },
    {
      label:   "Commandes totales",
      value:   data.totalOrders.toString(),
      icon:    ShoppingBag,
      color:   "text-brand-teal",
      bg:      "bg-brand-teal/10 border-brand-teal/20",
    },
    {
      label:   "Commandes en attente",
      value:   data.pendingOrders.toString(),
      icon:    Clock,
      color:   "text-brand-warning",
      bg:      "bg-brand-warning/10 border-brand-warning/20",
    },
    {
      label:   "Produits actifs",
      value:   data.totalProducts.toString(),
      icon:    Package,
      color:   "text-brand-purple-light",
      bg:      "bg-brand-purple/10 border-brand-purple/20",
    },
  ];

  return (
    <div className="max-w-6xl flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-text">
          Tableau de bord
        </h1>
        <p className="text-brand-muted text-sm mt-1">
          Vue d&apos;ensemble de votre boutique ReadyMiix
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl bg-brand-card border border-brand-border flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-brand-muted mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="rounded-2xl bg-brand-card border border-brand-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-brand-text flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              Dernières commandes
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-brand-gold hover:text-brand-gold-light flex items-center gap-1 transition-colors"
            >
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {data.recentOrders.length === 0 ? (
            <p className="text-brand-muted text-sm text-center py-8">Aucune commande pour le moment</p>
          ) : (
            <div className="flex flex-col gap-2">
              {data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders?id=${order.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-brand-text">{order.orderNumber}</p>
                    <p className="text-xs text-brand-muted">
                      {order.customerName} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-brand-gold">
                      {formatPrice(order.total)}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${ORDER_STATUS_COLORS[order.status] ?? "text-brand-muted"}`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Low stock */}
        <div className="rounded-2xl bg-brand-card border border-brand-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-brand-text flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-brand-warning" />
              Stock faible
            </h2>
            <Link
              href="/admin/products"
              className="text-xs text-brand-gold hover:text-brand-gold-light flex items-center gap-1 transition-colors"
            >
              Gérer <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {data.lowStockProducts.length === 0 ? (
            <div className="flex items-center gap-2 py-8 justify-center">
              <Package className="w-5 h-5 text-brand-success" />
              <p className="text-brand-success text-sm font-medium">Tous les stocks sont OK !</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {data.lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 rounded-xl"
                >
                  <p className="text-sm text-brand-text">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-brand-border rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          product.stock === 0
                            ? "bg-brand-error"
                            : product.stock <= 3
                            ? "bg-brand-warning"
                            : "bg-brand-success"
                        }`}
                        style={{ width: `${Math.min((product.stock / 10) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${
                      product.stock === 0
                        ? "text-brand-error"
                        : product.stock <= 3
                        ? "text-brand-warning"
                        : "text-brand-success"
                    }`}>
                      {product.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl bg-brand-card border border-brand-border p-6">
        <h2 className="font-display font-bold text-brand-text mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/admin/products?new=true", label: "Ajouter un produit",    icon: Package },
            { href: "/admin/orders",            label: "Voir les commandes",    icon: ShoppingBag },
            { href: "/admin/categories",        label: "Gérer les catégories",  icon: Users },
            { href: "/",                        label: "Voir la boutique",      icon: ArrowRight },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-border hover:border-brand-gold/40 hover:bg-brand-gold/5 text-sm font-medium text-brand-muted hover:text-brand-text transition-all"
            >
              <action.icon className="w-4 h-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
