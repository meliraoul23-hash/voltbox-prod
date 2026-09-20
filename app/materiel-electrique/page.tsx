import type { Metadata } from "next";
import CategoryHero from "@/components/CategoryHero";
import CategoryListing from "@/components/CategoryListing";
import { getProductsByCategory } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Matériel électrique",
  description: "Disjoncteurs, différentiels, parafoudres, contacteurs, borniers, câbles, goulottes et accessoires de câblage.",
};

export default async function Page() {
  const products = await getProductsByCategory("materiel-electrique");
  return (
    <div>
      <CategoryHero
        eyebrow="Catalogue"
        title="Matériel électrique"
        description="Disjoncteurs, interrupteurs différentiels, parafoudres, contacteurs, borniers, peignes, câbles, goulottes et accessoires de câblage."
      />
      <div className="container-wrap py-10">
        <CategoryListing products={products} />
      </div>
    </div>
  );
}
