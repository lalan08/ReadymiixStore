"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Save, Check, Plus, X, Upload, Sparkles } from "lucide-react";

/* ─── Image compression ─────────────────────────────────────── */
async function compressImage(file: File, maxW = 1200): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/* ─── Image upload zone ─────────────────────────────────────── */
function ImageUploadZone({
  value, accent, objectFit = "cover", onChange,
}: { value: string; accent: string; objectFit?: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const compressed = await compressImage(file);
    onChange(compressed);
  }, [onChange]);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className="relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all"
      style={{
        aspectRatio: "4/3",
        borderColor: dragging ? accent : `${accent}40`,
        boxShadow: dragging ? `0 0 20px ${accent}50` : "none",
      }}
    >
      {value ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Aperçu" className="absolute inset-0 w-full h-full" style={{ objectFit: objectFit as React.CSSProperties["objectFit"], objectPosition: "center" }} />
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-white">
              <Upload className="w-6 h-6" />
              <span className="text-xs font-bold">Changer l&apos;image</span>
            </div>
          </div>
        </>
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3"
          style={{ background: `${accent}08` }}
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${accent}20` }}>
            <Upload className="w-5 h-5" style={{ color: accent }} />
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-white">Glisser une image ici</p>
            <p className="text-[10px] text-white/40 mt-0.5">ou cliquer pour choisir</p>
          </div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ─── Editable list ─────────────────────────────────────────── */
function EditableList({
  items, accent, placeholder, onChange, maxItems = 8,
}: {
  items: string[];
  accent: string;
  placeholder: string;
  onChange: (items: string[]) => void;
  maxItems?: number;
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: accent }} />
          <input
            className="flex-1 bg-transparent text-xs text-white border-b border-white/10 focus:border-white/30 outline-none py-1 transition-colors placeholder:text-white/20"
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            placeholder={placeholder}
          />
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="text-white/20 hover:text-red-400 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      {items.length < maxItems && (
        <button
          onClick={() => onChange([...items, ""])}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide transition-opacity hover:opacity-70 mt-1"
          style={{ color: accent }}
        >
          <Plus className="w-3 h-3" />
          Ajouter une ligne
        </button>
      )}
    </div>
  );
}

/* ─── Card section ──────────────────────────────────────────── */
const DEFAULTS = {
  light: {
    accent: "#00D2C8",
    title: "Light",
    base_price: "5",
    highlights: ["Léger & équilibré", "1 dose de Hennessy", "Surprises incluses 🍬"],
    detail: ["🍾 1 bouteille de Hennessy", "💧 Sirop au choix", "🍬 Bonbons & surprises", "🥤 1 gobelet ReadyMiix", "🥤 1 paille"],
  },
  hard: {
    accent: "#F72585",
    title: "Hard",
    base_price: "7",
    highlights: ["Plus intense 🔥", "2 doses de Hennessy", "Surprises incluses 🍬"],
    detail: ["🍾 2 bouteilles de Hennessy", "💧 Sirop au choix", "🍬 Bonbons & surprises", "🥤 1 gobelet ReadyMiix", "🥤 1 paille"],
  },
};

function parseList(raw: string | undefined, fallback: string[]): string[] {
  if (!raw) return fallback;
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : fallback; }
  catch { return fallback; }
}

function CardSection({
  cardKey, cfg, onCfg,
}: {
  cardKey: "light" | "hard";
  cfg: Record<string, string>;
  onCfg: (key: string, val: string) => void;
}) {
  const def = DEFAULTS[cardKey];
  const accent = cfg[`${cardKey}_accent`] || def.accent;
  const title = cfg[`${cardKey}_title`] || def.title;
  const image = cfg[`${cardKey}_card_image`] || "";
  const basePrice = cfg[`${cardKey}_base_price`] || def.base_price;
  const highlights = parseList(cfg[`${cardKey}_highlights`], def.highlights);
  const detail = parseList(cfg[`${cardKey}_detail`], def.detail);

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "#0a0a14",
        border: `2px solid ${accent}`,
        boxShadow: `0 0 40px ${accent}20`,
      }}
    >
      {/* Card header */}
      <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: `1px solid ${accent}30` }}>
        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
        <span className="font-display text-sm text-white uppercase tracking-wider">Cocktail</span>
        <span
          className="text-xl font-bold"
          style={{ color: accent, fontFamily: "'Dancing Script', cursive", textShadow: `0 0 15px ${accent}60` }}
        >
          {title}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-5 flex-1">
        {/* Image upload */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
            Photo du cocktail
          </p>
          <ImageUploadZone
            value={image}
            accent={accent}
            objectFit={cfg[`${cardKey}_card_fit`] || "cover"}
            onChange={(v) => onCfg(`${cardKey}_card_image`, v)}
          />
          {/* Image fit option */}
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] text-white/40 shrink-0">Ajustement</span>
            <select
              className="flex-1 bg-white/5 rounded-lg px-2 py-1.5 text-xs text-white border border-white/10 focus:border-white/30 outline-none transition-colors cursor-pointer"
              value={cfg[`${cardKey}_card_fit`] || "cover"}
              onChange={(e) => onCfg(`${cardKey}_card_fit`, e.target.value)}
            >
              <option value="cover">Remplir le cadre</option>
              <option value="contain">Voir l&apos;image entière</option>
            </select>
          </div>
        </div>

        {/* Title + Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: accent }}>
              Titre affiché
            </p>
            <input
              className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:border-white/30 outline-none transition-colors"
              value={title}
              onChange={(e) => onCfg(`${cardKey}_title`, e.target.value)}
              placeholder={def.title}
            />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: accent }}>
              Prix de base (€)
            </p>
            <input
              type="number"
              step="0.50"
              min="0"
              className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white border border-white/10 focus:border-white/30 outline-none transition-colors"
              value={basePrice}
              onChange={(e) => onCfg(`${cardKey}_base_price`, e.target.value)}
            />
          </div>
        </div>

        {/* Accent color */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: accent }}>
            Couleur accent (neon)
          </p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              className="w-12 h-9 rounded-lg cursor-pointer border border-white/10 bg-transparent p-1"
              value={accent}
              onChange={(e) => onCfg(`${cardKey}_accent`, e.target.value)}
            />
            <input
              className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-xs text-white border border-white/10 focus:border-white/30 outline-none font-mono"
              value={accent}
              onChange={(e) => onCfg(`${cardKey}_accent`, e.target.value)}
            />
          </div>
        </div>

        {/* Points forts */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
            Points forts (ligne d&apos;accroche)
          </p>
          <EditableList
            items={highlights}
            accent={accent}
            placeholder="Ex: Léger & équilibré"
            onChange={(v) => onCfg(`${cardKey}_highlights`, JSON.stringify(v))}
            maxItems={5}
          />
        </div>

        {/* Détail */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: accent }}>
            Détail du contenu
          </p>
          <EditableList
            items={detail}
            accent={accent}
            placeholder="Ex: 🍾 1 bouteille de Hennessy"
            onChange={(v) => onCfg(`${cardKey}_detail`, JSON.stringify(v))}
            maxItems={10}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function AdminComposerPage() {
  const [cfg, setCfg] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((data) => { setCfg(data); setLoading(false); });
  }, []);

  function set(key: string, value: string) {
    setCfg((c) => ({ ...c, [key]: value }));
  }

  async function save() {
    setSaving(true);
    await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cfg),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-brand-muted text-sm animate-pulse">
        Chargement du configurateur...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-brand-text flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-brand-gold" />
            Composer
          </h1>
          <p className="text-brand-muted text-sm mt-1">
            Personnalise les cartes cocktail — images, couleurs, textes, prix
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white text-sm font-bold px-5 py-2.5 rounded-xl disabled:opacity-50 hover:shadow-gold transition-all active:scale-[0.98]"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Enregistré !" : saving ? "Enregistrement..." : "Enregistrer tout"}
        </button>
      </div>

      {/* Cartes cocktail */}
      <p className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-4">
        Cartes cocktail
      </p>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <CardSection cardKey="light" cfg={cfg} onCfg={set} />
        <CardSection cardKey="hard" cfg={cfg} onCfg={set} />
      </div>

      {/* Bonbons */}
      <p className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-4">
        Options globales
      </p>
      <div className="bg-brand-card border border-brand-border rounded-2xl p-5 mb-4">
        <h2 className="font-display text-lg text-brand-text mb-1">🍬 Bonbons & Surprises</h2>
        <p className="text-brand-muted text-xs mb-4">
          Texte et étiquettes affichés dans le configurateur à l&apos;étape Bonbons.
        </p>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Texte descriptif</label>
            <textarea
              rows={3}
              className="input-base resize-none"
              value={cfg.bonbons_text ?? ""}
              onChange={(e) => set("bonbons_text", e.target.value)}
              placeholder="Description des bonbons inclus dans chaque cocktail..."
            />
          </div>
          <div>
            <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">
              Étiquettes de bonbons (séparées par des virgules)
            </label>
            <input
              className="input-base"
              value={
                (() => {
                  try { return JSON.parse(cfg.bonbons_items ?? "[]").join(", "); }
                  catch { return cfg.bonbons_items ?? ""; }
                })()
              }
              onChange={(e) => {
                const tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean);
                set("bonbons_items", JSON.stringify(tags));
              }}
              placeholder="Haribo 🐻, Jitty Shocks ⚡, Popping Candy 🎆"
            />
            <p className="text-xs text-brand-muted mt-1">
              Aperçu :{" "}
              {(() => {
                try { return JSON.parse(cfg.bonbons_items ?? "[]").slice(0, 4).join(" · "); }
                catch { return ""; }
              })()}
            </p>
          </div>
        </div>
      </div>

      {/* Softs */}
      <div className="bg-brand-card border border-brand-border rounded-2xl p-5">
        <h2 className="font-display text-lg text-brand-text mb-1">🥤 Supplément Softs</h2>
        <p className="text-brand-muted text-xs mb-4">
          Prix ajouté automatiquement quand le client choisit un soft dans le configurateur.
        </p>
        <div className="flex items-center gap-3">
          <label className="text-sm text-brand-text w-40">Supplément (€)</label>
          <input
            type="number"
            step="0.10"
            min="0"
            className="input-base w-32"
            value={cfg.soft_supplement ?? "1.50"}
            onChange={(e) => set("soft_supplement", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
