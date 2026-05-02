import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  return NextResponse.json(order);
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { status } = await req.json();

    const validStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data:  { status },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
