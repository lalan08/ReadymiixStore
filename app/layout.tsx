import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "ReadyMiix Store – Cocktails Premium en Guyane",
    template: "%s | ReadyMiix Store",
  },
  description:
    "Découvrez les cocktails premium ReadyMiix. Livraison en Guyane. Des saveurs tropicales authentiques, prêtes à savourer.",
  keywords: ["cocktails", "Guyane", "ReadyMiix", "boissons premium", "livraison"],
  authors: [{ name: "ReadyMiix Store" }],
  creator: "ReadyMiix Store",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "ReadyMiix Store",
    title: "ReadyMiix Store – Cocktails Premium en Guyane",
    description:
      "Des cocktails premium livrés chez vous en Guyane. Saveurs tropicales, qualité irréprochable.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#070710",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#0E0E1C",
              color: "#F0F0F8",
              border: "1px solid #1E1E32",
              borderRadius: "12px",
              fontFamily: "var(--font-inter)",
            },
            success: {
              iconTheme: { primary: "#E8A838", secondary: "#070710" },
            },
            error: {
              iconTheme: { primary: "#EF4444", secondary: "#070710" },
            },
          }}
        />
      </body>
    </html>
  );
}
