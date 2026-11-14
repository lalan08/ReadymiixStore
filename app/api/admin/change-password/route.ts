import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  const stored = await prisma.siteConfig.findUnique({ where: { key: "admin_password" } }).catch(() => null);
  const expected = stored?.value ?? process.env.ADMIN_PASSWORD;

  if (!expected || currentPassword !== expected) {
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 401 });
  }

  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "Le nouveau mot de passe doit faire au moins 6 caractères" }, { status: 400 });
  }

  await prisma.siteConfig.upsert({
    where:  { key: "admin_password" },
    update: { value: newPassword, updatedAt: new Date() },
    create: { key: "admin_password", value: newPassword },
  });

  return NextResponse.json({ success: true });
}
