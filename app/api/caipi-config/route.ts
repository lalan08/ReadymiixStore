import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CAIPI_CONFIG } from "@/lib/caipiConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const row = await prisma.siteConfig.findUnique({ where: { key: "caipi_config" } });
    if (!row) return NextResponse.json(DEFAULT_CAIPI_CONFIG);
    const config = { ...DEFAULT_CAIPI_CONFIG, ...JSON.parse(row.value) };
    return NextResponse.json(config);
  } catch {
    return NextResponse.json(DEFAULT_CAIPI_CONFIG);
  }
}
