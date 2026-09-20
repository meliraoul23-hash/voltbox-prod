// Integration paiement - Stripe Checkout, avec repli en mode demonstration.
//
// Sans STRIPE_SECRET_KEY dans .env, le site fonctionne en mode
// DEMONSTRATION : la commande est enregistree directement avec le statut
// "PAYEE" sans transaction reelle (aucun appel a Stripe n'est effectue).
//
// Avec une cle Stripe renseignee, une vraie session Stripe Checkout est
// creee (voir createStripeCheckoutSession ci-dessous, utilisee par
// app/api/checkout/route.ts) et la commande reste "EN_ATTENTE" jusqu'a
// confirmation du paiement par le webhook Stripe
// (app/api/webhooks/stripe/route.ts), qui verifie la signature de la
// requete avant de marquer la commande "PAYEE" - ne jamais se fier au seul
// retour navigateur pour confirmer un paiement.
//
// PayPal suit la meme logique (variables PAYPAL_CLIENT_ID /
// PAYPAL_CLIENT_SECRET) : brancher l'Orders API v2
// (https://developer.paypal.com/docs/api/orders/v2/) dans une fonction
// jumelle `createPaypalOrder`, appelee depuis la meme route quand Stripe
// n'est pas configure mais PayPal l'est.
import Stripe from "stripe";

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function isPaypalConfigured(): boolean {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

export function paymentModeLabel(): "stripe" | "paypal" | "demo" {
  if (isStripeConfigured()) return "stripe";
  if (isPaypalConfigured()) return "paypal";
  return "demo";
}

let stripeClient: Stripe | null = null;
export function getStripeClient(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2026-08-26.dahlia",
    });
  }
  return stripeClient;
}

export async function createStripeCheckoutSession(params: {
  orderId: string;
  customerEmail: string;
  lineItems: { name: string; unitAmountCents: number; quantity: number }[];
  shippingCents: number;
  vatCents: number;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string | null }> {
  const stripe = getStripeClient();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = params.lineItems.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: { name: item.name },
      unit_amount: item.unitAmountCents,
    },
    quantity: item.quantity,
  }));

  if (params.vatCents > 0) {
    line_items.push({
      price_data: { currency: "eur", product_data: { name: "TVA" }, unit_amount: params.vatCents },
      quantity: 1,
    });
  }
  if (params.shippingCents > 0) {
    line_items.push({
      price_data: { currency: "eur", product_data: { name: "Livraison" }, unit_amount: params.shippingCents },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: params.customerEmail,
    line_items,
    metadata: { orderId: params.orderId },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  });

  return { url: session.url };
}
