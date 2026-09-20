import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data/products";
import { demoDataDisclaimer, complianceDisclaimer, siteConfig } from "@/lib/site-config";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });

  const specs = (product.specs as { label: string; value: string }[])
    .map((s) => `  - ${s.label} : ${s.value}`)
    .join("\n");
  const contents = (product.contents as { qty: string; label: string }[])
    .map((c) => `  - ${c.qty} ${c.label}`)
    .join("\n");

  const text = `${siteConfig.name} — FICHE TECHNIQUE (extrait de démonstration)
================================================================

${product.name}
Référence interne : ${product.internalRef}${product.manufacturerRef ? `\nRéférence fabricant : ${product.manufacturerRef}` : ""}

${product.description}

CARACTÉRISTIQUES TECHNIQUES
${specs}
  - Poids : ${product.weightKg} kg

CONTENU DU COFFRET
${contents}

DÉLAIS INDICATIFS
  - Préparation : ${product.leadTimePrepDays} j ouvrés
  - Livraison : ${product.leadTimeShipDays} j supplémentaires (Luxembourg)

----------------------------------------------------------------
${demoDataDisclaimer}
${complianceDisclaimer}
`;

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${product.internalRef}-fiche-technique.txt"`,
    },
  });
}
