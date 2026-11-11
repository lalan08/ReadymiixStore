import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice, formatDate, ORDER_PAYMENT_LABELS } from "@/lib/utils";
import Link from "next/link";
import { CheckCircle, Clock, MessageCircle, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Commande confirmée" };

interface Props { params: { id: string } }

const BG   = "#010C14";
const PINK = "#F72585";

export default async function OrderConfirmationPage({ params }: Props) {
  const order = await prisma.order.findUnique({
    where:   { id: params.id },
    include: { items: true },
  });

  if (!order) notFound();

  const whatsapp    = process.env.NEXT_PUBLIC_WHATSAPP ?? "594694369615";
  const paymentLabel = ORDER_PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod;
  const isPaid       = order.paymentMethod === "card_online";

  const waLines: string[] = [
    `Commande ${order.orderNumber} ${isPaid ? "✅ Payée en ligne" : "💵 À régler en espèces"}`,
    "",
  ];
  order.items.forEach(item => {
    let optLine = "";
    if (item.options) {
      try {
        const opts = JSON.parse(item.options);
        const c = opts?.caipi;
        if (c) {
          optLine = ` · ${c.taille} · ${c.preparation}`;
          if (c.supplements?.length) optLine += ` + ${c.supplements.join(", ")}`;
        }
      } catch {}
    }
    waLines.push(`• ${item.name}${optLine} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`);
  });
  waLines.push(``, `Total : ${formatPrice(order.total)}`);
  if (order.pickupTime) waLines.push(`Retrait : ${order.pickupTime}`);

  const waMsg = encodeURIComponent(waLines.join("\n"));

  return (
    <div
      className="min-h-screen px-5 pb-24"
      style={{ background: BG, paddingTop: "5rem" }}
    >
      <div className="max-w-lg mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="text-center pt-4 pb-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: "rgba(247,37,133,0.08)",
              border:     "1px solid rgba(247,37,133,0.3)",
            }}
          >
            <CheckCircle className="w-8 h-8" style={{ color: PINK }} />
          </div>
          <h1
            className="font-sans font-black text-white text-2xl mb-1"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            {isPaid ? "Payée en ligne !" : "Commande confirmée !"}
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Merci {order.customerName} · N°{" "}
            <span className="font-bold" style={{ color: PINK }}>{order.orderNumber}</span>
          </p>
        </div>

        {/* Pickup info */}
        {order.pickupTime && (
          <div
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: "rgba(0,210,200,0.06)", border: "1px solid rgba(0,210,200,0.2)" }}
          >
            <Clock className="w-5 h-5 shrink-0" style={{ color: "#00D2C8" }} />
            <div>
              <p className="text-white font-bold text-sm">Retrait à {order.pickupTime}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                Click &amp; Collect · Matoury
              </p>
            </div>
          </div>
        )}

        {/* Payment status */}
        <div
          className="flex items-center gap-3 p-4 rounded-2xl"
          style={{
            background: isPaid
              ? "rgba(0,210,200,0.06)"
              : "rgba(247,37,133,0.06)",
            border: isPaid
              ? "1px solid rgba(0,210,200,0.2)"
              : "1px solid rgba(247,37,133,0.2)",
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg"
            style={{
              background: isPaid ? "rgba(0,210,200,0.12)" : "rgba(247,37,133,0.12)",
            }}
          >
            {isPaid ? "💳" : "💵"}
          </div>
          <div>
            <p className="text-white font-bold text-sm">{paymentLabel}</p>
            {!isPaid && (
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                {formatPrice(order.total)} à régler au retrait
              </p>
            )}
          </div>
        </div>

        {/* Articles */}
        <div
          className="p-4 rounded-2xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
            Tes articles
          </p>
          <div className="flex flex-col gap-2">
            {order.items.map((item) => {
              let caipiDetail = "";
              if (item.options) {
                try {
                  const opts = JSON.parse(item.options);
                  const c = opts?.caipi;
                  if (c) {
                    caipiDetail = `${c.taille} · ${c.preparation}`;
                    if (c.supplements?.length) caipiDetail += ` · +${c.supplements.join(", ")}`;
                  }
                } catch {}
              }
              return (
                <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium leading-snug">{item.name} ×{item.quantity}</p>
                    {caipiDetail && (
                      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{caipiDetail}</p>
                    )}
                  </div>
                  <p className="font-bold shrink-0" style={{ color: PINK }}>
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>
          <div
            className="flex items-center justify-between mt-3 pt-3 font-bold"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="text-white">Total</span>
            <span style={{ color: PINK }}>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* WhatsApp recap */}
        <a
          href={`https://wa.me/${whatsapp}?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white text-sm uppercase tracking-widest active:scale-[0.98] transition-transform"
          style={{
            background: "linear-gradient(135deg, #128C7E, #25D366)",
            boxShadow:  "0 0 24px rgba(37,211,102,0.3)",
          }}
        >
          <MessageCircle className="w-4 h-4" /> Envoyer le récapitulatif sur WhatsApp
        </a>

        {/* Back to store */}
        <Link
          href="/frozen-caipi"
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-sm border active:scale-[0.98] transition-transform"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          Commander une autre caïpi <ArrowRight className="w-4 h-4" />
        </Link>

        <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
          {formatDate(order.createdAt)}
        </p>

      </div>
    </div>
  );
}
