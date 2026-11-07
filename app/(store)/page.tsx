import Image from "next/image";
import { Clock, MapPin, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import FrozenCaipiShop from "@/components/store/FrozenCaipiShop";
import ShopCard from "@/components/store/ShopCard";

export const revalidate = 60;
export const metadata = { title: "ReadyMiix Store — Frozen Caïpi · Matoury" };

export default async function HomePage() {
  const extras = await prisma.product.findMany({
    where: {
      active: true,
      category: { name: { not: { contains: "frozen" } } },
      slug: { notIn: ["light", "hard"] },
    },
    include: { category: true },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 8,
  }).catch(() => []);

  return (
    <div className="min-h-screen bg-brand-darker pb-28">

      {/* ── Hero compact ── */}
      <section className="relative overflow-hidden pt-16">
        {/* BG gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C0014] via-brand-darker/80 to-brand-darker pointer-events-none" />

        <div className="relative container-custom px-4 pt-6 pb-4 text-center">

          {/* Click & Collect badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-3 py-1.5 rounded-full uppercase tracking-widest">
              <MapPin className="w-3 h-3" /> Click & collect · Matoury
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-[2.6rem] md:text-5xl font-black text-white leading-none mb-2 uppercase tracking-tight"
            style={{ textShadow: "0 0 60px rgba(247,37,133,0.3)" }}>
            Ta caïpi.<br />À ton goût.
          </h1>
          <p className="text-brand-muted text-sm mb-5">Givrée, fruitée, préparée pour toi.</p>

          {/* Hero image */}
          <div className="relative mx-auto max-w-xs mb-4">
            <div className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
              style={{ background: "radial-gradient(ellipse, #F72585 0%, transparent 70%)" }} />
            <Image
              src="/hero-cocktail.png"
              alt="Frozen Caïpi ReadyMiix"
              width={320}
              height={220}
              className="relative mx-auto object-contain max-h-48 drop-shadow-2xl"
              priority
            />
          </div>

          {/* Hours */}
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 text-xs text-brand-muted">
              <Clock className="w-3 h-3 text-brand-gold" />
              Mardi au dimanche · 19 h–23 h
            </span>
          </div>
        </div>
      </section>

      {/* ── Frozen Caïpi shop ── */}
      <section className="container-custom px-4 pt-6">
        <h2 className="font-display text-lg text-brand-text mb-0.5 tracking-wide">
          Choisis ton parfum
        </h2>
        <p className="text-xs text-brand-muted/70 mb-5">16 parfums · Tap pour personnaliser</p>
        <FrozenCaipiShop />
      </section>

      {/* ── Boissons & extras ── */}
      {extras.length > 0 && (
        <section className="container-custom px-4 pt-10">
          <div className="border-t border-brand-border pt-8">
            <h2 className="font-display text-lg text-brand-text mb-0.5 tracking-wide">
              Boissons & extras
            </h2>
            <p className="text-xs text-brand-muted/70 mb-5">
              {extras.length} article{extras.length !== 1 ? "s" : ""} disponible{extras.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {extras.map((p) => (
                <ShopCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Infos retrait ── */}
      <section className="container-custom px-4 pt-10 pb-4">
        <div className="border-t border-brand-border pt-8 flex items-start gap-3 p-4 rounded-2xl bg-brand-card border border-brand-border">
          <AlertCircle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
          <div className="text-xs text-brand-muted leading-relaxed space-y-1">
            <p>
              <span className="text-brand-text font-semibold">Retrait à Matoury · Uniquement sur commande</span>
            </p>
            <p>Commande au moins 15 min avant ton passage. Heure de retrait à confirmer.</p>
            <p>Aucune livraison pour le moment.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
