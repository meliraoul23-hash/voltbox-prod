import Link from "next/link";
import ProductCard from "./ProductCard";
import ComplianceNotice from "./ComplianceNotice";
import type { Product } from "@/lib/db/schema";

export default function SeoLandingLayout({
  eyebrow,
  h1,
  intro,
  sections,
  products,
  faq,
}: {
  eyebrow: string;
  h1: string;
  intro: string;
  sections: { title: string; body: string }[];
  products: Product[];
  faq: { q: string; a: string }[];
}) {
  return (
    <div>
      <div className="border-b border-steel-200 bg-steel-50">
        <div className="container-wrap py-12">
          <p className="label-eyebrow">{eyebrow}</p>
          <h1 className="mt-2 max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">{h1}</h1>
          <p className="mt-3 max-w-2xl text-steel-600">{intro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/configurateur" className="focus-ring rounded-md bg-volt px-5 py-3 text-sm font-semibold text-white hover:bg-volt-600">
              Configurer mon tableau
            </Link>
            <Link href="/devis" className="focus-ring rounded-md border border-ink px-5 py-3 text-sm font-medium text-ink">
              Demander un devis
            </Link>
          </div>
        </div>
      </div>

      <div className="container-wrap py-10">
        {products.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-ink">Produits correspondants</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        )}

        <div className="mt-14 max-w-3xl space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-bold text-ink">{s.title}</h2>
              <p className="mt-2 leading-relaxed text-steel-700">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 max-w-3xl">
          <h2 className="text-lg font-bold text-ink">Questions fréquentes</h2>
          <div className="mt-4 divide-y divide-steel-200 rounded-lg border border-steel-200">
            {faq.map((f) => (
              <div key={f.q} className="p-4">
                <p className="font-medium text-ink">{f.q}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-steel-600">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <ComplianceNotice className="mt-10 max-w-3xl" />
      </div>
    </div>
  );
}
