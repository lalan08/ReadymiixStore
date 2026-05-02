import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import OrderStatusUpdate from "./OrderStatusUpdate";

export const metadata = { title: "Commandes" };
export const dynamic  = "force-dynamic";

const STATUS_LIST = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

interface Props { searchParams: { status?: string } }

export default async function AdminOrdersPage({ searchParams }: Props) {
  const statusFilter = searchParams.status;

  const orders = await prisma.order.findMany({
    where:   statusFilter ? { status: statusFilter } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-text">
            Commandes
          </h1>
          <p className="text-brand-muted text-sm mt-0.5">
            {orders.length} commande{orders.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        <a
          href="/admin/orders"
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
            !statusFilter
              ? "bg-brand-gold/10 text-brand-gold border-brand-gold/30"
              : "text-brand-muted border-brand-border hover:border-brand-gold/30 hover:text-brand-text"
          }`}
        >
          Toutes ({orders.length})
        </a>
        {STATUS_LIST.map((s) => (
          <a
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              statusFilter === s
                ? "bg-brand-gold/10 text-brand-gold border-brand-gold/30"
                : "text-brand-muted border-brand-border hover:border-brand-gold/30 hover:text-brand-text"
            }`}
          >
            {ORDER_STATUS_LABELS[s] ?? s}
          </a>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl bg-brand-card border border-brand-border">
          <ShoppingBag className="w-12 h-12 text-brand-muted" />
          <div className="text-center">
            <p className="font-display font-bold text-brand-text mb-1">Aucune commande</p>
            <p className="text-brand-muted text-sm">Les commandes apparaîtront ici.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-brand-card border border-brand-border p-5 flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-display font-bold text-brand-gold text-lg">
                      {order.orderNumber}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${ORDER_STATUS_COLORS[order.status] ?? ""}`}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </div>
                  <p className="text-sm text-brand-muted">
                    {order.customerName} · {order.customerEmail} · {order.customerPhone}
                  </p>
                  <p className="text-xs text-brand-muted mt-0.5">
                    {formatDate(order.createdAt)} · {order.city}
                    {order.paymentMethod === "cash_on_delivery" && " · Paiement à la livraison"}
                    {order.paymentMethod === "bank_transfer" && " · Virement bancaire"}
                    {order.paymentMethod === "whatsapp" && " · WhatsApp"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-xl text-brand-gold">
                    {formatPrice(order.total)}
                  </p>
                  {order.deliveryFee === 0 && (
                    <p className="text-xs text-brand-success">Livraison gratuite</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-1.5 border-t border-brand-border pt-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-brand-muted">
                      {item.name} <span className="text-brand-text">×{item.quantity}</span>
                    </span>
                    <span className="text-brand-text">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {order.notes && (
                <p className="text-xs text-brand-muted italic border-t border-brand-border pt-2">
                  Note : {order.notes}
                </p>
              )}

              {/* Update status */}
              <div className="flex items-center gap-3 border-t border-brand-border pt-3 flex-wrap">
                <span className="text-xs text-brand-muted">Mettre à jour le statut :</span>
                <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
