"use server";

// Actions serveur pour la gestion du catalogue produits depuis l'espace
// admin (/admin/produits). Reservees au role ADMIN — verifie ici en plus
// de la protection au niveau des pages (app/admin/**), car une action
// serveur reste un point d'entree appelable independamment du rendu de la
// page qui l'expose.
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { euroToCents } from "@/lib/format";

export type ProductFormState = { error?: string };

async function requireAdmin() {
const session = await getServerSession(authOptions);
if (!session?.user || (session.user as any).role !== "ADMIN") {
redirect("/compte/connexion");
}
}

// Retire les accents (diacritiques) d'une chaine normalisee en forme NFD,
// en comparant directement les points de code des marques diacritiques
// combinantes (0x0300 a 0x036f), sans notation d'echappement dans le
// code source.
function stripDiacritics(input: string): string {
return input
.normalize("NFD")
.split("")
.filter((ch) => {
const code = ch.charCodeAt(0);
return code < 0x300 || code > 0x36f;
})
.join("");
}

function slugify(input: string): string {
return stripDiacritics(input.toLowerCase())
.replace(/[^a-z0-9]+/g, "-")
.replace(/(^-+|-+$)/g, "")
.slice(0, 80);
}

function parseLines(raw: string): string[] {
return raw
.split("\n")
.map((l) => l.trim())
.filter(Boolean);
}

// Une ligne par caracteristique, au format "Libelle: Valeur".
function parseSpecs(raw: string): { label: string; value: string }[] {
return parseLines(raw).map((line) => {
const idx = line.indexOf(":");
if (idx === -1) return { label: line, value: "" };
return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
});
}

// Une ligne par element du contenu, au format "Quantite Libelle" (ex. "2x Disjoncteur 20A").
function parseContents(raw: string): { qty: string; label: string }[] {
return parseLines(raw).map((line) => {
const m = line.match(/^(\S+)\s+(.*)$/);
if (!m) return { qty: "1", label: line };
return { qty: m[1], label: m[2] };
});
}

function toFloatOrNull(raw: FormDataEntryValue | null): number | null {
const s = String(raw ?? "").trim().replace(",", ".");
if (!s) return null;
const n = parseFloat(s);
return Number.isFinite(n) ? n : null;
}

function toEuroCents(raw: FormDataEntryValue | null): number {
const s = String(raw ?? "").trim().replace(",", ".");
const n = parseFloat(s);
return euroToCents(Number.isFinite(n) ? n : 0);
}

function toIntOr(raw: FormDataEntryValue | null, fallback: number): number {
const n = parseInt(String(raw ?? ""), 10);
return Number.isFinite(n) ? n : fallback;
}

function buildValues(formData: FormData, slug: string) {
const name = String(formData.get("name") ?? "").trim();
const internalRef = String(formData.get("internalRef") ?? "").trim().toUpperCase();
const imageVariant = String(formData.get("imageVariant") ?? "panel-ac-tri").trim() || "panel-ac-tri";

return {
slug,
name,
shortDescription: String(formData.get("shortDescription") ?? "").trim(),
description: String(formData.get("description") ?? "").trim(),
categorySlug: String(formData.get("categorySlug") ?? "").trim(),
brandSlug: String(formData.get("brandSlug") ?? "").trim() || null,
internalRef,
manufacturerRef: String(formData.get("manufacturerRef") ?? "").trim() || null,
purchasePriceCents: toEuroCents(formData.get("purchasePrice")),
priceParticulierCents: toEuroCents(formData.get("priceParticulier")),
priceProCents: toEuroCents(formData.get("pricePro")),
phase: String(formData.get("phase") ?? "").trim() || null,
powerKw: toFloatOrNull(formData.get("powerKw")),
voltage: String(formData.get("voltage") ?? "").trim() || null,
poles: String(formData.get("poles") ?? "").trim() || null,
ipRating: String(formData.get("ipRating") ?? "").trim() || null,
dimensions: String(formData.get("dimensions") ?? "").trim() || null,
weightKg: toFloatOrNull(formData.get("weightKg")),
specs: parseSpecs(String(formData.get("specs") ?? "")),
contents: parseContents(String(formData.get("contents") ?? "")),
images: [imageVariant],
stockQty: toIntOr(formData.get("stockQty"), 0),
leadTimePrepDays: toIntOr(formData.get("leadTimePrepDays"), 5),
leadTimeShipDays: toIntOr(formData.get("leadTimeShipDays"), 4),
status: String(formData.get("status") ?? "ACTIVE"),
featured: formData.get("featured") === "on",
isDemo: formData.get("isDemo") === "on",
};
}

function isUniqueConstraintError(e: any): boolean {
const code = String(e?.code ?? "");
const message = String(e?.message ?? "");
return code === "23505" || /unique/i.test(message) || /UNIQUE constraint failed/i.test(message);
}

export async function createProduct(_prevState: ProductFormState, formData: FormData): Promise<ProductFormState> {
await requireAdmin();

const name = String(formData.get("name") ?? "").trim();
const internalRef = String(formData.get("internalRef") ?? "").trim();
const categorySlug = String(formData.get("categorySlug") ?? "").trim();
if (!name) return { error: "Le nom du produit est obligatoire." };
if (!internalRef) return { error: "La référence interne est obligatoire." };
if (!categorySlug) return { error: "Choisissez une catégorie." };

const rawSlug = String(formData.get("slug") ?? "").trim();
const slug = slugify(rawSlug || name);
if (!slug) return { error: "Impossible de générer une URL (slug) à partir du nom fourni." };

try {
await db.insert(products).values(buildValues(formData, slug));
} catch (e: any) {
if (isUniqueConstraintError(e)) {
return { error: "Un produit existe déjà avec cette référence interne ou cette URL (slug). Modifiez-la." };
}
return { error: "Erreur lors de l'enregistrement du produit. Veuillez réessayer." };
}

revalidatePath("/admin/produits");
revalidatePath("/");
revalidatePath(`/${categorySlug}`);
revalidatePath("/recherche");
redirect("/admin/produits");
}

export async function updateProduct(
id: string,
_prevState: ProductFormState,
formData: FormData
): Promise<ProductFormState> {
await requireAdmin();

const name = String(formData.get("name") ?? "").trim();
const internalRef = String(formData.get("internalRef") ?? "").trim();
const categorySlug = String(formData.get("categorySlug") ?? "").trim();
if (!name) return { error: "Le nom du produit est obligatoire." };
if (!internalRef) return { error: "La référence interne est obligatoire." };
if (!categorySlug) return { error: "Choisissez une catégorie." };

const rawSlug = String(formData.get("slug") ?? "").trim();
const slug = slugify(rawSlug || name);
if (!slug) return { error: "Impossible de générer une URL (slug) à partir du nom fourni." };

try {
await db
.update(products)
.set({ ...buildValues(formData, slug), updatedAt: new Date() })
.where(eq(products.id, id));
} catch (e: any) {
if (isUniqueConstraintError(e)) {
return { error: "Un autre produit utilise déjà cette référence interne ou cette URL (slug)." };
}
return { error: "Erreur lors de l'enregistrement du produit. Veuillez réessayer." };
}

revalidatePath("/admin/produits");
revalidatePath("/");
revalidatePath(`/produit/${slug}`);
revalidatePath(`/${categorySlug}`);
revalidatePath("/recherche");
redirect("/admin/produits");
}

export async function deleteProduct(id: string) {
await requireAdmin();
await db.delete(products).where(eq(products.id, id));
revalidatePath("/admin/produits");
revalidatePath("/");
revalidatePath("/recherche");
}
