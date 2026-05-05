"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Trash2, X, Check, Upload, ImageIcon, Loader2, AlertCircle, RefreshCw } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
interface MediaItem { id: string; name: string; slot: string | null; src: string; createdAt: string }
interface OptResult { dataUrl: string; w: number; h: number; outputBytes: number; isSvg: boolean }

/* ─── Slot config ────────────────────────────────────────── */
const SLOT_GROUPS = [
  {
    label: "Page Composer",
    color: "text-[#00D2C8]",
    slots: [
      { value: "light_card_image", label: "🟦 Cocktail Light" },
      { value: "hard_card_image",  label: "🟥 Cocktail Hard"  },
    ],
  },
  {
    label: "Page d'accueil",
    color: "text-brand-gold",
    slots: [
      { value: "hero_image",   label: "🏠 Visuel Hero" },
      { value: "banner_image", label: "📢 Bannière"    },
    ],
  },
  {
    label: "Inspirations",
    color: "text-brand-purple-light",
    slots: [
      { value: "inspiration_1", label: "✨ Inspiration 1" },
      { value: "inspiration_2", label: "✨ Inspiration 2" },
      { value: "inspiration_3", label: "✨ Inspiration 3" },
      { value: "inspiration_4", label: "✨ Inspiration 4" },
    ],
  },
];

const ALL_SLOTS = [
  { value: "", label: "(aucun) — image libre" },
  ...SLOT_GROUPS.flatMap((g) => g.slots),
];

const MAX_BYTES    = 5 * 1024 * 1024;
const ACCEPT_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];

