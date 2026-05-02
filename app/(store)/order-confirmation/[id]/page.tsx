import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, formatDate, ORDER_STATUS_LABELS } from "@/lib/utils";
import Link from "next/link";
import { CheckCircle, Package, MessageCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Commande confirmée" };

interface Props { params: { id: string } }

export default async function OrderConfirmationPage({ params }: Props) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });

  if (!order) notFound();

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "594694000000";
  const waMsg    = encodeURIComponent(
    `Bonjour ReadyMiix ! Je viens de passer la commande ${order.orderNumber}. Pouvez-vous confirmer ?`
  );

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container-custom max-w-2xl">
        {/* Success header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-brand-success/15 border border-brand-success/30 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-brand-success" />
          </div>
          <h1 className="font-display text-3xl font-bold text-brand-text mb-2">
            Commande confirmée !
          </h1>
          <p className="text-brand-muted">
            Merci {order.customerName.split(" ")[0]} ! Votre commande{" "}
            <span className="font-bold text-brand-gold">{order.orderNumber}</span> a bien été reçue.
          </p>
        </div>

        {/* Order details */}
        <div className="rounded-2xl bg-brand-card border border-brand-border p-6 mb-6">
          <h2 className="font-display font-bold text-brand-text mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-gold" />
            Détails de la commande
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-5 text-sm">
            <div>
              <p className="text-brand-muted">Numéro de commande</p>
              <p className="font-bold text-brand-gold">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-brand-muted">Date</p>
              <p className="font-medium text-brand-text">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-brand-muted">Statut</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-warning/15 text-brand-warning border border-brand-warning/30">
                {ORDER_STATUS_LABELS[order.status] ?? order.status}
              </span>
            </div>
            <div>
              <p className="text-brand-muted">Mode de paiement</p>
              <p className="font-medium text-brand-text capitalize">
                {order.paymentMethod === "cash_on_delivery" && "Paiement à la livraison"}
                {order.paymentMethod === "bank_transfer" && "Virement bancaire"}
                {order.paymentMethod === "whatsapp" && "Via WhatsApp"}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-2 border-t border-brand-border pt-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-brand-muted">
                  {item.name} <span className="text-brand-text">x{item.quantity}</span>
                </span>
                <span className="font-medium text-brand-text">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-brand-text border-t border-brand-border pt-2 mt-2">
              <span>Total payé</span>
              <span className="text-brand-gold">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Delivery info */}
        <div className="rounded-2xl bg-brand-card border border-brand-border p-6 mb-6">
          <h2 className="font-display font-bold text-brand-text mb-4">Livraison à</h2>
          <p className="text-brand-muted text-sm">
            {order.customerName}<br />
            {order.address}<br />
            {order.postalCode} {order.city}
          </p>
          {order.notes && (
            <p className="text-xs text-brand-muted mt-2 italic">Note : {order.notes}</p>
          )}
        </div>

        {/* Next steps */}
        <div className="rounded-2xl bg-gradient-to-r from-brand-purple/10 to-brand-gold/10 border border-brand-border p-6 mb-8">
          <h2 className="font-display font-bold text-brand-text mb-3">Et maintenant ?</h2>
          <ul className="flex flex-col gap-2.5 text-sm">
            {[
              "Nous avons reçu votre commande et allons la préparer très vite.",
              "Vous recevrez un email de confirmation à " + order.customerEmail + ".",
              "Notre équipe vous contactera pour la livraison.",
              "En cas de question, n'hésitez pas à nous contacter via WhatsApp.",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-brand-gold/20 text-brand-gold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-brand-muted">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={`https://wa.me/${whatsapp}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            Contacter via WhatsApp
          </a>
          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold py-3.5 rounded-xl text-sm"
          >
            Continuer mes achats
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
