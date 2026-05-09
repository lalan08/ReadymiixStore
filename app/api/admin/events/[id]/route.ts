import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const event = await prisma.event.update({
    where: { id: params.id },
    data: {
      ...(body.title       !== undefined && { title: body.title }),
      ...(body.type        !== undefined && { type: body.type }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.image       !== undefined && { image: body.image }),
      ...(body.date        !== undefined && { date: new Date(body.date) }),
      ...(body.timeRange   !== undefined && { timeRange: body.timeRange }),
      ...(body.location    !== undefined && { location: body.location }),
      ...(body.price       !== undefined && { price: body.price != null ? Number(body.price) : null }),
      ...(body.maxTickets  !== undefined && { maxTickets: body.maxTickets != null ? Number(body.maxTickets) : null }),
      ...(body.active      !== undefined && { active: body.active }),
      ...(body.featured    !== undefined && { featured: body.featured }),
    },
  });
  return NextResponse.json(event);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
