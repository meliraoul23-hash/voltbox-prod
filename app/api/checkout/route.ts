import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { products, orders, orderItems, invoices, promoCodes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getApplicablePriceCents } from "@/lib/pricing";
import { getShippingCostCents, type DeliveryCountry, type DeliveryMethodKey } from "@/lib/delivery";
import { siteConfig } from "@/lib/site-config";
import { randomUUID } from "crypto";
import { isStripeConfigured, createStripeCheckoutSession } from "@/lib/payments";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { centsToEuro } from "@/lib/format";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const body = await req.json();

  const { items, customerName, customerEmail, customerCompany, deliveryCountry, deliveryMethod, promoCode } = body as {
    items: { productId: string; quantity: number }[];
    customerName: string;
    customerEmail: string;
    customerCompany?: string;
    deliveryCountry: DeliveryCountry;
    deliveryMethod: DeliveryMethodKey;
    promoCode?: string;
  };

  if (!items?.length || !customerName || !customerEmail) {
    return NextResponse.json({ error: "Panier ou coordonnées incomplets." }, { status: 400 });
  }

  // Les prix sont toujours recalcules cote serveur a partir du catalogue,
  // jamais a partir de valeurs envoyees par le client.
  let subtotalCents = 0;
  const resolvedItems: { productId: string; quantity: number; unitPriceCents: number; name: string }[] = [];

  for (const item of items) {
    const rows = await db.select().from(products).where(eq(products.id, item.productId)).limit(1);
    const product = rows[0];
    if (!product) continue;
    const unitPriceCents = getApplicablePriceCents(
      product,
      session?.user?.role,
      session?.user?.proDiscountPct ?? 0
    );
    subtotalCents += unitPriceCents * item.quantity;
    resolvedItems.push({ productId: product.id, quantity: item.quantity, unitPriceCents, name: product.name });
  }

  if (resolvedItems.length === 0) {
    return NextResponse.json({ error: "Aucun produit valide dans le panier." }, { status: 400 });
  }

  let promoApplied: string | undefined;
  if (promoCode) {
    const promoRows = await db.select().from(promoCodes).where(eq(promoCodes.code, promoCode.toUpperCase())).limit(1);
    const promo = promoRows[0];
    if (promo && promo.active) {
      promoApplied = promo.code;
      if (promo.percentOff) subtotalCents = Math.round(subtotalCents * (1 - promo.percentOff / 100));
      if (promo.amountOffCents) subtotalCents = Math.max(0, subtotalCents - promo.amountOffCents);
    }
  }

  const shippingCents = getShippingCostCents(deliveryCountry, deliveryMethod);
  const vatPercent = siteConfig.vatRatePercent;
  const vatCents = Math.round(subtotalCents * (vatPercent / 100));
  const totalCents = subtotalCents + vatCents + shippingCents;

  const orderId = randomUUID();
  const useStripe = isStripeConfigured();

  await db.insert(orders).values({
    id: orderId,
    userId: session?.user?.id,
    // En mode demonstration (sans Stripe configure), la commande est
    // consideree payee immediatement. Avec Stripe, elle reste EN_ATTENTE
    // jusqu'a confirmation par le webhook (voir app/api/webhooks/stripe).
    status: useStripe ? "EN_ATTENTE" : "PAYEE",
    subtotalCents,
    vatPercent,
    vatCents,
    shippingCents,
    totalCents,
    deliveryMethod,
    deliveryCountry,
    promoCode: promoApplied,
    customerName,
    customerEmail,
    customerCompany,
  });

  for (const item of resolvedItems) {
    await db.insert(orderItems).values({
      orderId,
      productId: item.productId,
      quantity: item.quantity,
      unitPriceCents: item.unitPriceCents,
      productNameSnapshot: item.name,
    });
  }

  const invoiceNumber = `VB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  await db.insert(invoices).values({ orderId, number: invoiceNumber });

  if (useStripe) {
    const origin = req.nextUrl.origin;
    const { url } = await createStripeCheckoutSession({
      orderId,
      customerEmail,
      lineItems: resolvedItems.map((i) => ({ name: i.name, unitAmountCents: i.unitPriceCents, quantity: i.quantity })),
      shippingCents,
      vatCents,
      successUrl: `${origin}/commande/confirmation/${orderId}`,
      cancelUrl: `${origin}/panier`,
    });
    return NextResponse.json({ orderId, checkoutUrl: url });
  }

  // Mode démonstration : pas de paiement réel, on confirme immédiatement.
  await sendOrderConfirmationEmail({
    customerName,
    customerEmail,
    invoiceNumber,
    totalLabel: centsToEuro(totalCents),
  }).catch((err) => console.error("[checkout] envoi email:", err));

  return NextResponse.json({ orderId });
}
