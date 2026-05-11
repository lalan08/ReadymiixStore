import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: string[] = [];
  const errors: string[] = [];

  async function run(label: string, sql: string) {
    try {
      await prisma.$executeRawUnsafe(sql);
      results.push(`✓ ${label}`);
    } catch (e) {
      errors.push(`✗ ${label}: ${String(e)}`);
    }
  }

  await run("Create Event table", `
    CREATE TABLE IF NOT EXISTS "Event" (
      "id" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'ÉVÉNEMENT',
      "description" TEXT,
      "image" TEXT NOT NULL DEFAULT '',
      "date" TIMESTAMP(3) NOT NULL,
      "timeRange" TEXT,
      "location" TEXT NOT NULL,
      "price" DOUBLE PRECISION,
      "maxTickets" INTEGER,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "featured" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
    );
  `);

  await run("Add maxTickets column (migration)", `
    ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "maxTickets" INTEGER;
  `);

  await run("Drop bookingUrl column (migration)", `
    ALTER TABLE "Event" DROP COLUMN IF EXISTS "bookingUrl";
  `);

  await run("Add productType column to Product", `
    ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "productType" TEXT NOT NULL DEFAULT 'simple';
  `);

  await run("Add hasSoftChoice column to Product", `
    ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "hasSoftChoice" BOOLEAN NOT NULL DEFAULT false;
  `);


  // Verify table exists
  let tableExists = false;
  try {
    await prisma.$queryRawUnsafe(`SELECT 1 FROM "Event" LIMIT 1`);
    tableExists = true;
  } catch {
    tableExists = false;
  }

  return NextResponse.json({
    success: tableExists,
    tableExists,
    results,
    errors,
    message: tableExists
      ? "Table Event prête !"
      : "Échec — voir les erreurs",
  });
}
