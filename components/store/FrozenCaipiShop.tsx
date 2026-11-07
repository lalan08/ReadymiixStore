"use client";

import { useState } from "react";
import { X, Plus, Minus, ShoppingCart, Check, AlertCircle } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const TOAST_STYLE = {
  style: { background: "#0E0E1C", color: "#F0F0F8", border: "1px solid #1E1E32" },
};

interface Flavor {
  id: string;
  label: string;
  sub?: string;
  category: "classique" | "fruitee";
  emoji: string;
  color: string;
}

const FLAVORS: Flavor[] = [
  { id: "citron-vert",   label: "Classique",    sub: "Citron Vert",  category: "classique", emoji: "🍋", color: "#a8e063" },
  { id: "fraise",        label: "Fraise",        category: "fruitee", emoji: "🍓", color: "#FF4444" },
  { id: "peche",         label: "Pêche",         category: "fruitee", emoji: "🍑", color: "#FFAA55" },
  { id: "mangue",        label: "Mangue",        category: "fruitee", emoji: "🥭", color: "#FFB347" },
  { id: "maracudja",     label: "Maracudja",     category: "fruitee", emoji: "🍊", color: "#E84393" },
  { id: "ananas",        label: "Ananas",        category: "fruitee", emoji: "🍍", color: "#FFD700" },
  { id: "fruits-rouges", label: "Fruits Rouges", category: "fruitee", emoji: "🫐", color: "#CC2244" },
  { id: "coco",          label: "Coco",          category: "fruitee", emoji: "🥥", color: "#D4C8AA" },
  { id: "kiwi",          label: "Kiwi",          category: "fruitee", emoji: "🥝", color: "#5FA000" },
  { id: "framboise",     label: "Framboise",     category: "fruitee", emoji: "🍇", color: "#FF3366" },
  { id: "cerise",        label: "Cerise",        category: "fruitee", emoji: "🍒", color: "#990022" },
  { id: "myrtille",      label: "Myrtille",      category: "fruitee", emoji: "🫐", color: "#6B21A8" },
  { id: "pomme-verte",   label: "Pomme Verte",   category: "fruitee", emoji: "🍏", color: "#3A9500" },
  { id: "litchi",        label: "Litchi",        category: "fruitee", emoji: "🍈", color: "#FFB0C8" },
  { id: "banane",        label: "Banane",        category: "fruitee", emoji: "🍌", color: "#FFE066" },
  { id: "poire",         label: "Poire",         category: "fruitee", emoji: "🍐", color: "#CCDD55" },
];

const SIZES = [
  { id: "500ml",   label: "500 ml" },
  { id: "700ml",   label: "700 ml" },
  { id: "1litre",  label: "1 Litre" },
];

const PREPS = [
  { id: "douce",  label: "Douce" },
  { id: "corsee", label: "Corsée" },
];

const TOPPINGS = [
  { id: "bonbons", label: "Bonbons", price: 1 },
  { id: "sirop",   label: "Sirop",   price: 2 },
];

const PRICING: Record<string, Record<string, number>> = {
  classique: { "500ml": 10, "700ml": 12, "1litre": 18 },
  fruitee:   { "500ml": 12, "700ml": 14, "1litre": 20 },
};

function getPrice(category: string, sizeId: string) {
  return PRICING[category]?.[sizeId] ?? 0;
}

