import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PanelArt from "@/components/PanelArt";
import ProductCard from "@/components/ProductCard";
import AddToCartBar from "@/components/AddToCartBar";
import ComplianceNotice from "@/components/ComplianceNotice";
import DemoBadge from "@/components/DemoBadge";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/data/products";
import { demoDataDisclaimer } from "@/lib/site-config";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const specs = product.specs as { label: string; value: string }[];
  const contents = product.contents as { qty: string; label: string }[];
  const variant = (product.images as string[])[0];

  return (
    <div className="container-wrap py-10">
      <nav className="mb-6 text-xs text-steel-500">
        <Link href="/" className="hover:text-ink">
          Accueil
        </Link>
        {" / "}
        <Link href={`/${product.categorySlug}`} className="hover:text-ink">
          {product.categorySlug.replace(/-/g, " ")}
        </Link>
        {" / "}
        <span className="text-steel-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-xl border border-steel-200 bg-steel-50">
            <PanelArt variant={variant} className="w-full" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {["Vue d'ensemble", "Détail des protections", "Bornier & repérage"].map((caption, i) => (
              <div key={caption} className="overflow-hidden rounded-lg border border-steel-200 bg-steel-50">
                <PanelArt variant={variant} className="aspect-square w-full opacity-90" />
                <p className="border-t border-steel-200 bg-white px-2 py-1 text-center text-[10px] text-steel-500">
                  {caption}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-steel-500">
            Illustrations schématiques du produit (pas des photographies) — les photos réelles remplaceront ces
            schémas avant mise en production.
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center gap-2">
            <DemoBadge />
            {product.brandSlug && (
              <span className="font-mono text-[11px] uppercase tracking-wide text-steel-500">
                {product.brandSlug}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">{product.name}</h1>
          <p className="mt-1 font-mono text-xs text-steel-500">
            Réf. interne {product.internalRef}
            {product.manufacturerRef ? ` · Réf. fabricant ${product.manufacturerRef}` : ""}
          </p>
          <p className="mt-4 leading-relaxed text-steel-700">{product.description}</p>

          <div className="mt-6">
            <AddToCartBar product={product} />
          </div>

          <div className="mt-6 flex flex-col gap-2 text-sm">
            <Link href="/compte/telechargements" className="text-volt hover:underline">
              Télécharger la fiche technique &amp; le schéma (espace installateur) →
            </Link>
            <Link href="/devis" className="text-volt hover:underline">
              Besoin d'une variante ? Demander un devis →
            </Link>
          </div>
        </div>
      </div>

      <section className="mt-14 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold text-ink">Caractéristiques techniques</h2>
          <dl className="mt-4 divide-y divide-steel-200 rounded-lg border border-steel-200">
            {specs.map((s) => (
              <div key={s.label} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <dt className="text-steel-500">{s.label}</dt>
                <dd className="text-right font-medium text-ink">{s.value}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
              <dt className="text-steel-500">Poids</dt>
              <dd className="text-right font-medium text-ink">{product.weightKg} kg</dd>
            </div>
          </dl>
        </div>
        <div>
          <h2 className="text-lg font-bold text-ink">Contenu du coffret</h2>
          <ul className="mt-4 divide-y divide-steel-200 rounded-lg border border-steel-200">
            {contents.map((c, i) => (
              <li key={i} className="flex items-baseline gap-3 px-4 py-3 text-sm">
                <span className="font-mono font-semibold text-volt">{c.qty}</span>
                <span className="text-ink">{c.label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-steel-500">{demoDataDisclaimer}</p>
          <ComplianceNotice className="mt-4" />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-lg font-bold text-ink">Produits associés</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
