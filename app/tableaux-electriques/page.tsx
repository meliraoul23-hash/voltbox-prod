import type { Metadata } from "next";
import CategoryHero from "@/components/CategoryHero";
import CategoryListing from "@/components/CategoryListing";
import { getProductsByCategory } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Tableaux électriques précâblés",
  description:
    "Tableaux résidentiels, tertiaires, pré-équipés et coffrets industriels préassemblés, câblés et repérés — prêts à installer au Luxembourg et en Grande Région.",
};

export default async function Page() {
  const products = await getProductsByCategory("tableaux-electriques");
  return (
    <div>
      <CategoryHero
        eyebrow="Catalogue"
        title="Tableaux électriques"
        description="Tableaux résidentiels et tertiaires préassemblés, tableaux pré-équipés, sur mesure et coffrets industriels — précâblés et prêts à poser."
      />
      <div className="container-wrap py-10">
        <CategoryListing
          products={products}
          subcategories={["Tableaux résidentiels", "Tableaux tertiaires", "Tableaux pré-équipés", "Coffrets industriels"]}
        />
      </div>
    </div>
  );
}
