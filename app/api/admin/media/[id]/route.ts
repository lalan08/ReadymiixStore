import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const media = await prisma.media.findUnique({ where: { id: params.id } });
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.media.delete({ where: { id: params.id } });

  if (media.slot) {
    await prisma.siteConfig.upsert({
      where: { key: media.slot },
      update: { value: "" },
      create: { key: media.slot, value: "" },
    });
  }

  return NextResponse.json({ success: true });
}
