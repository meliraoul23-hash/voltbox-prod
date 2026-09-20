// Export du catalogue produits vers un fichier CSV.
// Usage : npm run export:csv  (ecrit exports/products.csv)
import { db } from "../lib/db";
import { products } from "../lib/db/schema";
import { stringify } from "csv-stringify/sync";
import fs from "fs";
import path from "path";

async function main() {
  const outPath = process.argv[2] || path.join(process.cwd(), "exports", "products.csv");

  const rows = await db.select().from(products);

  const csv = stringify(
    rows.map((p: any) => ({
      slug: p.slug,
      name: p.name,
      internalRef: p.internalRef,
      manufacturerRef: p.manufacturerRef ?? "",
      categorySlug: p.categorySlug,
      brandSlug: p.brandSlug ?? "",
      purchasePriceCents: p.purchasePriceCents,
      priceParticulierCents: p.priceParticulierCents,
      priceProCents: p.priceProCents,
      stockQty: p.stockQty,
      status: p.status,
      phase: p.phase ?? "",
      powerKw: p.powerKw ?? "",
      ipRating: p.ipRating ?? "",
    })),
    { header: true }
  );

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, csv, "utf-8");
  console.log(`${rows.length} produits exportés vers ${outPath}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
