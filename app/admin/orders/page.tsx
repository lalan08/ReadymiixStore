import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, ORDER_PAYMENT_LABELS } from "@/lib/utils";
import { ShoppingBag, Clock } from "lucide-react";
import OrderStatusUpdate from "./OrderStatusUpdate";
import QuickOrderActions from "./QuickOrderActions";
import Link from "next/link";

export const metadata = { title: "Commandes" };
export const dynamic  = "force-dynamic";

const STATUS_LIST = ["PENDING", "PENDING_PAYMENT", "CONFIRMED", "PROCESSING", "DELIVERED", "CANCELLED"];

interface Props { searchParams: { status?: string; view?: string } }

export default async function AdminOrdersPage({ searchParams }: Props) {
  const statusFilter = searchParams.status;
  const view         = searchParams.view ?? "today";

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const whereToday = {
    createdAt: { gte: todayStart },
    ...(statusFilter ? { status: statusFilter } : {}),
  };
  const whereAll = statusFilter ? { status: statusFilter } : undefined;

  const [orders, todayCount, pendingCount] = await Promise.all([
    prisma.order.findMany({
      where:   view === "today" ? whereToday : whereAll,
      include: { items: true },
      orderBy: view === "today"
        ? [{ pickupTime: "asc" }, { createdAt: "asc" }]
        : { createdAt: "desc" },
    }),
    prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="max-w-6xl flex flex-col gap-6">

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
            href="/admin/orders?view=today"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              view === "today"
                ? "bg-brand-gold text-brand-darker"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            <Clock className="w-3 h-3" />
            Aujourd&apos;hui ({todayCount})
          </Link>
          <Link
            href="/admin/orders?view=all"
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

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/orders?view=${view}`}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            !statusFilter
              ? "bg-brand-gold/10 text-brand-gold border-brand-gold/30"
              : "text-brand-muted border-brand-border hover:border-brand-gold/30 hover:text-brand-text"
          }`}
        >
          Tous
        </Link>
        {STATUS_LIST.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?view=${view}&status=${s}`}
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
              {view === "today" ? "Aucune commande aujourd'hui" : "Aucune commande"}
            </p>
            <p className="text-brand-muted text-sm">
              {view === "today" ? "Les commandes du jour apparaîtront ici." : "Les commandes apparaîtront ici."}
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
                  order.status === "PENDING"    ? "rgb(245,158,11)" :
                  order.status === "PROCESSING" ? "rgb(168,85,247)" :
                  order.status === "DELIVERED"  ? "rgb(34,197,94)"  :
                  order.status === "CANCELLED"  ? "rgb(239,68,68)"  : "transparent",
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
                    {/* Payment badge */}
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
                  {/* Pickup time badge */}
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
