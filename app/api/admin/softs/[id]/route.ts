import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";


export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const soft = await prisma.soft.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      emoji: body.emoji,
      image: body.image ?? null,
      surcharge: body.surcharge,
      active: body.active,
      sortOrder: body.sortOrder,
    },
  });
  return NextResponse.json(soft);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  await prisma.soft.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
