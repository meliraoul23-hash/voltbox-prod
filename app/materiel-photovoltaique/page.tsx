import type { Metadata } from "next";
import CategoryHero from "@/components/CategoryHero";
import CategoryListing from "@/components/CategoryListing";
import { getProductsByCategory } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Matériel photovoltaïque",
  description: "Onduleurs, micro-onduleurs, optimiseurs, batteries, protections AC/DC, parafoudres et câbles solaires.",
};

export default async function Page() {
  const products = await getProductsByCategory("materiel-photovoltaique");
  return (
    <div>
      <CategoryHero
        eyebrow="Catalogue"
        title="Matériel photovoltaïque"
        description="Panneaux, onduleurs, micro-onduleurs, batteries, optimiseurs, connecteurs, câbles solaires, protections DC/AC, parafoudres, sectionneurs et coffrets."
      />
      <div className="container-wrap py-10">
        <CategoryListing
          products={products}
          subcategories={[
            "Onduleurs",
            "Micro-onduleurs",
            "Batteries",
            "Optimiseurs",
            "Connecteurs",
            "Câbles solaires",
            "Protections DC",
            "Protections AC",
          ]}
        />
      </div>
    </div>
  );
}
