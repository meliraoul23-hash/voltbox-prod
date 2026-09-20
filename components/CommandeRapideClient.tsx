"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/cart-store";
import { getApplicablePriceCents } from "@/lib/pricing";

type Row = { ref: string; qty: number };

export default function CommandeRapideClient() {
  const [rows, setRows] = useState<Row[]>([{ ref: "", qty: 1 }]);
  const [message, setMessage] = useState("");
  const { data: session } = useSession();
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  function updateRow(i: number, patch: Partial<Row>) {
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  async function submit() {
    setMessage("");
    let added = 0;
    for (const row of rows) {
      if (!row.ref.trim()) continue;
      const res = await fetch(`/api/products/lookup?ref=${encodeURIComponent(row.ref.trim())}`);
      const data = await res.json();
      if (data.product) {
        const priceCents = getApplicablePriceCents(data.product, session?.user?.role, session?.user?.proDiscountPct ?? 0);
        addItem(
          {
            productId: data.product.id,
            slug: data.product.slug,
            name: data.product.name,
            unitPriceCents: priceCents,
            image: (data.product.images as string[])[0],
          },
          row.qty
        );
        added++;
      }
    }
    if (added > 0) {
      setMessage(`${added} référence(s) ajoutée(s) au panier.`);
      router.push("/panier");
    } else {
      setMessage("Aucune référence trouvée. Vérifiez les références saisies (ex. VB-PVAC-10K-TRI).");
    }
  }

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-2">
          <input
            id={`ref-${i}`}
            type="text"
            placeholder="Référence interne (ex. VB-PVAC-10K-TRI)"
            value={row.ref}
            onChange={(e) => updateRow(i, { ref: e.target.value })}
            className="focus-ring flex-1 rounded-md border border-steel-300 px-3 py-2 text-sm uppercase"
          />
          <input
            id={`qty-${i}`}
            type="number"
            min={1}
            value={row.qty}
            onChange={(e) => updateRow(i, { qty: Number(e.target.value) || 1 })}
            className="focus-ring w-20 rounded-md border border-steel-300 px-3 py-2 text-sm"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setRows((r) => [...r, { ref: "", qty: 1 }])}
        className="text-sm text-volt hover:underline"
      >
        + Ajouter une ligne
      </button>
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={submit}
          className="focus-ring rounded-md bg-volt px-4 py-2.5 text-sm font-semibold text-white hover:bg-volt-600"
        >
          Ajouter au panier
        </button>
        {message && <p className="text-sm text-steel-600">{message}</p>}
      </div>
    </div>
  );
}
