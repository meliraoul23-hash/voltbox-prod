"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore, cartCount } from "@/lib/cart-store";
import { siteConfig } from "@/lib/site-config";

const nav = [
  { href: "/tableaux-photovoltaiques", label: "Tableaux PV" },
  { href: "/tableaux-electriques", label: "Tableaux électriques" },
  { href: "/materiel-photovoltaique", label: "Matériel PV" },
  { href: "/materiel-electrique", label: "Matériel électrique" },
  { href: "/borne-de-recharge", label: "Borne de recharge" },
  { href: "/sur-mesure", label: "Sur mesure" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);
  const count = cartCount(items);

  return (
    <header className="sticky top-0 z-40 border-b border-steel-200 bg-white/95 backdrop-blur">
      <div className="border-b border-steel-100 bg-ink">
        <div className="container-wrap flex h-8 items-center justify-between text-[11px] text-steel-300">
          <p className="font-mono tracking-wide">Luxembourg · Belgique · France · Allemagne — Grande Région</p>
          <Link href="/livraison" className="hover:text-white">
            Livraison &amp; retrait
          </Link>
        </div>
      </div>
      <div className="container-wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-ink font-mono text-sm font-bold text-volt">
            V
          </span>
          <span className="font-semibold tracking-tight text-ink">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium hover:text-volt ${
                pathname === item.href ? "text-volt" : "text-steel-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/configurateur"
            className="focus-ring rounded-md bg-volt px-3.5 py-2 text-sm font-semibold text-white hover:bg-volt-600"
          >
            Configurer mon tableau
          </Link>
          <Link
            href={session ? "/compte" : "/compte/connexion"}
            className="focus-ring rounded-md border border-steel-300 px-3 py-2 text-sm font-medium text-ink hover:border-ink"
          >
            {session ? "Mon espace" : "Espace installateur"}
          </Link>
          <Link href="/panier" className="focus-ring relative rounded-md p-2 text-ink hover:text-volt" aria-label="Panier">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 3h2l.4 2M7 13h10l3-7H6.2M7 13 5.4 5H3m4 8-1.6 3H18m-9-3-1.6 3M17 21a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-8 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-volt text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>

        <button
          type="button"
          className="focus-ring rounded-md p-2 text-ink lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-steel-200 bg-white lg:hidden">
          <nav className="container-wrap flex flex-col gap-1 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-steel-700 hover:bg-steel-50"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/configurateur"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-volt px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Configurer mon tableau
            </Link>
            <Link
              href={session ? "/compte" : "/compte/connexion"}
              onClick={() => setOpen(false)}
              className="rounded-md border border-steel-300 px-3 py-2.5 text-center text-sm font-medium text-ink"
            >
              {session ? "Mon espace" : "Espace installateur"}
            </Link>
            <Link
              href="/panier"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2.5 text-center text-sm font-medium text-steel-700"
            >
              Panier {count > 0 ? `(${count})` : ""}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
