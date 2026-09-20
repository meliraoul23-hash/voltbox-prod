import type { Metadata } from "next";
import SeoLandingLayout from "@/components/SeoLandingLayout";
import { getProductsByCategory } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Tableau photovoltaïque précâblé Luxembourg",
  description:
    "Tableau photovoltaïque précâblé, prêt à poser, pour vos chantiers au Luxembourg. Coffrets AC, DC et AC/DC assemblés, câblés et contrôlés avant expédition.",
};

export default async function Page() {
  const products = (await getProductsByCategory("tableaux-photovoltaiques")).slice(0, 6);
  return (
    <SeoLandingLayout
      eyebrow="Luxembourg"
      h1="Tableau photovoltaïque précâblé au Luxembourg"
      intro="Pour les installateurs actifs au Luxembourg, VoltBox prépare des tableaux photovoltaïques précâblés, repérés et prêts à poser — afin de réduire le temps de câblage sur chantier."
      products={products}
      sections={[
        {
          title: "Un tableau PV prêt à poser, pensé pour le marché luxembourgeois",
          body: "Chaque tableau photovoltaïque est assemblé et câblé en atelier avant expédition. L'objectif : que vous puissiez raccorder le coffret sur chantier sans passer des heures à assembler protections, sectionnements et bornier.",
        },
        {
          title: "Retrait ou livraison au Luxembourg",
          body: "Les commandes au Luxembourg peuvent être retirées à l'atelier ou livrées selon le mode choisi (standard, express ou transporteur pour les coffrets volumineux). Voir la page Livraison pour le détail des délais et tarifs.",
        },
        {
          title: "Conformité et validation technique",
          body: "Chaque configuration proposée reste à valider selon les exigences du gestionnaire de réseau et les normes applicables à votre installation — nous ne certifions pas automatiquement une conformité réglementaire.",
        },
      ]}
      faq={[
        {
          q: "Un tableau photovoltaïque précâblé est-il conforme aux exigences luxembourgeoises ?",
          a: "Les configurations proposées sont à valider selon les exigences du gestionnaire de réseau, les normes applicables et les caractéristiques précises de votre installation.",
        },
        {
          q: "Quel est le délai pour un tableau PV précâblé au Luxembourg ?",
          a: "Le délai de préparation varie selon la complexité du tableau (voir chaque fiche produit ou le configurateur pour une estimation détaillée), auquel s'ajoute le délai de livraison ou de retrait.",
        },
        {
          q: "Puis-je faire configurer un tableau sur mesure ?",
          a: "Oui, via le configurateur en ligne pour une première estimation, ou via une demande de devis pour un besoin plus spécifique.",
        },
      ]}
    />
  );
}
