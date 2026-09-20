import { NextRequest, NextResponse } from "next/server";
import { getStripeClient, isStripeConfigured } from "@/lib/payments";
import { db } from "@/lib/db";
import { orders, invoices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { centsToEuro } from "@/lib/format";
import type Stripe from "stripe";

// Confirme un paiement Stripe cote serveur avant de marquer une commande
// "PAYEE" - ne jamais se fier au seul retour navigateur (success_url) pour
// cela, un utilisateur pourrait y accéder sans avoir réellement payé.
//
// Configuration côté Stripe : Dashboard > Developers > Webhooks > Add
// endpoint, URL = https://votre-domaine/api/webhooks/stripe, événement
// "checkout.session.completed". Copier le "Signing secret" dans
// STRIPE_WEBHOOK_SECRET (.env).
export async function POST(req: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 400 });
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    if (!signature || !webhookSecret) {
      // Sans secret de webhook configuré, on ne peut pas vérifier
      // l'authenticité de la requête : on refuse plutôt que de faire
      // confiance à un corps de requête non signé.
      return NextResponse.json({ error: "Signature ou secret de webhook manquant." }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature invalide:", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const stripeSession = event.data.object as Stripe.Checkout.Session;
    const orderId = stripeSession.metadata?.orderId;
    if (orderId) {
      await db.update(orders).set({ status: "PAYEE" }).where(eq(orders.id, orderId));

      const orderRows = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
      const invoiceRows = await db.select().from(invoices).where(eq(invoices.orderId, orderId)).limit(1);
      const order = orderRows[0];
      const invoice = invoiceRows[0];
      if (order && invoice) {
        await sendOrderConfirmationEmail({
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          invoiceNumber: invoice.number,
          totalLabel: centsToEuro(order.totalCents),
        }).catch((err) => console.error("[stripe webhook] envoi email:", err));
      }
    }
  }

  return NextResponse.json({ received: true });
}
