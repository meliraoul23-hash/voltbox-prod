import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { orders, orderItems, invoices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { centsToEuro } from "@/lib/format";
import { deliveryMethodLabels, type DeliveryMethodKey } from "@/lib/delivery";
import { isStripeConfigured } from "@/lib/payments";

export default async function ConfirmationPage({ params }: { params: { id: string } }) {
  const orderRows = await db.select().from(orders).where(eq(orders.id, params.id)).limit(1);
  const order = orderRows[0];
  if (!order) notFound();
  const items: (typeof orderItems.$inferSelect)[] = await db.select().from(orderItems).where(eq(orderItems.orderId, params.id));
  const invoiceRows = await db.select().from(invoices).where(eq(invoices.orderId, params.id)).limit(1);
  const invoice = invoiceRows[0];

  const stripeOn = isStripeConfigured();
  const isPending = order.status === "EN_ATTENTE";

  return (
    <div className="container-wrap max-w-2xl py-14">
      <div className={`rounded-lg border p-6 ${isPending ? "border-warn/30 bg-warn/5" : "border-ok/30 bg-ok/5"}`}>
        <p className={`font-semibold ${isPending ? "text-warn" : "text-ok"}`}>
          {isPending ? "Paiement en attente de confirmation" : "Commande confirmée"}
        </p>
        <p className="mt-1 text-sm text-steel-600">
          Numéro de facture {invoice?.number}.{" "}
          {stripeOn
            ? isPending
              ? "En attente de confirmation du paiement par Stripe."
              : "Paiement confirmé via Stripe."
            : "Site de démonstration — aucun paiement réel n'a été effectué (voir lib/payments.ts pour brancher Stripe ou PayPal)."}
        </p>
      </div>

      <div className="mt-8 divide-y divide-steel-200 rounded-lg border border-steel-200">
        {items.map((it) => (
          <div key={it.id} className="flex items-center justify-between p-4 text-sm">
            <div>
              <p className="font-medium text-ink">{it.productNameSnapshot}</p>
              <p className="text-steel-500">Qté {it.quantity}</p>
            </div>
            <p className="font-mono tabular text-ink">{centsToEuro(it.unitPriceCents * it.quantity)}</p>
          </div>
        ))}
      </div>

      <dl className="mt-6 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-steel-500">Sous-total HT</dt>
          <dd className="tabular text-ink">{centsToEuro(order.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-steel-500">Livraison ({deliveryMethodLabels[order.deliveryMethod as DeliveryMethodKey]})</dt>
          <dd className="tabular text-ink">{centsToEuro(order.shippingCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-steel-500">TVA ({order.vatPercent}%)</dt>
          <dd className="tabular text-ink">{centsToEuro(order.vatCents)}</dd>
        </div>
        <div className="flex justify-between border-t border-steel-200 pt-2 text-base font-semibold">
          <dt className="text-ink">Total TTC</dt>
          <dd className="tabular text-ink">{centsToEuro(order.totalCents)}</dd>
        </div>
      </dl>

      <div className="mt-10 flex gap-3">
        <Link href="/" className="focus-ring rounded-md bg-ink px-4 py-2.5 text-sm font-semibold text-white">
          Retour à l'accueil
        </Link>
        <Link href="/compte/commandes" className="focus-ring rounded-md border border-steel-300 px-4 py-2.5 text-sm font-medium text-ink">
          Voir mes commandes
        </Link>
      </div>
    </div>
  );
}
