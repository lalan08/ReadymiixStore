"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store";
import { formatPrice, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/utils";
import { ArrowLeft, CheckCircle, Loader2, ShoppingBag, Truck, CreditCard, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const paymentMethods = [
  { value: "cash_on_delivery", label: "Paiement à la livraison",  desc: "En espèces ou carte à la réception",   icon: Truck },
  { value: "bank_transfer",    label: "Virement bancaire",        desc: "RIB communiqué par email après commande", icon: CreditCard },
  { value: "whatsapp",         label: "Via WhatsApp",             desc: "Paiement arrangé par WhatsApp",         icon: MessageCircle },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const router    = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName:  "",
    customerEmail: "",
    customerPhone: "",
    address:       "",
    city:          "Cayenne",
    postalCode:    "97300",
    notes:         "",
    paymentMethod: "cash_on_delivery",
  });

  const cartTotal   = total();
  const deliveryFee = cartTotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const orderTotal  = cartTotal + deliveryFee;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur lors de la commande");
      clearCart();
      router.push(`/order-confirmation/${data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container-custom flex flex-col items-center justify-center py-24 gap-6 text-center">
          <ShoppingBag className="w-16 h-16 text-brand-muted" />
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-text mb-2">
              Votre panier est vide
            </h1>
            <p className="text-brand-muted">Ajoutez des produits avant de passer commande.</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold px-8 py-3.5 rounded-xl"
          >
            Voir la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container-custom max-w-5xl">
        <div className="mb-8 flex items-center gap-3">
          <Link href="/cart" className="text-brand-muted hover:text-brand-text transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-brand-text">
            Finaliser la commande
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: form */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Informations personnelles */}
              <section className="rounded-2xl bg-brand-card border border-brand-border p-6">
                <h2 className="font-display font-bold text-brand-text mb-5">
                  Vos informations
                </h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-brand-text block mb-1.5">
                      Nom complet <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      name="customerName"
                      value={form.customerName}
                      onChange={handleChange}
                      required
                      placeholder="Jean Dupont"
                      className="input-base"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-brand-text block mb-1.5">
                        Email <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        name="customerEmail"
                        type="email"
                        value={form.customerEmail}
                        onChange={handleChange}
                        required
                        placeholder="jean@email.com"
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-brand-text block mb-1.5">
                        Téléphone <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        name="customerPhone"
                        type="tel"
                        value={form.customerPhone}
                        onChange={handleChange}
                        required
                        placeholder="+594 6 94 00 00 00"
                        className="input-base"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Adresse de livraison */}
              <section className="rounded-2xl bg-brand-card border border-brand-border p-6">
                <h2 className="font-display font-bold text-brand-text mb-5">
                  Adresse de livraison
                </h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-brand-text block mb-1.5">
                      Adresse <span className="text-brand-gold">*</span>
                    </label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      placeholder="12 rue des Palmiers"
                      className="input-base"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-brand-text block mb-1.5">
                        Ville <span className="text-brand-gold">*</span>
                      </label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        placeholder="Cayenne"
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-brand-text block mb-1.5">
                        Code postal
                      </label>
                      <input
                        name="postalCode"
                        value={form.postalCode}
                        onChange={handleChange}
                        placeholder="97300"
                        className="input-base"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-text block mb-1.5">
                      Notes / Instructions de livraison
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Indicaions pour la livraison, interphone, etc."
                      className="input-base resize-none"
                    />
                  </div>
                </div>
              </section>

              {/* Paiement */}
              <section className="rounded-2xl bg-brand-card border border-brand-border p-6">
                <h2 className="font-display font-bold text-brand-text mb-5">
                  Mode de paiement
                </h2>
                <div className="flex flex-col gap-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        form.paymentMethod === method.value
                          ? "border-brand-gold/50 bg-brand-gold/5"
                          : "border-brand-border hover:border-brand-gold/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={form.paymentMethod === method.value}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          form.paymentMethod === method.value
                            ? "border-brand-gold"
                            : "border-brand-border"
                        }`}
                      >
                        {form.paymentMethod === method.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-brand-text">{method.label}</p>
                        <p className="text-xs text-brand-muted">{method.desc}</p>
                      </div>
                      <method.icon className="w-5 h-5 text-brand-muted" />
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* Right: order summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 rounded-2xl bg-brand-card border border-brand-border p-6 flex flex-col gap-4">
                <h2 className="font-display font-bold text-brand-text">
                  Votre commande
                </h2>

                <div className="flex flex-col gap-3 max-h-64 overflow-y-auto scrollbar-hide">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-brand-border">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-brand-text truncate">{item.name}</p>
                        <p className="text-xs text-brand-muted">x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-brand-gold shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2 text-sm border-t border-brand-border pt-3">
                  <div className="flex justify-between text-brand-muted">
                    <span>Sous-total</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-brand-muted">
                    <span>Livraison</span>
                    <span className={deliveryFee === 0 ? "text-brand-success" : ""}>
                      {deliveryFee === 0 ? "Gratuite !" : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-brand-text border-t border-brand-border pt-2 mt-1 text-base">
                    <span>Total</span>
                    <span className="text-brand-gold text-lg">{formatPrice(orderTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold-dark to-brand-gold text-brand-darker font-bold py-4 rounded-xl shadow-gold hover:shadow-gold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Traitement...</>
                  ) : (
                    <><CheckCircle className="w-5 h-5" /> Confirmer la commande</>
                  )}
                </button>

                <p className="text-[10px] text-brand-muted text-center">
                  En confirmant, vous acceptez nos CGV et mentions légales.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
