import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";


export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const sirops = await prisma.sirop.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(sirops);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const sirop = await prisma.sirop.create({
    data: {
      name: body.name,
      slug: body.slug,
      emoji: body.emoji || "💧",
      color: body.color || "#00D2C8",
      active: body.active ?? true,
      sortOrder: body.sortOrder ?? 0,
    },
  });
  return NextResponse.json(sirop, { status: 201 });
}
