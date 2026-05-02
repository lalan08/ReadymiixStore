"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { Suspense } from "react";

function LoginForm() {
  const router    = useRouter();
  const params    = useSearchParams();
  const from      = params.get("from") ?? "/admin";
  const [password, setPassword] = useState("");
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Identifiants invalides");
      toast.success("Connexion réussie !");
      router.push(from);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-gold">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-xl text-brand-text">
                Ready<span className="text-gold-gradient">Miix</span>
              </p>
              <p className="text-[10px] text-brand-muted uppercase tracking-widest">
                Administration
              </p>
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-text">
            Espace Admin
          </h1>
          <p className="text-brand-muted text-sm mt-1">
            Connectez-vous pour gérer votre boutique
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-brand-card border border-brand-border rounded-2xl p-8 flex flex-col gap-5"
        >
          <div>
            <label className="text-sm font-medium text-brand-text block mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="input-base pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
              >
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold py-3.5 rounded-xl shadow-gold hover:shadow-gold transition-all disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Connexion...</>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-brand-muted mt-4">
          Accès réservé à l&apos;équipe ReadyMiix
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-darker" />}>
      <LoginForm />
    </Suspense>
  );
}
