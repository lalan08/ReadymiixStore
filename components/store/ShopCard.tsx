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
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative flex flex-col rounded-2xl overflow-hidden bg-brand-card border border-brand-border transition-all duration-300 group-hover:border-brand-gold/40 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_rgba(247,37,133,0.15)]">

        {/* ── Image ── */}
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-darker">
          {mainImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-purple/40 via-brand-card to-brand-gold/10">
              <ShoppingBag className="w-10 h-10 text-brand-gold/20" />
            </div>
          )}

          {/* Bottom gradient so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/0 to-transparent" />

          {/* Out of stock overlay */}
          {isOut && (
            <div className="absolute inset-0 bg-brand-darker/70 flex items-center justify-center">
              <span className="text-xs font-bold text-brand-muted px-3 py-1.5 rounded-full border border-brand-border bg-brand-card/80 uppercase tracking-wider">
                Épuisé
              </span>
            </div>
          )}

          {/* Discount badge */}
          {discount && (
            <div className="absolute top-2.5 left-2.5">
              <span className="text-[10px] font-bold bg-brand-gold text-white px-2 py-0.5 rounded-full uppercase">
                -{discount}%
              </span>
            </div>
          )}

          {/* Heart */}
          <button
            onClick={handleLike}
            aria-label="Ajouter aux favoris"
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-black/70 active:scale-90"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-all ${
                liked ? "fill-brand-gold text-brand-gold" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* ── Info ── */}
        <div className="px-3 pb-3 pt-2 flex flex-col gap-1">
          <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-wider">
            {product.category.name}
          </p>
          <p className="font-display font-bold text-brand-text text-sm leading-snug line-clamp-1 tracking-wide">
            {product.name}
          </p>
          {product.description && (
            <p className="text-[11px] text-brand-muted leading-snug line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="font-bold text-brand-gold text-base leading-none">
                {formatPrice(product.price)}
              </p>
              {product.comparePrice && (
                <p className="text-[10px] text-brand-muted line-through leading-none mt-0.5">
                  {formatPrice(product.comparePrice)}
                </p>
              )}
            </div>

            <button
              onClick={handleAdd}
              disabled={isOut}
              aria-label={`Ajouter ${product.name}`}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 shrink-0 ${
                isOut
                  ? "bg-brand-border/50 text-brand-muted cursor-not-allowed"
                  : "bg-brand-gold text-white shadow-gold-sm hover:opacity-90"
              }`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
