import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/utils";
import type { CartItem } from "@/lib/types";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const orders = await prisma.order.findMany({
    where:   status ? { status } : undefined,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName, customerEmail, customerPhone,
      address, city, postalCode, notes,
      paymentMethod, items,
    }: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      address: string;
      city: string;
      postalCode: string;
      notes: string;
      paymentMethod: string;
      items: CartItem[];
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !items?.length) {
      return NextResponse.json({ error: "Informations manquantes" }, { status: 400 });
    }

    const subtotal    = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total       = subtotal + deliveryFee;

    const order = await prisma.order.create({
      data: {
        orderNumber:   generateOrderNumber(),
        customerName,
        customerEmail,
        customerPhone,
        address:    address || null,
        city:       city || null,
        postalCode: postalCode || null,
        notes:      notes || null,
        paymentMethod,
        subtotal,
        deliveryFee,
        total,
        status: "PENDING",
        items: {
          create: items.map((item) => ({
            productId: item.id,
            name:      item.name,
            price:     item.price,
            quantity:  item.quantity,
            image:     item.image || null,
          })),
        },
      },
      include: { items: true },
    });

    // Decrement stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data:  { stock: { decrement: item.quantity } },
      }).catch(() => {});
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la création de la commande" }, { status: 500 });
  }
}
