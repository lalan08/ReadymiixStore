"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Eye, EyeOff, Pencil, RefreshCw, Search,
  ChevronDown, X, Trash2, SlidersHorizontal,
  ImageIcon, Copy, ArrowUpDown,
} from "lucide-react";
import { formatPrice, parseJsonField } from "@/lib/utils";

interface Category { id: string; name: string; slug: string }
interface Product {
  id: string; name: string; slug: string; description: string | null;
  price: number; comparePrice: number | null; images: string;
  categoryId: string; category: Category;
  stock: number; featured: boolean; active: boolean;
  volume: string | null; alcohol: string | null; tags: string;
  productType: string; hasSoftChoice: boolean;
  createdAt: string;
}

/* Deterministic color per category slug */
const BADGE_PALETTE = [
  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "bg-sky-500/20 text-sky-400 border-sky-500/30",
  "bg-rose-500/20 text-rose-400 border-rose-500/30",
  "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "bg-teal-500/20 text-teal-400 border-teal-500/30",
  "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
];
function badgeColor(slug: string) {
  const idx = slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % BADGE_PALETTE.length;
  return BADGE_PALETTE[idx];
}

export default function ArticlesClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [qName, setQName] = useState("");
  const [qPrice, setQPrice] = useState("");
  const [qCategoryId, setQCategoryId] = useState(categories[0]?.id ?? "");
  const [isAdding, setIsAdding] = useState(false);

  const filtered = search.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : products;

  /* ---------- selection ---------- */
  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  }
  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  /* ---------- quick add ---------- */
  async function handleQuickAdd(e?: React.FormEvent) {
    e?.preventDefault();
    if (!qName.trim() || !qPrice || !qCategoryId) return;
    setIsAdding(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: qName.trim(), price: parseFloat(qPrice), categoryId: qCategoryId }),
    });
    if (res.ok) {
      const np = await res.json();
      setProducts((prev) => [np, ...prev]);
      setQName(""); setQPrice("");
    }
    setIsAdding(false);
  }

  /* ---------- toggle active ---------- */
  async function toggleActive(product: Product) {
    const newActive = !product.active;
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, active: newActive } : p));
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: product.name, description: product.description,
        price: product.price, comparePrice: product.comparePrice,
        images: product.images, categoryId: product.category.id,
        stock: product.stock, featured: product.featured,
        active: newActive, volume: product.volume,
        alcohol: product.alcohol, tags: product.tags,
      }),
    });
    if (!res.ok) {
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, active: product.active } : p));
    }
  }

  /* ---------- duplicate ---------- */
  async function handleDuplicate(product: Product) {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: `${product.name} (copie)`,
        slug: `${product.slug}-copie-${Date.now()}`,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        images: product.images,
        categoryId: product.category.id,
        stock: product.stock,
        featured: false,
        active: false,
        volume: product.volume,
        alcohol: product.alcohol,
        tags: product.tags,
      }),
    });
    if (res.ok) {
      const np = await res.json();
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p.id === product.id);
        const next = [...prev];
        next.splice(idx + 1, 0, np);
        return next;
      });
    }
  }

  /* ---------- delete ---------- */
  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet article définitivement ?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) startTransition(() => router.refresh());
  }

  /* ---------- preview close on Escape ---------- */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") setPreviewSrc(null);
  }, []);

  return (
    <>
      {/* ===== IMAGE LIGHTBOX ===== */}
      {previewSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setPreviewSrc(null)}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-3xl w-full max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Aperçu"
              className="w-full h-full object-contain bg-brand-darker"
              style={{ maxHeight: "85vh" }}
            />
            <button
              onClick={() => setPreviewSrc(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ===== PAGE ===== */}
      <div className="max-w-6xl flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-text flex items-center gap-2">
              Articles Boutique
            </h1>
            <p className="text-brand-muted text-sm mt-0.5">
              Gérez vos articles et leurs informations
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => startTransition(() => router.refresh())}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-border text-brand-muted text-sm hover:text-brand-text hover:border-brand-gold/30 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`} />
              Actualiser
            </button>
            {categories.length > 0 ? (
              <button
                onClick={() => setShowQuickAdd((v) => !v)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-4 py-2 rounded-xl text-sm shadow-gold-sm hover:opacity-90 transition-all"
              >
                <Plus className="w-4 h-4" />
                Nouvel article
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showQuickAdd ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <Link
                href="/admin/categories"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-4 py-2 rounded-xl text-sm"
              >
                <Plus className="w-4 h-4" />
                Créer une catégorie
              </Link>
            )}
          </div>
        </div>

        {/* Quick add panel */}
        {showQuickAdd && categories.length > 0 && (
          <form
            onSubmit={handleQuickAdd}
            className="bg-brand-card border border-brand-gold/30 rounded-2xl p-5 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-brand-text text-sm">Création rapide</p>
              <button type="button" onClick={() => setShowQuickAdd(false)} className="text-brand-muted hover:text-brand-text transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Nom de l'article *"
                value={qName}
                onChange={(e) => setQName(e.target.value)}
                autoFocus
                required
                className="flex-1 bg-brand-darker border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 outline-none focus:border-brand-gold/50 transition-colors"
              />
              <input
                type="number"
                placeholder="Prix (€) *"
                value={qPrice}
                onChange={(e) => setQPrice(e.target.value)}
                min="0"
                step="0.01"
                required
                className="w-32 bg-brand-darker border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 outline-none focus:border-brand-gold/50 transition-colors"
              />
              <select
                value={qCategoryId}
                onChange={(e) => setQCategoryId(e.target.value)}
                className="bg-brand-darker border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-text outline-none focus:border-brand-gold/50 transition-colors"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={isAdding || !qName.trim() || !qPrice}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-opacity"
              >
                {isAdding ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Ajouter
              </button>
            </div>
            <p className="text-xs text-brand-muted">Appuyez sur Entrée pour ajouter rapidement</p>
          </form>
        )}

        {/* Search + Filters bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher un article…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-card border border-brand-border rounded-xl pl-9 pr-9 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 outline-none focus:border-brand-gold/50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-brand-border text-brand-muted text-sm hover:text-brand-text hover:border-brand-gold/30 transition-all shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl bg-brand-card border border-brand-border text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-border/50 flex items-center justify-center">
              <ImageIcon className="w-7 h-7 text-brand-muted/50" />
            </div>
            <div>
              <p className="font-display font-bold text-brand-text mb-1">
                {search ? "Aucun résultat" : "Aucun article"}
              </p>
              <p className="text-brand-muted text-sm">
                {search
                  ? `Aucun article ne correspond à "${search}"`
                  : categories.length === 0
                  ? "Créez d'abord des catégories boutique (ex : Cocktails, Softs, Accessoires)."
                  : "Ajoutez votre premier article via le bouton ci-dessus."}
              </p>
            </div>
            {categories.length === 0 && (
              <Link href="/admin/categories" className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-5 py-2.5 rounded-xl text-sm">
                <Plus className="w-4 h-4" /> Gérer les catégories
              </Link>
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden">
            <table className="w-full text-sm">
              {/* Head */}
              <thead>
                <tr className="border-b border-brand-border bg-brand-darker/40">
                  {/* Checkbox all */}
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-brand-border bg-brand-darker accent-brand-gold cursor-pointer"
                    />
                  </th>
                  {/* Thumbnail */}
                  <th className="w-16 px-3 py-3.5" />
                  {/* Nom */}
                  <th className="text-left px-3 py-3.5">
                    <button className="inline-flex items-center gap-1 text-xs font-bold text-brand-muted uppercase tracking-wide hover:text-brand-text transition-colors">
                      Nom <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  {/* Catégorie */}
                  <th className="text-left px-3 py-3.5 hidden md:table-cell">
                    <span className="text-xs font-bold text-brand-muted uppercase tracking-wide">
                      Catégorie
                    </span>
                  </th>
                  {/* Prix */}
                  <th className="text-right px-3 py-3.5">
                    <button className="inline-flex items-center gap-1 text-xs font-bold text-brand-muted uppercase tracking-wide hover:text-brand-text transition-colors ml-auto">
                      Prix <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  {/* Statut */}
                  <th className="text-center px-3 py-3.5 hidden sm:table-cell">
                    <span className="text-xs font-bold text-brand-muted uppercase tracking-wide">
                      Statut
                    </span>
                  </th>
                  {/* Actions */}
                  <th className="text-right px-4 py-3.5 w-24">
                    <span className="text-xs font-bold text-brand-muted uppercase tracking-wide">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>

              {/* Body */}
              <tbody className="divide-y divide-brand-border/40">
                {filtered.map((product) => {
                  const images = parseJsonField<string[]>(product.images, []);
                  const imgSrc = images[0] ?? null;
                  const color  = badgeColor(product.category.slug);
                  const isSelected = selected.has(product.id);

                  return (
                    <tr
                      key={product.id}
                      className={`transition-colors group ${isSelected ? "bg-brand-gold/5" : "hover:bg-white/2"}`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(product.id)}
                          className="w-4 h-4 rounded border-brand-border bg-brand-darker accent-brand-gold cursor-pointer"
                        />
                      </td>

                      {/* Thumbnail — hover: popover preview · click: lightbox */}
                      <td className="px-3 py-3">
                        <div className="relative">
                          <button
                            onClick={() => imgSrc && setPreviewSrc(imgSrc)}
                            onMouseEnter={() => {
                              if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                              setHoveredId(product.id);
                            }}
                            onMouseLeave={() => {
                              hoverTimeout.current = setTimeout(() => setHoveredId(null), 150);
                            }}
                            className={`w-12 h-12 rounded-xl overflow-hidden bg-brand-darker border border-brand-border flex items-center justify-center shrink-0 transition-all ${
                              imgSrc
                                ? "cursor-zoom-in hover:opacity-80 hover:border-brand-gold/40"
                                : "cursor-default"
                            }`}
                            title={imgSrc ? "Cliquer pour agrandir" : "Pas d'image"}
                          >
                            {imgSrc ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-brand-muted/25" strokeWidth={1.5} />
                            )}
                          </button>

                          {/* Hover popover */}
                          {hoveredId === product.id && imgSrc && (
                            <div
                              className="absolute left-14 top-1/2 -translate-y-1/2 z-40 w-52 rounded-2xl overflow-hidden bg-brand-card border border-brand-border shadow-2xl pointer-events-none"
                              style={{ filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.5))" }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={imgSrc} alt={product.name} className="w-full aspect-square object-cover" />
                              <div className="px-3 py-2.5">
                                <p className="text-sm font-semibold text-brand-text leading-snug">{product.name}</p>
                                {(product.description || product.volume) && (
                                  <p className="text-xs text-brand-muted mt-0.5 line-clamp-2">
                                    {product.description ?? product.volume}
                                  </p>
                                )}
                                <p className="text-xs font-bold text-brand-gold mt-1">{formatPrice(product.price)}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Nom + description — clic → édition */}
                      <td className="px-3 py-3.5 min-w-0">
                        <Link
                          href={`/admin/articles/${product.id}/edit`}
                          className="group/name block"
                        >
                          <p className="font-semibold text-brand-text leading-snug group-hover/name:text-brand-gold transition-colors flex items-center gap-2">
                            {product.name}
                            {product.hasSoftChoice && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-brand-teal/15 text-brand-teal border border-brand-teal/25 uppercase tracking-wide shrink-0">
                                Soft
                              </span>
                            )}
                          </p>
                          {product.description && (
                            <p className="text-xs text-brand-muted mt-0.5 line-clamp-1">
                              {product.description}
                            </p>
                          )}
                          {!product.description && product.volume && (
                            <p className="text-xs text-brand-muted mt-0.5">{product.volume}</p>
                          )}
                        </Link>
                        {/* Category shown inline on small screens */}
                        <span className={`md:hidden mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color}`}>
                          {product.category.name}
                        </span>
                      </td>

                      {/* Catégorie badge */}
                      <td className="px-3 py-3.5 hidden md:table-cell">
                        <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full border ${color}`}>
                          {product.category.name}
                        </span>
                      </td>

                      {/* Prix */}
                      <td className="px-3 py-3.5 text-right whitespace-nowrap">
                        <p className="font-bold text-brand-text">
                          {formatPrice(product.price)}
                        </p>
                        {product.comparePrice && (
                          <p className="text-xs text-brand-muted line-through">
                            {formatPrice(product.comparePrice)}
                          </p>
                        )}
                      </td>

                      {/* Statut — pill solide style Kitchen */}
                      <td className="px-3 py-3.5 text-center hidden sm:table-cell">
                        <button
                          onClick={() => toggleActive(product)}
                          title="Cliquer pour changer le statut"
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                            product.active
                              ? "bg-emerald-700 text-white hover:bg-emerald-600"
                              : "bg-brand-border text-brand-muted hover:bg-brand-border/80"
                          }`}
                        >
                          {product.active
                            ? <><Eye className="w-3 h-3" /> Actif</>
                            : <><EyeOff className="w-3 h-3" /> Masqué</>
                          }
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          {/* Duplicate */}
                          <button
                            onClick={() => handleDuplicate(product)}
                            title="Dupliquer"
                            className="p-2 rounded-lg text-brand-muted hover:text-brand-text hover:bg-white/5 transition-all"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {/* Edit */}
                          <Link
                            href={`/admin/articles/${product.id}/edit`}
                            title="Modifier"
                            className="p-2 rounded-lg text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Link>
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(product.id)}
                            title="Supprimer"
                            className="p-2 rounded-lg text-brand-muted hover:text-brand-error hover:bg-brand-error/10 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Footer count */}
            <div className="px-5 py-3 border-t border-brand-border/50 bg-brand-darker/20">
              <p className="text-xs text-brand-muted">
                {selected.size > 0
                  ? `${selected.size} article${selected.size > 1 ? "s" : ""} sélectionné${selected.size > 1 ? "s" : ""} sur ${filtered.length}`
                  : `${filtered.length} article${filtered.length !== 1 ? "s" : ""}${search ? ` pour "${search}"` : ""}`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
