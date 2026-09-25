import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllProducts } from "@/lib/data/products";
import { centsToEuro } from "@/lib/format";

export default async function ProPricingPage() {
const session = await getServerSession(authOptions);
if (!session?.user) redirect("/compte/connexion");
const products = await getAllProducts();
const discount = session.user.proDiscountPct ?? 0;

return (
<div className="container-wrap py-10">
<p className="label-eyebrow">Mon compte</p>
<h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Tarifs professionnels</h1>
{session.user.role !== "PROFESSIONNEL" ? (
<p className="mt-4 max-w-lg text-steel-600">
Les tarifs professionnels sont réservés aux comptes de type Professionnel. Contactez-nous pour faire
évoluer votre compte.
</p>
) : (
<>
<p className="mt-2 text-steel-600">Remise professionnelle appliquée : {discount}%</p>
<div className="mt-6 overflow-x-auto rounded-lg border border-steel-200">
<table className="w-full min-w-[560px] text-sm">
<thead className="bg-steel-50 text-left text-xs uppercase tracking-wide text-steel-500">
<tr>
<th className="px-4 py-3">Produit</th>
<th className="px-4 py-3">Réf. interne</th>
<th className="px-4 py-3 text-right">Prix particulier</th>
<th className="px-4 py-3 text-right">Prix pro</th>
</tr>
</thead>
<tbody className="divide-y divide-steel-200">
{products.map((p) => (
<tr key={p.id}>
<td className="px-4 py-3 font-medium text-ink">{p.name}</td>
<td className="px-4 py-3 font-mono text-xs text-steel-500">{p.internalRef}</td>
<td className="px-4 py-3 text-right tabular text-steel-500 line-through">
{centsToEuro(p.priceParticulierCents)}
</td>
<td className="px-4 py-3 text-right tabular font-semibold text-volt">
{centsToEuro(Math.round(p.priceProCents * (1 - discount / 100)))}
</td>
</tr>
))}
</tbody>
</table>
</div>
</>
)}
</div>
);
}
