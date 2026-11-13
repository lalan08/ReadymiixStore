"use client";

import { useState, useEffect } from "react";
import { Save, Check, Loader2, IceCream2, Power, Tag, Settings2 } from "lucide-react";
import toast from "react-hot-toast";

interface Config {
  ordering_open: boolean;
  disabled_flavors: string[];
  supplement_bonbons_enabled: boolean;
  supplement_bonbons_price: number;
  supplement_sirop_enabled: boolean;
  supplement_sirop_price: number;
  price_classique_500ml: number;
  price_classique_700ml: number;
  price_classique_1litre: number;
  price_fruitee_500ml: number;
  price_fruitee_700ml: number;
  price_fruitee_1litre: number;
}

const FLAVORS = [
  { id: "citron-vert",   name: "Caïpi Classique",  emoji: "🍋", category: "classique" },
  { id: "fraise",        name: "Fraise",            emoji: "🍓", category: "fruitee" },
  { id: "peche",         name: "Pêche",             emoji: "🍑", category: "fruitee" },
  { id: "mangue",        name: "Mangue",            emoji: "🥭", category: "fruitee" },
  { id: "maracudja",     name: "Maracudja",         emoji: "🍊", category: "fruitee" },
  { id: "ananas",        name: "Ananas",            emoji: "🍍", category: "fruitee" },
  { id: "fruits-rouges", name: "Fruits Rouges",     emoji: "🫐", category: "fruitee" },
  { id: "coco",          name: "Coco",              emoji: "🥥", category: "fruitee" },
  { id: "kiwi",          name: "Kiwi",              emoji: "🥝", category: "fruitee" },
  { id: "framboise",     name: "Framboise",         emoji: "🍇", category: "fruitee" },
  { id: "cerise",        name: "Cerise",            emoji: "🍒", category: "fruitee" },
  { id: "myrtille",      name: "Myrtille",          emoji: "🫐", category: "fruitee" },
  { id: "pomme-verte",   name: "Pomme Verte",       emoji: "🍏", category: "fruitee" },
  { id: "litchi",        name: "Litchi",            emoji: "🍈", category: "fruitee" },
  { id: "banane",        name: "Banane",            emoji: "🍌", category: "fruitee" },
  { id: "poire",         name: "Poire",             emoji: "🍐", category: "fruitee" },
];

