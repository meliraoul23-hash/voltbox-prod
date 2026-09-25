import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCategories, getBrands, getProductById } from "@/lib/data/products";
import { updateProduct } from "@/lib/actions/products";
import ProductForm from "@/components/admin/ProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function EditProductPage({ params }: { params: { id: string } }) {
const session = await getServerSession(authOptions);
if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/compte/connexion");

const [product, categories, brands] = await Promise.all([
getProductById(params.id),
getCategories(),
getBrands(),
]);
if (!product) notFound();

const updateWithId = updateProduct.bind(null, product.id);

return (
<div className="container-wrap py-10">
<Link href="/admin/produits" className="text-sm text-steel-500 hover:text-ink">
← Retour aux produits
</Link>
<div className="mt-3 flex flex-wrap items-start justify-between gap-4">
<div>
<p className="label-eyebrow">Administration</p>
<h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Modifier — {product.name}</h1>
<p className="mt-1 font-mono text-xs text-steel-500">{product.internalRef}</p>
</div>
<DeleteProductButton id={product.id} name={product.name} />
</div>

<ProductForm
action={updateWithId}
categories={categories}
brands={brands}
product={product}
submitLabel="Enregistrer les modifications"
/>
</div>
);
}
