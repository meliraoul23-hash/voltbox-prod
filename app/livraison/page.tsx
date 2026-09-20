import type { Metadata } from "next";
import { deliveryCountries, deliveryMethodLabels, availableMethodsFor, getShippingCostCents } from "@/lib/delivery";
import { centsToEuro } from "@/lib/format";

export const metadata: Metadata = {
  title: "Livraison & retrait",
  description: "Livraison et retrait des tableaux électriques et photovoltaïques VoltBox au Luxembourg, en Belgique, en France et en Allemagne.",
};

export default function LivraisonPage() {
  return (
    <div>
      <div className="border-b border-steel-200 bg-steel-50">
        <div className="container-wrap py-12">
          <p className="label-eyebrow">Grande Région</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Livraison &amp; retrait</h1>
          <p className="mt-3 max-w-2xl text-steel-600">
            Nos tableaux sont préparés au Luxembourg et livrés dans toute la Grande Région : Luxembourg, Belgique,
            France, Allemagne.
          </p>
        </div>
      </div>

      <div className="container-wrap py-10">
        <div className="grid gap-6 sm:grid-cols-2">
          {deliveryCountries.map((c) => (
            <div key={c.code} className="rounded-lg border border-steel-200 p-5">
              <p className="font-semibold text-ink">{c.label}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {availableMethodsFor(c.code).map((m) => (
                  <li key={m} className="flex justify-between">
                    <span className="text-steel-600">{deliveryMethodLabels[m]}</span>
                    <span className="font-mono tabular text-ink">{centsToEuro(getShippingCostCents(c.code, m))}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-steel-200 bg-steel-50 p-6">
          <p className="font-semibold text-ink">Retrait à l'atelier</p>
          <p className="mt-2 max-w-xl text-sm text-steel-600">
            Le retrait sur place est proposé pour les commandes au Luxembourg. Un créneau vous est communiqué dès
            que votre tableau est prêt (préparation, câblage et contrôle terminés).
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-steel-200 p-6">
          <p className="font-semibold text-ink">Transporteur — envoi sur palette</p>
          <p className="mt-2 max-w-xl text-sm text-steel-600">
            Pour les coffrets volumineux ou les commandes groupées, un envoi sur palette via transporteur est
            disponible dans les quatre pays desservis, avec suivi de livraison.
          </p>
        </div>

        <p className="mt-8 text-xs text-steel-500">
          Les tarifs de livraison ci-dessus sont des exemples de démonstration — à ajuster selon vos accords
          transporteur réels.
        </p>
      </div>
    </div>
  );
}
