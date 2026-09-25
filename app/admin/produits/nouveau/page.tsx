import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCategories, getBrands } from "@/lib/data/products";
import { createProduct } from "@/lib/actions/products";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
const session = await getServerSession(authOptions);
if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/compte/connexion");

const [categories, brands] = await Promise.all([getCategories(), getBrands()]);

return (
<div className="container-wrap py-10">
<Link href="/admin/produits" className="text-sm text-steel-500 hover:text-ink">
← Retour aux produits
</Link>
<p className="label-eyebrow mt-3">Administration</p>
<h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Nouveau produit</h1>
<p className="mt-2 max-w-xl text-sm text-steel-600">
Ce produit sera visible en boutique dès l&apos;enregistrement si le statut est « Actif ».
</p>

<ProductForm action={createProduct} categories={categories} brands={brands} submitLabel="Créer le produit" />
</div>
);
}
