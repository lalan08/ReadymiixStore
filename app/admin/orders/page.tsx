import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, ORDER_PAYMENT_LABELS } from "@/lib/utils";
import { ShoppingBag, Clock, AlertTriangle } from "lucide-react";
import OrderStatusUpdate from "./OrderStatusUpdate";
import QuickOrderActions from "./QuickOrderActions";
import Link from "next/link";

export const metadata = { title: "Commandes" };
export const dynamic  = "force-dynamic";

const ACTIVE_STATUSES = ["PENDING", "PENDING_PAYMENT", "CONFIRMED", "PROCESSING"];
const DONE_STATUSES   = ["DELIVERED", "CANCELLED"];

interface Props { searchParams: { status?: string; view?: string; tab?: string } }

export default async function AdminOrdersPage({ searchParams }: Props) {
  const statusFilter = searchParams.status;
  const view         = searchParams.view ?? "today";
  const tab          = searchParams.tab  ?? "actives";

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const tabStatuses  = tab === "terminees" ? DONE_STATUSES : ACTIVE_STATUSES;
  const statusClause = statusFilter
    ? { status: statusFilter }
    : { status: { in: tabStatuses } };

  const whereBase = view === "today"
    ? { createdAt: { gte: todayStart }, ...statusClause }
    : statusClause;

  type OrderWithItems = Awaited<ReturnType<typeof prisma.order.findMany<{ include: { items: true } }>>>[number];
  let orders: OrderWithItems[] = [];
  let activeCount = 0;
  let doneCount   = 0;
  let pendingCount = 0;
  let dbError: string | null = null;

  const countWhere = (statuses: string[]) =>
    view === "today"
      ? { createdAt: { gte: todayStart }, status: { in: statuses } }
      : { status: { in: statuses } };

  try {
    [orders, activeCount, doneCount, pendingCount] = await Promise.all([
      prisma.order.findMany({
        where:   whereBase,
        include: { items: true },
        orderBy: tab === "actives"
          ? [{ pickupTime: "asc" }, { createdAt: "asc" }]
          : { createdAt: "desc" },
      }),
      prisma.order.count({ where: countWhere(ACTIVE_STATUSES) }),
      prisma.order.count({ where: countWhere(DONE_STATUSES) }),
      prisma.order.count({ where: { status: "PENDING" } }),
    ]);
  } catch (err) {
    console.error("[orders page]", err);
    try {
      [orders, activeCount, doneCount, pendingCount] = await Promise.all([
        prisma.order.findMany({
          where:   whereBase,
          include: { items: true },
          orderBy: { createdAt: "desc" },
        }),
        prisma.order.count({ where: countWhere(ACTIVE_STATUSES) }),
        prisma.order.count({ where: countWhere(DONE_STATUSES) }),
        prisma.order.count({ where: { status: "PENDING" } }),
      ]);
      dbError = "migration";
    } catch (err2) {
      console.error("[orders page fallback]", err2);
      dbError = "db";
    }
  }

  if (dbError === "db") {
    return (
      <div className="max-w-2xl flex flex-col gap-6">
        <h1 className="font-display text-2xl font-bold text-brand-text">Commandes</h1>
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
            <p className="font-bold text-red-300">Impossible de se connecter à la base de données</p>
          </div>
          <p className="text-sm text-brand-muted">
            Vérifie que la variable <code className="text-brand-gold bg-brand-darker px-1.5 py-0.5 rounded text-xs">DATABASE_URL</code> est bien configurée dans ton hébergeur.
          </p>
        </div>
      </div>
    );
  }

  const baseHref = (overrides: Record<string, string>) => {
    const p = new URLSearchParams({ view, tab, ...overrides });
    return `/admin/orders?${p.toString()}`;
  };

  return (
    <div className="max-w-6xl flex flex-col gap-6">

      {/* Migration banner */}
      {dbError === "migration" && (
        <div className="rounded-2xl border border-brand-warning/40 bg-brand-warning/10 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-brand-warning shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-brand-warning text-sm">Migration SQL à appliquer</p>
            <p className="text-xs text-brand-muted mt-1">
              Le tri par heure de retrait nécessite la migration <code className="text-brand-gold">prisma/migration_click_collect.sql</code> sur Neon.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-text">
            Commandes
          </h1>
          <p className="text-brand-muted text-sm mt-0.5">
            {orders.length} commande{orders.length > 1 ? "s" : ""}
            {pendingCount > 0 && (
              <span className="ml-2 text-brand-warning font-semibold">· {pendingCount} en attente</span>
            )}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-brand-darker border border-brand-border">
          <Link
            href={baseHref({ view: "today" })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              view === "today"
                ? "bg-brand-gold text-brand-darker"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            <Clock className="w-3 h-3" />
            Aujourd&apos;hui
          </Link>
          <Link
            href={baseHref({ view: "all" })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              view !== "today"
                ? "bg-brand-gold text-brand-darker"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            Toutes
          </Link>
        </div>
      </div>

      {/* Tab bar: Actives / Terminées */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-brand-darker border border-brand-border self-start">
        <Link
          href={baseHref({ tab: "actives" })}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab !== "terminees"
              ? "bg-brand-card text-brand-text shadow"
              : "text-brand-muted hover:text-brand-text"
          }`}
        >
          Actives
          {activeCount > 0 && (
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${
              tab !== "terminees"
                ? "bg-brand-warning/20 text-brand-warning"
                : "bg-brand-border text-brand-muted"
            }`}>
              {activeCount}
            </span>
          )}
        </Link>
        <Link
          href={baseHref({ tab: "terminees" })}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "terminees"
              ? "bg-brand-card text-brand-text shadow"
              : "text-brand-muted hover:text-brand-text"
          }`}
        >
          Terminées
          {doneCount > 0 && (
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-bold ${
              tab === "terminees"
                ? "bg-brand-border text-brand-muted"
                : "bg-brand-border text-brand-muted"
            }`}>
              {doneCount}
            </span>
          )}
        </Link>
      </div>

      {/* Status filter chips */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={baseHref({})}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            !statusFilter
              ? "bg-brand-gold/10 text-brand-gold border-brand-gold/30"
              : "text-brand-muted border-brand-border hover:border-brand-gold/30 hover:text-brand-text"
          }`}
        >
          Tous
        </Link>
        {tabStatuses.map((s) => (
          <Link
            key={s}
            href={baseHref({ status: s })}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              statusFilter === s
                ? "bg-brand-gold/10 text-brand-gold border-brand-gold/30"
                : "text-brand-muted border-brand-border hover:border-brand-gold/30 hover:text-brand-text"
            }`}
          >
            {ORDER_STATUS_LABELS[s] ?? s}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl bg-brand-card border border-brand-border">
          <ShoppingBag className="w-12 h-12 text-brand-muted" />
          <div className="text-center">
            <p className="font-display font-bold text-brand-text mb-1">
              {tab === "terminees" ? "Aucune commande terminée" : "Aucune commande active"}
            </p>
            <p className="text-brand-muted text-sm">
              {tab === "terminees"
                ? "Les commandes livrées ou annulées apparaîtront ici."
                : view === "today"
                  ? "Les commandes du jour apparaîtront ici."
                  : "Les commandes apparaîtront ici."}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-brand-card border border-brand-border p-5 flex flex-col gap-4"
              style={{
                borderLeftWidth: "3px",
                borderLeftColor:
                  order.status === "PENDING"         ? "rgb(245,158,11)" :
                  order.status === "PENDING_PAYMENT" ? "rgb(59,130,246)"  :
                  order.status === "CONFIRMED"       ? "rgb(20,184,166)"  :
                  order.status === "PROCESSING"      ? "rgb(168,85,247)"  :
                  order.status === "DELIVERED"       ? "rgb(34,197,94)"   :
                  order.status === "CANCELLED"       ? "rgb(239,68,68)"   : "transparent",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-display font-bold text-brand-gold text-lg">
                      {order.orderNumber}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${ORDER_STATUS_COLORS[order.status] ?? ""}`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                      order.paymentMethod === "card_online"
                        ? "text-brand-teal border-brand-teal/30 bg-brand-teal/10"
                        : "text-brand-warning border-brand-warning/30 bg-brand-warning/10"
                    }`}>
                      {ORDER_PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}
                    </span>
                  </div>
                  <p className="text-sm text-brand-muted">
                    {order.customerName} · {order.customerPhone}
                  </p>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-display font-bold text-xl text-brand-gold">
                    {formatPrice(order.total)}
                  </p>
                  {order.pickupTime && (
                    <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-brand-teal/10 text-brand-teal border border-brand-teal/20">
                      <Clock className="w-3 h-3" />
                      {order.pickupTime}
                    </span>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-1.5 border-t border-brand-border pt-3">
                {order.items.map((item) => {
                  let detail = "";
                  if (item.options) {
                    try {
                      const c = JSON.parse(item.options)?.caipi;
                      if (c) {
                        detail = `${c.taille} · ${c.preparation}`;
                        if (c.supplements?.length) detail += ` · +${c.supplements.join(", ")}`;
                      }
                    } catch {}
                  }
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-brand-muted">
                        {item.name} <span className="text-brand-text">×{item.quantity}</span>
                        {detail && (
                          <span className="block text-xs mt-0.5 text-brand-muted/70">{detail}</span>
                        )}
                      </span>
                      <span className="text-brand-text">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Notes */}
              {order.notes && (
                <p className="text-xs text-brand-muted italic border-t border-brand-border pt-2">
                  Note : {order.notes}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 border-t border-brand-border pt-3 flex-wrap">
                <QuickOrderActions orderId={order.id} currentStatus={order.status} />
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-brand-muted">Statut :</span>
                  <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