function FlavorCard({ flavor, selected, onClick }: { flavor: Flavor; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all active:scale-95 cursor-pointer ${
        selected
          ? "border-brand-gold ring-1 ring-brand-gold/30"
          : "border-brand-border bg-brand-card hover:border-brand-gold/30"
      }`}
      style={selected ? { background: `${flavor.color}18` } : {}}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-gold flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-white" />
        </div>
      )}
      <span className="text-3xl">{flavor.emoji}</span>
      <div className="text-center">
        <p className="text-xs font-bold text-brand-text leading-tight">{flavor.label}</p>
        {flavor.sub && <p className="text-[10px] text-brand-muted">{flavor.sub}</p>}
      </div>
    </button>
  );
}

export default function FrozenCaipiShop() {
  const [selected, setSelected] = useState<Flavor | null>(null);
  const [size, setSize]         = useState<string | null>(null);
  const [prep, setPrep]         = useState<string | null>(null);
  const [toppings, setToppings] = useState<string[]>([]);
  const [qty, setQty]           = useState(1);
  const { addItem, openCart }   = useCartStore();

  function pick(f: Flavor) {
    setSelected(f);
    setSize(null);
    setPrep(null);
    setToppings([]);
    setQty(1);
  }

  function close() { setSelected(null); }

  function toggleTopping(id: string) {
    setToppings((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  const basePrice  = selected && size ? getPrice(selected.category, size) : null;
  const suppTotal  = toppings.reduce((s, id) => s + (TOPPINGS.find((t) => t.id === id)?.price ?? 0), 0);
  const unitPrice  = basePrice !== null ? basePrice + suppTotal : null;
  const isReady    = !!selected && !!size && !!prep;

  function handleAdd() {
    if (!selected || !size || !prep || unitPrice === null) return;
    const suppsSorted   = [...toppings].sort();
    const cartId        = `caipi-${selected.id}-${size}-${prep}${suppsSorted.length ? "-" + suppsSorted.join("-") : ""}`;
    const sizeLabel     = SIZES.find((s) => s.id === size)!.label;
    const prepLabel     = PREPS.find((p) => p.id === prep)!.label;
    const toppingLabels = suppsSorted.map((id) => TOPPINGS.find((t) => t.id === id)!.label);

    addItem({
      id: cartId,
      name: `Frozen Caïpi ${selected.label}`,
      slug: "frozen-caipi",
      price: unitPrice,
      image: "",
      quantity: qty,
      options: {
        caipi: {
          parfum: selected.label + (selected.sub ? ` ${selected.sub}` : ""),
          taille: sizeLabel,
          preparation: prepLabel,
          supplements: toppingLabels,
        },
      },
    });

    toast.success(`Frozen Caïpi ${selected.label} ajouté !`, { icon: "🛒", ...TOAST_STYLE });
    openCart();
    close();
  }

  const classique = FLAVORS.filter((f) => f.category === "classique");
  const fruitee   = FLAVORS.filter((f) => f.category === "fruitee");

  return (
    <>
      {/* Notice */}
      <div className="mb-5 p-3 rounded-xl bg-brand-card border border-brand-border flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
        <p className="text-xs text-brand-muted leading-relaxed">
          <span className="text-brand-text font-semibold">Uniquement sur commande · Pas de surplace</span>
          <br />Prépare ta commande au minimum{" "}
          <span className="text-brand-gold font-semibold">15 min</span> avant ton passage
        </p>
      </div>

      {/* Classique */}
      <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-3">
        Classique — 10 / 12 / 18 €
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {classique.map((f) => (
          <FlavorCard key={f.id} flavor={f} selected={selected?.id === f.id} onClick={() => pick(f)} />
        ))}
      </div>

      {/* Fruité */}
      <p className="text-[10px] font-bold text-brand-gold uppercase tracking-widest mb-3">
        Fruité — 12 / 14 / 20 €
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {fruitee.map((f) => (
          <FlavorCard key={f.id} flavor={f} selected={selected?.id === f.id} onClick={() => pick(f)} />
        ))}
      </div>

      {/* Bottom sheet */}
      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={close} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-darker border-t border-brand-border rounded-t-3xl p-5 pb-10 max-h-[82vh] overflow-y-auto">
            <div className="w-10 h-1 bg-brand-border rounded-full mx-auto mb-5" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selected.emoji}</span>
                <div>
                  <p className="font-bold text-brand-text text-base">{selected.label}</p>
                  {selected.sub && <p className="text-xs text-brand-muted">{selected.sub}</p>}
                </div>
              </div>
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-card border border-brand-border text-brand-muted cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Taille */}
            <p className="text-[10px] font-bold text-brand-text uppercase tracking-widest mb-2">Taille</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {SIZES.map((s) => {
                const price = getPrice(selected.category, s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => setSize(s.id)}
                    className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                      size === s.id
                        ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                        : "border-brand-border bg-brand-card text-brand-muted hover:border-brand-gold/30"
                    }`}
                  >
                    {size === s.id && <Check className="w-3 h-3" />}
                    <span className="text-xs">{s.label}</span>
                    <span className="text-[11px] text-brand-gold font-bold">{formatPrice(price)}</span>
                    {s.id === "1litre" && (
                      <span className="text-[8px] bg-brand-gold text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                        NEW
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Préparation */}
            <p className="text-[10px] font-bold text-brand-text uppercase tracking-widest mb-2">Préparation</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {PREPS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPrep(p.id)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    prep === p.id
                      ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                      : "border-brand-border bg-brand-card text-brand-muted hover:border-brand-gold/30"
                  }`}
                >
                  {prep === p.id && <Check className="w-3 h-3 shrink-0" />}
                  {p.label}
                </button>
              ))}
            </div>

            {/* Toppings */}
            <p className="text-[10px] font-bold text-brand-text uppercase tracking-widest mb-2">
              Toppings{" "}
              <span className="text-brand-muted normal-case font-normal">(optionnel)</span>
            </p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {TOPPINGS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleTopping(t.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    toppings.includes(t.id)
                      ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                      : "border-brand-border bg-brand-card text-brand-muted hover:border-brand-gold/30"
                  }`}
                >
                  {toppings.includes(t.id) && <Check className="w-3 h-3 shrink-0" />}
                  <span className="flex-1">{t.label}</span>
                  <span className="text-[11px] text-brand-gold">+{formatPrice(t.price)}</span>
                </button>
              ))}
            </div>

            {/* Qty + CTA */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-card border border-brand-border text-brand-muted cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-bold text-brand-text w-5 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-brand-card border border-brand-border text-brand-muted cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={!isReady}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                  isReady
                    ? "bg-brand-gold text-white shadow-gold hover:opacity-90 active:scale-[0.98] cursor-pointer"
                    : "bg-brand-card border border-brand-border text-brand-muted cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {isReady && unitPrice !== null
                  ? `Ajouter · ${formatPrice(unitPrice * qty)}`
                  : "Choisis taille + préparation"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
