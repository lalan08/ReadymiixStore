import Link from "next/link";
import { Instagram, MapPin, Phone, MessageCircle } from "lucide-react";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "594694369615";

const pointsDeVente = [
  { name: "Soula Market",              detail: "" },
  { name: "Proxi Madeleine",           detail: "En face de la gendarmerie" },
  { name: "Rapid Market",              detail: "Raban" },
  { name: "Rapid Market",              detail: "En face de Melkior" },
  { name: "Barb'Or – Guyane à Jasmin", detail: "CC Family Plaza, Montjoly · Cayenne" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-darker border-t border-brand-border">
      {/* Newsletter banner */}
      <div className="bg-gradient-to-r from-brand-purple/20 via-brand-card to-brand-gold/10 border-b border-brand-border">
        <div className="container-custom py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-xl font-bold text-brand-text mb-1">
                Restez informé des nouveautés
              </h3>
              <p className="text-brand-muted text-sm">
                Nouvelles saveurs, offres exclusives, événements en Guyane.
              </p>
            </div>
            <form
              action="/api/newsletter"
              method="POST"
              className="flex gap-3 w-full md:w-auto"
            >
              <input
                type="email"
                name="email"
                placeholder="Votre email"
                required
                className="input-base flex-1 md:w-72"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-white font-semibold rounded-xl text-sm whitespace-nowrap hover:shadow-gold transition-shadow"
              >
                S&apos;inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <svg width="36" height="36" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <polygon points="40,4 76,72 4,72" fill="#F72585" opacity="0.95" />
                <polygon points="40,22 66,70 14,70" fill="#C5006A" />
                <text x="40" y="60" textAnchor="middle" fill="#00D2C8" fontSize="17" fontWeight="900" fontFamily="'Arial Black', Impact, sans-serif" letterSpacing="1">RMX</text>
              </svg>
              <div className="flex flex-col leading-none">
                <span className="font-display text-xl text-white uppercase tracking-wide">
                  Ready<span className="text-gold-gradient">Miix</span>
                </span>
                <span className="text-[10px] text-brand-teal uppercase tracking-[0.25em] font-bold">
                  Cocktails · 973
                </span>
              </div>
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed mb-4">
              Bien frais, toujours prêt. Des cocktails tropicaux créés en Guyane,
              prêts à mixer et à savourer.
            </p>
            <p className="text-xs text-brand-muted italic mb-5">
              Ton cocktail. Ton moment.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/readymiixx973"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram @READYMIIXX973"
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-border hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-colors group"
              >
                <Instagram className="w-4 h-4 text-brand-muted group-hover:text-brand-gold" />
                <span className="text-xs text-brand-muted group-hover:text-brand-text transition-colors">
                  @READYMIIXX973
                </span>
              </a>
            </div>
          </div>

          {/* Boutique */}
          <div>
            <h4 className="font-semibold text-brand-text text-sm mb-4">Boutique en ligne</h4>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/shop",                    label: "Tous les cocktails" },
                { href: "/shop?category=cocktails", label: "Cocktails" },
                { href: "/shop?category=packs",     label: "Packs & Offres" },
                { href: "/shop?category=nouveautes",label: "Nouveautés" },
                { href: "/cart",                    label: "Mon panier" },
                { href: "/contact",                 label: "Commander par WhatsApp" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-muted hover:text-brand-text transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Points de vente */}
          <div>
            <h4 className="font-semibold text-brand-text text-sm mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-gold" />
              Points de vente
            </h4>
            <ul className="flex flex-col gap-3">
              {pointsDeVente.map((p, i) => (
                <li key={i} className="flex flex-col">
                  <span className="text-sm text-brand-text font-medium">{p.name}</span>
                  {p.detail && (
                    <span className="text-xs text-brand-muted">{p.detail}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-brand-text text-sm mb-4">Nous contacter</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-gold mt-0.5 shrink-0" />
                <span className="text-sm text-brand-muted">
                  Cayenne, Guyane française
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a
                  href="tel:+594694369615"
                  className="text-sm text-brand-muted hover:text-brand-text transition-colors"
                >
                  06 94 36 96 15
                </a>
              </li>
              <li className="mt-2">
                <a
                  href={`https://wa.me/${whatsapp}?text=Bonjour%20ReadyMiix%20!%20Je%20voudrais%20commander.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Commander via WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-border">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-brand-muted">
            © {currentYear} ReadyMiix Cocktails. Tous droits réservés.
          </p>
          <p className="text-xs text-brand-muted">
            🍹 À consommer avec modération. Interdit aux mineurs.
          </p>
        </div>
      </div>
    </footer>
  );
}
