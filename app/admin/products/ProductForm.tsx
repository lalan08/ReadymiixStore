"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { parseJsonField } from "@/lib/utils";

interface Category { id: string; name: string }
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string;
  categoryId: string;
  stock: number;
  featured: boolean;
  active: boolean;
  volume: string | null;
  alcohol: string | null;
  tags: string;
}

interface Props {
  categories: Category[];
  product?: Product;
}

export default function ProductForm({ categories, product }: Props) {
  const router  = useRouter();
  const isEdit  = !!product;

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:         product?.name         ?? "",
    slug:         product?.slug         ?? "",
    description:  product?.description  ?? "",
    price:        product?.price        ?? 0,
    comparePrice: product?.comparePrice ?? "",
    images:       parseJsonField<string[]>(product?.images ?? "[]", []).join("\n"),
    categoryId:   product?.categoryId   ?? (categories[0]?.id ?? ""),
    stock:        product?.stock        ?? 0,
    featured:     product?.featured     ?? false,
    active:       product?.active       ?? true,
    volume:       product?.volume       ?? "",
    alcohol:      product?.alcohol      ?? "",
    tags:         parseJsonField<string[]>(product?.tags ?? "[]", []).join(", "),
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      price:        parseFloat(form.price.toString()),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice.toString()) : null,
      stock:        parseInt(form.stock.toString()),
      images:       JSON.stringify(
        form.images.split("\n").map((s) => s.trim()).filter(Boolean)
      ),
      tags: JSON.stringify(
        form.tags.split(",").map((s) => s.trim()).filter(Boolean)
      ),
    };

    const url    = isEdit ? `/api/products/${product!.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res  = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");
      toast.success(isEdit ? "Produit mis à jour !" : "Produit créé !");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "input-base";
  const labelClass = "text-sm font-medium text-brand-text block mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Back */}
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-text text-sm transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Retour aux produits
      </Link>

      <div className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col gap-5">
        <h2 className="font-display font-bold text-brand-text">Informations générales</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nom <span className="text-brand-gold">*</span></label>
            <input name="name" value={form.name} onChange={handleChange} required className={inputClass} placeholder="ReadyMiix Passion Punch" />
          </div>
          <div>
            <label className={labelClass}>Slug (URL)</label>
            <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} placeholder="passion-punch" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={`${inputClass} resize-none`} placeholder="Décrivez le produit..." />
        </div>

        <div>
          <label className={labelClass}>Catégorie <span className="text-brand-gold">*</span></label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} required className={inputClass}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col gap-5">
        <h2 className="font-display font-bold text-brand-text">Prix & Stock</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Prix (€) <span className="text-brand-gold">*</span></label>
            <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Prix barré (€)</label>
            <input name="comparePrice" type="number" step="0.01" min="0" value={form.comparePrice} onChange={handleChange} className={inputClass} placeholder="Optionnel" />
          </div>
          <div>
            <label className={labelClass}>Stock <span className="text-brand-gold">*</span></label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required className={inputClass} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col gap-5">
        <h2 className="font-display font-bold text-brand-text">Détails produit</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Volume (ex: 33cl)</label>
            <input name="volume" value={form.volume} onChange={handleChange} className={inputClass} placeholder="33cl" />
          </div>
          <div>
            <label className={labelClass}>Alcool (ex: 5%)</label>
            <input name="alcohol" value={form.alcohol} onChange={handleChange} className={inputClass} placeholder="5%" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Tags (séparés par des virgules)</label>
          <input name="tags" value={form.tags} onChange={handleChange} className={inputClass} placeholder="tropical, fruité, bestseller" />
        </div>
        <div>
          <label className={labelClass}>Images (une URL par ligne)</label>
          <textarea name="images" value={form.images} onChange={handleChange} rows={3} className={`${inputClass} resize-none font-mono text-xs`} placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" />
        </div>
      </div>

      <div className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col gap-4">
        <h2 className="font-display font-bold text-brand-text">Visibilité</h2>
        <div className="flex flex-col gap-3">
          {[
            { name: "active",   label: "Produit visible en boutique" },
            { name: "featured", label: "Produit mis en avant (vedette)" },
          ].map((opt) => (
            <label key={opt.name} className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  name={opt.name}
                  checked={form[opt.name as "active" | "featured"]}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div
                  className={`w-10 h-5 rounded-full transition-colors ${
                    form[opt.name as "active" | "featured"]
                      ? "bg-brand-gold"
                      : "bg-brand-border"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      form[opt.name as "active" | "featured"] ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
              <span className="text-sm text-brand-text">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold py-4 rounded-xl shadow-gold hover:shadow-gold transition-all disabled:opacity-60"
      >
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</>
        ) : (
          <><Save className="w-5 h-5" /> {isEdit ? "Mettre à jour" : "Créer le produit"}</>
        )}
      </button>
    </form>
  );
}
