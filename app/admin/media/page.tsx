"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { Plus, Trash2, X, Check, Upload, ImageIcon } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  slot: string | null;
  src: string;
  createdAt: string;
}

const SLOT_OPTIONS = [
  { value: "",                  label: "(aucun) — image libre" },
  { value: "light_card_image",  label: "🟦 Carte Cocktail Light" },
  { value: "hard_card_image",   label: "🟥 Carte Cocktail Hard" },
];

async function getCroppedImg(imageSrc: string, pixelCrop: Area, maxW = 800): Promise<string> {
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
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, canvas.width, canvas.height
  );
  return canvas.toDataURL("image/jpeg", 0.75);
}

export default function AdminMediaPage() {
  const [media, setMedia]               = useState<MediaItem[]>([]);
  const [loading, setLoading]           = useState(true);
  const [showUpload, setShowUpload]     = useState(false);

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
    const url = URL.createObjectURL(file);
    setRawSrc(url);
    if (!name) setName(file.name.replace(/\.[^.]+$/, ""));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  async function saveImage() {
    if (!rawSrc || !croppedArea || !name.trim()) return;
    setSaving(true);
    try {
      const base64 = await getCroppedImg(rawSrc, croppedArea);
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), slot: slot || null, src: base64 }),
      });
      if (res.ok) {
        await load();
        resetUpload();
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
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

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-brand-text">Médiathèque</h1>
          <p className="text-brand-muted text-sm mt-1">
            {media.length} image{media.length !== 1 ? "s" : ""} · Upload, recadre et assigne tes visuels
          </p>
        </div>
        {!showUpload && (
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" /> Ajouter une image
          </button>
        )}
      </div>

      {/* Upload + Crop panel */}
      {showUpload && (
        <div className="bg-brand-card border border-brand-gold/30 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg text-brand-text">Nouvelle image</h2>
            <button onClick={resetUpload} className="p-1.5 rounded-lg hover:bg-white/5 text-brand-muted hover:text-brand-text">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Nom *</label>
              <input
                className="input-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex: Kit Light Passion"
              />
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Assigner à un slot (optionnel)</label>
              <select
                className="input-base"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
              >
                {SLOT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dropzone */}
          {!rawSrc && (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-12 cursor-pointer transition-colors ${
                dragging
                  ? "border-brand-gold bg-brand-gold/5"
                  : "border-brand-border hover:border-brand-gold/40 hover:bg-white/2"
              }`}
            >
              <Upload className="w-8 h-8 text-brand-muted" />
              <div className="text-center">
                <p className="text-sm font-semibold text-brand-text">Glisse une image ici</p>
                <p className="text-xs text-brand-muted mt-1">ou clique pour sélectionner</p>
              </div>
              <p className="text-xs text-brand-muted">JPG, PNG, WebP — max 10 Mo</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
            </div>
          )}

          {/* Cropper */}
          {rawSrc && (
            <div className="flex flex-col gap-4">
              <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ height: 320 }}>
                <Cropper
                  image={rawSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_: Area, px: Area) => setCroppedArea(px)}
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-brand-muted w-16 shrink-0">Zoom</label>
                <input
                  type="range" min={1} max={3} step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 accent-brand-gold"
                />
                <button
                  onClick={() => { setRawSrc(null); setCrop({ x: 0, y: 0 }); setZoom(1); setCroppedArea(null); }}
                  className="text-xs text-brand-muted hover:text-brand-text px-3 py-1.5 rounded-lg border border-brand-border"
                >
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
                {saving ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enregistrement...</>
                ) : (
                  <><Check className="w-4 h-4" /> Recadrer &amp; Enregistrer</>
                )}
              </button>
              <button onClick={resetUpload} className="text-sm text-brand-muted hover:text-brand-text px-4 py-2.5 rounded-xl border border-brand-border">
                Annuler
              </button>
            </div>
          )}
        </div>
      )}

      {saved && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-brand-success/10 border border-brand-success/30 text-brand-success text-sm font-semibold">
          <Check className="w-4 h-4" /> Image enregistrée avec succès !
        </div>
      )}

      {/* Gallery */}
      {loading ? (
        <div className="text-center py-16 text-brand-muted text-sm">Chargement...</div>
      ) : media.length === 0 ? (
        <div className="text-center py-20">
          <ImageIcon className="w-12 h-12 text-brand-muted mx-auto mb-4" />
          <p className="text-brand-text font-semibold mb-1">Aucune image pour le moment</p>
          <p className="text-brand-muted text-sm">Clique sur &quot;Ajouter une image&quot; pour commencer</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
              {/* Image preview */}
              <div className="relative aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => deleteMedia(item.id)}
                    className="p-2 rounded-lg bg-brand-error/20 border border-brand-error/40 text-brand-error hover:bg-brand-error/30 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-semibold text-brand-text truncate">{item.name}</p>
                {item.slot ? (
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                    {SLOT_OPTIONS.find((o) => o.value === item.slot)?.label ?? item.slot}
                  </span>
                ) : (
                  <span className="text-xs text-brand-muted">Sans slot</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
