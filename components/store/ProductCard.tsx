"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Tag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice, parseJsonField } from "@/lib/utils";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Badge from "@/components/ui/Badge";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string;
  stock: number;
  featured: boolean;
  volume: string | null;
  alcohol: string | null;
  tags: string;
  category: { name: string; slug: string };
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const images    = parseJsonField<string[]>(product.images, []);
  const tags      = parseJsonField<string[]>(product.tags, []);
  const mainImage = images[0] ?? null;

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id:     product.id,
      name:   product.name,
      slug:   product.slug,
      price:  product.price,
      image:  mainImage ?? "",
      volume: product.volume ?? undefined,
    });
    toast.success(`${product.name} ajouté au panier !`);
    openCart();
  }

  const isOutOfStock = product.stock === 0;

  return (
    <Link href={`/product/${product.slug}`} className={cn("group block cursor-pointer", className)}>
      <article className="relative flex flex-col h-full rounded-2xl overflow-hidden bg-gradient-to-b from-brand-card to-brand-darker border border-white/[0.07] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-gold/40 hover:shadow-[0_20px_56px_rgba(247,37,133,0.18),0_4px_24px_rgba(0,0,0,0.5)]">

        {/* Neon accent line — visible on hover */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-darker">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-purple/40 via-brand-card to-brand-gold/20 flex items-center justify-center">
              <Star className="w-12 h-12 text-brand-gold/30" />
            </div>
          )}

          {/* Cinematic bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/75 via-transparent to-transparent" />

          {/* Hover warm vignette */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "radial-gradient(ellipse at bottom, rgba(247,37,133,0.1) 0%, transparent 65%)" }}
          />

          {/* Badges — left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.featured && (
              <Badge variant="gold"><Star className="w-3 h-3" /> Vedette</Badge>
            )}
            {discount && (
              <Badge variant="pink"><Tag className="w-3 h-3" /> -{discount}%</Badge>
            )}
            {isOutOfStock && <Badge variant="muted">Épuisé</Badge>}
          </div>

          {/* Category badge — right */}
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="muted">{product.category.name}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4 gap-2">
          {(product.volume || product.alcohol) && (
            <div className="flex items-center gap-1.5 text-xs text-brand-muted/70">
              {product.volume && <span>{product.volume}</span>}
              {product.volume && product.alcohol && <span className="text-brand-border">·</span>}
              {product.alcohol && <span>{product.alcohol} alc.</span>}
            </div>
          )}

          <h3 className="font-display text-base text-brand-text group-hover:text-brand-gold transition-colors duration-200 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-brand-muted/75 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-1">
              {tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-brand-muted/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Price & CTA */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.07]">
            <div className="flex items-baseline gap-2">
              <span
                className="text-lg font-bold text-brand-gold"
                style={{ textShadow: "0 0 16px rgba(247,37,133,0.4)" }}
              >
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="text-xs text-brand-muted/50 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={`Ajouter ${product.name} au panier`}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer",
                isOutOfStock
                  ? "bg-white/[0.04] text-brand-muted cursor-not-allowed"
                  : "bg-gradient-to-r from-[#C5006A] to-[#F72585] text-white shadow-[0_0_12px_rgba(247,37,133,0.35)] hover:shadow-[0_0_24px_rgba(247,37,133,0.65)] hover:scale-[1.05] active:scale-[0.96]"
              )}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ajouter</span>
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
