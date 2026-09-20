"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/db/schema";

type Phase = "tous" | "monophasé" | "triphasé";
type Sort = "pertinence" | "prix-asc" | "prix-desc";

export default function CategoryListing({
  products,
  subcategories,
}: {
  products: Product[];
  subcategories?: string[];
}) {
  const [phase, setPhase] = useState<Phase>("tous");
  const [sort, setSort] = useState<Sort>("pertinence");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = products;
    if (phase !== "tous") list = list.filter((p) => p.phase === phase);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q)
      );
    }
    if (sort === "prix-asc") list = [...list].sort((a, b) => a.priceParticulierCents - b.priceParticulierCents);
    if (sort === "prix-desc") list = [...list].sort((a, b) => b.priceParticulierCents - a.priceParticulierCents);
    return list;
  }, [products, phase, sort, query]);

  return (
    <div>
      {subcategories && subcategories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {subcategories.map((s) => (
            <span
              key={s}
              className="rounded-full border border-steel-200 bg-steel-50 px-3 py-1.5 text-xs font-medium text-steel-600"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mb-8 flex flex-col gap-3 rounded-lg border border-steel-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-wide text-steel-500">Filtrer :</span>
          {(["tous", "monophasé", "triphasé"] as Phase[]).map((p) => (
            <button
              key={p}
              onClick={() => setPhase(p)}
              className={`focus-ring rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${
                phase === p ? "border-ink bg-ink text-white" : "border-steel-300 text-steel-600 hover:border-ink"
              }`}
            >
              {p === "tous" ? "Tous" : p}
            </button>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-2 sm:max-w-sm sm:flex-row">
          <input
            id="category-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un produit…"
            className="focus-ring w-full rounded-md border border-steel-300 px-3 py-2 text-sm"
          />
          <select
            id="category-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="focus-ring rounded-md border border-steel-300 px-2 py-2 text-sm"
          >
            <option value="pertinence">Pertinence</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-dashed border-steel-300 p-10 text-center text-steel-500">
          Aucun produit ne correspond à ces critères.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
