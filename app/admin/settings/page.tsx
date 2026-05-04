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

        {/* ── Section Visuels Composer ── */}
        <section className="bg-brand-card border border-brand-gold/30 rounded-2xl p-5">
          <h2 className="font-display text-lg text-brand-text mb-1">📸 Visuels — Page Composer</h2>
          <p className="text-brand-muted text-xs mb-4">
            Photos affichées dans les cartes <strong className="text-brand-text">Cocktail Light</strong> et <strong className="text-brand-text">Cocktail Hard</strong> sur la page /composer.
          </p>

          <div className="bg-brand-darker rounded-xl border border-brand-border p-4 mb-4">
            <p className="text-xs font-bold text-brand-gold uppercase tracking-wide mb-2">📋 Comment ajouter tes photos ?</p>
            <ol className="text-xs text-brand-muted space-y-1 list-decimal list-inside leading-relaxed">
              <li>Va sur GitHub → ton dépôt → dossier <code className="text-brand-teal">public/images/</code></li>
              <li>Clique sur <strong className="text-brand-text">Add file → Upload files</strong></li>
              <li>Upload ta photo Light (<code className="text-brand-teal">light-kit.jpg</code>) et ta photo Hard (<code className="text-brand-teal">hard-kit.jpg</code>)</li>
              <li>Reviens ici et entre <code className="text-brand-teal">/images/light-kit.jpg</code> dans le champ ci-dessous</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-2">
                🟦 Image Cocktail <span style={{ color: "#00D2C8" }}>Light</span>
              </label>
              <input
                className="input-base"
                value={config.light_card_image ?? ""}
                onChange={(e) => set("light_card_image", e.target.value)}
                placeholder="/images/light-kit.jpg  ou  https://lien-direct-image.jpg"
              />
              {config.light_card_image && (
                <div className="mt-2 relative w-32 h-24 rounded-lg overflow-hidden border border-brand-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={config.light_card_image} alt="Light preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="text-xs text-brand-muted uppercase tracking-wide block mb-2">
                🟥 Image Cocktail <span style={{ color: "#F72585" }}>Hard</span>
              </label>
              <input
                className="input-base"
                value={config.hard_card_image ?? ""}
                onChange={(e) => set("hard_card_image", e.target.value)}
                placeholder="/images/hard-kit.jpg  ou  https://lien-direct-image.jpg"
              />
              {config.hard_card_image && (
                <div className="mt-2 relative w-32 h-24 rounded-lg overflow-hidden border border-brand-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={config.hard_card_image} alt="Hard preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
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
