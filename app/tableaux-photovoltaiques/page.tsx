import type { Metadata } from "next";
import CategoryHero from "@/components/CategoryHero";
import CategoryListing from "@/components/CategoryListing";
import { getProductsByCategory } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Tableaux photovoltaïques précâblés",
  description:
    "Coffrets PV AC, DC, AC/DC, mono et triphasés, avec parafoudre, sectionnement, batterie ou onduleur — précâblés et prêts à poser. Catalogue pour le Luxembourg et la Grande Région.",
};

export default async function Page() {
  const products = await getProductsByCategory("tableaux-photovoltaiques");
  return (
    <div>
      <CategoryHero
        eyebrow="Catalogue"
        title="Tableaux photovoltaïques"
        description="Coffrets AC, DC, AC/DC, monophasés et triphasés, avec parafoudre, sectionnement, pour batteries ou onduleurs — tous précâblés, repérés et prêts à poser."
      />
      <div className="container-wrap py-10">
        <CategoryListing
          products={products}
          subcategories={[
            "Coffrets AC",
            "Coffrets DC",
            "Coffrets AC/DC",
            "Coffrets monophasés",
            "Coffrets triphasés",
            "Avec parafoudre",
            "Pour batteries",
            "Pour onduleurs",
          ]}
        />
      </div>
    </div>
  );
}
