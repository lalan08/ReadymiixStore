"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingBag, Plus, Eye, EyeOff, Pencil,
  RefreshCw, Search, ChevronDown, X, Trash2,
} from "lucide-react";
import { formatPrice, parseJsonField } from "@/lib/utils";

interface Category { id: string; name: string; slug: string }
interface Product {
  id: string; name: string; slug: string; description: string | null;
  price: number; comparePrice: number | null; images: string;
  categoryId: string; category: Category;
  stock: number; featured: boolean; active: boolean;
  volume: string | null; alcohol: string | null; tags: string;
  createdAt: string;
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
  const [qName, setQName] = useState("");
  const [qPrice, setQPrice] = useState("");
  const [qCategoryId, setQCategoryId] = useState(categories[0]?.id ?? "");
  const [isAdding, setIsAdding] = useState(false);

  const filtered = search.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  async function handleQuickAdd(e?: React.FormEvent) {
    e?.preventDefault();
    if (!qName.trim() || !qPrice || !qCategoryId) return;
    setIsAdding(true);
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: qName.trim(),
        price: parseFloat(qPrice),
        categoryId: qCategoryId,
      }),
    });
    if (res.ok) {
      const newProduct = await res.json();
      setProducts((prev) => [newProduct, ...prev]);
      setQName("");
      setQPrice("");
    }
    setIsAdding(false);
  }

  async function toggleActive(product: Product) {
    const newActive = !product.active;
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, active: newActive } : p))
    );
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        images: product.images,
        categoryId: product.category.id,
        stock: product.stock,
        featured: product.featured,
        active: newActive,
        volume: product.volume,
        alcohol: product.alcohol,
        tags: product.tags,
      }),
    });
    if (!res.ok) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, active: product.active } : p
        )
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet article définitivement ?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) startTransition(() => router.refresh());
  }

  return (
    <div className="max-w-5xl flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-text">
            Articles Boutique
          </h1>
          <p className="text-brand-muted text-sm mt-0.5">
            {products.length} article{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => startTransition(() => router.refresh())}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-border text-brand-muted text-sm hover:text-brand-text hover:border-brand-gold/30 transition-all"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isPending ? "animate-spin" : ""}`}
            />
            Actualiser
          </button>
          {categories.length > 0 ? (
            <button
              onClick={() => setShowQuickAdd((v) => !v)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-4 py-2 rounded-xl text-sm shadow-gold-sm hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Nouvel article
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showQuickAdd ? "rotate-180" : ""}`}
              />
            </button>
          ) : (
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-4 py-2 rounded-xl text-sm shadow-gold-sm hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Créer une catégorie d&apos;abord
            </Link>
          )}
        </div>
      </div>

      {/* Création rapide panel */}
      {showQuickAdd && categories.length > 0 && (
        <form
          onSubmit={handleQuickAdd}
          className="bg-brand-card border border-brand-gold/30 rounded-2xl p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <p className="font-semibold text-brand-text text-sm">
              Création rapide
            </p>
            <button
              type="button"
              onClick={() => setShowQuickAdd(false)}
              className="text-brand-muted hover:text-brand-text transition-colors"
            >
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
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={isAdding || !qName.trim() || !qPrice}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 transition-opacity"
            >
              {isAdding ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Ajouter
            </button>
          </div>
          <p className="text-xs text-brand-muted">
            Appuyez sur Entrée pour ajouter rapidement
          </p>
        </form>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher un article…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-brand-card border border-brand-border rounded-xl pl-9 pr-9 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 outline-none focus:border-brand-gold/50 transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-2xl bg-brand-card border border-brand-border text-center">
          <ShoppingBag className="w-12 h-12 text-brand-muted" />
          <div>
            <p className="font-display font-bold text-brand-text mb-1">
              {search ? "Aucun résultat" : "Aucun article"}
            </p>
            <p className="text-brand-muted text-sm">
              {search
                ? `Aucun article ne correspond à "${search}"`
                : categories.length === 0
                ? "Créez d'abord des catégories boutique (ex : Cocktails, Softs, Accessoires)."
                : "Ajoutez votre premier article boutique via le bouton ci-dessus."}
            </p>
          </div>
          {categories.length === 0 && (
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-5 py-2.5 rounded-xl text-sm"
            >
              <Plus className="w-4 h-4" />
              Gérer les catégories
            </Link>
          )}
        </div>
      ) : (
        <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted text-xs uppercase tracking-wide">
                <th className="w-14 px-4 py-3.5" />
                <th className="text-left px-4 py-3.5">Article</th>
                <th className="text-left px-4 py-3.5 hidden md:table-cell">
                  Catégorie
                </th>
                <th className="text-right px-4 py-3.5">Prix</th>
                <th className="text-center px-4 py-3.5 hidden sm:table-cell">
                  Statut
                </th>
                <th className="text-right px-4 py-3.5 w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/50">
              {filtered.map((product) => {
                const images = parseJsonField<string[]>(product.images, []);
                const imgSrc = images[0] ?? null;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-white/2 transition-colors group"
                  >
                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-brand-darker border border-brand-border shrink-0">
                        {imgSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imgSrc}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-brand-muted/40" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-brand-text leading-snug">
                        {product.name}
                      </p>
                      {product.volume && (
                        <p className="text-xs text-brand-muted">
                          {product.volume}
                        </p>
                      )}
                      <p className="text-xs text-brand-muted md:hidden mt-0.5">
                        {product.category.name}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border bg-brand-border/50 text-brand-muted border-brand-border">
                        {product.category.name}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 text-right">
                      <p className="font-bold text-brand-gold whitespace-nowrap">
                        {formatPrice(product.price)}
                      </p>
                      {product.comparePrice && (
                        <p className="text-xs text-brand-muted line-through">
                          {formatPrice(product.comparePrice)}
                        </p>
                      )}
                    </td>

                    {/* Status toggle */}
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      <button
                        onClick={() => toggleActive(product)}
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-all ${
                          product.active
                            ? "text-brand-success bg-brand-success/10 border-brand-success/30 hover:bg-brand-success/20"
                            : "text-brand-muted bg-brand-border/50 border-brand-border hover:border-brand-gold/30 hover:text-brand-text"
                        }`}
                      >
                        {product.active ? (
                          <>
                            <Eye className="w-3 h-3" /> Actif
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Masqué
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg text-brand-muted hover:text-brand-gold hover:bg-brand-gold/10 transition-all"
                          title="Modifier"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg text-brand-muted hover:text-brand-error hover:bg-brand-error/10 transition-all"
                          title="Supprimer"
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
        </div>
      )}

      {/* Info banner */}
      <p className="text-xs text-brand-muted text-center pb-2">
        Ces articles apparaissent dans la{" "}
        <a href="/shop" target="_blank" className="text-brand-gold hover:underline">
          Boutique
        </a>{" "}
        — distinct du Composer cocktail.
      </p>
    </div>
  );
}
