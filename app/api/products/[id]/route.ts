import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

interface Params { params: { id: string } }

export async function GET(_: Request, { params }: Params) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!product) return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const {
      name, slug, description, price, comparePrice,
      images, categoryId, stock, featured, active,
      volume, alcohol, tags,
    } = body;

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name, description, price,
        comparePrice: comparePrice ?? null,
        images: images ?? "[]",
        categoryId, stock: stock ?? 0,
        featured: featured ?? false,
        active: active ?? true,
        volume: volume || null,
        alcohol: alcohol || null,
        tags: tags ?? "[]",
        slug: slug || slugify(name),
      },
      include: { category: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
