import Link from "next/link";
import PanelArt from "@/components/PanelArt";
import ProductCard from "@/components/ProductCard";
import ComplianceNotice from "@/components/ComplianceNotice";
import DemoBadge from "@/components/DemoBadge";
import { getFeaturedProducts } from "@/lib/data/products";

const whyBlocks = [
  { n: "01", title: "Précâblé", text: "Le tableau arrive câblé et repéré." },
  { n: "02", title: "Gain de temps", text: "Réduisez le temps passé à assembler et câbler vos coffrets." },
  { n: "03", title: "Contrôlé", text: "Chaque tableau est préparé et contrôlé avant expédition." },
  { n: "04", title: "Prêt à poser", text: "Vous recevez un coffret organisé pour faciliter l'installation sur chantier." },
];

export default async function HomePage() {
  const featured = await getFeaturedProducts();

  return (
    <>
      <section className="border-b border-steel-200 bg-white">
        <div className="container-wrap grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <p className="label-eyebrow">Tableaux électriques &amp; photovoltaïques précâblés</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              Votre tableau électrique.
              <br />
              Déjà câblé. Prêt à poser.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-steel-600">
              Des tableaux électriques et photovoltaïques préassemblés pour gagner du temps sur vos chantiers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/tableaux-photovoltaiques"
                className="focus-ring rounded-md bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-ink-700"
              >
                Voir les tableaux
              </Link>
              <Link
                href="/configurateur"
                className="focus-ring rounded-md bg-volt px-5 py-3 text-sm font-semibold text-white hover:bg-volt-600"
              >
                Configurer mon tableau
              </Link>
            </div>
            <div className="mt-6">
              <DemoBadge label="Catalogue de démonstration" />
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-steel-200 bg-steel-50 shadow-panel">
            <PanelArt variant="panel-ac-dc" className="w-full" />
          </div>
        </div>
      </section>

      <section className="bg-ink py-10">
        <div className="container-wrap flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-2xl font-bold leading-tight text-white sm:text-3xl">
            Vous installez.
            <br className="sm:hidden" /> Nous préparons.
          </p>
          <p className="max-w-sm text-sm text-steel-400">
            Moins de câblage sur chantier. Plus de temps pour vos installations.
          </p>
        </div>
      </section>

      <section className="border-b border-steel-200 py-16">
        <div className="container-wrap">
          <p className="label-eyebrow">Notre méthode</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">Pourquoi choisir nos tableaux ?</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyBlocks.map((b) => (
              <div key={b.n} className="rounded-lg border border-steel-200 p-5">
                <p className="font-mono text-xs text-volt">{b.n}</p>
                <p className="mt-2 font-semibold text-ink">{b.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-steel-600">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-steel-200 py-16">
        <div className="container-wrap">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="label-eyebrow">Sélection</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Les tableaux les plus demandés
              </h2>
            </div>
            <Link href="/tableaux-photovoltaiques" className="text-sm font-medium text-volt hover:underline">
              Voir tout le catalogue →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-wrap grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="label-eyebrow">Configurateur</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Composez votre tableau sur mesure
            </h2>
            <p className="mt-4 max-w-md text-steel-600">
              Phase, puissance, onduleur, MPPT, batterie, parafoudre, sectionnement… configurez votre coffret et
              obtenez instantanément la liste des composants, le schéma de principe, le prix estimatif et les délais.
            </p>
            <Link
              href="/configurateur"
              className="focus-ring mt-6 inline-block rounded-md bg-volt px-5 py-3 text-sm font-semibold text-white hover:bg-volt-600"
            >
              Ouvrir le configurateur
            </Link>
            <ComplianceNotice className="mt-6" />
          </div>
          <div className="rounded-xl border border-steel-200 bg-steel-50 p-6">
            <PanelArt variant="panel-batterie" className="w-full" />
          </div>
        </div>
      </section>
    </>
  );
}
