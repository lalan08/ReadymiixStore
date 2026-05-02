"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Minus, Plus, ChevronRight, Star, Wine, Info, Check } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice, parseJsonField } from "@/lib/utils";
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

export default function ProductDetail({ product }: { product: Product }) {
  const [qty, setQty]           = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const { addItem, openCart }   = useCartStore();

  const images = parseJsonField<string[]>(product.images, []);
  const tags   = parseJsonField<string[]>(product.tags, []);
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  function handleAdd() {
    addItem({
      id:     product.id,
      name:   product.name,
      slug:   product.slug,
      price:  product.price,
      image:  images[0] ?? "",
      volume: product.volume ?? undefined,
      quantity: qty,
    });
    toast.success(`${product.name} ajouté au panier !`);
    openCart();
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-brand-muted mb-8">
        <Link href="/" className="hover:text-brand-text transition-colors">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-brand-text transition-colors">Boutique</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-brand-text transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-brand-text truncate">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-card border border-brand-border">
            {images[activeImg] ? (
              <Image
                src={images[activeImg]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-brand-purple/30 to-brand-gold/20 flex items-center justify-center">
                <Wine className="w-20 h-20 text-brand-gold/30" />
              </div>
            )}
            {discount && (
              <div className="absolute top-4 left-4">
                <Badge variant="pink">-{discount}%</Badge>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImg
                      ? "border-brand-gold shadow-gold-sm"
                      : "border-brand-border hover:border-brand-gold/40"
                  }`}
                >
                  <Image src={img} alt={`Vue ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          {/* Category */}
          <div className="flex items-center gap-2">
            <Badge variant="muted">{product.category.name}</Badge>
            {product.featured && <Badge variant="gold"><Star className="w-3 h-3" /> Vedette</Badge>}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-text leading-tight">
            {product.name}
          </h1>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-brand-card border border-brand-border text-brand-muted">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold text-brand-gold">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xl text-brand-muted line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
            {discount && (
              <span className="text-sm font-semibold text-brand-pink">
                Économisez {discount}%
              </span>
            )}
          </div>

          {/* Specs */}
          {(product.volume || product.alcohol) && (
            <div className="flex gap-4">
              {product.volume && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-card border border-brand-border">
                  <Wine className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm text-brand-text font-medium">{product.volume}</span>
                </div>
              )}
              {product.alcohol && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-card border border-brand-border">
                  <Info className="w-4 h-4 text-brand-gold" />
                  <span className="text-sm text-brand-text font-medium">{product.alcohol} alc.</span>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {product.description && (
            <p className="text-brand-muted leading-relaxed text-sm">
              {product.description}
            </p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <Check className="w-4 h-4 text-brand-success" />
                <span className="text-sm text-brand-success font-medium">
                  En stock {product.stock < 10 && `— Plus que ${product.stock} unités !`}
                </span>
              </>
            ) : (
              <span className="text-sm text-brand-error font-medium">Rupture de stock</span>
            )}
          </div>

          {/* Quantity + Add to cart */}
          {product.stock > 0 && (
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-brand-text">Quantité :</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-brand-border hover:border-brand-gold/40 text-brand-muted hover:text-brand-text transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-brand-text text-lg w-8 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-brand-border hover:border-brand-gold/40 text-brand-muted hover:text-brand-text transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-8 py-4 rounded-xl shadow-gold hover:shadow-gold transition-all active:scale-[0.98] text-base w-full"
              >
                <ShoppingCart className="w-5 h-5" />
                Ajouter au panier · {formatPrice(product.price * qty)}
              </button>
            </div>
          )}

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-brand-border mt-2">
            {[
              { icon: "🚚", label: "Livraison Guyane" },
              { icon: "🌿", label: "100% Naturel" },
              { icon: "⭐", label: "Qualité Premium" },
            ].map((badge) => (
              <div key={badge.label} className="flex flex-col items-center gap-1 text-center">
                <span className="text-xl">{badge.icon}</span>
                <span className="text-[10px] text-brand-muted">{badge.label}</span>
              </div>
            ))}
          </div>

          {/* Legal notice */}
          <p className="text-[10px] text-brand-muted italic border-t border-brand-border pt-3">
            L&apos;abus d&apos;alcool est dangereux pour la santé. À consommer avec modération.
            Interdit aux personnes de moins de 18 ans.
          </p>
        </div>
      </div>
    </div>
  );
}
