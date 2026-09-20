import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import DevisForm from "@/components/DevisForm";

export const metadata: Metadata = {
  title: "Tableau sur mesure",
  description: "Demandez un tableau électrique ou photovoltaïque entièrement sur mesure, adapté à votre chantier.",
};

export default function SurMesurePage() {
  return (
    <div>
      <div className="border-b border-steel-200 bg-steel-50">
        <div className="container-wrap py-12">
          <p className="label-eyebrow">Sur mesure</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">Tableau sur mesure</h1>
          <p className="mt-3 max-w-2xl text-steel-600">
            Un projet qui sort des standards ? Décrivez vos contraintes (dimensions, protections, emplacement,
            repérage spécifique) et nous étudions votre tableau sur mesure. Pour une pré-estimation instantanée,
            vous pouvez aussi essayer le{" "}
            <Link href="/configurateur" className="text-volt hover:underline">
              configurateur
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="container-wrap max-w-2xl py-10">
        <Suspense fallback={null}>
          <DevisForm defaultType="SUR_MESURE" />
        </Suspense>
      </div>
    </div>
  );
}
