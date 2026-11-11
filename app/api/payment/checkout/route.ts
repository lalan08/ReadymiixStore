import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: "Paiement par carte non configuré" }, { status: 503 });
  }

  try {
    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" as never });
    const origin = req.headers.get("origin") ?? process.env.NEXT_PUBLIC_URL ?? "https://readymiixstore.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "fr",
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
      success_url: `${origin}/order-confirmation/${order.id}?payment=success`,
      cancel_url:  `${origin}/cart?payment=cancelled`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data:  { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la création du paiement" }, { status: 500 });
  }
}
