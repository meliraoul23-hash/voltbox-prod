import type { Metadata } from "next";
import ConfiguratorForm from "@/components/ConfiguratorForm";

export const metadata: Metadata = {
  title: "Configurateur de tableau",
  description:
    "Configurez votre tableau photovoltaïque ou électrique sur mesure : phase, puissance, onduleur, MPPT, batterie, parafoudre, sectionnement — composants, schéma, prix et délais en direct.",
};

export default function ConfiguratorPage() {
  return (
    <div>
      <div className="border-b border-steel-200 bg-steel-50">
        <div className="container-wrap py-12">
          <p className="label-eyebrow">Configurateur</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Composez votre tableau</h1>
          <p className="mt-3 max-w-2xl text-steel-600">
            Renseignez les caractéristiques de votre installation : la liste des composants, le schéma de principe,
            le prix estimatif et les délais se mettent à jour au fur et à mesure.
          </p>
        </div>
      </div>
      <div className="container-wrap py-10">
        <ConfiguratorForm />
      </div>
    </div>
  );
}
