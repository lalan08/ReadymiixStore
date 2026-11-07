import Link from "next/link";
import Image from "next/image";
import { Instagram, MapPin, Phone, MessageCircle, Clock } from "lucide-react";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "594694369615";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-darker border-t border-brand-border mt-8">
      <div className="container-custom py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" aria-label="ReadyMiix Store — Accueil" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="ReadyMiix Store"
                width={90}
                height={90}
                className="object-contain"
              />
            </Link>
            <p className="text-brand-muted text-sm leading-relaxed mb-4">
              Des Frozen Caïpis givrés, fruités, préparés à la commande pour toi.
            </p>
            <a
              href="https://www.instagram.com/readymiixx973"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram @READYMIIXX973"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-border hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-colors group"
            >
              <Instagram className="w-4 h-4 text-brand-muted group-hover:text-brand-gold" />
              <span className="text-xs text-brand-muted group-hover:text-brand-text transition-colors">
                @READYMIIXX973
              </span>
            </a>
          </div>

          {/* Infos retrait + contact */}
          <div className="flex flex-col gap-5">
            <div>
              <h4 className="font-semibold text-brand-text text-sm mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-gold" /> Retrait
              </h4>
              <ul className="flex flex-col gap-2 text-sm text-brand-muted">
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  Matoury · Uniquement sur commande
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  Mardi au dimanche · 19 h–23 h
                </li>
                <li className="text-xs text-brand-muted/70 pl-5">
                  Commande au moins 15 min avant ton passage.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-brand-text text-sm mb-3">Contact</h4>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="tel:+594694369615"
                    className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text transition-colors"
                  >
                    <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                    06 94 36 96 15
                  </a>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${whatsapp}?text=Bonjour%20ReadyMiix%20!%20Je%20voudrais%20commander.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-border">
        <div className="container-custom px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-brand-muted">
            © {currentYear} ReadyMiix Cocktails. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-brand-muted">À consommer avec modération. Interdit aux mineurs.</p>
            <Link href="/admin" className="text-xs text-brand-muted/40 hover:text-brand-muted transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
