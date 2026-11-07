"use client";

import { useState } from "react";
import { ShoppingCart, Check, Plus, Minus, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice, parseJsonField } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  CAIPI_FLAVORS,
  CAIPI_SIZES,
  CAIPI_PREPARATIONS,
  CAIPI_SUPPLEMENTS,
  getCaipiPrice,
} from "@/lib/caipiPricing";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string;
  stock: number;
  featured: boolean;
  volume: string | null;
  comparePrice: number | null;
  category: { name: string; slug: string };
}

const TOAST_STYLE = {
  style: { background: "#0E0E1C", color: "#F0F0F8", border: "1px solid #1E1E32" },
};

export default function CaipiConfigurator({ product }: { product: Product }) {
  const [flavor, setFlavor] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [preparation, setPreparation] = useState<string | null>(null);
  const [supplements, setSupplements] = useState<string[]>([]);
  const [qty, setQty] = useState(1);
  const { addItem, openCart } = useCartStore();

  const images = parseJsonField<string[]>(product.images, []);

  const basePrice = flavor && size ? getCaipiPrice(flavor, size) : null;
  const suppTotal = supplements.reduce((sum, suppId) => {
    const supp = CAIPI_SUPPLEMENTS.find((x) => x.id === suppId);
    return sum + (supp?.price ?? 0);
  }, 0);
  const unitPrice = basePrice !== null ? basePrice + suppTotal : null;
  const isReady = !!flavor && !!size && !!preparation;

  function toggleSupp(id: string) {
    setSupplements((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleAdd() {
    if (!flavor) {
      toast.error("Choisis un parfum", TOAST_STYLE);
      return;
    }
    if (!size) {
      toast.error("Choisis une taille", TOAST_STYLE);
      return;
    }
    if (!preparation) {
      toast.error("Choisis une préparation (douce ou corsée)", TOAST_STYLE);
      return;
    }

    const suppsSorted = [...supplements].sort();
    const cartId = `caipi-${product.id}-${flavor}-${size}-${preparation}${
      suppsSorted.length ? "-" + suppsSorted.join("-") : ""
    }`;

    const flavorLabel = CAIPI_FLAVORS.find((f) => f.id === flavor)!.label;
    const sizeLabel = CAIPI_SIZES.find((s) => s.id === size)!.label;
    const prepLabel = CAIPI_PREPARATIONS.find((p) => p.id === preparation)!.label;
    const suppLabels = suppsSorted.map(
      (id) => CAIPI_SUPPLEMENTS.find((s) => s.id === id)!.label
    );

    addItem({
      id: cartId,
      name: product.name,
      slug: product.slug,
      price: unitPrice!,
      image: images[0] ?? "",
      quantity: qty,
      options: {
        caipi: {
          parfum: flavorLabel,
          taille: sizeLabel,
          preparation: prepLabel,
          supplements: suppLabels,
        },
      },
    });

    toast.success(`${product.name} ajoutée !`, { icon: "🛒", ...TOAST_STYLE });
    openCart();
  }

  return (
    <>
      <div className="md:grid md:grid-cols-2 md:gap-12">
        {/* ── Left: info + options ── */}
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

          {/* Description */}
          {product.description && (
            <p className="text-sm text-brand-muted leading-relaxed">
              {product.description}
            </p>
          )}

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

          {product.stock > 0 && (
            <>
              {/* Parfum */}
              <div className="flex flex-col gap-3 rounded-2xl bg-brand-card border border-brand-border p-4">
                <p className="text-xs font-bold text-brand-text uppercase tracking-widest">
                  Parfum
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {CAIPI_FLAVORS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFlavor(f.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                        flavor === f.id
                          ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                          : "border-brand-border bg-brand-darker text-brand-muted hover:border-brand-gold/30"
                      }`}
                    >
                      {flavor === f.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                      <span className="truncate">{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Taille */}
              <div className="flex flex-col gap-3 rounded-2xl bg-brand-card border border-brand-border p-4">
                <p className="text-xs font-bold text-brand-text uppercase tracking-widest">
                  Taille
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {CAIPI_SIZES.map((s) => {
                    const price = flavor ? getCaipiPrice(flavor, s.id) : null;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSize(s.id)}
                        className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                          size === s.id
                            ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                            : "border-brand-border bg-brand-darker text-brand-muted hover:border-brand-gold/30"
                        }`}
                      >
                        {size === s.id && <Check className="w-3.5 h-3.5" />}
                        <span>{s.label}</span>
                        {price !== null && (
                          <span className="text-[11px] text-brand-gold font-bold">
                            {formatPrice(price)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Préparation */}
              <div className="flex flex-col gap-3 rounded-2xl bg-brand-card border border-brand-border p-4">
                <p className="text-xs font-bold text-brand-text uppercase tracking-widest">
                  Préparation
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {CAIPI_PREPARATIONS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPreparation(p.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                        preparation === p.id
                          ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                          : "border-brand-border bg-brand-darker text-brand-muted hover:border-brand-gold/30"
                      }`}
                    >
                      {preparation === p.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                      <span>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Suppléments */}
              <div className="flex flex-col gap-3 rounded-2xl bg-brand-card border border-brand-border p-4">
                <p className="text-xs font-bold text-brand-text uppercase tracking-widest">
                  Suppléments{" "}
                  <span className="text-brand-muted normal-case font-normal">(optionnel)</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {CAIPI_SUPPLEMENTS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => toggleSupp(s.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all active:scale-95 cursor-pointer ${
                        supplements.includes(s.id)
                          ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                          : "border-brand-border bg-brand-darker text-brand-muted hover:border-brand-gold/30"
                      }`}
                    >
                      {supplements.includes(s.id) && (
                        <Check className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span className="flex-1">{s.label}</span>
                      <span className="text-[11px] text-brand-gold ml-auto">
                        +{formatPrice(s.price)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Right: price + qty + CTA (desktop) ── */}
        <div className="hidden md:flex flex-col gap-6 pt-4">
          {product.stock > 0 && (
            <>
              {/* Price */}
              <div className="flex flex-col gap-1">
                <p className="text-xs font-bold text-brand-text uppercase tracking-widest">Prix</p>
                {unitPrice !== null ? (
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-3xl font-bold text-brand-gold">
                      {formatPrice(unitPrice * qty)}
                    </span>
                    {qty > 1 && (
                      <span className="text-sm text-brand-muted">
                        {formatPrice(unitPrice)} / unité
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-brand-muted text-sm">
                    Sélectionne un parfum et une taille
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold text-brand-text uppercase tracking-widest">
                  Quantité
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/40 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-brand-text text-xl w-8 text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/40 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className={`flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-2xl transition-all active:scale-[0.98] text-sm uppercase tracking-widest ${
                  isReady
                    ? "bg-brand-gold text-white shadow-gold hover:opacity-90 cursor-pointer"
                    : "bg-brand-card border border-brand-border text-brand-muted cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isReady && unitPrice !== null
                  ? `Ajouter au panier · ${formatPrice(unitPrice * qty)}`
                  : "Choisis tes options"}
              </button>

              <p className="text-[10px] text-brand-muted/60 text-center">
                Paiement sécurisé · Livraison en Guyane
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ── */}
      {product.stock > 0 && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 p-4 bg-brand-darker/95 backdrop-blur-xl border-t border-brand-border flex items-center gap-3 z-40">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-card border border-brand-border text-brand-muted cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-bold text-brand-text w-5 text-center">{qty}</span>
            <button
              onClick={() => setQty(Math.min(product.stock, qty + 1))}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-card border border-brand-border text-brand-muted cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-gold text-white font-bold py-3.5 rounded-2xl shadow-gold hover:opacity-90 transition-all active:scale-[0.98] text-sm uppercase tracking-widest cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            {unitPrice !== null
              ? `Ajouter · ${formatPrice(unitPrice * qty)}`
              : "Ajouter au panier"}
          </button>
        </div>
      )}
    </>
  );
}
