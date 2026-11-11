-- Migration: Click & Collect - à appliquer sur la base de données Neon
-- Commande: psql $DATABASE_URL -f prisma/migration_click_collect.sql
-- Ou coller dans le SQL Editor de neon.tech

-- 1. Order: customerEmail devient nullable
ALTER TABLE "Order" ALTER COLUMN "customerEmail" DROP NOT NULL;

-- 2. Order: nouveaux champs
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "pickupTime" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "stripeSessionId" TEXT;

-- 3. OrderItem: productId devient nullable (FK optionnelle pour les caïpis)
ALTER TABLE "OrderItem" ALTER COLUMN "productId" DROP NOT NULL;

-- 4. OrderItem: champ options (JSON des détails caïpi)
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "options" TEXT;
