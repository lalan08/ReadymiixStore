import Link from "next/link";
import { Sparkles, Instagram, Facebook, MapPin, Mail, Phone, MessageCircle } from "lucide-react";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "594694000000";

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
                className="px-5 py-3 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-semibold rounded-xl text-sm whitespace-nowrap hover:shadow-gold transition-shadow"
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
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-lg bg-gradient-brand flex items-center justify-center shadow-gold-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-lg text-brand-text">
                  Ready<span className="text-gold-gradient">Miix</span>
                </span>
                <span className="text-[10px] text-brand-muted uppercase tracking-widest">
                  Store
                </span>
              </div>
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed mb-6">
              Des cocktails premium créés en Guyane, pour la Guyane. Des saveurs
              tropicales authentiques, prêtes à savourer.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-pink hover:border-brand-pink/40 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg border border-brand-border flex items-center justify-center text-brand-muted hover:text-blue-400 hover:border-blue-400/40 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-lg border border-brand-border flex items-center justify-center text-brand-muted hover:text-green-400 hover:border-green-400/40 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Boutique */}
          <div>
            <h4 className="font-semibold text-brand-text text-sm mb-4">Boutique</h4>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/shop",              label: "Tous les cocktails" },
                { href: "/shop?category=cocktails", label: "Cocktails" },
                { href: "/shop?category=packs",      label: "Packs & Offres" },
                { href: "/shop?category=nouveautes", label: "Nouveautés" },
                { href: "/cart",              label: "Mon panier" },
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

          {/* Informations */}
          <div>
            <h4 className="font-semibold text-brand-text text-sm mb-4">Informations</h4>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/about",             label: "Notre histoire" },
                { href: "/contact",           label: "Contact" },
                { href: "/faq",               label: "FAQ" },
                { href: "/livraison",         label: "Livraison & retours" },
                { href: "/mentions-legales",  label: "Mentions légales" },
                { href: "/cgv",               label: "CGV" },
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
                  href={`tel:+${whatsapp}`}
                  className="text-sm text-brand-muted hover:text-brand-text transition-colors"
                >
                  +594 6 94 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a
                  href="mailto:contact@readymiixstore.com"
                  className="text-sm text-brand-muted hover:text-brand-text transition-colors"
                >
                  contact@readymiixstore.com
                </a>
              </li>
              <li className="mt-2">
                <a
                  href={`https://wa.me/${whatsapp}?text=Bonjour%20ReadyMiix%20!%20Je%20voudrais%20commander.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 text-sm font-medium px-4 py-2 rounded-xl transition-colors"
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
            © {currentYear} ReadyMiix Store. Tous droits réservés.
          </p>
          <p className="text-xs text-brand-muted">
            À consommer avec modération. Interdit aux mineurs.
          </p>
        </div>
      </div>
    </footer>
  );
}
