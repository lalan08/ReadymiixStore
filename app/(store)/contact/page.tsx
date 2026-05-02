"use client";

import { useState } from "react";
import { MapPin, Mail, Phone, MessageCircle, Clock, Send, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP ?? "594694000000";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Message envoyé ! Nous vous répondrons sous 24h.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3 block">
            Parlons-nous
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-brand-text mb-4">
            Nous contacter
          </h1>
          <p className="text-brand-muted text-lg max-w-xl mx-auto">
            Une question, une commande spéciale, un événement à organiser ?
            Notre équipe est là pour vous.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {[
              {
                icon: MapPin,
                label: "Notre adresse",
                value: "Cayenne, Guyane française 97300",
                href: null,
              },
              {
                icon: Phone,
                label: "Téléphone",
                value: `+594 6 94 00 00 00`,
                href: `tel:+${whatsapp}`,
              },
              {
                icon: Mail,
                label: "Email",
                value: "contact@readymiixstore.com",
                href: "mailto:contact@readymiixstore.com",
              },
              {
                icon: Clock,
                label: "Horaires",
                value: "Lun–Sam : 9h–18h",
                href: null,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex gap-4 p-5 rounded-2xl bg-brand-card border border-brand-border hover:border-brand-gold/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-brand-gold" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted mb-0.5">{item.label}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-brand-text hover:text-brand-gold transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-brand-text">{item.value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsapp}?text=Bonjour%20ReadyMiix%20!%20J%27ai%20une%20question.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 font-semibold py-4 rounded-2xl transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Nous écrire sur WhatsApp
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-brand-card border border-brand-border p-6 md:p-8 flex flex-col gap-5"
            >
              <h2 className="font-display font-bold text-brand-text text-xl mb-1">
                Envoyer un message
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-brand-text block mb-1.5">
                    Nom <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-brand-text block mb-1.5">
                    Email <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="email@exemple.com"
                    className="input-base"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-brand-text block mb-1.5">
                  Sujet <span className="text-brand-gold">*</span>
                </label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="Commande, événement, question..."
                  className="input-base"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-brand-text block mb-1.5">
                  Message <span className="text-brand-gold">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Décrivez votre demande..."
                  className="input-base resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold py-4 rounded-xl shadow-gold hover:shadow-gold transition-all disabled:opacity-70"
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...</>
                ) : (
                  <><Send className="w-5 h-5" /> Envoyer le message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
