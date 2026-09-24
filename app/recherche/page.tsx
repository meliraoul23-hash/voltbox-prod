import CategoryListing from "@/components/CategoryListing";
import { getAllProducts } from "@/lib/data/products";

export default async function RecherchePage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q ?? "";
  const products = await getAllProducts();

  return (
    <section className="py-10">
      <div className="container-wrap">
        <p className="label-eyebrow">Recherche</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {q ? (
            <>
              Résultats pour « {q} »
            </>
          ) : (
            "Rechercher un produit"
          )}
        </h1>
        <p className="mt-2 text-sm text-steel-600">
          Recherchez par nom de produit ou par référence (ex. VB-TE-RES-3R).
        </p>
        <div className="mt-8">
          <CategoryListing products={products} initialQuery={q} />
        </div>
      </div>
    </section>
  );
}
