"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { ProductFormState } from "@/lib/actions/products";
import type { Product, Category, Brand } from "@/lib/db/schema";

const imageVariants: { value: string; label: string }[] = [
{ value: "panel-ac-tri", label: "Coffret AC triphasé" },
{ value: "panel-ac-mono", label: "Coffret AC monophasé" },
{ value: "panel-dc", label: "Coffret DC" },
{ value: "panel-ac-dc", label: "Coffret AC/DC combiné" },
{ value: "panel-parafoudre", label: "Coffret parafoudre" },
{ value: "panel-batterie", label: "Coffret batterie" },
{ value: "panel-onduleur", label: "Coffret pour onduleur" },
{ value: "panel-residentiel", label: "Tableau résidentiel" },
{ value: "panel-tertiaire", label: "Tableau tertiaire" },
{ value: "panel-industriel", label: "Coffret industriel" },
{ value: "panel-borne", label: "Tableau borne de recharge" },
{ value: "inverter", label: "Onduleur (appareil)" },
{ value: "optimizer", label: "Optimiseur (appareil)" },
{ value: "breaker", label: "Disjoncteur / différentiel (appareil)" },
];

function specsToText(specs: { label: string; value: string }[] | undefined): string {
if (!specs?.length) return "";
return specs.map((s) => `${s.label}: ${s.value}`).join("\n");
}

function contentsToText(contents: { qty: string; label: string }[] | undefined): string {
if (!contents?.length) return "";
return contents.map((c) => `${c.qty} ${c.label}`).join("\n");
}

const inputClass =
"focus-ring mt-1 w-full rounded-md border border-steel-300 px-3 py-2 text-sm";
const labelClass = "text-sm font-medium text-ink";

function SubmitButton({ label }: { label: string }) {
const { pending } = useFormStatus();
return (
<button
type="submit"
disabled={pending}
className="focus-ring rounded-md bg-volt px-5 py-2.5 text-sm font-semibold text-white hover:bg-volt-600 disabled:opacity-60"
>
{pending ? "Enregistrement…" : label}
</button>
);
}

