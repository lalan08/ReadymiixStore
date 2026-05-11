import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const softs = await prisma.soft.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(softs);
  } catch {
    return NextResponse.json([]);
  }
}
