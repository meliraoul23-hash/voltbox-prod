import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { centsToEuro } from "@/lib/format";

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/compte/connexion");

  const rows: (typeof orders.$inferSelect)[] = await db.select().from(orders).orderBy(desc(orders.createdAt));

  return (
    <div className="container-wrap py-10">
      <p className="label-eyebrow">Administration</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Commandes</h1>

      <div className="mt-6 divide-y divide-steel-200 rounded-lg border border-steel-200">
        {rows.map((o) => (
          <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
            <div>
              <p className="font-medium text-ink">{o.customerName}</p>
              <p className="text-steel-500">{o.customerEmail} {o.customerCompany ? `· ${o.customerCompany}` : ""}</p>
            </div>
            <span className="rounded-full border border-steel-300 px-2.5 py-1 text-xs">{o.status}</span>
            <p className="text-steel-500">{o.deliveryCountry} · {o.deliveryMethod}</p>
            <p className="font-mono tabular font-semibold text-ink">{centsToEuro(o.totalCents)}</p>
          </div>
        ))}
        {rows.length === 0 && <p className="p-6 text-steel-500">Aucune commande pour le moment.</p>}
      </div>
    </div>
  );
}
