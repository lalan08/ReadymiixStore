"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Check, X, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { slugify } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  active: boolean;
  _count?: { products: number };
}

const EMPTY = {
  name: "",
  slug: "",
  description: "",
  image: "",
  sortOrder: 0,
  active: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ ...EMPTY });
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch("/api/admin/categories");
    if (r.ok) setCategories(await r.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditId(null);
    setForm({ ...EMPTY, sortOrder: categories.length + 1 });
    setShowForm(true);
  }

  function openEdit(c: Category) {
    setEditId(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? "",
      image: c.image ?? "",
      sortOrder: c.sortOrder,
      active: c.active,
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditId(null);
  }

  async function save() {
    if (!form.name.trim()) return;
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.name) };
    const url = editId ? `/api/admin/categories/${editId}` : "/api/admin/categories";
    const method = editId ? "PUT" : "POST";
    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (r.ok) {
      toast.success(editId ? "Catégorie mise à jour" : "Catégorie créée");
      await load();
      cancelForm();
    } else {
      const data = await r.json().catch(() => ({}));
      toast.error(data.error || "Erreur lors de l'enregistrement");
    }
    setSaving(false);
  }

  async function toggle(c: Category) {
    await fetch(`/api/admin/categories/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...c, active: !c.active }),
    });
    await load();
  }

  async function remove(c: Category) {
    if (!confirm(`Supprimer la catégorie "${c.name}" ?`)) return;
    let r = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });

    if (r.status === 400) {
      const data = await r.json().catch(() => ({}));
      const n = data.productCount ?? c._count?.products ?? 0;
      if (n > 0) {
        if (
          !confirm(
            `⚠️ "${c.name}" contient ${n} produit(s).\n\nSupprimer DÉFINITIVEMENT la catégorie ET ses ${n} produit(s) ? Cette action est irréversible.`,
          )
        )
          return;
        r = await fetch(`/api/admin/categories/${c.id}?withProducts=true`, { method: "DELETE" });
      }
    }

    if (r.ok) {
      toast.success("Catégorie supprimée");
      await load();
    } else {
      const data = await r.json().catch(() => ({}));
      toast.error(data.error || "Erreur lors de la suppression");
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-brand-text">Catégories</h1>
          <p className="text-brand-muted text-sm mt-1">
            {categories.length} catégorie{categories.length > 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white text-sm font-bold px-4 py-2.5 rounded-xl"
        >
          <Plus className="w-4 h-4" /> Nouvelle catégorie
        </button>
      </div>

      {showForm && (
        <div className="bg-brand-card border border-brand-border rounded-2xl p-5 mb-6">
          <h2 className="font-display text-lg text-brand-text mb-4">
            {editId ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Nom *</label>
              <input
                className="input-base"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value, slug: editId ? f.slug : slugify(e.target.value) }))
                }
                placeholder="ex: Cocktails"
              />
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Slug</label>
              <input
                className="input-base"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="auto-généré"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Description</label>
              <textarea
                className="input-base min-h-[80px]"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Description courte de la catégorie..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Image (URL)</label>
              <input
                className="input-base"
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                placeholder="https://..."
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
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.active ? "translate-x-7" : "translate-x-1"}`}
                  />
                </div>
                <span className="text-sm text-brand-text">{form.active ? "Active" : "Inactive"}</span>
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
            <button
              onClick={cancelForm}
              className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text px-4 py-2.5 rounded-xl border border-brand-border"
            >
              <X className="w-4 h-4" /> Annuler
            </button>
          </div>
        </div>
      )}

      <div className="bg-brand-card border border-brand-border rounded-2xl overflow-hidden">
        {loading ? (
          <div className="text-center py-10 text-brand-muted text-sm">Chargement...</div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Tag className="w-12 h-12 text-brand-muted" />
            <p className="text-brand-muted text-sm">Aucune catégorie</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-border text-brand-muted text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3">Nom</th>
                <th className="text-left px-5 py-3 hidden md:table-cell">Slug</th>
                <th className="text-center px-5 py-3">Produits</th>
                <th className="text-center px-5 py-3">Statut</th>
                <th className="text-center px-5 py-3 hidden md:table-cell">Ordre</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-brand-border/50 hover:bg-white/2 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-brand-text">{c.name}</p>
                    {c.description && (
                      <p className="text-xs text-brand-muted line-clamp-1 mt-0.5">{c.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-xs font-mono text-brand-muted bg-brand-border px-2 py-0.5 rounded">
                      /{c.slug}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-brand-gold font-bold">{c._count?.products ?? 0}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => toggle(c)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${c.active ? "bg-brand-success/15 text-brand-success" : "bg-brand-border text-brand-muted"}`}
                    >
                      {c.active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-center text-brand-muted hidden md:table-cell">
                    {c.sortOrder}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-brand-muted hover:text-brand-text"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => remove(c)}
                        className="p-1.5 rounded-lg hover:bg-brand-error/10 text-brand-muted hover:text-brand-error"
                      >
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
