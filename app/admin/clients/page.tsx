import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/utils";
import { Users, ShoppingBag } from "lucide-react";

export const metadata = { title: "Clients" };
export const dynamic  = "force-dynamic";

export default async function AdminClientsPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      total: true,
      status: true,
      createdAt: true,
      city: true,
    },
  });

  // Aggregate by email
  const clientMap = new Map<string, {
    name: string; email: string; phone: string; city: string | null;
    totalOrders: number; totalSpent: number; lastOrderAt: Date;
  }>();

  for (const o of orders) {
    if (!clientMap.has(o.customerEmail)) {
      clientMap.set(o.customerEmail, {
        name: o.customerName, email: o.customerEmail,
        phone: o.customerPhone, city: o.city,
        totalOrders: 0, totalSpent: 0, lastOrderAt: o.createdAt,
      });
    }
    const c = clientMap.get(o.customerEmail)!;
    c.totalOrders++;
    c.totalSpent += o.total;
    if (o.createdAt > c.lastOrderAt) {
      c.lastOrderAt = o.createdAt;
      if (o.city) c.city = o.city;
    }
  }

  const clients = Array.from(clientMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <div className="max-w-4xl flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-brand-text">Clients</h1>
        <p className="text-brand-muted text-sm mt-0.5">{clients.length} client{clients.length !== 1 ? "s" : ""} uniques</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Clients uniques",   value: clients.length.toString(),                               color: "text-brand-gold" },
          { label: "Commandes totales", value: orders.length.toString(),                                color: "text-brand-teal" },
          { label: "Panier moyen",      value: formatPrice(clients.reduce((s, c) => s + c.totalSpent, 0) / Math.max(orders.length, 1)), color: "text-brand-purple-light" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-brand-card border border-brand-border p-5">
            <p className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-brand-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 rounded-2xl bg-brand-card border border-brand-border">
          <Users className="w-12 h-12 text-brand-muted" />
          <p className="text-brand-text font-semibold">Aucun client pour le moment</p>
          <p className="text-brand-muted text-sm">Les clients apparaîtront ici dès qu&apos;une commande sera passée.</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3.5">Client</th>
                <th className="text-left px-4 py-3.5 hidden md:table-cell">Ville</th>
                <th className="text-center px-4 py-3.5 hidden sm:table-cell">Commandes</th>
                <th className="text-right px-4 py-3.5">Total dépensé</th>
                <th className="text-right px-5 py-3.5 hidden lg:table-cell">Dernière commande</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              {clients.map((client) => (
                <tr key={client.email} className="hover:bg-white/2 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-brand-gold">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-brand-text">{client.name}</p>
                        <p className="text-xs text-brand-muted">{client.email}</p>
                        <p className="text-xs text-brand-muted">{client.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-brand-muted text-xs">
                    {client.city ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-center hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-text">
                      <ShoppingBag className="w-3.5 h-3.5 text-brand-gold" />
                      {client.totalOrders}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-bold text-brand-gold">{formatPrice(client.totalSpent)}</span>
                  </td>
                  <td className="px-5 py-4 text-right hidden lg:table-cell text-xs text-brand-muted">
                    {formatDate(client.lastOrderAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
