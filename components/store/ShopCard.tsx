"use client";

import { useCartStore } from "@/lib/store";
import { formatPrice, parseJsonField } from "@/lib/utils";
import { ShoppingCart, Plus } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: string;
  stock: number;
  category: { name: string; slug: string };
}

export default function ShopCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore();
  const images = parseJsonField<string[]>(product.images, []);
  const mainImage = images[0] ?? null;
  const isOutOfStock = product.stock === 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: mainImage ?? "",
    });
    toast.success(`${product.name} ajouté au panier !`);
    openCart();
  }

  return (
    <div className="group flex flex-col rounded-2xl overflow-hidden bg-brand-card border border-brand-border hover:border-brand-gold/30 transition-all duration-200">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-brand-border/40">
        {mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-purple/20 to-brand-gold/10">
            <ShoppingCart className="w-8 h-8 text-brand-muted/30" />
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-brand-darker/60 flex items-center justify-center">
            <span className="text-xs font-bold text-brand-muted bg-brand-card px-3 py-1 rounded-full border border-brand-border">
              Épuisé
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1.5">
        <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-wide">
          {product.category.name}
        </p>
        <p className="font-semibold text-brand-text text-sm leading-snug line-clamp-2 flex-1">
          {product.name}
        </p>
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-brand-border/50">
          <div>
            <p className="font-bold text-brand-gold">{formatPrice(product.price)}</p>
            {product.comparePrice && (
              <p className="text-xs text-brand-muted line-through">
                {formatPrice(product.comparePrice)}
              </p>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            aria-label={`Ajouter ${product.name}`}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isOutOfStock
                ? "bg-brand-border text-brand-muted cursor-not-allowed"
                : "bg-brand-gold text-brand-darker hover:opacity-90 active:scale-95 shadow-gold-sm"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
