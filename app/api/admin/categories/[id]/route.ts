import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const category = await prisma.category.update({
    where: { id },
    data: {
      name: body.name,
      slug: body.slug || slugify(body.name),
      description: body.description ?? null,
      image: body.image ?? null,
      sortOrder: body.sortOrder ?? 0,
      active: body.active ?? true,
    },
  });
  return NextResponse.json(category);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;

  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `Impossible de supprimer : ${count} produit(s) dans cette catégorie` },
      { status: 400 },
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
