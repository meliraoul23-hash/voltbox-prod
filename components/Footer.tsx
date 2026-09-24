import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const columns = [
  {
    title: "Catalogue",
    links: [
      { href: "/tableaux-photovoltaiques", label: "Tableaux photovoltaïques" },
      { href: "/tableaux-electriques", label: "Tableaux électriques" },
      { href: "/materiel-photovoltaique", label: "Matériel photovoltaïque" },
      { href: "/materiel-electrique", label: "Matériel électrique" },
      { href: "/borne-de-recharge", label: "Borne de recharge" },
    ],
  },
  {
    title: "Outils",
    links: [
      { href: "/configurateur", label: "Configurateur de tableau" },
      { href: "/sur-mesure", label: "Tableau sur mesure" },
      { href: "/devis", label: "Demander un devis" },
      { href: "/compte", label: "Espace installateur" },
    ],
  },
  {
    title: "Informations",
    links: [
      { href: "/a-propos", label: "À propos" },
      { href: "/livraison", label: "Livraison & retrait" },
      { href: "/seo/tableau-photovoltaique-precable-luxembourg", label: "Tableau PV précâblé Luxembourg" },
      { href: "/seo/coffret-photovoltaique-precable", label: "Coffret photovoltaïque précâblé" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-steel-200 bg-ink text-steel-300">
      <div className="container-wrap grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <p className="font-semibold text-white">{siteConfig.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-steel-400">{siteConfig.description}</p>
          <p className="mt-4 font-mono text-xs text-steel-500">{siteConfig.email}</p>
          <p className="font-mono text-xs text-steel-500">{siteConfig.phone}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="label-eyebrow">{col.title}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-steel-400 hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-700">
        <div className="container-wrap flex flex-col gap-3 py-6 text-xs text-steel-500 md:flex-row md:items-center md:justify-between">
          <p>
            {siteConfig.legalName} · {siteConfig.vatNumber} · {siteConfig.rcs}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-steel-500">Paiement sécurisé :</span>
            {["Visa", "Mastercard", "Stripe"].map((m) => (
              <span key={m} className="rounded border border-ink-700 px-2 py-1 font-mono text-[10px] text-steel-300">
                {m}
              </span>
            ))}
          </div>
        </div>
        {siteConfig.isDemo && (
          <div className="container-wrap pb-6 text-xs text-steel-500">
            Catalogue de démonstration — références, caractéristiques et prix sont des exemples à confirmer avant
            mise en production.
          </div>
        )}
      </div>
    </footer>
  );
}
