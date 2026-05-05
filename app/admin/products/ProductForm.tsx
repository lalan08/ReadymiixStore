"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2, Save, ArrowLeft, Upload, X, Check, RefreshCw,
  ChevronRight, Droplets, Coffee, Settings, AlertCircle,
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

/* ─── Constants ─────────────────────────────────────────── */
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const ACCEPTED_EXT   = "PNG, JPG, WebP, SVG";

/* ─── Image optimize ─────────────────────────────────────── */
interface ImgResult { dataUrl: string; w: number; h: number; outputBytes: number; isSvg: boolean }

async function optimizeImage(file: File, maxW = 1200, quality = 0.82): Promise<ImgResult> {
  if (file.type === "image/svg+xml") {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = (e) => resolve(e.target!.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return { dataUrl, w: 0, h: 0, outputBytes: file.size, isSvg: true };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload  = (ev) => {
      const img = new Image();
      img.onerror = reject;
      img.onload  = () => {
        const scale   = Math.min(1, maxW / img.width);
        const canvas  = document.createElement("canvas");
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        const dataUrl     = canvas.toDataURL("image/jpeg", quality);
        const outputBytes = Math.round((dataUrl.length - "data:image/jpeg;base64,".length) * 3 / 4);
        resolve({ dataUrl, w: canvas.width, h: canvas.height, outputBytes, isSvg: false });
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function fmt(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}

/* ─── Component ─────────────────────────────────────────── */
export default function ProductForm({ categories, product }: { categories: Category[]; product?: Product }) {
  const router = useRouter();
  const isEdit = !!product;

  const savedImages = parseJsonField<string[]>(product?.images ?? "[]", []);

  const [tab, setTab]       = useState<Tab>("details");
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
  const [savedSrc, setSavedSrc]       = useState<string | null>(savedImages[0] ?? null);
  const [pendingSrc, setPendingSrc]   = useState<string | null>(null);   // optimized but not saved
  const [pendingMeta, setPendingMeta] = useState<ImgResult | null>(null);
  const [imgError, setImgError]       = useState<string | null>(null);
  const [dragging, setDragging]       = useState(false);
  const [imgSaving, setImgSaving]     = useState(false);
  const [imgSaved, setImgSaved]       = useState(false);
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
      images:       overrideImages ?? JSON.stringify(savedSrc ? [savedSrc] : []),
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

  /* ── File pick ── */
  async function handleFile(file: File) {
    setImgError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImgError(`Format non accepté. Utilise ${ACCEPTED_EXT}.`);
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setImgError(`Fichier trop lourd (${fmt(file.size)}). Maximum 5 Mo.`);
      return;
    }
    const result = await optimizeImage(file);
    setPendingSrc(result.dataUrl);
    setPendingMeta(result);
  }

  /* ── Save image button ── */
  async function saveImage() {
    if (!pendingSrc || !isEdit) return;
    setImgSaving(true);
    try {
      const res = await fetch(`/api/products/${product!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(JSON.stringify([pendingSrc]))),
      });
      if (!res.ok) throw new Error();
      setSavedSrc(pendingSrc);
      setPendingSrc(null);
      setPendingMeta(null);
      setImgSaved(true);
      setTimeout(() => setImgSaved(false), 3000);
    } catch {
      toast.error("Erreur lors de l'enregistrement de l'image");
    } finally {
      setImgSaving(false);
    }
  }

  async function removeImage() {
    setSavedSrc(null);
    setPendingSrc(null);
    setPendingMeta(null);
    if (isEdit) {
      await fetch(`/api/products/${product!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(JSON.stringify([]))),
      });
    }
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

  /* preview to show: pending takes priority over saved */
  const displaySrc = pendingSrc ?? savedSrc;

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

        {/* ────────── DÉTAILS ────────── */}
        {tab === "details" && (
          <>
            <div className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col gap-5">
              <h2 className="font-display font-bold text-brand-text">Informations</h2>

              <div>
                <label className={lbl}>Nom *</label>
                <input className={inp} value={form.name}
                  onChange={(e) => { set("name", e.target.value); if (!isEdit) set("slug", slugify(e.target.value)); }}
                  required placeholder="ReadyMiix Passion Punch" />
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
                  <input type="number" step="0.01" min="0" required className={inp} value={form.price}
                    onChange={(e) => set("price", parseFloat(e.target.value) || 0)} />
                </div>
                <div>
                  <label className={lbl}>Prix barré (€)</label>
                  <input type="number" step="0.01" min="0" className={inp} value={form.comparePrice}
                    onChange={(e) => set("comparePrice", e.target.value === "" ? "" : parseFloat(e.target.value))} placeholder="—" />
                </div>
                <div>
                  <label className={lbl}>Stock *</label>
                  <input type="number" min="0" required className={inp} value={form.stock}
                    onChange={(e) => set("stock", parseInt(e.target.value) || 0)} />
                </div>
              </div>

              <div>
                <label className={lbl}>Description</label>
                <textarea rows={4} className={`${inp} resize-none`} value={form.description}
                  onChange={(e) => set("description", e.target.value)} placeholder="Décrivez le produit..." />
              </div>

              <div className="flex flex-col gap-3 pt-1">
                {(["active", "featured"] as const).map((key) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer select-none">
                    <div onClick={() => set(key, !form[key])}
                      className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${form[key] ? "bg-brand-gold" : "bg-brand-border"}`}>
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form[key] ? "translate-x-6" : "translate-x-1"}`} />
                    </div>
                    <span className="text-sm font-medium text-brand-text">
                      {key === "active" ? "Visible en boutique" : "Produit en vedette"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold py-4 rounded-xl shadow-gold hover:opacity-90 transition-all disabled:opacity-60">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</> : <><Save className="w-5 h-5" /> {isEdit ? "Sauvegarder" : "Créer le produit"}</>}
            </button>
          </>
        )}

        {/* ────────── APPARENCE ────────── */}
        {tab === "apparence" && isEdit && (
          <div className="rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-brand-text">Image du produit</h2>
              {imgSaved && (
                <span className="flex items-center gap-1.5 text-xs text-brand-success font-semibold">
                  <Check className="w-3.5 h-3.5" /> Image enregistrée ✓
                </span>
              )}
            </div>

            {/* Hint */}
            <div className="flex items-center gap-2 text-xs text-brand-muted bg-brand-darker border border-brand-border rounded-xl px-3 py-2">
              <span className="text-brand-gold font-bold">16:9</span>
              <span>Ratio recommandé · PNG, JPG, WebP, SVG · Max 5 Mo · Optimisation automatique</span>
            </div>

            {/* Error */}
            {imgError && (
              <div className="flex items-center gap-2 text-sm text-brand-error bg-brand-error/10 border border-brand-error/30 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {imgError}
              </div>
            )}

            {/* Dropzone (always visible when no display src) */}
            {!displaySrc && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-16 cursor-pointer transition-colors ${
                  dragging ? "border-brand-gold bg-brand-gold/5" : "border-brand-border hover:border-brand-gold/40 hover:bg-white/2"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-brand-text">Glisse une image ici</p>
                  <p className="text-xs text-brand-muted mt-0.5">ou clique pour sélectionner</p>
                </div>
              </div>
            )}

            {/* Preview */}
            {displaySrc && (
              <div className="flex flex-col gap-4">
                <div className="relative rounded-xl overflow-hidden bg-brand-darker" style={{ aspectRatio: "16/9", maxWidth: 480 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={displaySrc} alt="Aperçu" className="w-full h-full object-cover" />
                  {/* Pending badge */}
                  {pendingSrc && (
                    <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-brand-warning/90 text-brand-darker text-[10px] font-bold">
                      Non enregistré
                    </div>
                  )}
                  <button type="button" onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-brand-error/80 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Meta */}
                {pendingMeta && (
                  <div className="flex items-center gap-4 text-xs text-brand-muted">
                    {pendingMeta.w > 0 && <span>{pendingMeta.w} × {pendingMeta.h} px</span>}
                    <span>{fmt(pendingMeta.outputBytes)}</span>
                    {!pendingMeta.isSvg && <span className="text-brand-success">✓ Optimisée</span>}
                    {pendingMeta.isSvg && <span className="text-brand-teal">SVG vectoriel</span>}
                  </div>
                )}

                {/* Replace link */}
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:text-brand-gold-light transition-colors w-fit">
                  <RefreshCw className="w-3.5 h-3.5" /> Changer l&apos;image
                </button>
              </div>
            )}

            {/* Hidden file input */}
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />

            {/* Save button — only shown when there's a pending image */}
            {pendingSrc && (
              <button
                type="button"
                onClick={saveImage}
                disabled={imgSaving}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold py-3.5 rounded-xl shadow-gold hover:opacity-90 transition-all disabled:opacity-60"
              >
                {imgSaving
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</>
                  : <><Check className="w-5 h-5" /> Enregistrer</>}
              </button>
            )}
          </div>
        )}

        {/* ────────── OPTIONS ────────── */}
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
                  <Link key={lk.href} href={lk.href}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border border-brand-border hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all group">
                    <div className="flex items-center gap-3 text-sm font-medium text-brand-muted group-hover:text-brand-text">
                      <lk.icon className="w-4 h-4 group-hover:text-brand-gold" />
                      {lk.label}
                    </div>
                    <ChevronRight className="w-4 h-4 text-brand-muted/50 group-hover:text-brand-gold" />
                  </Link>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold py-4 rounded-xl shadow-gold hover:opacity-90 transition-all disabled:opacity-60">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</> : <><Save className="w-5 h-5" /> Sauvegarder</>}
            </button>
          </div>
        )}

      </form>
    </div>
  );
}