/* ─── Helpers ────────────────────────────────────────────── */
function fmt(b: number) {
  if (b < 1024) return `${b} o`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} Ko`;
  return `${(b / 1024 / 1024).toFixed(1)} Mo`;
}

function slotLabel(slot: string | null) {
  return ALL_SLOTS.find((s) => s.value === slot)?.label ?? slot ?? "";
}

async function optimizeImage(file: File, maxW = 1200, quality = 0.82): Promise<OptResult> {
  if (file.type === "image/svg+xml") {
    const dataUrl = await new Promise<string>((res, rej) => {
      const r = new FileReader();
      r.onload = (e) => res(e.target!.result as string);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
    return { dataUrl, w: 0, h: 0, outputBytes: file.size, isSvg: true };
  }
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onerror = rej;
    r.onload = (ev) => {
      const img = new Image();
      img.onerror = rej;
      img.onload = () => {
        const scale   = Math.min(1, maxW / img.width);
        const c       = document.createElement("canvas");
        c.width  = Math.round(img.width  * scale);
        c.height = Math.round(img.height * scale);
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        const dataUrl     = c.toDataURL("image/jpeg", quality);
        const outputBytes = Math.round((dataUrl.length - "data:image/jpeg;base64,".length) * 3 / 4);
        res({ dataUrl, w: c.width, h: c.height, outputBytes, isSvg: false });
      };
      img.src = ev.target!.result as string;
    };
    r.readAsDataURL(file);
  });
}

/* ─── Page ───────────────────────────────────────────────── */
export default function AdminMediaPage() {
  const [media, setMedia]       = useState<MediaItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showPanel, setShowPanel] = useState(false);
  const [filterGroup, setFilterGroup] = useState("all");

  /* Upload panel state */
  const [name, setName]           = useState("");
  const [slot, setSlot]           = useState("");
  const [preview, setPreview]     = useState<OptResult | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/media");
    if (r.ok) setMedia(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── File handling ── */
  async function handleFile(file: File) {
    setFileError(null);
    if (!ACCEPT_TYPES.includes(file.type)) {
      setFileError("Format non accepté. Utilise PNG, JPG, WebP ou SVG.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setFileError(`Fichier trop lourd (${fmt(file.size)}). Maximum 5 Mo.`);
      return;
    }
    if (!name) setName(file.name.replace(/\.[^.]+$/, ""));
    const result = await optimizeImage(file);
    setPreview(result);
  }

  function resetPanel() {
    setShowPanel(false);
    setName("");
    setSlot("");
    setPreview(null);
    setFileError(null);
  }

  async function saveMedia() {
    if (!preview || !name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slot: slot || null, src: preview.dataUrl }),
      });
      if (res.ok) {
        await load();
        resetPanel();
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

  /* ── Filtered gallery ── */
  const filtered = filterGroup === "all"    ? media
    : filterGroup === "libre"               ? media.filter((m) => !m.slot)
    : media.filter((m) => {
        const g = SLOT_GROUPS.find((g) => g.label === filterGroup);
        return g?.slots.some((s) => s.value === m.slot);
      });

  /* ── Quick-slot card (click to open panel for that slot) ── */
  function QuickSlot({ slotVal, label }: { slotVal: string; label: string }) {
    const img = media.find((m) => m.slot === slotVal);
    return (
      <div
        className="group relative rounded-xl overflow-hidden border border-brand-border cursor-pointer hover:border-brand-gold/40 transition-all bg-brand-darker"
        style={{ aspectRatio: "4/3" }}
        onClick={() => { setSlot(slotVal); setShowPanel(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
      >
        {img ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.src} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex items-center gap-1.5 text-white text-xs font-bold">
                <RefreshCw className="w-3.5 h-3.5" /> Remplacer
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 group-hover:bg-brand-gold/5 transition-colors">
            <Upload className="w-5 h-5 text-brand-muted/50 group-hover:text-brand-gold transition-colors" />
            <span className="text-[10px] text-brand-muted/60 group-hover:text-brand-muted text-center px-2">{label}</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-[11px] text-white/90 font-medium truncate">{label}</p>
        </div>
      </div>
    );
  }

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-brand-text">Médias & Visuels</h1>
          <p className="text-brand-muted text-sm mt-0.5">
            {media.length} image{media.length !== 1 ? "s" : ""} · PNG, JPG, WebP, SVG · Max 5 Mo
          </p>
        </div>
        {!showPanel && (
          <button
            onClick={() => setShowPanel(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        )}
      </div>

      {/* ── Upload panel ── */}
      {showPanel && (
        <div className="bg-brand-card border border-brand-gold/30 rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-brand-text">Nouvelle image</h2>
            <button onClick={resetPanel} className="p-1.5 rounded-lg hover:bg-white/5 text-brand-muted hover:text-brand-text transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Name + Slot */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wide block mb-1.5">Nom *</label>
              <input className="input-base" value={name} onChange={(e) => setName(e.target.value)} placeholder="ex: Kit Light Passion" />
            </div>
            <div>
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wide block mb-1.5">Emplacement</label>
              <select className="input-base" value={slot} onChange={(e) => setSlot(e.target.value)}>
                {ALL_SLOTS.map((o) => <option key={o.value} value={o.value}>{o.label || "(aucun) — image libre"}</option>)}
              </select>
            </div>
          </div>

          {/* Error */}
          {fileError && (
            <div className="flex items-center gap-2 text-sm text-brand-error bg-brand-error/10 border border-brand-error/30 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {fileError}
            </div>
          )}

          {/* Dropzone or Preview */}
          {!preview ? (
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
              <p className="text-[11px] text-brand-muted">PNG · JPG · WebP · SVG · Max 5 Mo</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Preview image */}
              <div className="relative rounded-xl overflow-hidden bg-brand-darker" style={{ aspectRatio: "16/9", maxWidth: 480 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview.dataUrl} alt="Aperçu" className="w-full h-full object-cover" />
              </div>
              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-brand-muted">
                {preview.w > 0 && <span>{preview.w} × {preview.h} px</span>}
                <span>{fmt(preview.outputBytes)}</span>
                {!preview.isSvg && <span className="text-brand-success font-medium">✓ Optimisée</span>}
                {preview.isSvg  && <span className="text-brand-teal  font-medium">SVG vectoriel</span>}
              </div>
              {/* Change link */}
              <button type="button" onClick={() => { setPreview(null); fileRef.current?.click(); }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:text-brand-gold-light transition-colors w-fit">
                <RefreshCw className="w-3.5 h-3.5" /> Changer l&apos;image
              </button>
            </div>
          )}

          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />

          {/* Save button */}
          {preview && (
            <button
              onClick={saveMedia}
              disabled={saving || !name.trim()}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</>
                : <><Check className="w-5 h-5" /> Enregistrer</>}
            </button>
          )}
        </div>
      )}

      {/* Success toast */}
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
              <h2 className={`font-display font-bold text-base mb-3 ${group.color}`}>{group.label}</h2>
              <div className={`grid gap-3 ${group.slots.length === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
                {group.slots.map((s) => <QuickSlot key={s.value} slotVal={s.value} label={s.label} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Gallery ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-brand-text">Bibliothèque</h2>
          <div className="flex gap-1 bg-brand-card border border-brand-border rounded-xl p-1 overflow-x-auto">
            {[
              { id: "all",   label: "Tout" },
              { id: "libre", label: "Libres" },
              ...SLOT_GROUPS.map((g) => ({ id: g.label, label: g.label.split(" ")[1] ?? g.label })),
            ].map((f) => (
              <button key={f.id} onClick={() => setFilterGroup(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${filterGroup === f.id ? "bg-brand-gold/20 text-brand-gold" : "text-brand-muted hover:text-brand-text"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-brand-muted text-sm">
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
                    <button onClick={() => deleteMedia(item.id)}
                      className="p-2 rounded-xl bg-brand-error/20 border border-brand-error/40 text-brand-error hover:bg-brand-error/40 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-brand-text truncate">{item.name}</p>
                  {item.slot
                    ? <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30 truncate max-w-full">{slotLabel(item.slot)}</span>
                    : <span className="text-xs text-brand-muted">Libre</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
