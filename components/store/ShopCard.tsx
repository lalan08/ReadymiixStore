"use client";

import { useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice, parseJsonField } from "@/lib/utils";
import { Plus, Heart, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string;
  stock: number;
  description: string | null;
  category: { name: string; slug: string };
}

export default function ShopCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore();
  const [liked, setLiked]    = useState(false);

  const images    = parseJsonField<string[]>(product.images, []);
  const mainImage = images[0] ?? null;
  const isOut     = product.stock === 0;

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (isOut) return;
    addItem({
      id:    product.id,
      name:  product.name,
      slug:  product.slug,
      price: product.price,
      image: mainImage ?? "",
    });
    toast.success(`${product.name} ajouté !`, {
      icon: "🍹",
      style: { background: "#0E0E1C", color: "#F0F0F8", border: "1px solid #1E1E32" },
    });
    openCart();
  }

  function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLiked((v) => !v);
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block cursor-pointer">
      <div className="relative flex flex-col rounded-2xl overflow-hidden bg-gradient-to-b from-brand-card to-brand-darker border border-white/[0.06] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand-gold/40 group-hover:shadow-[0_16px_48px_rgba(247,37,133,0.2),0_4px_16px_rgba(0,0,0,0.5)]">

        {/* Neon top line on hover */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* ── Image ── */}
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-darker">
          {mainImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-purple/40 via-brand-card to-brand-gold/10">
              <ShoppingBag className="w-10 h-10 text-brand-gold/20" />
            </div>
          )}

          {/* Cinematic bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/20 to-transparent" />

          {/* Hover warm glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "radial-gradient(ellipse at bottom, rgba(247,37,133,0.1) 0%, transparent 65%)" }}
          />

          {/* Out of stock */}
          {isOut && (
            <div className="absolute inset-0 bg-brand-darker/75 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="text-xs font-bold text-brand-muted px-3 py-1.5 rounded-full border border-brand-border bg-brand-card/80 uppercase tracking-wider">
                Épuisé
              </span>
            </div>
          )}

          {/* Discount badge */}
          {discount && (
            <div className="absolute top-2.5 left-2.5 z-10">
              <span
                className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full uppercase tracking-wide"
                style={{
                  background: "linear-gradient(135deg, #C5006A, #F72585)",
                  boxShadow: "0 0 10px rgba(247,37,133,0.55)",
                }}
              >
                -{discount}%
              </span>
            </div>
          )}

          {/* Heart */}
          <button
            onClick={handleLike}
            aria-label="Ajouter aux favoris"
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all hover:bg-black/60 active:scale-90 cursor-pointer"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all duration-200 ${
                liked ? "fill-brand-gold text-brand-gold scale-110" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* ── Info ── */}
        <div className="px-3 pb-3 pt-2.5 flex flex-col gap-1.5">
          <p className="text-[10px] font-bold text-brand-muted/60 uppercase tracking-[0.15em]">
            {product.category.name}
          </p>
          <p className="font-display font-bold text-brand-text text-sm leading-snug line-clamp-1 tracking-wide group-hover:text-brand-gold transition-colors duration-200">
            {product.name}
          </p>
          {product.description && (
            <p className="text-[11px] text-brand-muted/70 leading-snug line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-2.5">
            <div>
              <p
                className="font-bold text-brand-gold text-base leading-none"
                style={{ textShadow: "0 0 12px rgba(247,37,133,0.35)" }}
              >
                {formatPrice(product.price)}
              </p>
              {product.comparePrice && (
                <p className="text-[10px] text-brand-muted/50 line-through leading-none mt-0.5">
                  {formatPrice(product.comparePrice)}
                </p>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={isOut}
              aria-label={`Ajouter ${product.name}`}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 shrink-0 cursor-pointer ${
                isOut
                  ? "bg-brand-border/30 text-brand-muted cursor-not-allowed"
                  : "text-white hover:scale-110"
              }`}
              style={isOut ? {} : {
                background: "linear-gradient(135deg, #C5006A, #F72585)",
                boxShadow: "0 0 14px rgba(247,37,133,0.4)",
              }}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
