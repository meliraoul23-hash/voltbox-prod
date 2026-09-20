import type { Metadata } from "next";
import SeoLandingLayout from "@/components/SeoLandingLayout";
import { getProductsByCategory } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Coffret photovoltaïque précâblé",
  description:
    "Coffret photovoltaïque précâblé AC, DC ou AC/DC, mono ou triphasé — prêt à poser. Comparez les coffrets PV précâblés du catalogue VoltBox.",
};

export default async function Page() {
  const products = (await getProductsByCategory("tableaux-photovoltaiques")).slice(0, 6);
  return (
    <SeoLandingLayout
      eyebrow="Coffrets photovoltaïques"
      h1="Coffret photovoltaïque précâblé — AC, DC et AC/DC"
      intro="Le coffret photovoltaïque précâblé regroupe sectionnement, protections et parafoudre dans un boîtier déjà câblé et repéré, prêt à raccorder sur chantier."
      products={products}
      sections={[
        {
          title: "Coffret AC, DC ou combiné AC/DC",
          body: "Selon votre installation, un coffret dédié au courant alternatif (sortie onduleur), un coffret dédié au courant continu (entre panneaux et onduleur), ou un coffret combiné réunissant les deux compartiments.",
        },
        {
          title: "Monophasé ou triphasé",
          body: "Le catalogue propose des coffrets pour installations monophasées (jusqu'à quelques kW) et triphasées (jusqu'à plusieurs dizaines de kW), avec sectionnement et protections calibrés en conséquence.",
        },
        {
          title: "Avec parafoudre, batterie ou onduleur",
          body: "Certains coffrets intègrent une protection parafoudre renforcée, un compartiment dédié à une batterie de stockage, ou un raccordement pensé pour un onduleur de forte puissance.",
        },
      ]}
      faq={[
        {
          q: "Quelle est la différence entre un coffret AC et un coffret DC ?",
          a: "Le coffret AC protège et sectionne la sortie en courant alternatif de l'onduleur vers le réseau. Le coffret DC protège et sectionne le courant continu entre les panneaux et l'onduleur.",
        },
        {
          q: "Le coffret est-il livré avec un schéma ?",
          a: "Chaque fiche produit présente un schéma de principe illustratif ; le configurateur génère également un schéma de principe adapté à votre configuration.",
        },
      ]}
    />
  );
}
