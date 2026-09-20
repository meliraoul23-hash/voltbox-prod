import type { Metadata } from "next";
import CategoryHero from "@/components/CategoryHero";
import CategoryListing from "@/components/CategoryListing";
import { getProductsByCategory } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Tableaux pour borne de recharge",
  description: "Tableaux pré-équipés, protections et accessoires pour l'alimentation de bornes de recharge de véhicules électriques.",
};

export default async function Page() {
  const products = await getProductsByCategory("borne-de-recharge");
  return (
    <div>
      <CategoryHero
        eyebrow="Catalogue"
        title="Borne de recharge"
        description="Tableaux pré-équipés, protections dédiées, câbles et accessoires pour l'alimentation de bornes de recharge véhicules électriques."
      />
      <div className="container-wrap py-10">
        <CategoryListing products={products} />
      </div>
    </div>
  );
}