export default function ProductForm({
action,
categories,
brands,
product,
submitLabel,
}: {
action: (prevState: ProductFormState, formData: FormData) => Promise<ProductFormState>;
categories: Pick<Category, "slug" | "name">[];
brands: Pick<Brand, "slug" | "name">[];
product?: Product;
submitLabel: string;
}) {
const [state, formAction] = useFormState(action, {});

return (
<form action={formAction} className="mt-6 space-y-8">
{state?.error && (
<div className="rounded-md border border-warn bg-warn/10 px-4 py-3 text-sm text-warn">{state.error}</div>
)}

<fieldset className="grid gap-4 sm:grid-cols-2">
<legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-steel-500">Identification</legend>
<label className="block">
<span className={labelClass}>Nom du produit *</span>
<input name="name" required defaultValue={product?.name} className={inputClass} />
</label>
<label className="block">
<span className={labelClass}>URL (slug)</span>
<input
name="slug"
defaultValue={product?.slug}
placeholder="généré automatiquement si laissé vide"
className={inputClass}
/>
</label>
<label className="block">
<span className={labelClass}>Référence interne *</span>
<input name="internalRef" required defaultValue={product?.internalRef} className={`${inputClass} uppercase`} />
</label>
<label className="block">
<span className={labelClass}>Référence fabricant</span>
<input name="manufacturerRef" defaultValue={product?.manufacturerRef ?? ""} className={inputClass} />
</label>
<label className="block sm:col-span-2">
<span className={labelClass}>Description courte (liste produits)</span>
<textarea
name="shortDescription"
rows={2}
defaultValue={product?.shortDescription}
className={inputClass}
/>
</label>
<label className="block sm:col-span-2">
<span className={labelClass}>Description complète (fiche produit)</span>
<textarea name="description" rows={5} defaultValue={product?.description} className={inputClass} />
</label>
</fieldset>

<fieldset className="grid gap-4 sm:grid-cols-3">
<legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-steel-500">
Catégorie &amp; marque
</legend>
<label className="block">
<span className={labelClass}>Catégorie *</span>
<select name="categorySlug" required defaultValue={product?.categorySlug ?? ""} className={inputClass}>
<option value="" disabled>
Choisir…
</option>
{categories.map((c) => (
<option key={c.slug} value={c.slug}>
{c.name}
</option>
))}
</select>
</label>
<label className="block">
<span className={labelClass}>Marque</span>
<select name="brandSlug" defaultValue={product?.brandSlug ?? ""} className={inputClass}>
<option value="">— Aucune —</option>
{brands.map((b) => (
<option key={b.slug} value={b.slug}>
{b.name}
</option>
))}
</select>
</label>
<label className="block">
<span className={labelClass}>Illustration</span>
<select
name="imageVariant"
defaultValue={product?.images?.[0] ?? "panel-ac-tri"}
className={inputClass}
>
{imageVariants.map((v) => (
<option key={v.value} value={v.value}>
{v.label}
</option>
))}
</select>
</label>
</fieldset>

<fieldset className="grid gap-4 sm:grid-cols-3">
<legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-steel-500">Tarifs (€)</legend>
<label className="block">
<span className={labelClass}>Prix d&apos;achat — usage interne</span>
<input
name="purchasePrice"
type="number"
step="0.01"
min="0"
defaultValue={product ? (product.purchasePriceCents / 100).toFixed(2) : ""}
className={inputClass}
/>
</label>
<label className="block">
<span className={labelClass}>Prix particulier TTC *</span>
<input
name="priceParticulier"
type="number"
step="0.01"
min="0"
required
defaultValue={product ? (product.priceParticulierCents / 100).toFixed(2) : ""}
className={inputClass}
/>
</label>
<label className="block">
<span className={labelClass}>Prix professionnel TTC *</span>
<input
name="pricePro"
type="number"
step="0.01"
min="0"
required
defaultValue={product ? (product.priceProCents / 100).toFixed(2) : ""}
className={inputClass}
/>
</label>
</fieldset>

<fieldset className="grid gap-4 sm:grid-cols-3">
<legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-steel-500">
Caractéristiques techniques
</legend>
<label className="block">
<span className={labelClass}>Phase</span>
<select name="phase" defaultValue={product?.phase ?? ""} className={inputClass}>
<option value="">—</option>
<option value="monophasé">Monophasé</option>
<option value="triphasé">Triphasé</option>
</select>
</label>
<label className="block">
<span className={labelClass}>Puissance (kW)</span>
<input
name="powerKw"
type="number"
step="0.1"
min="0"
defaultValue={product?.powerKw ?? ""}
className={inputClass}
/>
</label>
<label className="block">
<span className={labelClass}>Tension</span>
<input name="voltage" defaultValue={product?.voltage ?? ""} className={inputClass} />
</label>
<label className="block">
<span className={labelClass}>Pôles</span>
<input name="poles" defaultValue={product?.poles ?? ""} className={inputClass} />
</label>
<label className="block">
<span className={labelClass}>Indice de protection (IP)</span>
<input name="ipRating" defaultValue={product?.ipRating ?? ""} className={inputClass} />
</label>
<label className="block">
<span className={labelClass}>Dimensions</span>
<input name="dimensions" defaultValue={product?.dimensions ?? ""} className={inputClass} />
</label>
<label className="block">
<span className={labelClass}>Poids (kg)</span>
<input
name="weightKg"
type="number"
step="0.1"
min="0"
defaultValue={product?.weightKg ?? ""}
className={inputClass}
/>
</label>
</fieldset>

<fieldset className="grid gap-4 sm:grid-cols-2">
<legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-steel-500">
Fiche technique &amp; contenu du coffret
</legend>
<label className="block">
<span className={labelClass}>Caractéristiques (une par ligne : « Libellé: Valeur »)</span>
<textarea
name="specs"
rows={6}
defaultValue={specsToText(product?.specs)}
placeholder={"Puissance maximale: 10 kW\nDegré de protection: IP54"}
className={`${inputClass} font-mono text-xs`}
/>
</label>
<label className="block">
<span className={labelClass}>Contenu du coffret (une ligne par élément : « Qté Libellé »)</span>
<textarea
name="contents"
rows={6}
defaultValue={contentsToText(product?.contents)}
placeholder={"1× Interrupteur-sectionneur AC 4P 40A\n1 Notice de mise en service"}
className={`${inputClass} font-mono text-xs`}
/>
</label>
</fieldset>

<fieldset className="grid gap-4 sm:grid-cols-3">
<legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-steel-500">
Stock &amp; délais
</legend>
<label className="block">
<span className={labelClass}>Stock disponible</span>
<input
name="stockQty"
type="number"
min="0"
defaultValue={product?.stockQty ?? 0}
className={inputClass}
/>
</label>
<label className="block">
<span className={labelClass}>Délai de préparation (jours)</span>
<input
name="leadTimePrepDays"
type="number"
min="0"
defaultValue={product?.leadTimePrepDays ?? 5}
className={inputClass}
/>
</label>
<label className="block">
<span className={labelClass}>Délai d&apos;expédition (jours)</span>
<input
name="leadTimeShipDays"
type="number"
min="0"
defaultValue={product?.leadTimeShipDays ?? 4}
className={inputClass}
/>
</label>
</fieldset>

<fieldset className="grid gap-4 sm:grid-cols-3">
<legend className="mb-1 text-sm font-semibold uppercase tracking-wide text-steel-500">Visibilité</legend>
<label className="block">
<span className={labelClass}>Statut</span>
<select name="status" defaultValue={product?.status ?? "ACTIVE"} className={inputClass}>
<option value="ACTIVE">Actif (visible en boutique)</option>
<option value="DRAFT">Brouillon (masqué)</option>
<option value="RUPTURE">Rupture de stock</option>
</select>
</label>
<label className="mt-6 flex items-center gap-2">
<input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} className="h-4 w-4" />
<span className="text-sm text-ink">Mettre en avant sur la page d&apos;accueil</span>
</label>
<label className="mt-6 flex items-center gap-2">
<input type="checkbox" name="isDemo" defaultChecked={product?.isDemo ?? false} className="h-4 w-4" />
<span className="text-sm text-ink">Produit de démonstration (badge affiché sur le site)</span>
</label>
</fieldset>

<div className="flex items-center gap-3 border-t border-steel-200 pt-6">
<SubmitButton label={submitLabel} />
</div>
</form>
);
}
