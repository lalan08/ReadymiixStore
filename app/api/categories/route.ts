import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET() {
  const categories = await prisma.category.findMany({
    where:   { active: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { active: true } } } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const { name, slug, description, image, sortOrder } = await req.json();
    if (!name) return NextResponse.json({ error: "Nom requis" }, { status: 400 });

    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || slugify(name),
        description: description || null,
        image: image || null,
        sortOrder: sortOrder ?? 0,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
