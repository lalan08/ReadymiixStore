"use client";

import { useState, useEffect } from "react";
import { Save, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [config, setConfig]   = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((data) => { setConfig(data); setLoading(false); });
  }, []);

  function set(key: string, value: string) {
    setConfig((c) => ({ ...c, [key]: value }));
  }

  async function save() {
    setSaving(true);
    await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-brand-muted text-sm">
        Chargement des paramètres...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-brand-text">Paramètres</h1>
          <p className="text-brand-muted text-sm mt-1">Configuration générale du site</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white text-sm font-bold px-5 py-2.5 rounded-xl disabled:opacity-50"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Enregistré !" : saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── Section Composer activé/désactivé ── */}
        <section className="bg-brand-card border border-brand-gold/30 rounded-2xl p-5">
          <h2 className="font-display text-lg text-brand-text mb-1">🎯 Module Composer</h2>
          <p className="text-brand-muted text-xs mb-4">
            Active ou met en pause toute la partie <strong className="text-brand-text">Composer / Mixer</strong>.
            Désactivé, le lien disparaît du menu et de la barre mobile, les boutons de l&apos;accueil n&apos;y renvoient plus,
            et la page <code className="text-brand-gold">/composer</code> redirige vers la Boutique.
          </p>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => set("composer_enabled", config.composer_enabled === "false" ? "true" : "false")}
              className={`w-12 h-6 rounded-full transition-colors relative ${config.composer_enabled !== "false" ? "bg-brand-gold" : "bg-brand-border"}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${config.composer_enabled !== "false" ? "translate-x-7" : "translate-x-1"}`} />
            </div>
            <span className="text-sm text-brand-text font-semibold">
              {config.composer_enabled !== "false" ? "Composer activé" : "Composer désactivé"}
            </span>
          </label>
          <p className="text-[11px] text-brand-muted mt-2">
            ⏱️ Le changement peut prendre jusqu&apos;à 1 minute pour s&apos;afficher côté site (cache).
          </p>
        </section>

        {/* ── Section Visuels → renvoi vers Médias ── */}
        <section className="bg-brand-card border border-brand-gold/30 rounded-2xl p-5">
          <h2 className="font-display text-lg text-brand-text mb-1">📸 Visuels — Page Composer</h2>
          <p className="text-brand-muted text-xs mb-4">
            Gère les photos des cartes <strong className="text-brand-text">Cocktail Light</strong> et <strong className="text-brand-text">Cocktail Hard</strong> depuis la Médiathèque.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            {config.light_card_image && (
              <div className="flex items-center gap-3 flex-1 bg-brand-darker rounded-xl border border-brand-border p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={config.light_card_image} alt="Light" className="w-16 h-12 object-cover rounded-lg shrink-0" />
                <div>
                  <p className="text-xs font-bold text-brand-text">🟦 Cocktail Light</p>
                  <p className="text-[10px] text-brand-success mt-0.5">Image définie ✓</p>
                </div>
              </div>
            )}
            {config.hard_card_image && (
              <div className="flex items-center gap-3 flex-1 bg-brand-darker rounded-xl border border-brand-border p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={config.hard_card_image} alt="Hard" className="w-16 h-12 object-cover rounded-lg shrink-0" />
                <div>
                  <p className="text-xs font-bold text-brand-text">🟥 Cocktail Hard</p>
                  <p className="text-[10px] text-brand-success mt-0.5">Image définie ✓</p>
                </div>
              </div>
            )}
            {!config.light_card_image && !config.hard_card_image && (
              <p className="text-xs text-brand-muted">Aucun visuel défini pour le moment.</p>
            )}
          </div>
          <a
            href="/admin/media"
            className="inline-flex items-center gap-2 mt-4 text-sm font-bold text-brand-gold hover:text-brand-gold-light transition-colors"
          >
            Gérer les visuels dans la Médiathèque →
          </a>
        </section>

        {/* Section Softs */}
        <section className="bg-brand-card border border-brand-border rounded-2xl p-5">
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
              value={config.soft_supplement ?? "1.50"}
              onChange={(e) => set("soft_supplement", e.target.value)}
            />
          </div>
        </section>

        {/* Section Bonbons */}
        <section className="bg-brand-card border border-brand-border rounded-2xl p-5">
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
                value={config.bonbons_text ?? ""}
                onChange={(e) => set("bonbons_text", e.target.value)}
                placeholder="Description des bonbons inclus..."
              />
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">
                Étiquettes (séparées par des virgules)
              </label>
              <input
                className="input-base"
                value={
                  (() => {
                    try { return JSON.parse(config.bonbons_items ?? "[]").join(", "); }
                    catch { return config.bonbons_items ?? ""; }
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
                  try { return JSON.parse(config.bonbons_items ?? "[]").slice(0, 4).join(" · "); }
                  catch { return ""; }
                })()}
              </p>
            </div>
          </div>
        </section>

        {/* Section Prix livraison */}
        <section className="bg-brand-card border border-brand-border rounded-2xl p-5">
          <h2 className="font-display text-lg text-brand-text mb-1">🚚 Livraison</h2>
          <p className="text-brand-muted text-xs mb-4">
            Frais de livraison et seuil de gratuité. (Modifiable ici pour affichage — mettre à jour lib/utils.ts pour le calcul commande.)
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Frais livraison (€)</label>
              <input
                type="number" step="0.50" min="0" className="input-base"
                value={config.delivery_fee ?? "3.00"}
                onChange={(e) => set("delivery_fee", e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Seuil livraison gratuite (€)</label>
              <input
                type="number" step="1" min="0" className="input-base"
                value={config.free_delivery_threshold ?? "40"}
                onChange={(e) => set("free_delivery_threshold", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Section textes site */}
        <section className="bg-brand-card border border-brand-border rounded-2xl p-5">
          <h2 className="font-display text-lg text-brand-text mb-1">🏠 Textes du site</h2>
          <p className="text-brand-muted text-xs mb-4">
            Messages marketing affichés sur la boutique.
          </p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Slogan page d&apos;accueil</label>
              <input
                className="input-base"
                value={config.hero_tagline ?? ""}
                onChange={(e) => set("hero_tagline", e.target.value)}
                placeholder="Live Fully. Sip Boldly."
              />
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Sous-titre accueil</label>
              <input
                className="input-base"
                value={config.hero_subtitle ?? ""}
                onChange={(e) => set("hero_subtitle", e.target.value)}
                placeholder="Cocktails prêts à boire..."
              />
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1">Texte bannière promotionnelle</label>
              <input
                className="input-base"
                value={config.promo_banner ?? ""}
                onChange={(e) => set("promo_banner", e.target.value)}
                placeholder="🎉 Livraison offerte dès 40€ d'achat !"
              />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
