"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, RefreshCw, X, Upload,
  Eye, EyeOff,
  Package, Palette, SlidersHorizontal,
} from "lucide-react";
import { parseJsonField, slugify } from "@/lib/utils";

interface Category { id: string; name: string; slug: string }
interface Product {
  id: string; name: string; slug: string; description: string | null;
  price: number; comparePrice: number | null; images: string;
  categoryId: string; category: Category;
  stock: number; featured: boolean; active: boolean;
  volume: string | null; alcohol: string | null; tags: string;
  productType: string; hasSoftChoice: boolean; softQty: number;
}

const TABS = [
  { key: "details",   label: "Détails",    Icon: Package },
  { key: "apparence", label: "Apparence",  Icon: Palette },
  { key: "options",   label: "Options",    Icon: SlidersHorizontal },
] as const;
type Tab = typeof TABS[number]["key"];

const MAX_BYTES  = 5 * 1024 * 1024;
const ACCEPTED   = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

async function optimizeImage(file: File, maxW = 1200, quality = 0.82): Promise<string> {
  if (file.type === "image/svg+xml") {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }
  const url = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i); i.onerror = rej; i.src = url;
  });
  URL.revokeObjectURL(url);
  const scale  = Math.min(1, maxW / img.naturalWidth);
  const canvas = document.createElement("canvas");
  canvas.width  = Math.round(img.naturalWidth  * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

export default function ArticleEditForm({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const router = useRouter();

  /* ---------- tabs ---------- */
  const [tab, setTab] = useState<Tab>("details");

  /* ---------- form state ---------- */
  const [name,         setName]         = useState(product.name);
  const [price,        setPrice]        = useState(product.price.toString());
  const [categoryId,   setCategoryId]   = useState(product.category.id);
  const [stock,        setStock]        = useState(product.stock.toString());
  const [subtitle,     setSubtitle]     = useState(product.volume ?? "");
  const [description,  setDescription]  = useState(product.description ?? "");
  const [comparePrice, setComparePrice] = useState(product.comparePrice?.toString() ?? "");
  const [active,       setActive]       = useState(product.active);
  const [featured,     setFeatured]     = useState(product.featured);
  const [productType,  setProductType]  = useState(product.productType ?? "simple");
  const [hasSoftChoice, setHasSoftChoice] = useState(product.hasSoftChoice ?? false);
  const [softQty,       setSoftQty]       = useState(product.softQty ?? 1);

  /* ---------- image ---------- */
  const existingImages = parseJsonField<string[]>(product.images, []);
  const [imageSrc,  setImageSrc]  = useState<string | null>(existingImages[0] ?? null);
  const [imgPending, setImgPending] = useState(false);
  const [imgError,   setImgError]   = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setImgError(null);
    if (!ACCEPTED.includes(file.type)) {
      setImgError("Format non supporté (PNG, JPG, WebP, SVG)");
      return;
    }
    if (file.size > MAX_BYTES) {
      setImgError("Fichier trop lourd (max 5 Mo)");
      return;
    }
    setImgPending(true);
    const dataUrl = await optimizeImage(file);
    setImageSrc(dataUrl);
    setImgPending(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  /* ---------- save ---------- */
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleSave() {
    if (!name.trim() || !price || !categoryId) return;
    setIsSaving(true); setSaveError(null);
    const images = imageSrc ? JSON.stringify([imageSrc]) : product.images;
    const res = await fetch(`/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name:         name.trim(),
        slug:         slugify(name.trim()),
        description:  description.trim() || null,
        price:        parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        images,
        categoryId,
        stock:        parseInt(stock) || 0,
        featured,
        active,
        volume:  subtitle.trim() || null,
        alcohol: product.alcohol,
        tags:    product.tags,
        productType,
        hasSoftChoice,
        softQty: hasSoftChoice ? softQty : 1,
      }),
    });
    if (res.ok) {
      router.push("/admin/articles");
      router.refresh();
    } else {
      setSaveError("Erreur lors de l'enregistrement.");
    }
    setIsSaving(false);
  }

  /* ---------- render ---------- */
  return (
    <div className="max-w-3xl flex flex-col gap-6">

      {/* ── Breadcrumb + header ── */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-brand-muted mb-2">
            <Link href="/admin" className="hover:text-brand-text transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/admin/articles" className="hover:text-brand-text transition-colors">Articles</Link>
            <span>/</span>
            <span className="text-brand-text truncate max-w-[160px]">{product.name}</span>
          </nav>
          <h1 className="font-display text-2xl font-bold text-brand-text">
            Modifier l&apos;article
          </h1>
          <p className="text-brand-muted text-sm mt-0.5">
            Modifier les informations de l&apos;article
          </p>
        </div>
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-brand-border text-brand-muted text-sm hover:text-brand-text hover:border-brand-gold/30 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-brand-border -mb-2">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
              tab === key
                ? "border-brand-gold text-brand-gold"
                : "border-transparent text-brand-muted hover:text-brand-text"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ════════════════════════
          TAB: Détails
      ════════════════════════ */}
      {tab === "details" && (
        <div className="flex flex-col gap-5">
          {/* Identification */}
          <section className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-border">
              <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-brand-gold" />
              </div>
              <div>
                <p className="font-semibold text-brand-text text-sm">Identification</p>
                <p className="text-xs text-brand-muted">Nom, référence et catégorie</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Titre */}
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                  Titre <span className="text-brand-error">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nom de l'article"
                  className="bg-brand-darker border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 outline-none focus:border-brand-gold/50 transition-colors"
                />
              </div>

              {/* SKU (read-only) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                  SKU (auto-généré)
                </label>
                <input
                  type="text"
                  value={product.slug}
                  readOnly
                  className="bg-brand-darker/50 border border-brand-border/50 rounded-xl px-3.5 py-2.5 text-sm text-brand-muted/60 cursor-not-allowed"
                />
              </div>

              {/* Prix */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                  Prix (€) <span className="text-brand-error">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="bg-brand-darker border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 outline-none focus:border-brand-gold/50 transition-colors"
                />
              </div>

              {/* Catégorie */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                  Catégorie <span className="text-brand-error">*</span>
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="bg-brand-darker border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-text outline-none focus:border-brand-gold/50 transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Stock */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                  Stock
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  min="0"
                  step="1"
                  placeholder="0"
                  className="bg-brand-darker border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 outline-none focus:border-brand-gold/50 transition-colors"
                />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ════════════════════════
          TAB: Apparence
      ════════════════════════ */}
      {tab === "apparence" && (
        <div className="flex flex-col gap-5">
          <section className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col gap-5">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-border">
              <div className="w-8 h-8 rounded-lg bg-brand-purple-light/10 flex items-center justify-center shrink-0">
                <Palette className="w-4 h-4 text-brand-purple-light" />
              </div>
              <div>
                <p className="font-semibold text-brand-text text-sm">Affichage</p>
                <p className="text-xs text-brand-muted">Titre affiché, descriptions et photo</p>
              </div>
            </div>

            {/* Sous-titre affiché */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                Titre affiché <span className="text-brand-muted/50 font-normal">(facultatif)</span>
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Sous-titre optionnel affiché dans la liste"
                className="bg-brand-darker border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 outline-none focus:border-brand-gold/50 transition-colors"
              />
              <p className="text-[11px] text-brand-muted/60">
                Affiché sous le titre dans la liste des articles
              </p>
            </div>

            {/* Descriptions */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Description de l'article (affichée sur la fiche produit)"
                className="bg-brand-darker border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 outline-none focus:border-brand-gold/50 transition-colors resize-none"
              />
              <p className="text-[11px] text-brand-muted/60">
                Affichée dans le détail de l&apos;article
              </p>
            </div>

            {/* Photo */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                Photo
              </label>

              {imageSrc ? (
                /* Preview with remove button */
                <div className="relative w-fit">
                  <div className="w-40 h-40 rounded-2xl overflow-hidden border border-brand-border bg-brand-darker">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt="Photo article"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => setImageSrc(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-brand-error text-white shadow-lg hover:bg-brand-error/80 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="mt-2 text-xs text-brand-muted hover:text-brand-gold transition-colors underline underline-offset-2"
                  >
                    Changer la photo
                  </button>
                </div>
              ) : (
                /* Dropzone */
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-brand-border rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer hover:border-brand-gold/40 hover:bg-brand-gold/3 transition-all"
                >
                  {imgPending ? (
                    <RefreshCw className="w-8 h-8 text-brand-gold animate-spin" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-brand-border/50 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-brand-muted" />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-sm font-semibold text-brand-text">
                      {imgPending ? "Optimisation…" : "Cliquer ou glisser-déposer"}
                    </p>
                    <p className="text-xs text-brand-muted mt-0.5">
                      PNG, JPG, WebP, SVG · Max 5 Mo
                    </p>
                    <p className="text-[11px] text-brand-muted/60 mt-0.5">
                      Ratio recommandé : 1:1 (carré)
                    </p>
                  </div>
                </div>
              )}

              {imgError && (
                <p className="text-xs text-brand-error flex items-center gap-1">
                  <X className="w-3.5 h-3.5" /> {imgError}
                </p>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          </section>
        </div>
      )}

      {/* ════════════════════════
          TAB: Options
      ════════════════════════ */}
      {tab === "options" && (
        <div className="flex flex-col gap-5">
          <section className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col gap-5">
            <div className="flex items-center gap-3 pb-3 border-b border-brand-border">
              <div className="w-8 h-8 rounded-lg bg-brand-teal/10 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="w-4 h-4 text-brand-teal" />
              </div>
              <div>
                <p className="font-semibold text-brand-text text-sm">Options</p>
                <p className="text-xs text-brand-muted">Visibilité, mise en avant, prix comparé</p>
              </div>
            </div>

            {/* Statut */}
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="font-semibold text-brand-text text-sm">Statut</p>
                <p className="text-xs text-brand-muted mt-0.5">
                  {active ? "Article visible dans la boutique" : "Article masqué dans la boutique"}
                </p>
              </div>
              <button
                onClick={() => setActive((v) => !v)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  active
                    ? "bg-emerald-700 text-white"
                    : "bg-brand-border text-brand-muted hover:bg-brand-border/80"
                }`}
              >
                {active
                  ? <><Eye className="w-4 h-4" /> Actif</>
                  : <><EyeOff className="w-4 h-4" /> Masqué</>
                }
              </button>
            </div>

            {/* Mis en avant */}
            <div className="flex items-center justify-between py-1 border-t border-brand-border/50">
              <div>
                <p className="font-semibold text-brand-text text-sm">Mis en avant</p>
                <p className="text-xs text-brand-muted mt-0.5">
                  Apparaît en premier dans la boutique
                </p>
              </div>
              <button
                onClick={() => setFeatured((v) => !v)}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  featured ? "bg-brand-gold" : "bg-brand-border"
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                  featured ? "left-5" : "left-0.5"
                }`} />
              </button>
            </div>

            {/* Prix comparé */}
            <div className="flex flex-col gap-1.5 border-t border-brand-border/50 pt-4">
              <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                Prix barré / Prix comparé (€)
              </label>
              <input
                type="number"
                value={comparePrice}
                onChange={(e) => setComparePrice(e.target.value)}
                min="0"
                step="0.01"
                placeholder="Laisser vide si aucune promotion"
                className="bg-brand-darker border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-text placeholder:text-brand-muted/50 outline-none focus:border-brand-gold/50 transition-colors"
              />
              <p className="text-[11px] text-brand-muted/60">
                Affiché barré à côté du prix actuel
              </p>
            </div>

            {/* Type de produit */}
            <div className="flex flex-col gap-1.5 border-t border-brand-border/50 pt-4">
              <label className="text-xs font-semibold text-brand-muted uppercase tracking-wide">
                Type de produit
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="bg-brand-darker border border-brand-border rounded-xl px-3.5 py-2.5 text-sm text-brand-text outline-none focus:border-brand-gold/50 transition-colors"
              >
                <option value="simple">Simple</option>
                <option value="soft">Avec soft</option>
                <option value="pack">Pack</option>
                <option value="with_options">Avec options</option>
              </select>
              <p className="text-[11px] text-brand-muted/60">
                Catégorisation interne du produit
              </p>
            </div>

            {/* Choix du soft */}
            <div className="flex items-center justify-between py-1 border-t border-brand-border/50">
              <div>
                <p className="font-semibold text-brand-text text-sm">Choix du soft</p>
                <p className="text-xs text-brand-muted mt-0.5">
                  Affiche le sélecteur de soft sur la fiche produit
                </p>
              </div>
              <button
                onClick={() => setHasSoftChoice((v) => !v)}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  hasSoftChoice ? "bg-brand-teal" : "bg-brand-border"
                }`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                  hasSoftChoice ? "left-5" : "left-0.5"
                }`} />
              </button>
            </div>

            {/* Nombre de softs (visible seulement si hasSoftChoice) */}
            {hasSoftChoice && (
              <div className="flex items-center justify-between py-2 pl-3 border-l-2 border-brand-teal/40 ml-1">
                <div>
                  <p className="font-semibold text-brand-text text-sm">Nombre de softs</p>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Ex: 2 pour un pack duo
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoftQty((v) => Math.max(1, v - 1))}
                    className="w-8 h-8 rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/40 flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-bold text-brand-text">{softQty}</span>
                  <button
                    onClick={() => setSoftQty((v) => Math.min(6, v + 1))}
                    className="w-8 h-8 rounded-xl bg-brand-card border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/40 flex items-center justify-center text-lg font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {/* ── Save bar ── */}
      {saveError && (
        <p className="text-sm text-brand-error bg-brand-error/10 border border-brand-error/20 rounded-xl px-4 py-3">
          {saveError}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-brand-border">
        <Link
          href="/admin/articles"
          className="text-sm text-brand-muted hover:text-brand-text transition-colors"
        >
          Annuler
        </Link>
        <button
          onClick={handleSave}
          disabled={isSaving || !name.trim() || !price}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-6 py-2.5 rounded-xl text-sm shadow-gold-sm hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {isSaving
            ? <RefreshCw className="w-4 h-4 animate-spin" />
            : <Save className="w-4 h-4" />
          }
          Enregistrer
        </button>
      </div>
    </div>
  );
}
