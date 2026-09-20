// Fonctions de tarification pures (aucune dependance base de donnees) afin
// de pouvoir etre importees depuis des composants client sans embarquer
// better-sqlite3 dans le bundle navigateur.
import type { Product } from "@/lib/db/schema";

export function getApplicablePriceCents(
  product: Pick<Product, "priceParticulierCents" | "priceProCents">,
  role: "PARTICULIER" | "PROFESSIONNEL" | "ADMIN" | undefined,
  proDiscountPct = 0
): number {
  if (role === "PROFESSIONNEL" || role === "ADMIN") {
    const base = product.priceProCents;
    return Math.round(base * (1 - proDiscountPct / 100));
  }
  return product.priceParticulierCents;
}
