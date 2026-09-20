import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders, invoices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { centsToEuro } from "@/lib/format";

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/compte/connexion");
  const myOrders: (typeof orders.$inferSelect)[] = await db.select().from(orders).where(eq(orders.userId, session.user.id));
  const rows = await Promise.all(
    myOrders.map(async (o) => ({
      order: o,
      invoice: (await db.select().from(invoices).where(eq(invoices.orderId, o.id)).limit(1))[0],
    }))
  );

  return (
    <div className="container-wrap py-10">
      <p className="label-eyebrow">Espace installateur</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Mes factures</h1>

      {rows.length === 0 ? (
        <p className="mt-8 text-steel-600">Aucune facture pour le moment.</p>
      ) : (
        <div className="mt-8 divide-y divide-steel-200 rounded-lg border border-steel-200">
          {rows.map(({ order, invoice }) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
              <p className="font-mono font-medium text-ink">{invoice?.number ?? "—"}</p>
              <p className="text-steel-500">
                {invoice?.issuedAt ? new Date(invoice.issuedAt).toLocaleDateString("fr-LU") : ""}
              </p>
              <p className="font-mono tabular font-semibold text-ink">{centsToEuro(order.totalCents)}</p>
              <span className="text-xs text-steel-400">PDF disponible après intégration d'un module de facturation</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
