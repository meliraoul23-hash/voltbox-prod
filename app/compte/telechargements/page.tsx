import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllProducts } from "@/lib/data/products";

export default async function DownloadsPage() {
const session = await getServerSession(authOptions);
if (!session?.user) redirect("/compte/connexion");
const products = await getAllProducts();

return (
<div className="container-wrap py-10">
<p className="label-eyebrow">Mon compte</p>
<h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Téléchargements</h1>
<p className="mt-2 max-w-2xl text-steel-600">
Fiches techniques générées à partir des données de démonstration du catalogue. Les schémas détaillés et
certificats réels remplaceront ces extraits avant mise en production.
</p>
<div className="mt-8 divide-y divide-steel-200 rounded-lg border border-steel-200">
{products.map((p) => (
<div key={p.id} className="flex items-center justify-between gap-3 p-4 text-sm">
<div>
<p className="font-medium text-ink">{p.name}</p>
<p className="font-mono text-xs text-steel-500">{p.internalRef}</p>
</div>
<a
href={`/api/products/${p.slug}/fiche-technique`}
className="focus-ring rounded-md border border-ink px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink hover:text-white"
>
Fiche technique (.txt)
</a>
</div>
))}
</div>
</div>
);
}
