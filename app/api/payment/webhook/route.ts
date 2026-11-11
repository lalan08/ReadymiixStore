import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const stripeKey    = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe non configuré" }, { status: 503 });
  }

  const stripe    = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" as never });
  const body      = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId && session.payment_status === "paid") {
      await prisma.order.update({
        where: { id: orderId },
        data:  { status: "CONFIRMED", paymentMethod: "card_online" },
      }).catch(console.error);
    }
  }

  return NextResponse.json({ received: true });
}
