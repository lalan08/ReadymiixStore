import { prisma } from "@/lib/prisma";
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import Link from "next/link";
import {
  ShoppingBag, Package, TrendingUp,
  ArrowRight, AlertTriangle, Clock,
  IceCream2, Euro, CheckCircle2,
} from "lucide-react";

export const metadata = { title: "Tableau de bord" };
export const dynamic  = "force-dynamic";

async function getDashboardData() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      todayOrders,
      pendingOrders,
      totalProducts,
      nextPickups,
      lowStockProducts,
      totalRevenue,
      todayRevenue,
      siropCount,
    ] = await Promise.all([
      prisma.order.findMany({
        where:   { createdAt: { gte: todayStart } },
        include: { items: true },
        orderBy: [{ pickupTime: "asc" }, { createdAt: "asc" }],
        take:    5,
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count({ where: { active: true } }),
      // Next pickups = PENDING/CONFIRMED orders today with pickupTime
      prisma.order.findMany({
        where: {
          createdAt:  { gte: todayStart },
          status:     { in: ["PENDING", "CONFIRMED"] },
          pickupTime: { not: null },
        },
        orderBy: { pickupTime: "asc" },
        take:    4,
        select:  { id: true, orderNumber: true, customerName: true, pickupTime: true, status: true },
      }),
      prisma.product.findMany({
        where:   { stock: { lte: 5 }, active: true },
        orderBy: { stock: "asc" },
        take:    5,
      }),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.aggregate({
        _sum:  { total: true },
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.sirop.count(),
    ]);

    return {
      todayOrders,
      todayCount:    todayOrders.length,
      todayRevenue:  todayRevenue._sum.total ?? 0,
      pendingOrders,
      totalProducts,
      nextPickups,
      lowStockProducts,
      totalRevenue:  totalRevenue._sum.total ?? 0,
      needsSetup:    siropCount === 0,
    };
  } catch {
    return {
      todayOrders:   [],
      todayCount:    0,
      todayRevenue:  0,
      pendingOrders: 0,
      totalProducts: 0,
      nextPickups:   [],
      lowStockProducts: [],
      totalRevenue:  0,
      needsSetup:    true,
    };
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="max-w-6xl flex flex-col gap-8">

      {/* Setup banner */}
      {data.needsSetup && (
        <div className="rounded-2xl border border-brand-warning/40 bg-brand-warning/10 p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-1">
            <p className="font-bold text-brand-warning text-sm">Base de données non initialisée</p>
            <p className="text-brand-muted text-xs mt-1">
              Clique sur le bouton pour créer les tables et ajouter les données par défaut.
            </p>
          </div>
          <a
            href="/api/setup"
            target="_blank"
            className="shrink-0 bg-brand-warning text-brand-darker font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            Initialiser maintenant
          </a>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-text">
            Tableau de bord
          </h1>
          <p className="text-brand-muted text-sm mt-1">Vue d&apos;ensemble · Aujourd&apos;hui</p>
        </div>
        <Link
          href="/admin/orders?view=today"
          className="flex items-center gap-1.5 text-xs text-brand-gold border border-brand-gold/30 hover:bg-brand-gold/5 px-3 py-1.5 rounded-xl transition-colors"
        >
          Voir les commandes du jour <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Today's stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "CA aujourd'hui",
            value: formatPrice(data.todayRevenue),
            icon:  Euro,
            color: "text-brand-gold",
            bg:    "bg-brand-gold/10 border-brand-gold/20",
          },
          {
            label: "Commandes aujourd'hui",
            value: data.todayCount.toString(),
            icon:  IceCream2,
            color: "text-brand-teal",
            bg:    "bg-brand-teal/10 border-brand-teal/20",
          },
          {
            label: "En attente",
            value: data.pendingOrders.toString(),
            icon:  Clock,
            color: data.pendingOrders > 0 ? "text-brand-warning" : "text-brand-success",
            bg:    data.pendingOrders > 0 ? "bg-brand-warning/10 border-brand-warning/20" : "bg-brand-success/10 border-brand-success/20",
          },
          {
            label: "CA total",
            value: formatPrice(data.totalRevenue),
            icon:  TrendingUp,
            color: "text-brand-purple-light",
            bg:    "bg-brand-purple/10 border-brand-purple/20",
          },
        ].map((stat) => (
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
        {/* Prochains retraits */}
        <div className="rounded-2xl bg-brand-card border border-brand-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-brand-text flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-teal" />
              Prochains retraits
            </h2>
            <Link
              href="/admin/orders?view=today&status=PENDING"
              className="text-xs text-brand-gold hover:text-brand-gold-light flex items-center gap-1 transition-colors"
            >
              Tout voir <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {data.nextPickups.length === 0 ? (
            <div className="flex items-center gap-2 py-8 justify-center">
              <CheckCircle2 className="w-5 h-5 text-brand-success" />
              <p className="text-brand-success text-sm font-medium">Aucune commande en attente</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {data.nextPickups.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-brand-darker"
                >
                  <div>
                    <p className="text-sm font-semibold text-brand-text">{order.orderNumber}</p>
                    <p className="text-xs text-brand-muted">{order.customerName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${ORDER_STATUS_COLORS[order.status] ?? ""}`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-brand-teal">
                      <Clock className="w-3 h-3" />
                      {order.pickupTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's orders mini-list */}
        <div className="rounded-2xl bg-brand-card border border-brand-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-brand-text flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-gold" />
              Commandes du jour
            </h2>
            <Link
              href="/admin/orders?view=today"
              className="text-xs text-brand-gold hover:text-brand-gold-light flex items-center gap-1 transition-colors"
            >
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {data.todayOrders.length === 0 ? (
            <p className="text-brand-muted text-sm text-center py-8">Aucune commande aujourd&apos;hui</p>
          ) : (
            <div className="flex flex-col gap-2">
              {data.todayOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-brand-text">{order.orderNumber}</p>
                    <p className="text-xs text-brand-muted">{order.customerName}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-bold text-brand-gold">
                      {formatPrice(order.total)}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${ORDER_STATUS_COLORS[order.status] ?? "text-brand-muted"}`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Frozen Caïpis quick link */}
        <Link
          href="/admin/caipi"
          className="rounded-2xl bg-brand-card border border-brand-border p-6 hover:border-brand-gold/30 hover:bg-brand-gold/5 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shrink-0">
              <IceCream2 className="w-7 h-7 text-brand-gold" />
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-brand-text group-hover:text-brand-gold transition-colors">
                Frozen Caïpis
              </h2>
              <p className="text-xs text-brand-muted mt-0.5">
                Gérer les parfums, prix et suppléments
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-muted group-hover:text-brand-gold transition-colors" />
          </div>
        </Link>

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
            <div className="flex items-center gap-2 py-4 justify-center">
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
                          product.stock === 0 ? "bg-brand-error" :
                          product.stock <= 3  ? "bg-brand-warning" : "bg-brand-success"
                        }`}
                        style={{ width: `${Math.min((product.stock / 10) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${
                      product.stock === 0 ? "text-brand-error" :
                      product.stock <= 3  ? "text-brand-warning" : "text-brand-success"
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
    </div>
  );
}
