"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, Save, ArrowLeft, Upload, X, Check, RefreshCw,
  ChevronRight, Droplets, Coffee, Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { parseJsonField, slugify } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────── */
interface Category { id: string; name: string; slug: string }
interface Product {
  id: string; name: string; slug: string; description: string | null;
  price: number; comparePrice: number | null; images: string;
  categoryId: string; stock: number; featured: boolean; active: boolean;
  volume: string | null; alcohol: string | null; tags: string;
}
type Tab = "details" | "apparence" | "options";

/* ─── Helpers ───────────────────────────────────────────── */
async function compressImage(file: File, maxW = 900, quality = 0.80): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

/* ─── Component ─────────────────────────────────────────── */
export default function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const existingImages = parseJsonField<string[]>(product?.images ?? "[]", []);

  const [tab, setTab]     = useState<Tab>("details");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:         product?.name         ?? "",
    slug:         product?.slug         ?? "",
    description:  product?.description  ?? "",
    price:        product?.price        ?? 0,
    comparePrice: (product?.comparePrice ?? "") as number | "",
    categoryId:   product?.categoryId   ?? (categories[0]?.id ?? ""),
    stock:        product?.stock        ?? 0,
    featured:     product?.featured     ?? false,
    active:       product?.active       ?? true,
    volume:       product?.volume       ?? "",
    alcohol:      product?.alcohol      ?? "",
    tags:         parseJsonField<string[]>(product?.tags ?? "[]", []).join(", "),
  });

  /* ── Image state ── */
  const [imageSrc, setImageSrc]           = useState<string | null>(existingImages[0] ?? null);
  const [imageDragging, setImageDragging] = useState(false);
  const [imageMeta, setImageMeta]         = useState<{ w: number; h: number; size: number } | null>(null);
  const [imageStatus, setImageStatus]     = useState<"idle" | "saving" | "saved">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function buildPayload(overrideImages?: string) {
    return {
      ...form,
      price:        parseFloat(String(form.price)),
      comparePrice: form.comparePrice !== "" ? parseFloat(String(form.comparePrice)) : null,
      stock:        parseInt(String(form.stock)),
      images:       overrideImages ?? JSON.stringify(imageSrc ? [imageSrc] : []),
      tags:         JSON.stringify(form.tags.split(",").map((s) => s.trim()).filter(Boolean)),
    };
  }

  /* ── Main form save ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const url    = isEdit ? `/api/products/${product!.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";
    try {
      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(buildPayload()) });
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

  /* ── Image auto-save ── */
  async function saveImageNow(base64: string) {
    if (!isEdit) return;
    setImageStatus("saving");
    try {
      const res = await fetch(`/api/products/${product!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(JSON.stringify(base64 ? [base64] : []))),
      });
      if (!res.ok) throw new Error();
      setImageStatus("saved");
      setTimeout(() => setImageStatus("idle"), 3000);
    } catch {
      toast.error("Erreur lors de la sauvegarde de l'image");
      setImageStatus("idle");
    }
  }

  async function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const base64 = await compressImage(file);
    const dims = await new Promise<{ w: number; h: number }>((res) => {
      const i = new Image();
      i.onload = () => res({ w: i.width, h: i.height });
      i.src = base64;
    });
    setImageSrc(base64);
    setImageMeta({ w: dims.w, h: dims.h, size: file.size });
    await saveImageNow(base64);
  }

  async function removeImage() {
    setImageSrc(null);
    setImageMeta(null);
    if (isEdit) await saveImageNow("");
  }

  /* ─── UI ──────────────────────────────────────────────── */
  const TABS = [
    { id: "details"   as const, label: "Détails" },
    ...(isEdit ? [
      { id: "apparence" as const, label: "Apparence" },
      { id: "options"   as const, label: "Options" },
    ] : []),
  ];

  const inp = "input-base";
  const lbl = "text-xs font-semibold text-brand-muted uppercase tracking-wide block mb-1.5";

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-text text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Retour aux produits
      </Link>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-brand-card border border-brand-border rounded-2xl p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.id
                ? "bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white shadow-sm"
                : "text-brand-muted hover:text-brand-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* ────────────────── DÉTAILS ────────────────── */}
        {tab === "details" && (
          <>
            <div className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col gap-5">
              <h2 className="font-display font-bold text-brand-text">Informations</h2>

              <div>
                <label className={lbl}>Nom *</label>
                <input
                  className={inp}
                  value={form.name}
                  onChange={(e) => {
                    set("name", e.target.value);
                    if (!isEdit) set("slug", slugify(e.target.value));
                  }}
                  required
                  placeholder="ReadyMiix Passion Punch"
                />
              </div>

              <div>
                <label className={lbl}>Type / Catégorie *</label>
                <select className={inp} value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} required>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Prix (€) *</label>
                  <input type="number" step="0.01" min="0" required className={inp} value={form.price} onChange={(e) => set("price", parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <label className={lbl}>Prix barré (€)</label>
                  <input type="number" step="0.01" min="0" className={inp} value={form.comparePrice} onChange={(e) => set("comparePrice", e.target.value === "" ? "" : parseFloat(e.target.value))} placeholder="—" />
                </div>
                <div>
                  <label className={lbl}>Stock *</label>
                  <input type="number" min="0" required className={inp} value={form.stock} onChange={(e) => set("stock", parseInt(e.target.value) || 0)} />
                </div>
              </div>

              <div>
                <label className={lbl}>Description</label>
                <textarea rows={4} className={`${inp} resize-none`} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Décrivez le produit..." />
              </div>

              <div className="flex flex-col gap-3 pt-1">
                {(["active", "featured"] as const).map((key) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer select-none">
                    <div onClick={() => set(key, !form[key])} className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${form[key] ? "bg-brand-gold" : "bg-brand-border"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form[key] ? "translate-x-6" : "translate-x-1"}`} />
                    </div>
                    <span className="text-sm font-medium text-brand-text">
                      {key === "active" ? "Visible en boutique" : "Produit en vedette"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold py-4 rounded-xl shadow-gold hover:opacity-90 transition-all disabled:opacity-60">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</> : <><Save className="w-5 h-5" /> {isEdit ? "Sauvegarder" : "Créer le produit"}</>}
            </button>
          </>
        )}

        {/* ────────────────── APPARENCE ────────────────── */}
        {tab === "apparence" && isEdit && (
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-brand-text">Image principale</h2>
              {imageStatus === "saving" && (
                <span className="flex items-center gap-1.5 text-xs text-brand-muted">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Enregistrement...
                </span>
              )}
              {imageStatus === "saved" && (
                <span className="flex items-center gap-1.5 text-xs text-brand-success font-semibold">
                  <Check className="w-3.5 h-3.5" /> Image enregistrée ✓
                </span>
              )}
            </div>

            {imageSrc ? (
              <div className="flex flex-col gap-3">
                <div className="relative rounded-xl overflow-hidden bg-brand-darker" style={{ aspectRatio: "4/3", maxWidth: 360 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-brand-error/80 transition-colors" title="Supprimer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {imageMeta && (
                  <div className="flex gap-4 text-xs text-brand-muted">
                    <span>{imageMeta.w} × {imageMeta.h} px</span>
                    <span>{formatBytes(imageMeta.size)}</span>
                  </div>
                )}
                <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:text-brand-gold-light transition-colors w-fit">
                  <RefreshCw className="w-4 h-4" /> Remplacer
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setImageDragging(true); }}
                onDragLeave={() => setImageDragging(false)}
                onDrop={(e) => { e.preventDefault(); setImageDragging(false); const f = e.dataTransfer.files[0]; if (f) handleImageFile(f); }}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-16 cursor-pointer transition-colors ${
                  imageDragging ? "border-brand-gold bg-brand-gold/5" : "border-brand-border hover:border-brand-gold/40 hover:bg-white/2"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-brand-text">Glisse une image ici</p>
                  <p className="text-xs text-brand-muted mt-1">ou clique pour sélectionner</p>
                </div>
                <p className="text-[11px] text-brand-muted">JPG, PNG, WebP</p>
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageFile(f); e.target.value = ""; }} />

            <p className="text-[11px] text-brand-muted border-t border-brand-border pt-4">
              Sauvegarde automatique — l&apos;image est enregistrée dès l&apos;upload.
            </p>
          </div>
        )}

        {/* ────────────────── OPTIONS ────────────────── */}
        {tab === "options" && isEdit && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col gap-4">
              <h2 className="font-display font-bold text-brand-text">Détails cocktail</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Volume (ex: Cup 50cl)</label>
                  <input className={inp} value={form.volume} onChange={(e) => set("volume", e.target.value)} placeholder="Cup 50cl" />
                </div>
                <div>
                  <label className={lbl}>Alcool / Doses</label>
                  <input className={inp} value={form.alcohol} onChange={(e) => set("alcohol", e.target.value)} placeholder="1 dose Hennessy" />
                </div>
              </div>
              <div>
                <label className={lbl}>Tags (séparés par virgule)</label>
                <input className={inp} value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="bestseller, hard, hennessy" />
              </div>
              <div>
                <label className={lbl}>Slug (URL)</label>
                <input className={inp} value={form.slug} onChange={(e) => set("slug", e.target.value)} />
              </div>
            </div>

            <div className="rounded-2xl bg-brand-card border border-brand-border p-5">
              <h2 className="font-display font-bold text-brand-text mb-1">Configurateur cocktail</h2>
              <p className="text-xs text-brand-muted mb-4">Ces options s&apos;appliquent à tous les cocktails.</p>
              <div className="flex flex-col gap-2">
                {[
                  { href: "/admin/sirops",   icon: Droplets, label: "Gérer les sirops" },
                  { href: "/admin/softs",    icon: Coffee,   label: "Gérer les softs & suppléments" },
                  { href: "/admin/settings", icon: Settings, label: "Texte Bonbons & surprises" },
                ].map((lk) => (
                  <Link key={lk.href} href={lk.href} className="flex items-center justify-between px-4 py-3 rounded-xl border border-brand-border hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all group">
                    <div className="flex items-center gap-3 text-sm font-medium text-brand-muted group-hover:text-brand-text">
                      <lk.icon className="w-4 h-4 group-hover:text-brand-gold" />
                      {lk.label}
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-muted/50 group-hover:text-brand-gold" />
                  </Link>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold py-4 rounded-xl shadow-gold hover:opacity-90 transition-all disabled:opacity-60">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</> : <><Save className="w-5 h-5" /> Sauvegarder</>}
            </button>
          </div>
        )}

      </form>
    </div>
  );
}
