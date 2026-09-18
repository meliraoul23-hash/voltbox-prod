import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "À propos",
  description: "VoltBox prépare des solutions électriques et photovoltaïques précâblées pour les professionnels du Luxembourg et de la Grande Région.",
};

export default function AboutPage() {
  return (
    <div className="container-wrap max-w-3xl py-14">
      <p className="label-eyebrow">À propos</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Nous préparons vos tableaux. Vous installez.
      </h1>

      <div className="mt-8 space-y-5 leading-relaxed text-steel-700">
        <p>
          {siteConfig.name} est spécialisé dans la préparation de solutions électriques et photovoltaïques destinées
          aux professionnels : électriciens, installateurs photovoltaïques et bureaux d'études. Notre catalogue est
          centré sur un produit précis — le tableau électrique précâblé, repéré et prêt à poser — plutôt que sur une
          offre généraliste de matériel électrique.
        </p>
        <p className="rounded-lg border-l-4 border-volt bg-volt-50 p-5 text-lg font-semibold text-ink">
          Notre mission : faire gagner du temps aux installateurs.
        </p>
        <p>
          Chaque tableau est assemblé, câblé et contrôlé avant expédition, pour réduire le temps passé sur chantier
          à assembler et raccorder les coffrets. Nous nous concentrons d'abord sur le marché luxembourgeois, avec une
          activité étendue à la Belgique, la France, l'Allemagne et plus largement la Grande Région.
        </p>
        <p>
          Ce site présente une première version du catalogue avec des données de démonstration. Le catalogue
          définitif, les certifications réelles des produits et les conditions commerciales seront confirmés avant
          mise en production.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/configurateur" className="focus-ring rounded-md bg-volt px-5 py-3 text-sm font-semibold text-white hover:bg-volt-600">
          Essayer le configurateur
        </Link>
        <Link href="/devis" className="focus-ring rounded-md border border-ink px-5 py-3 text-sm font-medium text-ink">
          Nous contacter
        </Link>
      </div>

      <div className="mt-12 rounded-lg border border-steel-200 p-5 text-sm text-steel-600">
        <p className="font-medium text-ink">Coordonnées</p>
        <p className="mt-2">{siteConfig.legalName}</p>
        <p>{siteConfig.address}</p>
        <p>{siteConfig.vatNumber} · {siteConfig.rcs}</p>
        <p className="mt-2 font-mono">{siteConfig.email} · {siteConfig.phone}</p>
      </div>
    </div>
  );
}
