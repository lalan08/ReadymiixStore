import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const number = searchParams.get("number")?.trim();
  const email = searchParams.get("email")?.trim();

  if (!number || !email) {
    return NextResponse.json({ error: "Numéro de commande et email requis" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: number,
      customerEmail: { equals: email, mode: "insensitive" },
    },
    include: { items: true },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Aucune commande trouvée avec ces informations." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    status: order.status,
    createdAt: order.createdAt,
    customerName: order.customerName,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
    paymentMethod: order.paymentMethod,
    items: order.items.map((i) => ({
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    })),
  });
}
