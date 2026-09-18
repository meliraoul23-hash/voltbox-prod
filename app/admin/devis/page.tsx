import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { quotes, quoteFiles } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function AdminQuotesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") redirect("/compte/connexion");

  const rows: (typeof quotes.$inferSelect)[] = await db.select().from(quotes).orderBy(desc(quotes.createdAt));
  const filesByQuote = new Map<string, (typeof quoteFiles.$inferSelect)[]>();
  for (const q of rows) {
    filesByQuote.set(q.id, await db.select().from(quoteFiles).where(eq(quoteFiles.quoteId, q.id)));
  }

  return (
    <div className="container-wrap py-10">
      <p className="label-eyebrow">Administration</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Devis reçus</h1>

      <div className="mt-6 divide-y divide-steel-200 rounded-lg border border-steel-200">
        {rows.map((q) => {
          const files = filesByQuote.get(q.id) ?? [];
          return (
            <div key={q.id} className="p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-ink">
                  {q.name} — {q.email}
                </p>
                <span className="rounded-full border border-steel-300 px-2.5 py-1 text-xs">{q.type}</span>
              </div>
              <p className="mt-1 text-steel-500">
                {q.company ? `${q.company} · ` : ""}
                {q.phone ?? ""} · {q.createdAt ? new Date(q.createdAt).toLocaleString("fr-LU") : ""}
              </p>
              {q.powerKw && <p className="mt-1 text-steel-600">Puissance : {q.powerKw} kWc · Qté {q.quantity}</p>}
              {q.message && <p className="mt-2 text-steel-700">{q.message}</p>}
              {files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {files.map((f) => (
                    <a key={f.id} href={f.url} className="rounded border border-steel-300 px-2 py-1 text-xs text-volt hover:underline">
                      {f.filename}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {rows.length === 0 && <p className="p-6 text-steel-500">Aucun devis reçu pour le moment.</p>}
      </div>
    </div>
  );
}
