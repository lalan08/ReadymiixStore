import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PUBLIC_KEYS = [
  "bonbons_text",
  "bonbons_items",
  "soft_supplement",
  "light_card_image",
  "hard_card_image",
  "promo_banner",
];

export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany({
      where: { key: { in: PUBLIC_KEYS } },
    });
    const result: Record<string, string> = {};
    for (const c of configs) result[c.key] = c.value;
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({});
  }
}
