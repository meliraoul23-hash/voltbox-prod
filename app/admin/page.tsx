import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { products, quotes, orders } from "@/lib/db/schema";

const links = [
  { href: "/admin/produits", title: "Produits", desc: "Catalogue, stock, prix d'achat et marges" },
  { href: "/admin/devis", title: "Devis reçus", desc: "Toutes les demandes de devis et tableaux sur mesure" },
  { href: "/admin/commandes", title: "Commandes", desc: "Commandes passées sur la boutique" },
];

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/compte/connexion");

  const nbProducts = (await db.select().from(products)).length;
  const nbQuotes = (await db.select().from(quotes)).length;
  const nbOrders = (await db.select().from(orders)).length;

  return (
    <div className="container-wrap py-10">
      <p className="label-eyebrow">Administration</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Tableau de bord</h1>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-steel-200 p-4">
          <p className="text-2xl font-bold tabular text-ink">{nbProducts}</p>
          <p className="text-sm text-steel-500">Produits</p>
        </div>
        <div className="rounded-lg border border-steel-200 p-4">
          <p className="text-2xl font-bold tabular text-ink">{nbQuotes}</p>
          <p className="text-sm text-steel-500">Devis reçus</p>
        </div>
        <div className="rounded-lg border border-steel-200 p-4">
          <p className="text-2xl font-bold tabular text-ink">{nbOrders}</p>
          <p className="text-sm text-steel-500">Commandes</p>
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-lg border border-steel-200 p-5 hover:border-ink">
            <p className="font-semibold text-ink">{l.title}</p>
            <p className="mt-1 text-sm text-steel-500">{l.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-dashed border-steel-300 p-5 text-sm text-steel-600">
        <p className="font-medium text-ink">Import / export CSV</p>
        <p className="mt-1">
          Utilisez <code className="rounded bg-steel-100 px-1.5 py-0.5 font-mono text-xs">npm run export:csv</code>{" "}
          et{" "}
          <code className="rounded bg-steel-100 px-1.5 py-0.5 font-mono text-xs">npm run import:csv</code> en ligne
          de commande pour synchroniser le catalogue produits depuis/vers un fichier CSV (voir README).
        </p>
      </div>
    </div>
  );
}
