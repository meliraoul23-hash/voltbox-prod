// Import / mise a jour du catalogue produits depuis un fichier CSV.
// Usage : npm run import:csv -- ./exports/products.csv
// Le CSV doit contenir au minimum la colonne "slug" pour identifier le
// produit a mettre a jour (colonnes reconnues : voir export-products.ts).
// Les produits inconnus (nouveau slug) sont ignores ici par securite - ce
// script est prevu pour la mise a jour de prix/stock d'un catalogue
// existant ; la creation de nouveaux produits se fait via le seed ou un
// futur back-office.
import { db } from "../lib/db";
import { products } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

async function main() {
  const inPath = process.argv[2] || path.join(process.cwd(), "exports", "products.csv");

  if (!fs.existsSync(inPath)) {
    console.error(`Fichier introuvable : ${inPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(inPath, "utf-8");
  const records: Record<string, string>[] = parse(content, { columns: true, skip_empty_lines: true });

  let updated = 0;
  let skipped = 0;

  for (const r of records) {
    const rows = await db.select().from(products).where(eq(products.slug, r.slug)).limit(1);
    const existing = rows[0];
    if (!existing) {
      skipped++;
      continue;
    }
    await db
      .update(products)
      .set({
        priceParticulierCents: r.priceParticulierCents ? Number(r.priceParticulierCents) : existing.priceParticulierCents,
        priceProCents: r.priceProCents ? Number(r.priceProCents) : existing.priceProCents,
        purchasePriceCents: r.purchasePriceCents ? Number(r.purchasePriceCents) : existing.purchasePriceCents,
        stockQty: r.stockQty ? Number(r.stockQty) : existing.stockQty,
        status: (r.status as any) || existing.status,
        updatedAt: new Date(),
      })
      .where(eq(products.slug, r.slug));
    updated++;
  }

  console.log(`${updated} produits mis à jour, ${skipped} lignes ignorées (slug inconnu).`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
