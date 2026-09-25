import CommandeRapideClient from "@/components/CommandeRapideClient";

export default function CommandeRapidePage() {
return (
<div className="container-wrap py-10">
<p className="label-eyebrow">Mon compte</p>
<h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Commande rapide</h1>
<p className="mt-2 max-w-xl text-steel-600">
Ajoutez des produits directement au panier en saisissant leur référence interne (visible sur chaque fiche
produit) — utile pour les commandes récurrentes.
</p>
<div className="mt-8 max-w-lg">
<CommandeRapideClient />
</div>
</div>
);
}
