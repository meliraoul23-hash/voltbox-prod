import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { centsToEuro } from "@/lib/format";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/compte/connexion");
  const myOrders: (typeof orders.$inferSelect)[] = await db.select().from(orders).where(eq(orders.userId, session.user.id)).orderBy(desc(orders.createdAt));

  return (
    <div className="container-wrap py-10">
      <p className="label-eyebrow">Espace installateur</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Mes commandes</h1>

      {myOrders.length === 0 ? (
        <p className="mt-8 text-steel-600">Vous n'avez pas encore passé de commande.</p>
      ) : (
        <div className="mt-8 divide-y divide-steel-200 rounded-lg border border-steel-200">
          {myOrders.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
              <div>
                <p className="font-medium text-ink">Commande #{o.id.slice(0, 8)}</p>
                <p className="text-steel-500">{o.createdAt ? new Date(o.createdAt).toLocaleDateString("fr-LU") : ""}</p>
              </div>
              <span className="rounded-full border border-steel-300 px-2.5 py-1 text-xs">{o.status}</span>
              <p className="font-mono tabular font-semibold text-ink">{centsToEuro(o.totalCents)}</p>
              <Link href={`/commande/confirmation/${o.id}`} className="text-volt hover:underline">
                Détail →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
