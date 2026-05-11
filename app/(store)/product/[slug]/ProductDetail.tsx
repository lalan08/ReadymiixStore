"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Minus, ShoppingCart, Check, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice, parseJsonField } from "@/lib/utils";
import toast from "react-hot-toast";

interface Soft {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  surcharge: number;
}

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
  productType: string;
  hasSoftChoice: boolean;
  softQty: number;
  category: { name: string; slug: string };
}

interface Props {
  product: Product;
  softs: Soft[];
  related: Product[];
}

const COMPOSER_SLUGS = ["light", "hard"];

export default function ProductDetail({ product, softs, related }: Props) {
  const [qty, setQty]           = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const softQty = Math.max(1, product.softQty ?? 1);
  const [selectedSofts, setSelectedSofts] = useState<(Soft | null)[]>(() => Array(softQty).fill(null));
  const { addItem, openCart } = useCartStore();

  const images = parseJsonField<string[]>(product.images, []);
  const mainImage = images[activeImg] ?? null;

  const isComposer = COMPOSER_SLUGS.includes(product.category.slug);
  const showSofts  = softs.length > 0 && product.hasSoftChoice;

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  const softSurcharge = selectedSofts.reduce((sum, s) => sum + (s?.surcharge ?? 0), 0);
  const finalPrice    = product.price + softSurcharge;

  function selectSoft(slotIndex: number, soft: Soft | null) {
    setSelectedSofts((prev) => prev.map((s, i) => i === slotIndex ? soft : s));
  }

  function handleAdd() {
    if (isComposer) return;
    const softNames = selectedSofts.filter(Boolean).map((s) => s!.name);
    addItem({
      id:     product.id,
      name:   product.name,
      slug:   product.slug,
      price:  finalPrice,
      image:  images[0] ?? "",
      volume: product.volume ?? undefined,
      quantity: qty,
      options: softNames.length > 0 ? { softs: softNames } : undefined,
    });
    toast.success(`${product.name} ajouté !`, {
      icon: "🛒",
      style: { background: "#0E0E1C", color: "#F0F0F8", border: "1px solid #1E1E32" },
    });
    openCart();
  }

  return (
    <div className="min-h-screen bg-brand-darker pb-32 md:pb-16">
      {/* ── Hero image ── */}
      <div className="relative w-full aspect-[4/3] md:aspect-[16/7] overflow-hidden bg-brand-card">
        {mainImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mainImage}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-purple/40 via-brand-card to-brand-gold/10" />
        )}

        {/* Gradient overlay bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-darker via-brand-darker/20 to-transparent" />

        {/* Back button */}
        <Link
          href="/shop"
          className="absolute top-20 left-4 md:top-28 md:left-8 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white transition-all hover:bg-black/80 active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-20 right-4 md:top-28">
            <span className="text-xs font-bold bg-brand-gold text-white px-3 py-1 rounded-full uppercase shadow-gold-sm">
              -{discount}%
            </span>
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === activeImg ? "bg-brand-gold scale-125" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="relative -mt-6 md:mt-0 px-4 md:container-custom md:pt-8 max-w-2xl md:max-w-none mx-auto">
        <div className="md:grid md:grid-cols-2 md:gap-12">

          {/* Left: info */}
          <div className="flex flex-col gap-5">
            {/* Category + badge */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] font-bold text-brand-gold uppercase tracking-widest">
                {product.category.name}
              </span>
              {product.featured && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-brand-teal bg-brand-teal/10 border border-brand-teal/20 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Populaire
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-text uppercase tracking-wide leading-tight">
              {product.name}
            </h1>

            {/* Volume */}
            {product.volume && (
              <p className="text-sm text-brand-muted">{product.volume}</p>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-sm text-brand-muted leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-brand-gold">
                {formatPrice(finalPrice * qty)}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-brand-muted line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>

            {/* Stock */}
            {product.stock > 0 ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-success" />
                <span className="text-xs text-brand-success font-semibold">
                  En stock{product.stock < 5 ? ` — Plus que ${product.stock} !` : ""}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-error" />
                <span className="text-xs text-brand-error font-semibold">Épuisé</span>
              </div>
            )}

            {/* ── Soft chooser ── */}
            {showSofts && product.stock > 0 && !isComposer && (
              <div className="flex flex-col gap-4 rounded-2xl bg-brand-card border border-brand-border p-4">
                <p className="text-xs font-bold text-brand-text uppercase tracking-widest">
                  🥤 {softQty > 1 ? `Choisis tes ${softQty} softs` : "Choisis ton soft"}
                </p>

                {Array.from({ length: softQty }, (_, i) => (
                  <div key={i} className={softQty > 1 ? "flex flex-col gap-2" : ""}>
                    {softQty > 1 && (
                      <p className="text-[11px] font-semibold text-brand-muted uppercase tracking-wide">
                        Soft {i + 1}
                      </p>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        onClick={() => selectSoft(i, null)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-95 ${
                          selectedSofts[i] === null
                            ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                            : "border-brand-border bg-brand-darker text-brand-muted hover:border-brand-gold/30"
                        }`}
                      >
                        {selectedSofts[i] === null && <Check className="w-3.5 h-3.5 shrink-0" />}
                        <span>Sans soft</span>
                      </button>

                      {softs.map((soft) => (
                        <button
                          key={soft.id}
                          onClick={() => selectSoft(i, soft)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-95 ${
                            selectedSofts[i]?.id === soft.id
                              ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                              : "border-brand-border bg-brand-darker text-brand-muted hover:border-brand-gold/30"
                          }`}
                        >
                          {selectedSofts[i]?.id === soft.id
                            ? <Check className="w-3.5 h-3.5 shrink-0" />
                            : <span className="text-base leading-none">{soft.emoji}</span>
                          }
                          <span className="truncate">{soft.name}</span>
                          {soft.surcharge > 0 && (
                            <span className="text-[10px] text-brand-gold ml-auto">+{formatPrice(soft.surcharge)}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: quantity + CTA (desktop) */}
          <div className="hidden md:flex flex-col gap-6 pt-4">
            {product.stock > 0 && !isComposer && (
              <>
                {/* Quantity */}
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-bold text-brand-text uppercase tracking-widest">Quantité</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/40 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-bold text-brand-text text-xl w-8 text-center">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/40 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex items-center justify-center gap-2 bg-brand-gold text-white font-bold py-4 px-8 rounded-2xl shadow-gold hover:opacity-90 transition-all active:scale-[0.98] text-sm uppercase tracking-widest"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Ajouter au panier · {formatPrice(finalPrice * qty)}
                </button>

                <p className="text-[10px] text-brand-muted/60 text-center">
                  Paiement sécurisé · Livraison en Guyane
                </p>
              </>
            )}

            {isComposer && (
              <Link
                href="/composer"
                className="flex items-center justify-center gap-2 bg-brand-gold text-white font-bold py-4 px-8 rounded-2xl shadow-gold hover:opacity-90 transition-all active:scale-[0.98] text-sm uppercase tracking-widest"
              >
                <Sparkles className="w-5 h-5" />
                Créer mon cocktail
              </Link>
            )}
          </div>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-xl font-bold text-brand-text uppercase tracking-wide mb-4">
              Tu aimeras aussi
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4">
              {related.map((p) => {
                const imgs = parseJsonField<string[]>(p.images, []);
                return (
                  <Link
                    key={p.id}
                    href={`/product/${p.slug}`}
                    className="shrink-0 w-36 md:w-auto rounded-2xl overflow-hidden bg-brand-card border border-brand-border hover:border-brand-gold/40 transition-all"
                  >
                    <div className="aspect-square bg-brand-darker">
                      {imgs[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imgs[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-purple/30 to-brand-gold/10" />
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="font-display font-bold text-brand-text text-xs uppercase leading-snug line-clamp-1">
                        {p.name}
                      </p>
                      <p className="text-brand-gold font-bold text-xs mt-0.5">{formatPrice(p.price)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile sticky CTA ── */}
      {product.stock > 0 && !isComposer && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-brand-darker/95 backdrop-blur-xl border-t border-brand-border flex items-center gap-3 z-40">
          {/* Quantity compact */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-card border border-brand-border text-brand-muted"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-brand-text w-5 text-center">{qty}</span>
            <button
              onClick={() => setQty(Math.min(product.stock, qty + 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-card border border-brand-border text-brand-muted"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-gold text-white font-bold py-3.5 rounded-2xl shadow-gold hover:opacity-90 transition-all active:scale-[0.98] text-sm uppercase tracking-widest"
          >
            <ShoppingCart className="w-4 h-4" />
            Ajouter · {formatPrice(finalPrice * qty)}
          </button>
        </div>
      )}

      {isComposer && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-brand-darker/95 backdrop-blur-xl border-t border-brand-border z-40">
          <Link
            href="/composer"
            className="flex items-center justify-center gap-2 bg-brand-gold text-white font-bold py-4 rounded-2xl shadow-gold text-sm uppercase tracking-widest w-full"
          >
            <Sparkles className="w-4 h-4" />
            Créer mon cocktail
          </Link>
        </div>
      )}
    </div>
  );
}
