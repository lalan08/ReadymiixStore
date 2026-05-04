import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";


export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const configs = await prisma.siteConfig.findMany();
  const result: Record<string, string> = {};
  for (const c of configs) result[c.key] = c.value;
  return NextResponse.json(result);
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body: Record<string, string> = await req.json();
  for (const [key, value] of Object.entries(body)) {
    await prisma.siteConfig.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value },
    });
  }
  return NextResponse.json({ success: true });
}
