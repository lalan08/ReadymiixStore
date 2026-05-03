import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Create tables
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "description" TEXT,
        "image" TEXT,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "description" TEXT,
        "price" DOUBLE PRECISION NOT NULL,
        "comparePrice" DOUBLE PRECISION,
        "images" TEXT NOT NULL DEFAULT '[]',
        "categoryId" TEXT NOT NULL,
        "stock" INTEGER NOT NULL DEFAULT 0,
        "featured" BOOLEAN NOT NULL DEFAULT false,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "volume" TEXT,
        "alcohol" TEXT,
        "tags" TEXT NOT NULL DEFAULT '[]',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT NOT NULL,
        "orderNumber" TEXT NOT NULL,
        "customerName" TEXT NOT NULL,
        "customerEmail" TEXT NOT NULL,
        "customerPhone" TEXT NOT NULL,
        "address" TEXT,
        "city" TEXT,
        "postalCode" TEXT,
        "notes" TEXT,
        "subtotal" DOUBLE PRECISION NOT NULL,
        "deliveryFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "total" DOUBLE PRECISION NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "paymentMethod" TEXT NOT NULL DEFAULT 'cash_on_delivery',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "Order"("orderNumber");
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        "id" TEXT NOT NULL,
        "orderId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "price" DOUBLE PRECISION NOT NULL,
        "quantity" INTEGER NOT NULL,
        "image" TEXT,
        CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'OrderItem_orderId_fkey'
        ) THEN
          ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey"
            FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'OrderItem_productId_fkey'
        ) THEN
          ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey"
            FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'Product_categoryId_fkey'
        ) THEN
          ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey"
            FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
        END IF;
      END $$;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Newsletter" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Newsletter_email_key" ON "Newsletter"("email");
    `);

    // Seed categories
    await prisma.category.upsert({
      where: { slug: "hard" },
      update: {},
      create: {
        id: "cat_hard_001",
        name: "Hard 🔥",
        slug: "hard",
        description: "Cocktails avec alcool fort — Hennessy & spirits. Pour les amateurs qui veulent du caractère.",
        image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80",
        sortOrder: 1,
      },
    });

    await prisma.category.upsert({
      where: { slug: "light" },
      update: {},
      create: {
        id: "cat_light_001",
        name: "Light 🍬",
        slug: "light",
        description: "Cocktails légers avec bonbons & saveurs fruitées. Pour tous les goûts.",
        image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&q=80",
        sortOrder: 2,
      },
    });

    await prisma.category.upsert({
      where: { slug: "packs" },
      update: {},
      create: {
        id: "cat_packs_001",
        name: "Packs & Offres 🎁",
        slug: "packs",
        description: "Packs de plusieurs cups — idéal pour soirées, cadeaux et événements.",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
        sortOrder: 3,
      },
    });

    // Seed products
    const hardCat  = await prisma.category.findUnique({ where: { slug: "hard" } });
    const lightCat = await prisma.category.findUnique({ where: { slug: "light" } });
    const packsCat = await prisma.category.findUnique({ where: { slug: "packs" } });

    const products = [
      {
        name: "ReadyMiix Hard",
        slug: "readymiix-hard",
        description: "Le cocktail Hard ReadyMiix — un cup préparé avec Hennessy et alcools forts, garni de bonbons et de surprises. Bien frais, toujours prêt. Pour les vrais amateurs de soirées en Guyane.",
        price: 7.0,
        comparePrice: 9.0,
        images: JSON.stringify(["https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80"]),
        categoryId: hardCat!.id,
        stock: 50,
        featured: true,
        volume: "Cup 50cl",
        alcohol: "Hennessy + alcool fort",
        tags: JSON.stringify(["bestseller", "hard", "hennessy", "soirée"]),
      },
      {
        name: "ReadyMiix Hard Spécial",
        slug: "readymiix-hard-special",
        description: "La version premium du Hard — cup XL avec Hennessy, double alcool et garniture bonbons XXL. Le must pour les grandes occasions.",
        price: 10.0,
        comparePrice: 13.0,
        images: JSON.stringify(["https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80"]),
        categoryId: hardCat!.id,
        stock: 30,
        featured: true,
        volume: "Cup XL",
        alcohol: "Hennessy double + alcool fort",
        tags: JSON.stringify(["premium", "hard", "xl", "spécial"]),
      },
      {
        name: "ReadyMiix Light",
        slug: "readymiix-light",
        description: "Le cocktail Light ReadyMiix — un cup garni de Haribo, bonbons Jitty Shocks, popping candy et d'autres surprises fruitées. Léger et fun, pour tous les moments.",
        price: 5.0,
        comparePrice: 6.5,
        images: JSON.stringify(["https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&q=80"]),
        categoryId: lightCat!.id,
        stock: 60,
        featured: true,
        volume: "Cup 50cl",
        alcohol: "Léger",
        tags: JSON.stringify(["bestseller", "light", "haribo", "bonbons", "fruité"]),
      },
      {
        name: "ReadyMiix Light Candy",
        slug: "readymiix-light-candy",
        description: "Le Light version Candy — maximum bonbons, Haribo géants, popping candy framboise et citron. La douceur en cup, parfait pour partager.",
        price: 4.0,
        images: JSON.stringify(["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80"]),
        categoryId: lightCat!.id,
        stock: 40,
        featured: false,
        volume: "Cup 50cl",
        alcohol: "Sans alcool fort",
        tags: JSON.stringify(["light", "candy", "haribo", "enfants"]),
      },
      {
        name: "Pack Duo – 1 Hard + 1 Light",
        slug: "pack-duo",
        description: "Le meilleur des deux mondes — 1 ReadyMiix Hard et 1 ReadyMiix Light. Parfait pour partager ou découvrir toute la gamme.",
        price: 11.0,
        comparePrice: 13.0,
        images: JSON.stringify(["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"]),
        categoryId: packsCat!.id,
        stock: 25,
        featured: true,
        volume: "2 cups",
        alcohol: "Hard + Light",
        tags: JSON.stringify(["pack", "duo", "cadeau", "découverte"]),
      },
      {
        name: "Pack x4 Cups au choix",
        slug: "pack-x4",
        description: "4 cups ReadyMiix au choix — Hard ou Light selon vos envies. Idéal pour une petite soirée ou un cadeau original.",
        price: 22.0,
        comparePrice: 26.0,
        images: JSON.stringify(["https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&q=80"]),
        categoryId: packsCat!.id,
        stock: 20,
        featured: true,
        volume: "4 cups",
        alcohol: "Au choix",
        tags: JSON.stringify(["pack", "soirée", "cadeau", "x4"]),
      },
      {
        name: "Pack Soirée x10 Cups",
        slug: "pack-soiree-x10",
        description: "Le pack soirée ultime ! 10 cups ReadyMiix au choix pour faire la fête en grand. Hard, Light ou mixte — vous choisissez.",
        price: 50.0,
        comparePrice: 62.0,
        images: JSON.stringify(["https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80"]),
        categoryId: packsCat!.id,
        stock: 10,
        featured: false,
        volume: "10 cups",
        alcohol: "Au choix",
        tags: JSON.stringify(["pack", "soirée", "événement", "x10", "fête"]),
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Base de données initialisée avec succès !",
      data: { categories: 3, products: products.length },
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
