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
    const cocktailsId = "cat_cocktails_001";
    const packsId = "cat_packs_001";
    const nouveautesId = "cat_nouveautes_001";

    await prisma.category.upsert({
      where: { slug: "cocktails" },
      update: {},
      create: {
        id: cocktailsId,
        name: "Cocktails",
        slug: "cocktails",
        description: "Nos cocktails ReadyMiix prêts à savourer",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
        sortOrder: 1,
      },
    });

    await prisma.category.upsert({
      where: { slug: "packs" },
      update: {},
      create: {
        id: packsId,
        name: "Packs & Offres",
        slug: "packs",
        description: "Packs découverte et offres spéciales",
        image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80",
        sortOrder: 2,
      },
    });

    await prisma.category.upsert({
      where: { slug: "nouveautes" },
      update: {},
      create: {
        id: nouveautesId,
        name: "Nouveautés",
        slug: "nouveautes",
        description: "Les dernières créations ReadyMiix",
        image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&q=80",
        sortOrder: 3,
      },
    });

    // Seed products
    const cocktailsCat = await prisma.category.findUnique({ where: { slug: "cocktails" } });
    const packsCat = await prisma.category.findUnique({ where: { slug: "packs" } });
    const nouveautesCat = await prisma.category.findUnique({ where: { slug: "nouveautes" } });

    const products = [
      {
        name: "ReadyMiix Passion Punch",
        slug: "passion-punch",
        description: "Un voyage tropical en bouteille. Notre Passion Punch marie fruits de la passion, mangue et une touche de citron vert pour un cocktail rafraîchissant et fruité. Parfait pour vos soirées en Guyane.",
        price: 4.5,
        comparePrice: 5.5,
        images: JSON.stringify(["https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80"]),
        categoryId: cocktailsCat!.id,
        stock: 50,
        featured: true,
        volume: "33cl",
        alcohol: "5%",
        tags: JSON.stringify(["bestseller", "tropical", "fruité"]),
      },
      {
        name: "ReadyMiix Dark & Stormy",
        slug: "dark-stormy",
        description: "La rencontre explosive du rhum brun et du gingembre épicé. Notre Dark & Stormy est un cocktail audacieux avec une pointe de citron vert pour équilibrer les saveurs.",
        price: 5.0,
        images: JSON.stringify(["https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80"]),
        categoryId: cocktailsCat!.id,
        stock: 35,
        featured: true,
        volume: "33cl",
        alcohol: "6.5%",
        tags: JSON.stringify(["rum", "épicé", "classique"]),
      },
      {
        name: "ReadyMiix Mango Tango",
        slug: "mango-tango",
        description: "La douceur de la mangue rencontre la fraîcheur du basilic et une touche pétillante. Le Mango Tango est une explosion de saveurs tropicales.",
        price: 4.5,
        images: JSON.stringify(["https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80"]),
        categoryId: cocktailsCat!.id,
        stock: 42,
        featured: true,
        volume: "33cl",
        alcohol: "5%",
        tags: JSON.stringify(["mangue", "tropical", "fruité"]),
      },
      {
        name: "ReadyMiix Piña Colada",
        slug: "pina-colada",
        description: "Le grand classique des Caraïbes. Notre Piña Colada premium associe noix de coco crémeuse et ananas frais pour un cocktail onctueux et ensoleillé.",
        price: 5.5,
        comparePrice: 6.5,
        images: JSON.stringify(["https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80"]),
        categoryId: cocktailsCat!.id,
        stock: 28,
        featured: false,
        volume: "33cl",
        alcohol: "7%",
        tags: JSON.stringify(["coco", "ananas", "classique"]),
      },
      {
        name: "ReadyMiix Hibiscus Sunset",
        slug: "hibiscus-sunset",
        description: "Inspiré des couchers de soleil guyanais. Notre Hibiscus Sunset marie fleur d'hibiscus, citron et une pointe de gingembre.",
        price: 4.5,
        images: JSON.stringify(["https://images.unsplash.com/photo-1607446045875-c1931f04ac88?w=600&q=80"]),
        categoryId: nouveautesCat!.id,
        stock: 20,
        featured: true,
        volume: "33cl",
        alcohol: "5%",
        tags: JSON.stringify(["hibiscus", "floral", "nouveau"]),
      },
      {
        name: "Pack Découverte – 6 Cocktails",
        slug: "pack-decouverte-6",
        description: "Découvrez l'univers ReadyMiix avec notre pack découverte. 6 cocktails variés : Passion Punch, Dark & Stormy, Mango Tango, Piña Colada, Hibiscus Sunset + 1 surprise.",
        price: 24.0,
        comparePrice: 29.0,
        images: JSON.stringify(["https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80"]),
        categoryId: packsCat!.id,
        stock: 15,
        featured: true,
        volume: "6 x 33cl",
        alcohol: "Varié",
        tags: JSON.stringify(["pack", "découverte", "cadeau", "bestseller"]),
      },
      {
        name: "Pack Soirée – 12 Cocktails",
        slug: "pack-soiree-12",
        description: "Le pack parfait pour animer vos soirées en Guyane ! 12 cocktails ReadyMiix au choix parmi toute notre gamme.",
        price: 46.0,
        comparePrice: 54.0,
        images: JSON.stringify(["https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80"]),
        categoryId: packsCat!.id,
        stock: 10,
        featured: false,
        volume: "12 x 33cl",
        alcohol: "Varié",
        tags: JSON.stringify(["pack", "soirée", "événement"]),
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
