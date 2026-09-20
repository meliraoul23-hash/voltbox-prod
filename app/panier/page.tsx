import type { Metadata } from "next";
import CartClient from "@/components/CartClient";

export const metadata: Metadata = {
  title: "Panier",
  description: "Votre panier VoltBox — tableaux et matériel électrique et photovoltaïque.",
};

export default function CartPage() {
  return (
    <div className="container-wrap py-10">
      <p className="label-eyebrow">Commande</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Panier</h1>
      <div className="mt-8">
        <CartClient />
      </div>
    </div>
  );
}
