"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body style={{ background: "#070710", color: "#F0F0F8", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", margin: 0, textAlign: "center", padding: "1rem" }}>
        <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#888", marginBottom: "1rem" }}>Erreur critique</p>
        <h1 style={{ fontSize: "2rem", marginBottom: "1.5rem" }}>Service indisponible</h1>
        <p style={{ color: "#888", fontSize: "0.875rem", marginBottom: "2rem", maxWidth: "360px" }}>
          Le service est temporairement indisponible. Merci de réessayer dans quelques instants.
        </p>
        <button
          onClick={reset}
          style={{ padding: "0.75rem 1.5rem", borderRadius: "0.75rem", background: "#F72585", color: "#fff", fontWeight: "bold", fontSize: "0.875rem", border: "none", cursor: "pointer" }}
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}
