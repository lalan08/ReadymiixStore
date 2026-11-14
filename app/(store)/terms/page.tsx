import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Conditions d'utilisation — ReadyMiix" };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-darker py-16 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="mb-10">
          <Link href="/" className="text-brand-muted text-sm hover:text-brand-gold transition-colors">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-text mt-4">
            Conditions générales de vente
          </h1>
          <p className="text-brand-muted text-sm mt-2">Dernière mise à jour : novembre 2024</p>
        </div>

        <div className="flex flex-col gap-8 text-brand-muted leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">1. Vendeur</h2>
            <p>
              <strong className="text-brand-text">ReadyMiix and More</strong><br />
              Matoury, Guyane — 97351<br />
              Site web : <span className="text-brand-gold">www.readymiixstore.com</span>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">2. Produits</h2>
            <p>
              ReadyMiix and More propose à la vente des frozen caïpis et produits associés (boissons, accessoires)
              disponibles en <strong className="text-brand-text">click &amp; collect</strong> uniquement.
              Les produits sont préparés à la commande et disponibles au retrait selon le créneau choisi.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">3. Passation de commande</h2>
            <p className="mb-2">Pour passer commande, le client :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Sélectionne ses produits et les ajoute au panier</li>
              <li>Renseigne son nom, son numéro de téléphone et l&apos;heure de retrait souhaitée</li>
              <li>Choisit son mode de paiement (en ligne ou en espèces au retrait)</li>
              <li>Valide sa commande</li>
            </ul>
            <p className="mt-2">
              La commande est définitive dès confirmation. Le client reçoit un récapitulatif et un numéro de commande.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">4. Prix</h2>
            <p>
              Les prix affichés sont en <strong className="text-brand-text">euros (€) toutes taxes comprises</strong>.
              ReadyMiix and More se réserve le droit de modifier ses tarifs à tout moment. Les prix applicables
              sont ceux en vigueur au moment de la validation de la commande.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">5. Paiement</h2>
            <p className="mb-2">Deux modes de paiement sont proposés :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-brand-text">En ligne</strong> (carte bancaire, Apple Pay, Google Pay)
                via la plateforme sécurisée <strong className="text-brand-text">Stripe</strong> —
                le paiement est débité immédiatement à la commande.
              </li>
              <li>
                <strong className="text-brand-text">En espèces</strong> au moment du retrait.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">6. Retrait (Click &amp; Collect)</h2>
            <p>
              La commande doit être retirée à l&apos;adresse communiquée par ReadyMiix and More, au créneau horaire
              choisi lors de la commande. En cas de retard ou d&apos;impossibilité de retrait, le client est invité à
              nous contacter dès que possible.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">7. Annulation et remboursement</h2>
            <p>
              Les commandes de produits alimentaires préparés à la demande ne peuvent pas être annulées une fois
              la préparation commencée. En cas de problème constaté à la réception, le client doit nous contacter
              dans les <strong className="text-brand-text">24 heures</strong> suivant le retrait pour toute réclamation.
              Les remboursements éventuels sont effectués sur le même moyen de paiement utilisé lors de la commande.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">8. Responsabilité</h2>
            <p>
              ReadyMiix and More s&apos;engage à préparer les produits dans le respect des normes d&apos;hygiène alimentaire
              en vigueur. Notre responsabilité ne saurait être engagée en cas de force majeure, d&apos;indisponibilité
              temporaire du service ou d&apos;erreur imputable au client lors de la passation de commande.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">9. Données personnelles</h2>
            <p>
              Le traitement de vos données personnelles est décrit dans notre{" "}
              <Link href="/privacy-policy" className="text-brand-gold hover:underline">
                Politique de confidentialité
              </Link>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">10. Droit applicable</h2>
            <p>
              Les présentes conditions générales de vente sont soumises au droit français.
              En cas de litige, une solution amiable sera recherchée en priorité.
              À défaut, les tribunaux compétents du ressort de Cayenne seront seuls compétents.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">11. Contact</h2>
            <p>
              Pour toute question, contactez-nous à{" "}
              <a href="mailto:contact@readymiixstore.com" className="text-brand-gold hover:underline">
                contact@readymiixstore.com
              </a>{" "}
              ou via notre page{" "}
              <Link href="/contact" className="text-brand-gold hover:underline">Contact</Link>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
