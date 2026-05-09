import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { active: true },
      orderBy: { date: "asc" },
    });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
