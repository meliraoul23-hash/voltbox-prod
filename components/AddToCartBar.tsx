"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";
import { getApplicablePriceCents } from "@/lib/pricing";
import { centsToEuro } from "@/lib/format";
import type { Product } from "@/lib/db/schema";

export default function AddToCartBar({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { data: session } = useSession();
  const addItem = useCartStore((s) => s.addItem);
  const priceCents = getApplicablePriceCents(product, session?.user?.role, session?.user?.proDiscountPct ?? 0);
  const available = product.stockQty > 0 && product.status === "ACTIVE";

  return (
    <div className="rounded-lg border border-steel-200 bg-white p-5">
      <p className="font-mono text-3xl font-semibold tabular text-ink">{centsToEuro(priceCents)}</p>
      <p className="mt-1 text-sm text-steel-500">
        {session?.user?.role === "PROFESSIONNEL" ? "Tarif professionnel appliqué" : "Prix particulier — TVA en sus au panier"}
      </p>
      <p className={`mt-3 text-sm font-medium ${available ? "text-ok" : "text-warn"}`}>
        {available ? `En stock (${product.stockQty} disponibles)` : "Sur commande"}
      </p>
      <p className="mt-1 text-xs text-steel-500">
        Préparation : {product.leadTimePrepDays} j ouvrés · Livraison estimée : {product.leadTimeShipDays} j
      </p>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center rounded-md border border-steel-300">
          <button
            type="button"
            aria-label="Diminuer la quantité"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="focus-ring px-3 py-2 text-steel-600 hover:text-ink"
          >
            −
          </button>
          <input
            id="quantity"
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-12 border-x border-steel-300 py-2 text-center tabular"
          />
          <button
            type="button"
            aria-label="Augmenter la quantité"
            onClick={() => setQty((q) => q + 1)}
            className="focus-ring px-3 py-2 text-steel-600 hover:text-ink"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            addItem(
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                unitPriceCents: priceCents,
                image: (product.images as string[])[0],
              },
              qty
            );
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
          }}
          className="focus-ring flex-1 rounded-md bg-volt px-4 py-2.5 text-sm font-semibold text-white hover:bg-volt-600"
        >
          {added ? "Ajouté au panier ✓" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}
