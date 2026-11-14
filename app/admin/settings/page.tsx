"use client";

import { useState, useEffect } from "react";
import { Save, Check, Eye, EyeOff, Lock, Phone, AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  /* ── Contact ── */
  const [whatsapp,  setWhatsapp]  = useState("");
  const [savingContact, setSavingContact] = useState(false);
  const [savedContact,  setSavedContact]  = useState(false);

  /* ── Maintenance ── */
  const [maintenanceEnabled,  setMaintenanceEnabled]  = useState(false);
  const [maintenanceMessage,  setMaintenanceMessage]  = useState("");
  const [savingMaintenance, setSavingMaintenance] = useState(false);
  const [savedMaintenance,  setSavedMaintenance]  = useState(false);

  /* ── Password ── */
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd,     setNewPwd]     = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd,    setShowPwd]    = useState(false);
  const [savingPwd,  setSavingPwd]  = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((r) => r.json())
      .then((data) => {
        setWhatsapp(data.whatsapp_number ?? "");
        setMaintenanceEnabled(data.maintenance_enabled === "true");
        setMaintenanceMessage(data.maintenance_message ?? "");
        setLoading(false);
      });
  }, []);

  async function saveConfig(payload: Record<string, string>, setSaving: (v: boolean) => void, setSaved: (v: boolean) => void) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  async function changePassword() {
    if (newPwd !== confirmPwd) { toast.error("Les mots de passe ne correspondent pas"); return; }
    if (newPwd.length < 6)     { toast.error("Le mot de passe doit faire au moins 6 caractères"); return; }
    setSavingPwd(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? "Erreur"); return; }
      toast.success("Mot de passe mis à jour !");
      setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setSavingPwd(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-brand-muted text-sm gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Chargement...
      </div>
    );
  }

  return (
    <div className="max-w-2xl flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-text">Paramètres</h1>
        <p className="text-brand-muted text-sm mt-1">Configuration du site ReadyMiix</p>
      </div>

      {/* ── Contact WhatsApp ── */}
      <section className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-brand-teal" />
          <h2 className="font-display text-lg text-brand-text">Contact WhatsApp</h2>
        </div>
        <p className="text-brand-muted text-xs -mt-2">
          Numéro utilisé pour les liens WhatsApp sur la page de confirmation de commande.
        </p>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1.5">
              Numéro (format international, sans +)
            </label>
            <input
              className="input-base"
              placeholder="594694369615"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
            />
            <p className="text-xs text-brand-muted mt-1">
              Exemple : <span className="text-brand-gold">594694369615</span> pour +594 694 36 96 15
            </p>
          </div>
          <button
            onClick={() => saveConfig({ whatsapp_number: whatsapp }, setSavingContact, setSavedContact)}
            disabled={savingContact}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-teal/10 text-brand-teal border border-brand-teal/30 text-sm font-semibold hover:bg-brand-teal/20 transition-colors disabled:opacity-50 shrink-0"
          >
            {savedContact ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {savedContact ? "Enregistré" : savingContact ? "..." : "Enregistrer"}
          </button>
        </div>
      </section>

      {/* ── Message de fermeture ── */}
      <section className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-brand-warning" />
          <h2 className="font-display text-lg text-brand-text">Message de fermeture</h2>
        </div>
        <p className="text-brand-muted text-xs -mt-2">
          Affiché en bannière sur toutes les pages quand le site est en maintenance ou fermé temporairement.
        </p>

        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setMaintenanceEnabled((v) => !v)}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${maintenanceEnabled ? "bg-brand-warning" : "bg-brand-border"}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${maintenanceEnabled ? "translate-x-6" : "translate-x-1"}`} />
          </div>
          <span className="text-sm text-brand-text font-semibold">
            {maintenanceEnabled ? "Bannière activée" : "Bannière désactivée"}
          </span>
        </label>

        <div>
          <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1.5">Message</label>
          <textarea
            rows={2}
            className="input-base resize-none"
            placeholder="Le site est momentanément fermé. Réouverture bientôt !"
            value={maintenanceMessage}
            onChange={(e) => setMaintenanceMessage(e.target.value)}
          />
        </div>

        <button
          onClick={() => saveConfig({
            maintenance_enabled: maintenanceEnabled ? "true" : "false",
            maintenance_message: maintenanceMessage,
          }, setSavingMaintenance, setSavedMaintenance)}
          disabled={savingMaintenance}
          className="self-end flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-warning/10 text-brand-warning border border-brand-warning/30 text-sm font-semibold hover:bg-brand-warning/20 transition-colors disabled:opacity-50"
        >
          {savedMaintenance ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {savedMaintenance ? "Enregistré" : savingMaintenance ? "..." : "Enregistrer"}
        </button>
      </section>

      {/* ── Mot de passe admin ── */}
      <section className="bg-brand-card border border-brand-border rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-brand-gold" />
          <h2 className="font-display text-lg text-brand-text">Mot de passe admin</h2>
        </div>
        <p className="text-brand-muted text-xs -mt-2">
          Modifie le mot de passe de connexion à l&apos;admin.
        </p>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1.5">Mot de passe actuel</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                className="input-base pr-10"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors"
              >
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1.5">Nouveau mot de passe</label>
            <input
              type={showPwd ? "text" : "password"}
              className="input-base"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="Minimum 6 caractères"
            />
          </div>
          <div>
            <label className="text-xs text-brand-muted uppercase tracking-wide block mb-1.5">Confirmer le nouveau mot de passe</label>
            <input
              type={showPwd ? "text" : "password"}
              className="input-base"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="Répète le nouveau mot de passe"
            />
          </div>
        </div>

        <button
          onClick={changePassword}
          disabled={savingPwd || !currentPwd || !newPwd || !confirmPwd}
          className="self-end flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-gold/10 text-brand-gold border border-brand-gold/30 text-sm font-semibold hover:bg-brand-gold/20 transition-colors disabled:opacity-50"
        >
          {savingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          {savingPwd ? "Vérification..." : "Changer le mot de passe"}
        </button>
      </section>
    </div>
  );
}
