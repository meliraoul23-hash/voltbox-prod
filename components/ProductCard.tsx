"use client";

import Link from "next/link";
import PanelArt from "./PanelArt";
import { centsToEuro } from "@/lib/format";
import { useSession } from "next-auth/react";
import { getApplicablePriceCents } from "@/lib/pricing";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/db/schema";

export default function ProductCard({ product }: { product: Product }) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const discount = session?.user?.proDiscountPct ?? 0;
  const priceCents = getApplicablePriceCents(product, role, discount);
  const addItem = useCartStore((s) => s.addItem);

  const available = product.stockQty > 0 && product.status === "ACTIVE";

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-steel-200 bg-white transition-shadow hover:shadow-panel">
      <Link href={`/produit/${product.slug}`} className="block border-b border-steel-100 bg-steel-50">
        <PanelArt variant={(product.images as string[])[0]} className="aspect-[4/3] w-full" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-mono text-[11px] uppercase tracking-wide text-steel-500">{product.internalRef}</p>
        <Link href={`/produit/${product.slug}`} className="font-semibold leading-snug text-ink hover:text-volt">
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-steel-600">{product.shortDescription}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {product.phase && (
            <span className="rounded border border-steel-200 px-1.5 py-0.5 text-[11px] text-steel-600">
              {product.phase}
            </span>
          )}
          {product.powerKw && (
            <span className="rounded border border-steel-200 px-1.5 py-0.5 text-[11px] text-steel-600">
              {product.powerKw} kW
            </span>
          )}
          {product.ipRating && (
            <span className="rounded border border-steel-200 px-1.5 py-0.5 text-[11px] text-steel-600">
              {product.ipRating}
            </span>
          )}
        </div>
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="font-mono text-lg font-semibold tabular text-ink">{centsToEuro(priceCents)}</p>
            <p className={`text-xs ${available ? "text-ok" : "text-warn"}`}>
              {available ? "En stock" : "Sur commande"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/produit/${product.slug}`}
              className="focus-ring rounded-md border border-ink px-3 py-2 text-xs font-medium text-ink hover:bg-ink hover:text-white"
            >
              Voir
            </Link>
            <button
              type="button"
              onClick={() =>
                addItem({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  unitPriceCents: priceCents,
                  image: (product.images as string[])[0],
                })
              }
              className="focus-ring rounded-md bg-volt px-3 py-2 text-xs font-semibold text-white hover:bg-volt-600"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
