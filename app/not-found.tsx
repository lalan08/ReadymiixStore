import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8 inline-block">
          <span className="font-display text-8xl md:text-9xl font-bold text-brand-border select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-brand-gold animate-pulse" />
          </div>
        </div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-text mb-3">
          Page introuvable
        </h1>
        <p className="text-brand-muted mb-8">
          Cette page n&apos;existe pas ou a été déplacée.
          Retournez à l&apos;accueil pour continuer.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-8 py-3.5 rounded-xl shadow-gold transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
