import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CAIPI_CONFIG } from "@/lib/caipiConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const row = await prisma.siteConfig.findUnique({ where: { key: "caipi_config" } });
    if (!row) return NextResponse.json(DEFAULT_CAIPI_CONFIG);
    return NextResponse.json({ ...DEFAULT_CAIPI_CONFIG, ...JSON.parse(row.value) });
  } catch {
    return NextResponse.json(DEFAULT_CAIPI_CONFIG);
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const merged = { ...DEFAULT_CAIPI_CONFIG, ...body };
    await prisma.siteConfig.upsert({
      where:  { key: "caipi_config" },
      update: { value: JSON.stringify(merged) },
      create: { key: "caipi_config", value: JSON.stringify(merged) },
    });
    return NextResponse.json(merged);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
