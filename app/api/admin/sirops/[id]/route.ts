import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";


export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const sirop = await prisma.sirop.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug,
      emoji: body.emoji,
      color: body.color,
      active: body.active,
      sortOrder: body.sortOrder,
    },
  });
  return NextResponse.json(sirop);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  await prisma.sirop.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
