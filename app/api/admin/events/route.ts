import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await prisma.event.findMany({
    orderBy: { date: "asc" },
  });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const event = await prisma.event.create({
    data: {
      title:       body.title,
      type:        body.type       ?? "ÉVÉNEMENT",
      description: body.description ?? null,
      image:       body.image      ?? "",
      date:        new Date(body.date),
      timeRange:   body.timeRange  ?? null,
      location:    body.location,
      price:       body.price      != null ? Number(body.price) : null,
      maxTickets:  body.maxTickets != null ? Number(body.maxTickets) : null,
      active:      body.active     ?? true,
      featured:    body.featured   ?? false,
    },
  });
  return NextResponse.json(event, { status: 201 });
}
