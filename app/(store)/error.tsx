"use client";

export default function StoreError({
  reset,
}: {
  error?: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#070710] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-brand-muted text-xs uppercase tracking-widest mb-4">Une erreur est survenue</p>
      <h1 className="font-display text-3xl text-white mb-6">Oups&hellip;</h1>
      <p className="text-brand-muted text-sm mb-8 max-w-sm">
        Le service est temporairement indisponible. Merci de réessayer dans quelques instants.
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 rounded-xl bg-brand-gold text-brand-darker font-bold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
      >
        Réessayer
      </button>
    </div>
  );
}
