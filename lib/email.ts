// Envoi d'emails transactionnels via Resend (https://resend.com).
//
// Sans RESEND_API_KEY dans .env, le site reste pleinement fonctionnel : les
// emails sont simplement journalisés en console au lieu d'être envoyés
// ("mode démonstration"), exactement comme pour les paiements (voir
// lib/payments.ts). Pour activer l'envoi réel :
//   1) Créer un compte sur https://resend.com et vérifier un domaine
//      d'expédition (ou utiliser leur domaine de test en développement).
//   2) Renseigner RESEND_API_KEY et EMAIL_FROM dans .env.
// Aucune autre modification de code n'est nécessaire.
import { Resend } from "resend";
import { siteConfig } from "./site-config";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

let client: Resend | null = null;
function getClient(): Resend {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

type SendArgs = { to: string; subject: string; html: string };

export async function sendEmail({ to, subject, html }: SendArgs): Promise<{ sent: boolean }> {
  if (!isEmailConfigured()) {
    console.log(`[email:demo] (non envoyé — RESEND_API_KEY absent) À: ${to} — Objet: ${subject}`);
    return { sent: false };
  }
  try {
    await getClient().emails.send({
      from: process.env.EMAIL_FROM || `${siteConfig.name} <no-reply@voltbox-demo.lu>`,
      to,
      subject,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error("[email] échec de l'envoi:", err);
    return { sent: false };
  }
}

function layout(title: string, bodyHtml: string): string {
  return `
  <div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#14171A;">
    <div style="background:#14171A;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0;">
      <strong style="font-size:16px;">${siteConfig.name}</strong>
    </div>
    <div style="border:1px solid #E7E9EB;border-top:none;padding:24px;border-radius:0 0 8px 8px;">
      <h1 style="font-size:18px;margin:0 0 12px;">${title}</h1>
      ${bodyHtml}
      <p style="margin-top:24px;font-size:12px;color:#6B7480;">
        ${siteConfig.name} — site de démonstration. ${siteConfig.email}
      </p>
    </div>
  </div>`;
}

export async function sendQuoteAcknowledgement(quote: { name: string; email: string; type: string }) {
  return sendEmail({
    to: quote.email,
    subject: "Votre demande de devis a bien été reçue",
    html: layout(
      "Demande de devis reçue",
      `<p>Bonjour ${quote.name},</p>
       <p>Nous avons bien reçu votre demande de devis${quote.type === "SUR_MESURE" ? " pour un tableau sur mesure" : quote.type === "CONFIGURATEUR" ? " générée depuis le configurateur" : ""}. Notre équipe revient vers vous rapidement avec une proposition adaptée.</p>`
    ),
  });
}

export async function sendQuoteAdminNotification(quote: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
}) {
  return sendEmail({
    to: siteConfig.email,
    subject: `Nouvelle demande de devis — ${quote.name}`,
    html: layout(
      "Nouvelle demande de devis",
      `<p><strong>${quote.name}</strong> (${quote.email}${quote.phone ? `, ${quote.phone}` : ""}${quote.company ? `, ${quote.company}` : ""})</p>
       ${quote.message ? `<p>${quote.message}</p>` : ""}
       <p>Voir le détail dans l'espace d'administration (/admin/devis).</p>`
    ),
  });
}

export async function sendOrderConfirmationEmail(order: {
  customerName: string;
  customerEmail: string;
  invoiceNumber: string;
  totalLabel: string;
}) {
  return sendEmail({
    to: order.customerEmail,
    subject: `Confirmation de commande — ${order.invoiceNumber}`,
    html: layout(
      "Commande confirmée",
      `<p>Bonjour ${order.customerName},</p>
       <p>Votre commande <strong>${order.invoiceNumber}</strong> d'un montant de <strong>${order.totalLabel}</strong> a bien été enregistrée.</p>
       <p>Ce site fonctionne actuellement en mode démonstration : aucun paiement réel n'a été prélevé.</p>`
    ),
  });
}
