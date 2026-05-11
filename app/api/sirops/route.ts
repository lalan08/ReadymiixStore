import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // 5 minutes

export async function GET() {
  try {
    const sirops = await prisma.sirop.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(sirops);
  } catch {
    return NextResponse.json([]);
  }
}
