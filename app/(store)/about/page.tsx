import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, Star, Zap } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notre histoire",
  description: "Découvrez l'histoire de ReadyMiix, la marque de cocktails premium née en Guyane.",
};

const values = [
  {
    icon: Leaf,
    title: "100% Naturel",
    desc: "Nous n'utilisons que des ingrédients naturels, sans colorants artificiels ni conservateurs. La nature de Guyane nous inspire à chaque recette.",
  },
  {
    icon: Star,
    title: "Qualité Premium",
    desc: "Chaque cocktail ReadyMiix est soigneusement élaboré pour offrir une expérience gustative exceptionnelle à un prix accessible.",
  },
  {
    icon: Heart,
    title: "Fait avec passion",
    desc: "La passion pour les saveurs tropicales guyanaises est au cœur de chacune de nos créations. Nous mettons notre cœur dans chaque bouteille.",
  },
  {
    icon: Zap,
    title: "Innovation continue",
    desc: "Nous ne cessons d'innover, d'explorer de nouvelles saveurs et de créer des expériences uniques pour nos clients guyanais.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16 overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
        <div className="container-custom relative z-10 text-center">
          <span className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-4 block">
            Notre histoire
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-brand-text mb-6 max-w-3xl mx-auto">
            Nés en Guyane,{" "}
            <span className="text-gold-gradient">pour la Guyane</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto leading-relaxed">
            ReadyMiix est une histoire d&apos;amour entre la Guyane et les cocktails. Une aventure
            commencée avec la conviction que les saveurs tropicales méritent d&apos;être partagées.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80"
                  alt="Création des cocktails ReadyMiix"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-darker/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 glass border-glow-gold rounded-2xl p-5 hidden md:block">
                <p className="text-3xl font-display font-bold text-brand-gold">2023</p>
                <p className="text-xs text-brand-muted mt-0.5">Fondé en Guyane</p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h2 className="font-display text-3xl font-bold text-brand-text">
                L&apos;histoire ReadyMiix
              </h2>
              <p className="text-brand-muted leading-relaxed">
                ReadyMiix est née en 2023 d&apos;une passion débordante pour les cocktails et les
                ingrédients tropicaux de la Guyane française. Nos fondateurs, amoureux de
                leur territoire, ont voulu capturer l&apos;essence même des saveurs locales dans
                des cocktails prêts à consommer.
              </p>
              <p className="text-brand-muted leading-relaxed">
                Le défi était simple : créer des cocktails de qualité bar, accessibles à tous,
                livrés directement chez vous en Guyane. Pas besoin d&apos;être barman pour profiter
                d&apos;un cocktail exceptionnel — il suffit d&apos;ouvrir une ReadyMiix.
              </p>
              <p className="text-brand-muted leading-relaxed">
                Aujourd&apos;hui, notre gamme s&apos;étend de cocktails classiques revisités à des
                créations originales inspirées des fruits et épices locaux. Et ce n&apos;est que
                le début — demain, ReadyMiix c&apos;est aussi des événements, des accessoires
                lifestyle et bien plus encore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-brand-card/50">
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3 block">
              Ce qui nous guide
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-text">
              Nos valeurs
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => (
              <div
                key={val.title}
                className="flex flex-col gap-4 p-6 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                  <val.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <h3 className="font-display font-bold text-brand-text">{val.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "7+",   label: "Saveurs",         desc: "cocktails uniques" },
              { value: "200+", label: "Clients",         desc: "satisfaits en Guyane" },
              { value: "100%", label: "Naturel",         desc: "sans artificiels" },
              { value: "24h",  label: "Livraison",       desc: "en Guyane" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-6 rounded-2xl bg-brand-card border border-brand-border"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-brand-gold mb-1">
                  {stat.value}
                </p>
                <p className="font-semibold text-brand-text text-sm">{stat.label}</p>
                <p className="text-xs text-brand-muted mt-0.5">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-brand-gold/10" />
        <div className="container-custom relative z-10 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-text mb-4">
            Prêt à découvrir ReadyMiix ?
          </h2>
          <p className="text-brand-muted mb-8 max-w-lg mx-auto">
            Explorez notre gamme de cocktails premium et faites vous livrer en Guyane.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-10 py-4 rounded-xl shadow-gold hover:shadow-gold transition-all text-lg"
          >
            Découvrir nos cocktails
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
