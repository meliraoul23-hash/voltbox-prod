"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteProduct } from "@/lib/actions/products";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
const [pending, startTransition] = useTransition();
const router = useRouter();

function onDelete() {
if (!confirm(`Supprimer définitivement « ${name} » ? Cette action est irréversible.`)) return;
startTransition(async () => {
await deleteProduct(id);
router.push("/admin/produits");
});
}

return (
<button
type="button"
onClick={onDelete}
disabled={pending}
className="focus-ring shrink-0 rounded-md border border-warn px-3 py-2 text-xs font-medium text-warn hover:bg-warn hover:text-white disabled:opacity-60"
>
{pending ? "Suppression…" : "Supprimer le produit"}
</button>
);
}
