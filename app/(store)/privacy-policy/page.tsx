import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Politique de confidentialité — ReadyMiix" };

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-brand-darker py-16 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="mb-10">
          <Link href="/" className="text-brand-muted text-sm hover:text-brand-gold transition-colors">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-brand-text mt-4">
            Politique de confidentialité
          </h1>
          <p className="text-brand-muted text-sm mt-2">Dernière mise à jour : novembre 2024</p>
        </div>

        <div className="flex flex-col gap-8 text-brand-muted leading-relaxed">

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">1. Qui sommes-nous ?</h2>
            <p>
              <strong className="text-brand-text">ReadyMiix and More</strong> est une entreprise spécialisée dans la vente de
              frozen caïpis et de produits associés en click &amp; collect, basée à Matoury, Guyane (97351).
              Le site <span className="text-brand-gold">www.readymiixstore.com</span> est opéré par ReadyMiix and More.
            </p>
            <p className="mt-2">
              Contact : <a href="mailto:contact@readymiixstore.com" className="text-brand-gold hover:underline">contact@readymiixstore.com</a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">2. Données collectées</h2>
            <p className="mb-2">Lors de votre commande, nous collectons :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Votre <strong className="text-brand-text">nom et prénom</strong></li>
              <li>Votre <strong className="text-brand-text">numéro de téléphone</strong></li>
              <li>Votre <strong className="text-brand-text">adresse e-mail</strong> (si paiement en ligne)</li>
              <li>Le détail et le montant de votre <strong className="text-brand-text">commande</strong></li>
              <li>L&apos;<strong className="text-brand-text">heure de retrait</strong> souhaitée</li>
            </ul>
            <p className="mt-2">
              Pour les paiements en ligne, les informations bancaires sont traitées directement et exclusivement
              par <strong className="text-brand-text">Stripe</strong> (stripe.com). ReadyMiix and More ne stocke
              aucune donnée de carte bancaire.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">3. Finalités du traitement</h2>
            <p className="mb-2">Vos données sont utilisées pour :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Préparer et gérer votre commande click &amp; collect</li>
              <li>Vous contacter en cas de question sur votre commande</li>
              <li>Traiter votre paiement (via Stripe)</li>
              <li>Améliorer nos services</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">4. Base légale</h2>
            <p>
              Le traitement de vos données est fondé sur l&apos;exécution du contrat de vente (votre commande).
              Conformément au RGPD et à la loi Informatique et Libertés, vous bénéficiez des droits suivants
              sur vos données personnelles.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">5. Vos droits</h2>
            <p className="mb-2">Vous pouvez à tout moment :</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong className="text-brand-text">Accéder</strong> aux données vous concernant</li>
              <li><strong className="text-brand-text">Rectifier</strong> des informations inexactes</li>
              <li><strong className="text-brand-text">Supprimer</strong> vos données (droit à l&apos;oubli)</li>
              <li><strong className="text-brand-text">Vous opposer</strong> au traitement</li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, contactez-nous par e-mail à{" "}
              <a href="mailto:contact@readymiixstore.com" className="text-brand-gold hover:underline">
                contact@readymiixstore.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">6. Conservation des données</h2>
            <p>
              Vos données de commande sont conservées pendant <strong className="text-brand-text">3 ans</strong> à
              compter de votre dernière commande, conformément aux obligations comptables et fiscales françaises.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">7. Cookies</h2>
            <p>
              Ce site utilise uniquement des cookies techniques indispensables au bon fonctionnement du panier
              et de la session (aucun cookie publicitaire ou de tracking tiers).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">8. Sécurité</h2>
            <p>
              Toutes les communications entre votre navigateur et notre site sont chiffrées via HTTPS.
              Les paiements sont sécurisés par Stripe, certifié PCI-DSS niveau 1.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-brand-text mb-3">9. Contact & réclamations</h2>
            <p>
              Pour toute question relative à vos données personnelles, vous pouvez nous contacter à{" "}
              <a href="mailto:contact@readymiixstore.com" className="text-brand-gold hover:underline">
                contact@readymiixstore.com
              </a>.
              Vous avez également le droit d&apos;introduire une réclamation auprès de la{" "}
              <strong className="text-brand-text">CNIL</strong> (cnil.fr).
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
