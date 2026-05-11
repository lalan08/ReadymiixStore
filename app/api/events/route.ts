import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 120; // 2 minutes

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
