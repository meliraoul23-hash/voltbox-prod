import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, quotes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const links = [
{ href: "/compte/commandes", title: "Commandes", desc: "Historique de vos commandes" },
{ href: "/compte/factures", title: "Factures", desc: "Téléchargez vos factures" },
{ href: "/compte/devis", title: "Devis", desc: "Suivi de vos demandes de devis" },
{ href: "/compte/commande-rapide", title: "Commande rapide", desc: "Ajoutez des produits par référence" },
{ href: "/compte/configurations", title: "Configurations sauvegardées", desc: "Vos tableaux configurés" },
{ href: "/compte/telechargements", title: "Téléchargements", desc: "Fiches techniques et schémas" },
{ href: "/compte/tarifs", title: "Tarifs professionnels", desc: "Grille tarifaire pro vs particulier" },
{ href: "/sur-mesure", title: "Tableau sur mesure", desc: "Demander un tableau personnalisé" },
];

export default async function AccountHome() {
const session = await getServerSession(authOptions);
if (!session?.user) redirect("/compte/connexion");

const myOrders = await db.select().from(orders).where(eq(orders.userId, session.user.id));
const myQuotes = await db.select().from(quotes).where(eq(quotes.userId, session.user.id));

return (
<div className="container-wrap py-10">
<p className="label-eyebrow">Mon compte</p>
<h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
Bonjour, {session.user.name}
</h1>
<p className="mt-2 text-steel-600">
{session.user.role === "PROFESSIONNEL"
? `Compte professionnel${session.user.companyName ? ` — ${session.user.companyName}` : ""} · remise pro ${session.user.proDiscountPct ?? 0}%`
: session.user.role === "ADMIN"
? "Compte administrateur"
: "Compte particulier"}
</p>

<div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
<div className="rounded-lg border border-steel-200 p-4">
<p className="text-2xl font-bold tabular text-ink">{myOrders.length}</p>
<p className="text-sm text-steel-500">Commandes</p>
</div>
<div className="rounded-lg border border-steel-200 p-4">
<p className="text-2xl font-bold tabular text-ink">{myQuotes.length}</p>
<p className="text-sm text-steel-500">Devis</p>
</div>
<div className="rounded-lg border border-steel-200 p-4">
<p className="text-2xl font-bold tabular text-ink capitalize">{session.user.role.toLowerCase()}</p>
<p className="text-sm text-steel-500">Type de compte</p>
</div>
{session.user.role === "ADMIN" && (
<Link href="/admin" className="rounded-lg border border-volt bg-volt/5 p-4 hover:bg-volt/10">
<p className="text-2xl font-bold text-volt">→</p>
<p className="text-sm text-volt-600">Administration</p>
</Link>
)}
</div>

<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
{links.map((l) => (
<Link key={l.href} href={l.href} className="rounded-lg border border-steel-200 p-5 hover:border-ink">
<p className="font-semibold text-ink">{l.title}</p>
<p className="mt-1 text-sm text-steel-500">{l.desc}</p>
</Link>
))}
</div>
</div>
);
}
