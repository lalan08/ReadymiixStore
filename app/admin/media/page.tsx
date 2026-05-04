"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Plus, Trash2, X, Check, Upload, ImageIcon, Loader2 } from "lucide-react";

/* ─── Types & constants ──────────────────────────────────── */
interface MediaItem {
  id: string;
  name: string;
  slot: string | null;
  src: string;
  createdAt: string;
}

const SLOT_GROUPS = [
  {
    label: "Page Composer",
    color: "text-[#00D2C8]",
    slots: [
      { value: "light_card_image", label: "🟦 Cocktail Light",   aspect: 4 / 3 },
      { value: "hard_card_image",  label: "🟥 Cocktail Hard",    aspect: 4 / 3 },
    ],
  },
  {
    label: "Page d'accueil",
    color: "text-brand-gold",
    slots: [
      { value: "hero_image",    label: "🏠 Visuel Hero",     aspect: 16 / 9 },
      { value: "banner_image",  label: "📢 Bannière",        aspect: 16 / 5 },
    ],
  },
  {
    label: "Inspirations",
    color: "text-brand-purple-light",
    slots: [
      { value: "inspiration_1", label: "✨ Inspiration 1", aspect: 1 },
      { value: "inspiration_2", label: "✨ Inspiration 2", aspect: 1 },
      { value: "inspiration_3", label: "✨ Inspiration 3", aspect: 1 },
      { value: "inspiration_4", label: "✨ Inspiration 4", aspect: 1 },
    ],
  },
];

const ALL_SLOTS = [
  { value: "",                label: "(aucun) — image libre", aspect: 4 / 3 },
  ...SLOT_GROUPS.flatMap((g) => g.slots),
];

function slotLabel(slot: string | null): string {
  if (!slot) return "";
  return ALL_SLOTS.find((s) => s.value === slot)?.label ?? slot;
}

/* ─── Image helpers ──────────────────────────────────────── */
async function getCroppedImg(imageSrc: string, pixelCrop: Area, maxW = 900): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = imageSrc;
  });
  const scale = Math.min(1, maxW / pixelCrop.width);
  const canvas = document.createElement("canvas");
  canvas.width  = Math.round(pixelCrop.width  * scale);
  canvas.height = Math.round(pixelCrop.height * scale);
  canvas.getContext("2d")!.drawImage(img, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.80);
}

