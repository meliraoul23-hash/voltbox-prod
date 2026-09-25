import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { quotes } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export default async function MyQuotesPage() {
const session = await getServerSession(authOptions);
if (!session?.user) redirect("/compte/connexion");
const myQuotes: (typeof quotes.$inferSelect)[] = await db.select().from(quotes).where(eq(quotes.userId, session.user.id)).orderBy(desc(quotes.createdAt));

return (
<div className="container-wrap py-10">
<p className="label-eyebrow">Mon compte</p>
<div className="flex flex-wrap items-center justify-between gap-3">
<h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Mes devis</h1>
<Link href="/devis" className="focus-ring rounded-md bg-volt px-4 py-2 text-sm font-semibold text-white">
Nouveau devis
</Link>
</div>

{myQuotes.length === 0 ? (
<p className="mt-8 text-steel-600">Aucune demande de devis pour le moment.</p>
) : (
<div className="mt-8 divide-y divide-steel-200 rounded-lg border border-steel-200">
{myQuotes.map((q) => (
<div key={q.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
<div>
<p className="font-medium text-ink">{q.type === "CONFIGURATEUR" ? "Configuration sur mesure" : q.type === "SUR_MESURE" ? "Tableau sur mesure" : "Devis standard"}</p>
<p className="text-steel-500">{q.createdAt ? new Date(q.createdAt).toLocaleDateString("fr-LU") : ""}</p>
</div>
<span className="rounded-full border border-steel-300 px-2.5 py-1 text-xs">{q.status}</span>
</div>
))}
</div>
)}
</div>
);
}
