"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ShopCard from "@/components/store/ShopCard";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  stock: number;
  featured: boolean;
  active: boolean;
  volume: string | null;
  alcohol: string | null;
  tags: string;
  productType: string;
  hasSoftChoice: boolean;
  createdAt: string | Date;
}

interface Props {
  allProducts: Product[];
  categories: { id: string; name: string; slug: string; _count: { products: number } }[];
}

function FrozenCaipiHeroCard() {
  return (
    <Link
      href="/frozen-caipi"
      className="group block relative overflow-hidden rounded-2xl cursor-pointer"
      style={{
        background: "linear-gradient(135deg, #1A0010 0%, #3D0022 50%, #2A0018 100%)",
        minHeight: "210px",
      }}
    >
      {/* Cup photo — right half */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Frozen.jpg.PNG.PNG"
        alt="Frozen Caïpis"
        className="absolute right-0 top-0 h-full w-[55%] object-contain object-right group-hover:scale-105 transition-transform duration-500"
        aria-hidden="true"
      />
      {/* Fade to dark for text legibility */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to right, #1A0010 36%, rgba(26,0,16,0.80) 54%, transparent 76%)" }}
      />
      {/* Pink atmospheric glow */}
      <div
        className="absolute inset-0 opacity-40"
        style={{ background: "radial-gradient(ellipse at top right, rgba(197,0,106,0.35) 0%, transparent 60%)" }}
      />
      {/* Neon border */}
      <div
        className="absolute inset-0 rounded-2xl border opacity-50 group-hover:opacity-90 transition-opacity duration-300"
        style={{ borderColor: "rgba(247,37,133,0.4)" }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(247,37,133,0.7), transparent)" }}
      />

      <div className="relative z-10 p-5 flex flex-col justify-center" style={{ minHeight: "210px" }}>
        <p
          className="text-[9px] font-bold uppercase tracking-[0.28em] mb-2"
          style={{ color: "#00D2C8" }}
        >
          Sur commande · Matoury
        </p>
        <h2
          className="font-sans font-black text-white leading-[1.05] mb-1.5"
          style={{
            fontSize: "clamp(1.4rem, 6vw, 1.8rem)",
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          Frozen<br />Caïpis
        </h2>
        <p className="text-sm font-semibold mb-4" style={{ color: "rgba(240,240,248,0.80)" }}>
          16 parfums · Dès 10 €
        </p>
        <span
          className="inline-flex items-center gap-2 text-sm font-bold py-2.5 px-5 rounded-2xl self-start text-white active:scale-[0.97] transition-transform duration-150"
          style={{
            background: "linear-gradient(135deg, #C5006A, #F72585)",
            boxShadow: "0 4px 18px rgba(247,37,133,0.45)",
          }}
        >
          Composer ma caïpi <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function ShopClient({ allProducts }: Props) {
  const nonFrozen = useMemo(
    () => allProducts.filter((p) => !p.category.name.toLowerCase().includes("frozen")),
    [allProducts]
  );

  return (
    <div className="min-h-screen bg-brand-darker pb-24 md:pb-8">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-30 bg-brand-darker/95 backdrop-blur-2xl border-b border-white/[0.06] pt-20 md:pt-24 pb-4">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/25 to-transparent" />
        <div className="container-custom">
          <p className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.25em] mb-0.5">
            ReadyMiix
          </p>
          <h1 className="font-display text-2xl text-brand-text tracking-wide">
            Boutique
          </h1>
        </div>
      </div>

      <div className="container-custom py-5">

        {/* ── Frozen Caïpis — hero card ── */}
        <FrozenCaipiHeroCard />

        {/* ── Boissons & nouveautés — only when products exist ── */}
        {nonFrozen.length > 0 && (
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="font-display text-lg text-brand-text tracking-wide">
                Boissons &amp; nouveautés
              </h2>
              <p className="text-xs text-brand-muted/70 mt-0.5">
                {nonFrozen.length} article{nonFrozen.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {nonFrozen.map((product) => (
                <ShopCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
