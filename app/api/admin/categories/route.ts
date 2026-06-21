import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: {
      name: body.name.trim(),
      slug: body.slug?.trim() || slugify(body.name),
      description: body.description?.trim() || null,
      image: body.image?.trim() || null,
      sortOrder: body.sortOrder ?? 0,
      active: body.active ?? true,
    },
  });
  return NextResponse.json(category, { status: 201 });
}
