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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const withProducts = searchParams.get("withProducts") === "true";

  const count = await prisma.product.count({ where: { categoryId: id } });

  if (count > 0 && !withProducts) {
    return NextResponse.json(
      { error: `Impossible de supprimer : ${count} produit(s) dans cette catégorie`, productCount: count },
      { status: 400 },
    );
  }

  try {
    if (withProducts && count > 0) {
      await prisma.$transaction([
        prisma.product.deleteMany({ where: { categoryId: id } }),
        prisma.category.delete({ where: { id } }),
      ]);
    } else {
      await prisma.category.delete({ where: { id } });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "P2003") {
      return NextResponse.json(
        {
          error:
            "Certains produits de cette catégorie ont déjà été commandés. Ils ne peuvent pas être supprimés sans effacer l'historique des commandes — désactive-les plutôt.",
        },
        { status: 409 },
      );
    }
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
