"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Pencil, Trash2, Check, X, Upload } from "lucide-react";
import { slugify } from "@/lib/utils";

interface Soft {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  image: string | null;
  surcharge: number;
  active: boolean;
  sortOrder: number;
}

const EMPTY: Omit<Soft, "id"> = {
  name: "", slug: "", emoji: "🥤", image: null, surcharge: 1.5, active: true, sortOrder: 0,
};

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_SIZE_BYTES = 3 * 1024 * 1024;

async function optimizeBadge(file: File): Promise<string> {
  if (file.type === "image/svg+xml") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target!.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (ev) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const max = 240;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", 0.88));
      };
      img.src = ev.target!.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function AdminSoftsPage() {
  const [softs, setSofts]     = useState<Soft[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState({ ...EMPTY });
  const [editId, setEditId]   = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [imgError, setImgError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/softs");
    if (r.ok) setSofts(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditId(null);
    setForm({ ...EMPTY, sortOrder: softs.length + 1 });
    setImgError(null);
    setShowForm(true);
  }

  function openEdit(s: Soft) {
    setEditId(s.id);
    setForm({
      name: s.name,
      slug: s.slug,
      emoji: s.emoji,
      image: s.image ?? null,
      surcharge: s.surcharge,
      active: s.active,
      sortOrder: s.sortOrder,
    });
    setImgError(null);
    setShowForm(true);
  }

  function cancelForm() { setShowForm(false); setEditId(null); setImgError(null); }

  async function onImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgError(null);
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setImgError("Format non supporté (PNG, JPG, WebP, SVG)");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setImgError("Fichier trop lourd (max 3 Mo)");
      return;
    }
    try {
      const dataUrl = await optimizeBadge(file);
      setForm((f) => ({ ...f, image: dataUrl }));
    } catch {
      setImgError("Impossible de lire l'image");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function clearImage() {
    setForm((f) => ({ ...f, image: null }));
  }

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.name) };
    const url    = editId ? `/api/admin/softs/${editId}` : "/api/admin/softs";
    const method = editId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    await load();
    cancelForm();
    setSaving(false);
  }

  async function toggle(s: Soft) {
    await fetch(`/api/admin/softs/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...s, active: !s.active }),
    });
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce soft ?")) return;
    await fetch(`/api/admin/softs/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-brand-text">Softs</h1>
          <p className="text-brand-muted text-sm mt-1">{softs.length} soft(s) configuré(s)</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white text-sm font-bold px-4 py-2.5 rounded-xl"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5 mb-6">
          <h2 className="font-display text-lg text-brand-text mb-4">
            {editId ? "Modifier le soft" : "Nouveau soft"}
          </h2>

          {/* Image / Emoji picker */}
          <div className="mb-5">
            <label className="text-xs text-brand-muted uppercase tracking-wide block mb-2">
              Visuel (image ou emoji)
            </label>
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-2xl border border-brand-border bg-brand-darker flex items-center justify-center overflow-hidden shrink-0"
              >
                {form.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.image} alt="Soft" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">{form.emoji || "🥤"}</span>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept={ACCEPTED_TYPES.join(",")}
                  onChange={onImagePick}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-brand-text bg-white/5 hover:bg-white/10 border border-brand-border px-4 py-2 rounded-xl transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {form.image ? "Changer l'image" : "Uploader une image"}
                </button>
                {form.image && (
                  <button
                    type="button"
                    onClick={clearImage}
                    className="flex items-center justify-center gap-2 text-xs text-brand-muted hover:text-brand-error transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Retirer l&apos;image
                  </button>
                )}
                {!form.image && (
                  <p className="text-[11px] text-brand-muted">
                    PNG, JPG, WebP ou SVG · max 3 Mo. Sans image, l&apos;emoji s&apos;affichera.
                  </p>
                )}
                {imgError && <p className="text-xs text-brand-error">{imgError}</p>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Nom *</label>
              <input
                className="input-base"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                placeholder="ex: Sprite"
              />
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Emoji (fallback)</label>
              <input
                className="input-base text-2xl"
                value={form.emoji}
                onChange={(e) => setForm((f) => ({ ...f, emoji: e.target.value }))}
                placeholder="🥤"
                maxLength={4}
              />
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Supplément prix (€)</label>
              <input
                type="number"
                step="0.10"
                min="0"
                className="input-base"
                value={form.surcharge}
                onChange={(e) => setForm((f) => ({ ...f, surcharge: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Ordre d&apos;affichage</label>
              <input
                type="number"
                className="input-base"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                  className={`w-12 h-6 rounded-full transition-colors ${form.active ? "bg-brand-gold" : "bg-brand-border"} relative`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.active ? "translate-x-7" : "translate-x-1"}`} />
                </div>
                <span className="text-sm text-brand-text">{form.active ? "Actif" : "Inactif"}</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={save}
              disabled={saving || !form.name.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white text-sm font-bold px-5 py-2.5 rounded-xl disabled:opacity-50"
            >
              <Check className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button onClick={cancelForm} className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text px-4 py-2.5 rounded-xl border border-brand-border">
              <X className="w-4 h-4" /> Annuler
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-brand-muted text-sm">Chargement...</div>
        ) : softs.length === 0 ? (
          <div className="text-center py-12 px-6">
            <div className="text-4xl mb-3">🥤</div>
            <p className="text-brand-text font-semibold mb-1">Aucun soft trouvé</p>
            <p className="text-brand-muted text-sm mb-5">
              La base de données n&apos;est pas encore initialisée.
            </p>
            <button
              onClick={async () => {
                await fetch("/api/setup");
                await load();
              }}
              className="bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white text-sm font-bold px-6 py-3 rounded-xl"
            >
              ✦ Initialiser les softs par défaut
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3">Soft</th>
                <th className="text-left px-5 py-3">Supplément</th>
                <th className="text-center px-5 py-3">Statut</th>
                <th className="text-center px-5 py-3">Ordre</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {softs.map((s) => (
                <tr key={s.id} className="border-b border-brand-border/50 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-brand-darker border border-brand-border flex items-center justify-center overflow-hidden shrink-0">
                        {s.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg">{s.emoji}</span>
                        )}
                      </div>
                      <span className="font-medium text-brand-text">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-brand-gold font-semibold">
                      {s.surcharge > 0 ? `+${s.surcharge.toFixed(2).replace(".", ",")}€` : "Inclus"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => toggle(s)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${s.active ? "bg-brand-success/15 text-brand-success" : "bg-brand-border text-brand-muted"}`}
                    >
                      {s.active ? "Actif" : "Inactif"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-center text-brand-muted">{s.sortOrder}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-white/5 text-brand-muted hover:text-brand-text">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => remove(s.id)} className="p-1.5 rounded-lg hover:bg-brand-error/10 text-brand-muted hover:text-brand-error">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
