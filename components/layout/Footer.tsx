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
            <Link href="/" className="flex items-center mb-5" aria-label="ReadyMiix Store — Accueil">
              {/* Logo SVG rétro néon */}
              <svg width="100" height="100" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <defs>
                  <filter id="fpinkNeon" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <filter id="ftealNeon" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <polygon points="100,10 185,100 15,100" fill="none" stroke="#FF1493" strokeWidth="3.5" filter="url(#fpinkNeon)" />
                <polygon points="15,100 185,100 100,190" fill="none" stroke="#FF1493" strokeWidth="3.5" filter="url(#fpinkNeon)" />
                <rect x="62" y="55" width="5" height="45" fill="#7B2FBE" rx="2" />
                <ellipse cx="64" cy="52" rx="16" ry="8" fill="#7B2FBE" transform="rotate(-20,64,52)" />
                <ellipse cx="64" cy="52" rx="14" ry="7" fill="#7B2FBE" transform="rotate(15,64,52)" />
                <ellipse cx="64" cy="52" rx="12" ry="6" fill="#7B2FBE" transform="rotate(-50,64,52)" />
                <rect x="98" y="40" width="5" height="58" fill="#6B1FBE" rx="2" />
                <ellipse cx="100" cy="37" rx="20" ry="10" fill="#6B1FBE" transform="rotate(-10,100,37)" />
                <ellipse cx="100" cy="37" rx="18" ry="9" fill="#6B1FBE" transform="rotate(20,100,37)" />
                <ellipse cx="100" cy="37" rx="16" ry="8" fill="#6B1FBE" transform="rotate(-40,100,37)" />
                <ellipse cx="100" cy="37" rx="14" ry="7" fill="#6B1FBE" transform="rotate(45,100,37)" />
                <rect x="134" y="55" width="5" height="45" fill="#7B2FBE" rx="2" />
                <ellipse cx="136" cy="52" rx="16" ry="8" fill="#7B2FBE" transform="rotate(20,136,52)" />
                <ellipse cx="136" cy="52" rx="14" ry="7" fill="#7B2FBE" transform="rotate(-15,136,52)" />
                <ellipse cx="136" cy="52" rx="12" ry="6" fill="#7B2FBE" transform="rotate(50,136,52)" />
                <text x="100" y="124" textAnchor="middle" fill="#00D2C8" fontSize="26" fontWeight="900" fontFamily="'Arial Black', Impact, sans-serif" letterSpacing="1.5" filter="url(#ftealNeon)">READYMIIX</text>
                <path d="M 35,130 Q 100,138 165,130" fill="none" stroke="#00D2C8" strokeWidth="2.5" strokeLinecap="round" filter="url(#ftealNeon)" />
                <text x="100" y="155" textAnchor="middle" fill="white" fontSize="20" fontStyle="italic" fontWeight="700" fontFamily="Georgia, serif" letterSpacing="3">STORE</text>
              </svg>
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