/* ─── Page ───────────────────────────────────────────────── */
export default function AdminMediaPage() {
  const [media, setMedia]           = useState<MediaItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string>("all");

  /* Upload state */
  const [name, setName]         = useState("");
  const [slot, setSlot]         = useState("");
  const [rawSrc, setRawSrc]     = useState<string | null>(null);
  const [crop, setCrop]         = useState({ x: 0, y: 0 });
  const [zoom, setZoom]         = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentAspect = ALL_SLOTS.find((s) => s.value === slot)?.aspect ?? 4 / 3;

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/media");
    if (r.ok) setMedia(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function resetUpload() {
    setShowUpload(false);
    setName("");
    setSlot("");
    setRawSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);
  }

  function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    setRawSrc(URL.createObjectURL(file));
    if (!name) setName(file.name.replace(/\.[^.]+$/, ""));
  }

  async function saveImage() {
    if (!rawSrc || !croppedArea || !name.trim()) return;
    setSaving(true);
    try {
      const base64 = await getCroppedImg(rawSrc, croppedArea, 900);
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slot: slot || null, src: base64 }),
      });
      if (res.ok) {
        await load();
        resetUpload();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  }

  async function deleteMedia(id: string) {
    if (!confirm("Supprimer cette image ?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    await load();
  }

  /* Filtered media */
  const filtered = activeGroup === "all"
    ? media
    : activeGroup === "libre"
    ? media.filter((m) => !m.slot)
    : media.filter((m) => {
        const group = SLOT_GROUPS.find((g) => g.label === activeGroup);
        return group?.slots.some((s) => s.value === m.slot);
      });

  /* ─── Slot quick-view cards ─────────────────────────────── */
  function QuickSlot({ slot: slotVal, label, aspect }: { slot: string; label: string; aspect: number }) {
    const existing = media.find((m) => m.slot === slotVal);
    return (
      <div
        className="group relative rounded-xl overflow-hidden border border-brand-border cursor-pointer hover:border-brand-gold/40 transition-all"
        style={{ aspectRatio: aspect }}
        onClick={() => { setSlot(slotVal); setShowUpload(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      >
        {existing ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={existing.src} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-white text-xs font-bold">Remplacer</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-brand-darker flex flex-col items-center justify-center gap-2 group-hover:bg-brand-gold/5 transition-colors">
            <Upload className="w-5 h-5 text-brand-muted/50 group-hover:text-brand-gold transition-colors" />
            <span className="text-[10px] text-brand-muted/60 group-hover:text-brand-muted text-center px-2">{label}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/60">
          <p className="text-[10px] text-white/80 font-medium truncate">{label}</p>
        </div>
      </div>
    );
  }

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-brand-text">Médias & Visuels</h1>
          <p className="text-brand-muted text-sm mt-1">{media.length} image{media.length !== 1 ? "s" : ""} — Upload, recadre et assigne</p>
        </div>
        {!showUpload && (
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        )}
      </div>

      {/* ── Upload + Crop panel ── */}
      {showUpload && (
        <div className="bg-brand-card border border-brand-gold/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-brand-text">Nouvelle image</h2>
            <button onClick={resetUpload} className="p-1.5 rounded-lg hover:bg-white/5 text-brand-muted hover:text-brand-text">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wide block mb-1.5">Nom *</label>
              <input className="input-base" value={name} onChange={(e) => setName(e.target.value)} placeholder="ex: Kit Light Passion" />
            </div>
            <div>
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wide block mb-1.5">Emplacement (optionnel)</label>
              <select className="input-base" value={slot} onChange={(e) => setSlot(e.target.value)}>
                {ALL_SLOTS.map((o) => <option key={o.value} value={o.value}>{o.label || "(aucun) — image libre"}</option>)}
              </select>
            </div>
          </div>

          {!rawSrc ? (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-14 cursor-pointer transition-colors ${
                dragging ? "border-brand-gold bg-brand-gold/5" : "border-brand-border hover:border-brand-gold/40 hover:bg-white/2"
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
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ height: 320 }}>
                <Cropper
                  image={rawSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={currentAspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_: Area, px: Area) => setCroppedArea(px)}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-brand-muted w-14 shrink-0">Zoom</label>
                <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="flex-1 accent-brand-gold" />
                <button type="button" onClick={() => { setRawSrc(null); setCrop({ x: 0, y: 0 }); setZoom(1); }} className="text-xs text-brand-muted hover:text-brand-text px-3 py-1.5 rounded-lg border border-brand-border">
                  Changer
                </button>
              </div>
            </div>
          )}

          {rawSrc && (
            <div className="flex gap-3 mt-5">
              <button
                onClick={saveImage}
                disabled={saving || !name.trim() || !croppedArea}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white text-sm font-bold px-5 py-2.5 rounded-xl disabled:opacity-50"
              >
                {saving
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement...</>
                  : <><Check className="w-4 h-4" /> Recadrer &amp; Enregistrer</>}
              </button>
              <button onClick={resetUpload} className="text-sm text-brand-muted hover:text-brand-text px-4 py-2.5 rounded-xl border border-brand-border">
                Annuler
              </button>
            </div>
          )}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-success/10 border border-brand-success/30 text-brand-success text-sm font-semibold">
          <Check className="w-4 h-4" /> Image enregistrée avec succès !
        </div>
      )}

      {/* ── Slot quick-view sections ── */}
      {!loading && (
        <div className="flex flex-col gap-6">
          {SLOT_GROUPS.map((group) => (
            <div key={group.label}>
              <h2 className={`font-display font-bold text-lg mb-3 ${group.color}`}>{group.label}</h2>
              <div className={`grid gap-3 ${group.slots.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
                {group.slots.map((s) => (
                  <QuickSlot key={s.value} slot={s.value} label={s.label} aspect={s.aspect} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── All images gallery ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-brand-text">Toutes les images</h2>
          <div className="flex gap-1 bg-brand-card border border-brand-border rounded-xl p-1">
            {[
              { id: "all",   label: "Tout" },
              { id: "libre", label: "Libres" },
              ...SLOT_GROUPS.map((g) => ({ id: g.label, label: g.label })),
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveGroup(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeGroup === f.id ? "bg-brand-gold/20 text-brand-gold" : "text-brand-muted hover:text-brand-text"}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-brand-muted text-sm flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Chargement...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <ImageIcon className="w-10 h-10 text-brand-muted mx-auto mb-3" />
            <p className="text-brand-text font-semibold mb-1">Aucune image</p>
            <p className="text-brand-muted text-sm">Clique sur &quot;Ajouter&quot; pour commencer</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div key={item.id} className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => deleteMedia(item.id)}
                      className="p-2 rounded-lg bg-brand-error/20 border border-brand-error/40 text-brand-error hover:bg-brand-error/30 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-brand-text truncate">{item.name}</p>
                  {item.slot ? (
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 truncate max-w-full">
                      {slotLabel(item.slot)}
                    </span>
                  ) : (
                    <span className="text-xs text-brand-muted">Libre</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
