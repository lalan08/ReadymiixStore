import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, slot, src } = await req.json();
  if (!name || !src) return NextResponse.json({ error: "name and src required" }, { status: 400 });

  const media = await prisma.media.create({ data: { name, slot: slot || null, src } });

  if (slot) {
    await prisma.siteConfig.upsert({
      where: { key: slot },
      update: { value: src },
      create: { key: slot, value: src },
    });
  }

  return NextResponse.json(media, { status: 201 });
}
