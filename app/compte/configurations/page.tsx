import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { savedConfigurations } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type { ConfiguratorState } from "@/lib/configurator";
import { computeConfiguration } from "@/lib/configurator";
import { centsToEuro } from "@/lib/format";
import Link from "next/link";

export default async function SavedConfigurationsPage() {
const session = await getServerSession(authOptions);
if (!session?.user) redirect("/compte/connexion");
const rows: (typeof savedConfigurations.$inferSelect)[] = await db
.select()
.from(savedConfigurations)
.where(eq(savedConfigurations.userId, session.user.id))
.orderBy(desc(savedConfigurations.createdAt));

return (
<div className="container-wrap py-10">
<p className="label-eyebrow">Mon compte</p>
<div className="flex flex-wrap items-center justify-between gap-3">
<h1 className="mt-2 text-2xl font-bold tracking-tight text-ink">Configurations sauvegardées</h1>
<Link href="/configurateur" className="focus-ring rounded-md bg-volt px-4 py-2 text-sm font-semibold text-white">
Nouvelle configuration
</Link>
</div>

{rows.length === 0 ? (
<p className="mt-8 text-steel-600">
Aucune configuration enregistrée. Ouvrez le configurateur pour en créer une.
</p>
) : (
<div className="mt-8 grid gap-4 sm:grid-cols-2">
{rows.map((r) => {
const snap = r.snapshot as ConfiguratorState;
const result = computeConfiguration(snap);
return (
<div key={r.id} className="rounded-lg border border-steel-200 p-5">
<p className="font-semibold text-ink">{r.name}</p>
<p className="mt-1 text-xs text-steel-500">
{r.createdAt ? new Date(r.createdAt).toLocaleDateString("fr-LU") : ""}
</p>
<p className="mt-3 text-sm text-steel-600 capitalize">
{snap.phase} · {snap.installationPowerKw} kWc · {snap.mpptCount} MPPT
{snap.hasBattery ? ` · batterie ${snap.batteryPowerKwh} kWh` : ""}
</p>
<p className="mt-2 font-mono text-lg font-semibold tabular text-ink">
{centsToEuro(result.priceProCents)}
</p>
</div>
);
})}
</div>
)}
</div>
);
}
