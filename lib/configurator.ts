// Logique du configurateur de tableau. Le calcul de prix est une FORMULE
// INDICATIVE DE DEMONSTRATION (voir configuratorDisclaimer) : elle ne
// remplace pas un chiffrage technique et commercial reel.

export type Phase = "monophasé" | "triphasé";
export type ParafoudreType = "aucun" | "type-2" | "type-1-2";
export type Protection = "standard" | "renforcee";
export type Emplacement = "interieur-technique" | "interieur-habitation" | "exterieur-abrite" | "exterieur-expose";
export type Dimensions = "standard" | "sur-mesure";
export type Marque = "norivolt" | "kelvex" | "amperia" | "dynovolt" | "sectra" | "indifferent";

export type ConfiguratorState = {
  phase: Phase;
  installationPowerKw: number;
  inverterPowerKw: number;
  mpptCount: number;
  stringsCount: number;
  hasBattery: boolean;
  batteryPowerKwh: number;
  hasParafoudre: boolean;
  parafoudreType: ParafoudreType;
  sectionnementAc: boolean;
  sectionnementDc: boolean;
  protection: Protection;
  marque: Marque;
  departsCount: number;
  emplacement: Emplacement;
  dimensions: Dimensions;
  dimensionsNote: string;
};

export const defaultConfiguratorState: ConfiguratorState = {
  phase: "triphasé",
  installationPowerKw: 10,
  inverterPowerKw: 10,
  mpptCount: 2,
  stringsCount: 2,
  hasBattery: false,
  batteryPowerKwh: 5,
  hasParafoudre: true,
  parafoudreType: "type-2",
  sectionnementAc: true,
  sectionnementDc: true,
  protection: "standard",
  marque: "indifferent",
  departsCount: 3,
  emplacement: "interieur-technique",
  dimensions: "standard",
  dimensionsNote: "",
};

export const configuratorDisclaimer =
  "Le prix, les composants et les délais affichés sont une estimation générée automatiquement à partir de vos sélections, à titre indicatif. Un chiffrage définitif est confirmé après étude de votre demande.";

const brandLabel: Record<Marque, string> = {
  norivolt: "Norivolt",
  kelvex: "Kelvex",
  amperia: "Amperia",
  dynovolt: "Dynovolt",
  sectra: "Sectra",
  indifferent: "Indifférent (au choix VoltBox)",
};

const brandMultiplier: Record<Marque, number> = {
  norivolt: 1,
  kelvex: 1.06,
  amperia: 1,
  dynovolt: 1.08,
  sectra: 1.03,
  indifferent: 1,
};

export type ConfiguratorResult = {
  components: { qty: string; label: string }[];
  priceParticulierCents: number;
  priceProCents: number;
  leadPrepDays: number;
  leadShipDays: number;
};

export function computeConfiguration(s: ConfiguratorState): ConfiguratorResult {
  const components: { qty: string; label: string }[] = [];

  // --- Composants ---
  components.push({
    qty: "1×",
    label: `Coffret ${s.dimensions === "sur-mesure" ? "sur mesure" : "standard"} — IP54 (${brandLabel[s.marque]})`,
  });

  components.push({
    qty: "1×",
    label: `Interrupteur-sectionneur AC ${s.phase === "triphasé" ? "4P" : "2P"} — calibre selon ${s.installationPowerKw} kW`,
  });

  if (s.sectionnementAc) {
    components.push({ qty: "1×", label: "Sectionnement AC dédié en amont de l'onduleur" });
  }

  if (s.mpptCount > 0) {
    components.push({ qty: `${s.mpptCount}×`, label: "Sectionneur DC porte-fusible (par MPPT)" });
  }
  if (s.stringsCount > 0) {
    components.push({ qty: `${s.stringsCount}×`, label: "Circuit string DC repéré" });
  }
  if (s.sectionnementDc) {
    components.push({ qty: "1×", label: "Sectionnement DC dédié" });
  }

  if (s.hasParafoudre) {
    const label =
      s.parafoudreType === "type-1-2"
        ? "Parafoudre combiné type 1+2"
        : "Parafoudre type 2";
    components.push({ qty: "1×", label: `${label} (AC${s.mpptCount > 0 ? " + DC" : ""})` });
  }

  components.push({ qty: `${s.departsCount}×`, label: "Disjoncteur de départ calibré" });

  if (s.hasBattery) {
    components.push({ qty: "1×", label: `Sectionneur dédié circuit batterie (${s.batteryPowerKwh} kWh)` });
    components.push({ qty: "1×", label: "Disjoncteur de protection batterie" });
  }

  if (s.protection === "renforcee") {
    components.push({ qty: "1×", label: "Protection renforcée — degré IP supérieur et verrouillages additionnels" });
  }

  components.push({ qty: "1×", label: "Bornier de raccordement entièrement repéré" });
  components.push({ qty: "1", label: "Jeu d'étiquettes de repérage + notice de mise en service" });

  // --- Prix (formule indicative) ---
  let base = 25000; // 250,00 EUR
  base += s.phase === "triphasé" ? 12000 : 0;
  base += s.installationPowerKw * 1800;
  base += s.mpptCount * 4000;
  base += s.stringsCount * 1500;
  if (s.hasBattery) base += 18000 + s.batteryPowerKwh * 3500;
  if (s.hasParafoudre) base += s.parafoudreType === "type-1-2" ? 12000 : 7000;
  if (s.sectionnementAc) base += 4000;
  if (s.sectionnementDc) base += 4000;
  if (s.protection === "renforcee") base += 9000;
  base += s.departsCount * 2500;
  if (s.dimensions === "sur-mesure") base += 6000;

  const withBrand = Math.round(base * brandMultiplier[s.marque]);
  const priceProCents = withBrand;
  const priceParticulierCents = Math.round(withBrand * 1.28);

  // --- Délais (jours ouvrés, estimation) ---
  let leadPrepDays = 4;
  if (s.hasBattery) leadPrepDays += 2;
  if (s.dimensions === "sur-mesure") leadPrepDays += 3;
  if (s.departsCount > 6) leadPrepDays += 2;
  if (s.protection === "renforcee") leadPrepDays += 1;

  const leadShipDays = 3; // base Luxembourg, voir page Livraison pour les autres zones

  return { components, priceParticulierCents, priceProCents, leadPrepDays, leadShipDays };
}
