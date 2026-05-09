"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Edit2, Calendar, MapPin, Clock, ChevronDown, ChevronUp, Check, X } from "lucide-react";
import toast from "react-hot-toast";

interface Event {
  id: string;
  title: string;
  type: string;
  description: string | null;
  image: string;
  date: string;
  timeRange: string | null;
  location: string;
  price: number | null;
  maxTickets: number | null;
  active: boolean;
  featured: boolean;
}

const EVENT_TYPES = ["ÉVÉNEMENT", "SOIRÉE", "CONCERT", "FESTIVAL", "BRUNCH", "POOL PARTY"];

const BLANK: Omit<Event, "id"> = {
  title: "", type: "ÉVÉNEMENT", description: null,
  image: "", date: "", timeRange: "22H00 - 04H00",
  location: "", price: null, maxTickets: null,
  active: true, featured: false,
};

function formatDateLocal(iso: string) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

async function optimizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const maxW = 1200;
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = src;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminEventsPage() {
  const [events, setEvents]     = useState<Event[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Event | null>(null);
  const [form, setForm]         = useState<Omit<Event, "id">>(BLANK);
  const [saving, setSaving]     = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/events")
      .then((r) => r.json())
      .then(setEvents)
      .catch(() => toast.error("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  function openNew() {
    setEditing(null);
    setForm(BLANK);
    setShowForm(true);
  }

  function openEdit(ev: Event) {
    setEditing(ev);
    setForm({
      title: ev.title, type: ev.type, description: ev.description,
      image: ev.image, date: formatDateLocal(ev.date), timeRange: ev.timeRange,
      location: ev.location, price: ev.price, maxTickets: ev.maxTickets,
      active: ev.active, featured: ev.featured,
    });
    setShowForm(true);
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const b64 = await optimizeImage(file);
      setForm((f) => ({ ...f, image: b64 }));
    } catch {
      toast.error("Erreur lors du traitement de l'image");
    }
  }

  async function handleSave() {
    if (!form.title || !form.date || !form.location) {
      toast.error("Titre, date et lieu sont requis");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, date: new Date(form.date).toISOString() };
      if (editing) {
        const res = await fetch(`/api/admin/events/${editing.id}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setEvents((prev) => prev.map((e) => e.id === editing.id ? updated : e));
        toast.success("Événement mis à jour");
      } else {
        const res = await fetch("/api/admin/events", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setEvents((prev) => [...prev, created]);
        toast.success("Événement créé !");
      }
      setShowForm(false);
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cet événement ?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast.success("Événement supprimé");
  }

  async function toggleActive(ev: Event) {
    const res = await fetch(`/api/admin/events/${ev.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !ev.active }),
    });
    const updated = await res.json();
    setEvents((prev) => prev.map((e) => e.id === ev.id ? updated : e));
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-text uppercase tracking-wide">Événements</h1>
          <p className="text-xs text-brand-muted mt-0.5">{events.length} événement{events.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-brand-gold text-white font-bold px-4 py-2.5 rounded-xl shadow-gold-sm hover:opacity-90 transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Nouvel événement
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="mb-6 rounded-2xl bg-brand-card border border-brand-border p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-brand-text text-sm uppercase tracking-wider">
              {editing ? "Modifier l'événement" : "Nouvel événement"}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-brand-muted hover:text-brand-text transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Title */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">Titre *</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="SUMMER VIBES CAYENNE"
                className="px-3 py-2.5 rounded-xl bg-brand-darker border border-brand-border text-brand-text text-sm focus:border-brand-gold/60 outline-none"
              />
            </div>

            {/* Type */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="px-3 py-2.5 rounded-xl bg-brand-darker border border-brand-border text-brand-text text-sm focus:border-brand-gold/60 outline-none"
              >
                {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="px-3 py-2.5 rounded-xl bg-brand-darker border border-brand-border text-brand-text text-sm focus:border-brand-gold/60 outline-none"
              />
            </div>

            {/* Time range */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">Horaires</label>
              <input
                value={form.timeRange ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, timeRange: e.target.value || null }))}
                placeholder="22H00 - 04H00"
                className="px-3 py-2.5 rounded-xl bg-brand-darker border border-brand-border text-brand-text text-sm focus:border-brand-gold/60 outline-none"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">Lieu *</label>
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Cayenne"
                className="px-3 py-2.5 rounded-xl bg-brand-darker border border-brand-border text-brand-text text-sm focus:border-brand-gold/60 outline-none"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">Prix (€)</label>
              <input
                type="number"
                value={form.price ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value ? Number(e.target.value) : null }))}
                placeholder="15"
                min="0"
                step="0.5"
                className="px-3 py-2.5 rounded-xl bg-brand-darker border border-brand-border text-brand-text text-sm focus:border-brand-gold/60 outline-none"
              />
            </div>

            {/* Max tickets */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">Places max (vide = illimité)</label>
              <input
                type="number"
                value={form.maxTickets ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, maxTickets: e.target.value ? Number(e.target.value) : null }))}
                placeholder="100"
                min="1"
                className="px-3 py-2.5 rounded-xl bg-brand-darker border border-brand-border text-brand-text text-sm focus:border-brand-gold/60 outline-none"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 flex flex-col gap-1">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">Description</label>
              <textarea
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value || null }))}
                rows={2}
                className="px-3 py-2.5 rounded-xl bg-brand-darker border border-brand-border text-brand-text text-sm focus:border-brand-gold/60 outline-none resize-none"
              />
            </div>

            {/* Image upload */}
            <div className="sm:col-span-2 flex flex-col gap-2">
              <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">Image bannière</label>
              <div className="flex items-start gap-3">
                {form.image && (
                  <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-brand-darker border border-brand-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-brand-border text-brand-muted hover:border-brand-gold/50 hover:text-brand-text transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  {form.image ? "Changer l'image" : "Ajouter une image"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setForm((f) => ({ ...f, active: !f.active }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.active ? "bg-emerald-600" : "bg-brand-border"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.active ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs text-brand-muted font-semibold">Actif</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setForm((f) => ({ ...f, featured: !f.featured }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${form.featured ? "bg-brand-gold" : "bg-brand-border"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-xs text-brand-muted font-semibold">Mis en avant</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2 border-t border-brand-border">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-brand-gold text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-60"
            >
              <Check className="w-4 h-4" />
              {saving ? "Sauvegarde…" : "Enregistrer"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-xl border border-brand-border text-brand-muted hover:text-brand-text text-sm transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Event list */}
      {loading ? (
        <div className="text-brand-muted text-sm py-12 text-center">Chargement…</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-brand-muted">
          <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun événement. Crée le premier !</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((ev) => {
            const dateStr = new Date(ev.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
            return (
              <div
                key={ev.id}
                className={`flex gap-4 p-4 rounded-2xl bg-brand-card border transition-all ${ev.active ? "border-brand-border" : "border-brand-border/50 opacity-60"}`}
              >
                {/* Image */}
                <div className="w-20 h-14 rounded-xl overflow-hidden shrink-0 bg-brand-darker border border-brand-border">
                  {ev.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-muted/30 text-xl">📅</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-brand-gold uppercase tracking-widest">{ev.type}</span>
                      <p className="font-display font-bold text-brand-text text-sm uppercase tracking-wide leading-tight">{ev.title}</p>
                    </div>
                    {ev.featured && (
                      <span className="shrink-0 text-[10px] font-bold text-brand-gold bg-brand-gold/10 border border-brand-gold/20 px-2 py-0.5 rounded-full">⭐ Vedette</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[11px] text-brand-muted">
                      <Calendar className="w-3 h-3" /> {dateStr}
                    </span>
                    {ev.timeRange && (
                      <span className="flex items-center gap-1 text-[11px] text-brand-muted">
                        <Clock className="w-3 h-3" /> {ev.timeRange}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-brand-muted">
                      <MapPin className="w-3 h-3" /> {ev.location}
                    </span>
                    {ev.price != null && (
                      <span className="text-[11px] font-bold text-brand-gold">À partir de {ev.price}€</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(ev)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      ev.active ? "bg-emerald-700 text-white hover:bg-emerald-600" : "bg-brand-border/50 text-brand-muted hover:bg-brand-border"
                    }`}
                    title={ev.active ? "Masquer" : "Afficher"}
                  >
                    {ev.active ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => openEdit(ev)}
                    className="w-8 h-8 rounded-lg bg-brand-darker border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-gold/30 flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="w-8 h-8 rounded-lg bg-brand-darker border border-brand-border text-brand-muted hover:text-brand-error hover:border-brand-error/30 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
