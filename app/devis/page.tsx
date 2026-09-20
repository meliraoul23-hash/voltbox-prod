import type { Metadata } from "next";
import { Suspense } from "react";
import DevisForm from "@/components/DevisForm";

export const metadata: Metadata = {
  title: "Demander un devis",
  description: "Demandez un devis pour un tableau électrique ou photovoltaïque précâblé, standard ou sur mesure.",
};

export default function DevisPage() {
  return (
    <div className="container-wrap max-w-2xl py-14">
      <p className="label-eyebrow">Devis</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Demander un devis</h1>
      <p className="mt-3 text-steel-600">
        Décrivez votre besoin, joignez un schéma ou une photo si nécessaire — nous revenons vers vous avec une
        proposition adaptée.
      </p>
      <div className="mt-8">
        <Suspense fallback={null}>
          <DevisForm />
        </Suspense>
      </div>
    </div>
  );
}
