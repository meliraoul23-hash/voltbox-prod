import type { Metadata } from "next";
import SeoLandingLayout from "@/components/SeoLandingLayout";
import { getProductsByCategory } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Tableau électrique précâblé Luxembourg",
  description:
    "Tableau électrique résidentiel ou tertiaire précâblé, prêt à poser, pour vos chantiers au Luxembourg et en Grande Région.",
};

export default async function Page() {
  const products = (await getProductsByCategory("tableaux-electriques")).slice(0, 6);
  return (
    <SeoLandingLayout
      eyebrow="Luxembourg"
      h1="Tableau électrique précâblé au Luxembourg"
      intro="Tableaux électriques résidentiels et tertiaires préassemblés, câblés et repérés, pour gagner du temps sur vos chantiers au Luxembourg et en Grande Région."
      products={products}
      sections={[
        {
          title: "Résidentiel, tertiaire ou industriel",
          body: "Le catalogue couvre les tableaux résidentiels (2 à 3 rangées), tertiaires (locaux professionnels) et les coffrets industriels en enveloppe étanche IP65 pour les environnements exigeants.",
        },
        {
          title: "Un tableau pré-équipé selon vos usages",
          body: "Chaque tableau précâblé est livré avec ses différentiels et disjoncteurs divisionnaires déjà répartis selon un schéma de distribution standard, ainsi que ses étiquettes de repérage.",
        },
        {
          title: "Besoin d'une distribution spécifique ?",
          body: "Pour un tableau pré-équipé ou sur mesure selon un cahier des charges précis, une demande de devis permet d'adapter la configuration proposée.",
        },
      ]}
      faq={[
        {
          q: "Le tableau électrique précâblé respecte-t-il la norme applicable au Luxembourg ?",
          a: "Les configurations proposées sont à valider selon les exigences du gestionnaire de réseau, les normes applicables et les caractéristiques de votre installation.",
        },
        {
          q: "Proposez-vous des tableaux pour bornes de recharge ?",
          a: "Oui, une catégorie dédiée propose des tableaux pré-équipés pour l'alimentation de bornes de recharge de véhicules électriques.",
        },
      ]}
    />
  );
}
