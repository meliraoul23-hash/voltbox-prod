"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ConfiguratorState,
  defaultConfiguratorState,
  computeConfiguration,
  configuratorDisclaimer,
  Marque,
} from "@/lib/configurator";
import ConfiguratorSchema from "./ConfiguratorSchema";
import ComplianceNotice from "./ComplianceNotice";
import { centsToEuro } from "@/lib/format";
import { getApplicablePriceCents } from "@/lib/pricing";

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-steel-500">{hint}</span>}
    </label>
  );
}

const inputCls =
  "focus-ring mt-1.5 w-full rounded-md border border-steel-300 px-3 py-2 text-sm";

export default function ConfiguratorForm() {
  const [s, setS] = useState<ConfiguratorState>(defaultConfiguratorState);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [configName, setConfigName] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const result = useMemo(() => computeConfiguration(s), [s]);
  const displayPriceCents = getApplicablePriceCents(
    { priceParticulierCents: result.priceParticulierCents, priceProCents: result.priceProCents },
    session?.user?.role,
    session?.user?.proDiscountPct ?? 0
  );

  function update<K extends keyof ConfiguratorState>(key: K, value: ConfiguratorState[K]) {
    setS((prev) => ({ ...prev, [key]: value }));
  }

  async function saveConfiguration() {
    if (!session) return;
    setSaveState("saving");
    try {
      const res = await fetch("/api/configurations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: configName || `Configuration du ${new Date().toLocaleDateString("fr-LU")}`, snapshot: s }),
      });
      if (!res.ok) throw new Error();
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function goToQuote() {
    sessionStorage.setItem("voltbox-configurator-snapshot", JSON.stringify({ state: s, result }));
    router.push("/devis?source=configurateur");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr]">
      {/* FORMULAIRE */}
      <div className="space-y-8">
        <fieldset className="space-y-4 rounded-lg border border-steel-200 p-5">
          <legend className="label-eyebrow px-1">Alimentation</legend>
          <Field label="Type d'installation">
            <div className="mt-1.5 flex gap-2">
              {(["monophasé", "triphasé"] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => update("phase", p)}
                  className={`focus-ring flex-1 rounded-md border px-3 py-2 text-sm font-medium capitalize ${
                    s.phase === p ? "border-ink bg-ink text-white" : "border-steel-300 text-steel-600"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Puissance de l'installation (kWc)">
              <input
                id="installationPowerKw"
                type="number"
                min={1}
                max={100}
                className={inputCls}
                value={s.installationPowerKw}
                onChange={(e) => update("installationPowerKw", Number(e.target.value))}
              />
            </Field>
            <Field label="Puissance de l'onduleur (kW)">
              <input
                id="inverterPowerKw"
                type="number"
                min={1}
                max={100}
                className={inputCls}
                value={s.inverterPowerKw}
                onChange={(e) => update("inverterPowerKw", Number(e.target.value))}
              />
            </Field>
            <Field label="Nombre de MPPT">
              <input
                id="mpptCount"
                type="number"
                min={0}
                max={8}
                className={inputCls}
                value={s.mpptCount}
                onChange={(e) => update("mpptCount", Number(e.target.value))}
              />
            </Field>
            <Field label="Nombre de strings">
              <input
                id="stringsCount"
                type="number"
                min={0}
                max={16}
                className={inputCls}
                value={s.stringsCount}
                onChange={(e) => update("stringsCount", Number(e.target.value))}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-lg border border-steel-200 p-5">
          <legend className="label-eyebrow px-1">Stockage</legend>
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input
              id="hasBattery"
              type="checkbox"
              checked={s.hasBattery}
              onChange={(e) => update("hasBattery", e.target.checked)}
              className="h-4 w-4 rounded border-steel-400 text-volt focus:ring-volt"
            />
            Avec batterie
          </label>
          {s.hasBattery && (
            <Field label="Puissance de la batterie (kWh)">
              <input
                id="batteryPowerKwh"
                type="number"
                min={1}
                max={60}
                className={inputCls}
                value={s.batteryPowerKwh}
                onChange={(e) => update("batteryPowerKwh", Number(e.target.value))}
              />
            </Field>
          )}
        </fieldset>

        <fieldset className="space-y-4 rounded-lg border border-steel-200 p-5">
          <legend className="label-eyebrow px-1">Protections &amp; sectionnement</legend>
          <label className="flex items-center gap-2 text-sm font-medium text-ink">
            <input
              id="hasParafoudre"
              type="checkbox"
              checked={s.hasParafoudre}
              onChange={(e) => update("hasParafoudre", e.target.checked)}
              className="h-4 w-4 rounded border-steel-400 text-volt focus:ring-volt"
            />
            Avec parafoudre
          </label>
          {s.hasParafoudre && (
            <Field label="Type de parafoudre">
              <select
                id="parafoudreType"
                className={inputCls}
                value={s.parafoudreType}
                onChange={(e) => update("parafoudreType", e.target.value as ConfiguratorState["parafoudreType"])}
              >
                <option value="type-2">Type 2</option>
                <option value="type-1-2">Type 1+2 (renforcé)</option>
              </select>
            </Field>
          )}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                id="sectionnementAc"
                type="checkbox"
                checked={s.sectionnementAc}
                onChange={(e) => update("sectionnementAc", e.target.checked)}
                className="h-4 w-4 rounded border-steel-400 text-volt focus:ring-volt"
              />
              Sectionnement AC
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                id="sectionnementDc"
                type="checkbox"
                checked={s.sectionnementDc}
                onChange={(e) => update("sectionnementDc", e.target.checked)}
                className="h-4 w-4 rounded border-steel-400 text-volt focus:ring-volt"
              />
              Sectionnement DC
            </label>
          </div>
          <Field label="Type de protection">
            <select
              id="protection"
              className={inputCls}
              value={s.protection}
              onChange={(e) => update("protection", e.target.value as ConfiguratorState["protection"])}
            >
              <option value="standard">Standard</option>
              <option value="renforcee">Renforcée</option>
            </select>
          </Field>
        </fieldset>

        <fieldset className="space-y-4 rounded-lg border border-steel-200 p-5">
          <legend className="label-eyebrow px-1">Configuration &amp; installation</legend>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Marque des composants">
              <select
                id="marque"
                className={inputCls}
                value={s.marque}
                onChange={(e) => update("marque", e.target.value as Marque)}
              >
                <option value="indifferent">Indifférent</option>
                <option value="norivolt">Norivolt</option>
                <option value="kelvex">Kelvex</option>
                <option value="amperia">Amperia</option>
                <option value="dynovolt">Dynovolt</option>
                <option value="sectra">Sectra</option>
              </select>
            </Field>
            <Field label="Nombre de départs">
              <input
                id="departsCount"
                type="number"
                min={1}
                max={20}
                className={inputCls}
                value={s.departsCount}
                onChange={(e) => update("departsCount", Number(e.target.value))}
              />
            </Field>
          </div>
          <Field label="Emplacement du tableau">
            <select
              id="emplacement"
              className={inputCls}
              value={s.emplacement}
              onChange={(e) => update("emplacement", e.target.value as ConfiguratorState["emplacement"])}
            >
              <option value="interieur-technique">Intérieur — local technique</option>
              <option value="interieur-habitation">Intérieur — habitation</option>
              <option value="exterieur-abrite">Extérieur — abrité</option>
              <option value="exterieur-expose">Extérieur — exposé aux intempéries</option>
            </select>
          </Field>
          <Field label="Dimensions souhaitées">
            <div className="mt-1.5 flex gap-2">
              {(["standard", "sur-mesure"] as const).map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => update("dimensions", d)}
                  className={`focus-ring flex-1 rounded-md border px-3 py-2 text-sm font-medium capitalize ${
                    s.dimensions === d ? "border-ink bg-ink text-white" : "border-steel-300 text-steel-600"
                  }`}
                >
                  {d === "standard" ? "Standard" : "Sur mesure"}
                </button>
              ))}
            </div>
          </Field>
          {s.dimensions === "sur-mesure" && (
            <Field label="Précisez les dimensions souhaitées">
              <input
                id="dimensionsNote"
                type="text"
                placeholder="ex. 600 × 400 × 200 mm"
                className={inputCls}
                value={s.dimensionsNote}
                onChange={(e) => update("dimensionsNote", e.target.value)}
              />
            </Field>
          )}
        </fieldset>
      </div>

      {/* RESULTATS PROGRESSIFS */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="space-y-6 rounded-xl border border-steel-200 bg-white p-6 shadow-panel">
          <div>
            <p className="label-eyebrow">1 — Composants nécessaires</p>
            <ul className="mt-3 space-y-1.5">
              {result.components.map((c, i) => (
                <li key={i} className="flex items-baseline gap-2 text-sm">
                  <span className="font-mono font-semibold text-volt">{c.qty}</span>
                  <span className="text-steel-700">{c.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-eyebrow">2 — Schéma de principe</p>
            <div className="mt-3 rounded-lg border border-steel-200 bg-white">
              <ConfiguratorSchema s={s} />
            </div>
          </div>

          <div>
            <p className="label-eyebrow">3 — Caractéristiques</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <dt className="text-steel-500">Phase</dt>
              <dd className="text-right font-medium capitalize text-ink">{s.phase}</dd>
              <dt className="text-steel-500">Emplacement</dt>
              <dd className="text-right font-medium text-ink">
                {s.emplacement.replace("-", " · ").replace("interieur", "intérieur").replace("exterieur", "extérieur")}
              </dd>
              <dt className="text-steel-500">Dimensions</dt>
              <dd className="text-right font-medium text-ink">
                {s.dimensions === "sur-mesure" ? s.dimensionsNote || "Sur mesure (à pre©ciser)" : "Standard"}
              </dd>
            </dl>
          </div>

          <div className="rounded-lg bg-steel-50 p-4">
            <p className="label-eyebrow">4 — Prix estimatif</p>
            <p className="mt-1 font-mono text-3xl font-bold tabular text-ink">{centsToEuro(displayPriceCents)}</p>
            <p className="mt-1 text-xs text-steel-500">
              {session?.user?.role === "PROFESSIONNEL" ? "Tarif professionnel indicatif" : "Tarif particulier indicatif"}, hors
              TVA et livraison.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="label-eyebrow">5 — Préparation</p>
              <p className="mt-1 text-lg font-semibold text-ink">{result.leadPrepDays} j ouvrés</p>
            </div>
            <div>
              <p className="label-eyebrow">6 — Livraison</p>
              <p className="mt-1 text-lg font-semibold text-ink">+{result.leadShipDays} j (Luxembourg)</p>
            </div>
          </div>

          <ComplianceNotice />
          <p className="text-xs text-steel-500">{configuratorDisclaimer}</p>

          {session?.user?.role === "PROFESSIONNEL" && (
            <div className="flex flex-col gap-2 border-t border-steel-200 pt-4">
              <input
                id="configName"
                type="text"
                placeholder="Nom de la configuration (ex. Chantier Mangen)"
                className={inputCls}
                value={configName}
                onChange={(e) => setConfigName(e.target.value)}
              />
              <button
                type="button"
                onClick={saveConfiguration}
                className="focus-ring rounded-md border border-ink px-4 py-2 text-sm font-medium text-ink hover:bg-ink hover:text-white"
              >
                {saveState === "saving"
                  ? "Enregistrement…"
                  : saveState === "saved"
                    ? "Configuration enregistrée ✓"
                    : "Sauvegarder cette configuration"}
              </button>
            </div>
          )}

          <div className="border-t border-steel-200 pt-5 text-center">
            <p className="font-semibold text-ink">Besoin de ce tableau sur mesure ?</p>
            <button
              type="button"
              onClick={goToQuote}
              className="focus-ring mt-3 w-full rounded-md bg-volt px-4 py-3 text-sm font-semibold text-white hover:bg-volt-600"
            >
              Demander un devis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
