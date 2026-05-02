import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const q        = searchParams.get("q");

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(category && { category: { slug: category } }),
      ...(featured === "true" && { featured: true }),
      ...(q && {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
        ],
      }),
    },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name, slug, description, price, comparePrice,
      images, categoryId, stock, featured, active,
      volume, alcohol, tags,
    } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const finalSlug = slug || slugify(name);

    const product = await prisma.product.create({
      data: {
        name, description, price, comparePrice: comparePrice ?? null,
        images: images ?? "[]", categoryId,
        stock: stock ?? 0, featured: featured ?? false,
        active: active ?? true, volume: volume || null,
        alcohol: alcohol || null, tags: tags ?? "[]",
        slug: finalSlug,
      },
      include: { category: true },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
