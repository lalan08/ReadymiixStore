import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { DEFAULT_CAIPI_CONFIG } from "@/lib/caipiConfig";
import type { CartItem } from "@/lib/types";

export async function POST(req: Request) {
  try {
    // Check ordering_open before anything else
    try {
      const row = await prisma.siteConfig.findUnique({ where: { key: "caipi_config" } });
      const cfg = row ? { ...DEFAULT_CAIPI_CONFIG, ...JSON.parse(row.value) } : DEFAULT_CAIPI_CONFIG;
      if (!cfg.ordering_open) {
        return NextResponse.json(
          { error: "Les commandes sont fermées pour le moment. Réessaie plus tard." },
          { status: 403 }
        );
      }
    } catch { /* si la config est inaccessible, on laisse passer */ }

    const body = await req.json();
    const {
      customerName,
      customerPhone,
      pickupTime,
      paymentMethod,
      items,
      notes,
    }: {
      customerName: string;
      customerPhone: string;
      pickupTime: string;
      paymentMethod: "cash_on_pickup" | "card_online";
      items: CartItem[];
      notes?: string;
    } = body;

    if (!customerName || !customerPhone || !pickupTime || !items?.length) {
      return NextResponse.json({ error: "Informations manquantes" }, { status: 400 });
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        orderNumber:  generateOrderNumber(),
        customerName,
        customerPhone,
        pickupTime,
        notes:        notes || null,
        paymentMethod,
        subtotal,
        deliveryFee:  0,
        total:        subtotal,
        status:       paymentMethod === "card_online" ? "PENDING_PAYMENT" : "PENDING",
        items: {
          create: items.map((item) => ({
            name:     item.name,
            price:    item.price,
            quantity: item.quantity,
            image:    item.image || null,
            options:  item.options ? JSON.stringify(item.options) : null,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la création de la commande" }, { status: 500 });
  }
}
