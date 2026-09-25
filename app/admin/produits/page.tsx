import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { centsToEuro } from "@/lib/format";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
const session = await getServerSession(authOptions);
if (!session?.user || session.user.role !== "ADMIN") redirect("/compte/connexion");

const rows: (typeof products.$inferSelect)[] = await db.select().from(products);

return (
<div className="container-wrap py-10">
<div className="flex flex-wrap items-start justify-between gap-4">
<div>
<p className="label-eyebrow">Administration</p>
<h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Produits</h1>
<p className="mt-2 text-sm text-steel-600">
{rows.length} produits — marges et prix d&apos;achat visibles uniquement ici (usage interne).
</p>
</div>
<Link
href="/admin/produits/nouveau"
className="focus-ring shrink-0 rounded-md bg-volt px-4 py-2.5 text-sm font-semibold text-white hover:bg-volt-600"
>
+ Nouveau produit
</Link>
</div>

<div className="mt-6 overflow-x-auto rounded-lg border border-steel-200">
<table className="w-full min-w-[1050px] text-sm">
<thead className="bg-steel-50 text-left text-xs uppercase tracking-wide text-steel-500">
<tr>
<th className="px-3 py-3">Réf.</th>
<th className="px-3 py-3">Nom</th>
<th className="px-3 py-3">Catégorie</th>
<th className="px-3 py-3 text-right">Achat</th>
<th className="px-3 py-3 text-right">Prix pro</th>
<th className="px-3 py-3 text-right">Prix particulier</th>
<th className="px-3 py-3 text-right">Marge</th>
<th className="px-3 py-3 text-right">Stock</th>
<th className="px-3 py-3">Statut</th>
<th className="px-3 py-3 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-steel-200">
{rows.map((p) => {
const marginCents = p.priceProCents - p.purchasePriceCents;
const marginPct = p.purchasePriceCents > 0 ? Math.round((marginCents / p.purchasePriceCents) * 100) : 0;
return (
<tr key={p.id}>
<td className="px-3 py-2.5 font-mono text-xs text-steel-500">{p.internalRef}</td>
<td className="px-3 py-2.5 font-medium text-ink">{p.name}</td>
<td className="px-3 py-2.5 text-steel-500">{p.categorySlug}</td>
<td className="px-3 py-2.5 text-right tabular text-steel-500">{centsToEuro(p.purchasePriceCents)}</td>
<td className="px-3 py-2.5 text-right tabular text-ink">{centsToEuro(p.priceProCents)}</td>
<td className="px-3 py-2.5 text-right tabular text-ink">{centsToEuro(p.priceParticulierCents)}</td>
<td className="px-3 py-2.5 text-right tabular text-ok">{marginPct}%</td>
<td className="px-3 py-2.5 text-right tabular text-ink">{p.stockQty}</td>
<td className="px-3 py-2.5">
<span className="rounded-full border border-steel-300 px-2 py-0.5 text-xs">{p.status}</span>
</td>
<td className="px-3 py-2.5">
<div className="flex items-center justify-end gap-2">
<Link
href={`/admin/produits/${p.id}`}
className="focus-ring rounded-md border border-steel-300 px-3 py-1.5 text-xs font-medium text-ink hover:border-ink"
>
Modifier
</Link>
<DeleteProductButton id={p.id} name={p.name} />
</div>
</td>
</tr>
);
})}
</tbody>
</table>
</div>
</div>
);
}
