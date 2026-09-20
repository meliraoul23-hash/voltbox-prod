"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore, cartSubtotalCents } from "@/lib/cart-store";
import { centsToEuro } from "@/lib/format";
import {
  deliveryCountries,
  deliveryMethodLabels,
  availableMethodsFor,
  getShippingCostCents,
  type DeliveryCountry,
  type DeliveryMethodKey,
} from "@/lib/delivery";
import { siteConfig } from "@/lib/site-config";
import PanelArt from "./PanelArt";

export default function CartClient() {
  const { items, removeItem, setQuantity, clear } = useCartStore();
  const { data: session } = useSession();
  const router = useRouter();

  const [country, setCountry] = useState<DeliveryCountry>("LU");
  const [method, setMethod] = useState<DeliveryMethodKey>("RETRAIT");
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState<{ code: string; percentOff: number; amountOffCents: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [company, setCompany] = useState(session?.user?.companyName ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cartSubtotalCents(items);
  const discounted = promo
    ? Math.max(0, Math.round(subtotal * (1 - promo.percentOff / 100)) - promo.amountOffCents)
    : subtotal;
  const shipping = getShippingCostCents(country, method);
  const vat = Math.round(discounted * (siteConfig.vatRatePercent / 100));
  const total = discounted + vat + shipping;

  async function applyPromo() {
    setPromoError("");
    if (!promoInput.trim()) return;
    const res = await fetch(`/api/promo?code=${encodeURIComponent(promoInput)}`);
    const data = await res.json();
    if (data.valid) setPromo(data);
    else {
      setPromo(null);
      setPromoError("Code promo invalide ou expiré.");
    }
  }

  async function submitOrder() {
    setError("");
    if (!name || !email) {
      setError("Merci de renseigner votre nom et votre email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          customerName: name,
          customerEmail: email,
          customerCompany: company,
          deliveryCountry: country,
          deliveryMethod: method,
          promoCode: promo?.code,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la commande.");
      clear();
      if (data.checkoutUrl) {
        // Paiement Stripe réel configuré : redirection vers Stripe Checkout,
        // la commande sera confirmée par le webhook une fois le paiement effectué.
        window.location.href = data.checkoutUrl;
        return;
      }
      router.push(`/commande/confirmation/${data.orderId}`);
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue.");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-steel-300 p-14 text-center">
        <p className="text-steel-600">Votre panier est vide.</p>
        <Link href="/tableaux-photovoltaiques" className="mt-4 inline-block text-volt hover:underline">
          Parcourir le catalogue →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <div className="divide-y divide-steel-200 rounded-lg border border-steel-200">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 p-4">
              <div className="h-16 w-20 shrink-0 overflow-hidden rounded border border-steel-200 bg-steel-50">
                <PanelArt variant={item.image} className="h-full w-full" />
              </div>
              <div className="flex-1">
                <Link href={`/produit/${item.slug}`} className="font-medium text-ink hover:text-volt">
                  {item.name}
                </Link>
                <p className="font-mono text-sm text-steel-500">{centsToEuro(item.unitPriceCents)} / unité</p>
              </div>
              <input
                id={`qty-${item.productId}`}
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => setQuantity(item.productId, Number(e.target.value) || 1)}
                className="focus-ring w-16 rounded-md border border-steel-300 px-2 py-1.5 text-center text-sm"
              />
              <p className="w-24 text-right font-mono font-semibold tabular text-ink">
                {centsToEuro(item.unitPriceCents * item.quantity)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                aria-label={`Retirer ${item.name}`}
                className="focus-ring rounded p-2 text-steel-400 hover:text-volt"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-lg border border-steel-200 p-5">
          <p className="label-eyebrow">Coordonnées</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-ink">Nom complet</span>
              <input
                id="checkout-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-ink">Email</span>
              <input
                id="checkout-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="font-medium text-ink">Société (optionnel)</span>
              <input
                id="checkout-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2"
              />
            </label>
          </div>
        </div>

        <div className="mt-8 rounded-lg border border-steel-200 p-5">
          <p className="label-eyebrow">Livraison</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-ink">Pays de livraison</span>
              <select
                id="checkout-country"
                value={country}
                onChange={(e) => {
                  const c = e.target.value as DeliveryCountry;
                  setCountry(c);
                  setMethod(availableMethodsFor(c)[0]);
                }}
                className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2"
              >
                {deliveryCountries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="font-medium text-ink">Mode de livraison</span>
              <select
                id="checkout-method"
                value={method}
                onChange={(e) => setMethod(e.target.value as DeliveryMethodKey)}
                className="focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2"
              >
                {availableMethodsFor(country).map((m) => (
                  <option key={m} value={m}>
                    {deliveryMethodLabels[m]} — {centsToEuro(getShippingCostCents(country, m))}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-lg border border-steel-200 bg-white p-6">
          <p className="label-eyebrow">Récapitulatif</p>
          <div className="mt-4 flex gap-2">
            <input
              id="promo-code"
              type="text"
              placeholder="Code promo"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              className="focus-ring flex-1 rounded-md border border-steel-300 px-3 py-2 text-sm uppercase"
            />
            <button
              type="button"
              onClick={applyPromo}
              className="focus-ring rounded-md border border-ink px-3 py-2 text-sm font-medium text-ink"
            >
              Appliquer
            </button>
          </div>
          {promoError && <p className="mt-1.5 text-xs text-volt-600">{promoError}</p>}
          {promo && <p className="mt-1.5 text-xs text-ok">Code {promo.code} appliqué.</p>}

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-steel-500">Sous-total HT</dt>
              <dd className="tabular text-ink">{centsToEuro(discounted)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel-500">Livraison</dt>
              <dd className="tabular text-ink">{centsToEuro(shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-steel-500">TVA ({siteConfig.vatRatePercent}%)</dt>
              <dd className="tabular text-ink">{centsToEuro(vat)}</dd>
            </div>
            <div className="flex justify-between border-t border-steel-200 pt-2 text-base font-semibold">
              <dt className="text-ink">Total TTC</dt>
              <dd className="tabular text-ink">{centsToEuro(total)}</dd>
            </div>
          </dl>

          {error && <p className="mt-3 text-sm text-volt-600">{error}</p>}

          <button
            type="button"
            onClick={submitOrder}
            disabled={submitting}
            className="focus-ring mt-5 w-full rounded-md bg-volt px-4 py-3 text-sm font-semibold text-white hover:bg-volt-600 disabled:opacity-60"
          >
            {submitting ? "Traitement…" : "Passer commande"}
          </button>
          <p className="mt-3 text-center text-xs text-steel-500">
            Si Stripe est configuré côté serveur, vous serez redirigé vers un paiement réel. Sinon, la commande est
            enregistrée en mode démonstration sans paiement (voir lib/payments.ts).
          </p>
        </div>
      </div>
    </div>
  );
}