export default function AdminCaipiPage() {
  const [config, setConfig]   = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch("/api/admin/caipi-config")
      .then(r => r.json())
      .then(data => { setConfig(data); setLoading(false); });
  }, []);

  function set<K extends keyof Config>(key: K, value: Config[K]) {
    setConfig(c => c ? { ...c, [key]: value } : c);
  }

  function toggleFlavor(id: string) {
    if (!config) return;
    const list = config.disabled_flavors;
    set("disabled_flavors", list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  }

  async function save() {
    if (!config) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/caipi-config", {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Erreur");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      toast.success("Configuration sauvegardée !");
    } catch {
      toast.error("Impossible de sauvegarder");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-brand-muted text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
      </div>
    );
  }

  return (
    <div className="max-w-2xl flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-text flex items-center gap-2">
            <IceCream2 className="w-7 h-7 text-brand-gold" /> Frozen Caïpis
          </h1>
          <p className="text-brand-muted text-sm mt-0.5">
            Menu, parfums, suppléments et tarifs
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold text-sm px-5 py-2.5 rounded-xl disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Sauvegardé !" : saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>

      {/* Prise de commandes */}
      <section className="bg-brand-card border rounded-2xl p-5" style={{ borderColor: config.ordering_open ? "rgba(0,210,200,0.3)" : "rgba(239,68,68,0.3)" }}>
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.ordering_open ? "bg-brand-teal/10" : "bg-red-500/10"}`}>
            <Power className={`w-5 h-5 ${config.ordering_open ? "text-brand-teal" : "text-red-400"}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg text-brand-text font-bold">Prise de commandes</h2>
                <p className="text-brand-muted text-xs mt-0.5">
                  {config.ordering_open
                    ? "Les clients peuvent commander — visible sur le site"
                    : "Commandes fermées — banner « fermé » affiché sur le site"}
                </p>
              </div>
              <button
                onClick={() => set("ordering_open", !config.ordering_open)}
                className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${config.ordering_open ? "bg-brand-teal" : "bg-brand-border"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${config.ordering_open ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Parfums */}
      <section className="bg-brand-card border border-brand-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-brand-gold" />
          <h2 className="font-display text-lg text-brand-text font-bold">Parfums disponibles</h2>
          <span className="text-xs text-brand-muted ml-auto">
            {FLAVORS.length - config.disabled_flavors.length}/{FLAVORS.length} actifs
          </span>
        </div>

        {/* Classique */}
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-2">Classique</p>
        <div className="flex flex-col gap-1.5 mb-4">
          {FLAVORS.filter(f => f.category === "classique").map(f => {
            const on = !config.disabled_flavors.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => toggleFlavor(f.id)}
                className="flex items-center justify-between gap-3 p-3 rounded-xl transition-colors hover:bg-white/5 w-full text-left"
                style={{ opacity: on ? 1 : 0.45 }}
              >
                <span className="text-sm text-brand-text flex items-center gap-2">
                  {f.emoji} {f.name}
                </span>
                <div className={`relative w-10 h-5 rounded-full transition-colors ${on ? "bg-brand-gold" : "bg-brand-border"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Fruité */}
        <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-2">Fruité</p>
        <div className="grid grid-cols-2 gap-1.5">
          {FLAVORS.filter(f => f.category === "fruitee").map(f => {
            const on = !config.disabled_flavors.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => toggleFlavor(f.id)}
                className="flex items-center justify-between gap-2 p-3 rounded-xl transition-colors hover:bg-white/5 w-full text-left"
                style={{ opacity: on ? 1 : 0.45 }}
              >
                <span className="text-sm text-brand-text truncate flex items-center gap-1.5">
                  {f.emoji} {f.name}
                </span>
                <div className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${on ? "bg-brand-gold" : "bg-brand-border"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Suppléments */}
      <section className="bg-brand-card border border-brand-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-4 h-4 text-brand-gold" />
          <h2 className="font-display text-lg text-brand-text font-bold">Suppléments (toppings)</h2>
        </div>
        <div className="flex flex-col gap-4">
          {/* Bonbons */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-brand-darker">
            <button
              onClick={() => set("supplement_bonbons_enabled", !config.supplement_bonbons_enabled)}
              className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${config.supplement_bonbons_enabled ? "bg-brand-gold" : "bg-brand-border"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${config.supplement_bonbons_enabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
            <span className="text-sm text-brand-text flex-1">🍬 Bonbons</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-muted">+</span>
              <input
                type="number" min="0" step="0.5"
                value={config.supplement_bonbons_price}
                onChange={e => set("supplement_bonbons_price", parseFloat(e.target.value) || 0)}
                className="w-16 text-sm text-center bg-brand-card border border-brand-border rounded-lg px-2 py-1 text-brand-text focus:outline-none focus:border-brand-gold/50"
              />
              <span className="text-xs text-brand-muted">€</span>
            </div>
          </div>
          {/* Sirop */}
          <div className="flex items-center gap-4 p-3 rounded-xl bg-brand-darker">
            <button
              onClick={() => set("supplement_sirop_enabled", !config.supplement_sirop_enabled)}
              className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${config.supplement_sirop_enabled ? "bg-brand-gold" : "bg-brand-border"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${config.supplement_sirop_enabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
            <span className="text-sm text-brand-text flex-1">💧 Sirop fruité</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-muted">+</span>
              <input
                type="number" min="0" step="0.5"
                value={config.supplement_sirop_price}
                onChange={e => set("supplement_sirop_price", parseFloat(e.target.value) || 0)}
                className="w-16 text-sm text-center bg-brand-card border border-brand-border rounded-lg px-2 py-1 text-brand-text focus:outline-none focus:border-brand-gold/50"
              />
              <span className="text-xs text-brand-muted">€</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="bg-brand-card border border-brand-border rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-4 h-4 text-brand-gold" />
          <h2 className="font-display text-lg text-brand-text font-bold">Tarifs</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {/* Classique */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-3">🍋 Classique</p>
            {(["500ml", "700ml", "1litre"] as const).map(size => (
              <div key={size} className="flex items-center justify-between gap-2 mb-2">
                <label className="text-xs text-brand-muted w-14">{size}</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number" min="0" step="1"
                    value={config[`price_classique_${size}` as keyof Config] as number}
                    onChange={e => set(`price_classique_${size}` as keyof Config, parseFloat(e.target.value) || 0 as never)}
                    className="w-16 text-sm text-center bg-brand-darker border border-brand-border rounded-lg px-2 py-1 text-brand-text focus:outline-none focus:border-brand-gold/50"
                  />
                  <span className="text-xs text-brand-muted">€</span>
                </div>
              </div>
            ))}
          </div>
          {/* Fruité */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-muted mb-3">🍓 Fruité</p>
            {(["500ml", "700ml", "1litre"] as const).map(size => (
              <div key={size} className="flex items-center justify-between gap-2 mb-2">
                <label className="text-xs text-brand-muted w-14">{size}</label>
                <div className="flex items-center gap-1">
                  <input
                    type="number" min="0" step="1"
                    value={config[`price_fruitee_${size}` as keyof Config] as number}
                    onChange={e => set(`price_fruitee_${size}` as keyof Config, parseFloat(e.target.value) || 0 as never)}
                    className="w-16 text-sm text-center bg-brand-darker border border-brand-border rounded-lg px-2 py-1 text-brand-text focus:outline-none focus:border-brand-gold/50"
                  />
                  <span className="text-xs text-brand-muted">€</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Save bottom */}
      <button
        onClick={save}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold text-sm py-3.5 rounded-xl disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
        {saved ? "Sauvegardé !" : saving ? "Enregistrement…" : "Enregistrer la configuration"}
      </button>
    </div>
  );
}
