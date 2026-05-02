import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Categories
  const cocktailsCategory = await prisma.category.upsert({
    where: { slug: "cocktails" },
    update: {},
    create: {
      name: "Cocktails",
      slug: "cocktails",
      description: "Nos cocktails ReadyMiix prêts à savourer",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
      sortOrder: 1,
    },
  });

  const packsCategory = await prisma.category.upsert({
    where: { slug: "packs" },
    update: {},
    create: {
      name: "Packs & Offres",
      slug: "packs",
      description: "Packs découverte et offres spéciales",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80",
      sortOrder: 2,
    },
  });

  const nouveautesCategory = await prisma.category.upsert({
    where: { slug: "nouveautes" },
    update: {},
    create: {
      name: "Nouveautés",
      slug: "nouveautes",
      description: "Les dernières créations ReadyMiix",
      image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&q=80",
      sortOrder: 3,
    },
  });

  // Products
  const products = [
    {
      name: "ReadyMiix Passion Punch",
      slug: "passion-punch",
      description:
        "Un voyage tropical en bouteille. Notre Passion Punch marie fruits de la passion, mangue et une touche de citron vert pour un cocktail rafraîchissant et fruité. Parfait pour vos soirées en Guyane.",
      price: 4.5,
      comparePrice: 5.5,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80",
        "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&q=80",
      ]),
      categoryId: cocktailsCategory.id,
      stock: 50,
      featured: true,
      volume: "33cl",
      alcohol: "5%",
      tags: JSON.stringify(["bestseller", "tropical", "fruité"]),
    },
    {
      name: "ReadyMiix Dark & Stormy",
      slug: "dark-stormy",
      description:
        "La rencontre explosive du rhum brun et du gingembre épicé. Notre Dark & Stormy est un cocktail audacieux avec une pointe de citron vert pour équilibrer les saveurs. Un classique réinventé.",
      price: 5.0,
      comparePrice: null,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80",
        "https://images.unsplash.com/photo-1508245890789-5d3ed1ca7cfa?w=600&q=80",
      ]),
      categoryId: cocktailsCategory.id,
      stock: 35,
      featured: true,
      volume: "33cl",
      alcohol: "6.5%",
      tags: JSON.stringify(["rum", "épicé", "classique"]),
    },
    {
      name: "ReadyMiix Mango Tango",
      slug: "mango-tango",
      description:
        "La douceur de la mangue rencontre la fraîcheur du basilic et une touche pétillante. Le Mango Tango est une explosion de saveurs tropicales qui vous transporte directement sous les cocotiers.",
      price: 4.5,
      comparePrice: null,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80",
        "https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=600&q=80",
      ]),
      categoryId: cocktailsCategory.id,
      stock: 42,
      featured: true,
      volume: "33cl",
      alcohol: "5%",
      tags: JSON.stringify(["mangue", "tropical", "fruité"]),
    },
    {
      name: "ReadyMiix Piña Colada",
      slug: "pina-colada",
      description:
        "Le grand classique des Caraïbes. Notre Piña Colada premium associe noix de coco crémeuse et ananas frais pour un cocktail onctueux et ensoleillé. Fermez les yeux et partez en voyage.",
      price: 5.5,
      comparePrice: 6.5,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&q=80",
        "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?w=600&q=80",
      ]),
      categoryId: cocktailsCategory.id,
      stock: 28,
      featured: false,
      volume: "33cl",
      alcohol: "7%",
      tags: JSON.stringify(["coco", "ananas", "classique", "crémeux"]),
    },
    {
      name: "ReadyMiix Hibiscus Sunset",
      slug: "hibiscus-sunset",
      description:
        "Inspiré des couchers de soleil guyanais. Notre Hibiscus Sunset marie fleur d'hibiscus, citron et une pointe de gingembre pour un cocktail floral et rafraîchissant. Une couleur rubis à couper le souffle.",
      price: 4.5,
      comparePrice: null,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1607446045875-c1931f04ac88?w=600&q=80",
        "https://images.unsplash.com/photo-1605197788044-9a7f9e58a35d?w=600&q=80",
      ]),
      categoryId: nouveautesCategory.id,
      stock: 20,
      featured: true,
      volume: "33cl",
      alcohol: "5%",
      tags: JSON.stringify(["hibiscus", "floral", "nouveau"]),
    },
    {
      name: "Pack Découverte – 6 Cocktails",
      slug: "pack-decouverte-6",
      description:
        "Découvrez l'univers ReadyMiix avec notre pack découverte. 6 cocktails variés : Passion Punch, Dark & Stormy, Mango Tango, Piña Colada, Hibiscus Sunset + 1 surprise. Le cadeau idéal ou la parfaite entrée en matière.",
      price: 24.0,
      comparePrice: 29.0,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
        "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&q=80",
      ]),
      categoryId: packsCategory.id,
      stock: 15,
      featured: true,
      volume: "6 x 33cl",
      alcohol: "Varié",
      tags: JSON.stringify(["pack", "découverte", "cadeau", "bestseller"]),
    },
    {
      name: "Pack Soirée – 12 Cocktails",
      slug: "pack-soiree-12",
      description:
        "Le pack parfait pour animer vos soirées en Guyane ! 12 cocktails ReadyMiix au choix parmi toute notre gamme. Commandez votre sélection personnalisée et épatez vos invités.",
      price: 46.0,
      comparePrice: 54.0,
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80",
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
      ]),
      categoryId: packsCategory.id,
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

  console.log("✅ Database seeded successfully!");
  console.log(`   - ${3} categories`);
  console.log(`   - ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
