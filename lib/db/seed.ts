// Jeu de donnees de DEMONSTRATION. Toutes les references, caracteristiques,
// marques, prix et delais ci-dessous sont des exemples destines a montrer le
// fonctionnement du site - a remplacer par vos donnees reelles avant mise en
// production. Voir demoDataDisclaimer dans lib/site-config.ts.
import { db } from "./index";
import { users, categories, brands, suppliers, products, promoCodes } from "./schema";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Nettoyage des tables de demonstration...");
  await db.delete(products);
  await db.delete(categories);
  await db.delete(brands);
  await db.delete(suppliers);
  await db.delete(users);
  await db.delete(promoCodes);

  console.log("Categories...");
  const categoryList = [
    { slug: "tableaux-photovoltaiques", name: "Tableaux photovoltaïques", order: 1, description: "Coffrets AC, DC, AC/DC, mono et triphasés, précâblés pour installations solaires." },
    { slug: "tableaux-electriques", name: "Tableaux électriques", order: 2, description: "Tableaux résidentiels et tertiaires préassemblés, coffrets industriels." },
    { slug: "materiel-photovoltaique", name: "Matériel photovoltaïque", order: 3, description: "Onduleurs, optimiseurs, protections DC/AC, parafoudres, connecteurs et câbles solaires." },
    { slug: "materiel-electrique", name: "Matériel électrique", order: 4, description: "Disjoncteurs, différentiels, contacteurs, borniers, câbles et accessoires de câblage." },
    { slug: "borne-de-recharge", name: "Borne de recharge", order: 5, description: "Tableaux pré-équipés, protections et accessoires pour bornes de recharge véhicules électriques." },
  ];
  for (const c of categoryList) await db.insert(categories).values(c);

  console.log("Marques (illustratives)...");
  const brandList = [
    { slug: "norivolt", name: "Norivolt" },
    { slug: "kelvex", name: "Kelvex" },
    { slug: "amperia", name: "Amperia" },
    { slug: "dynovolt", name: "Dynovolt" },
    { slug: "sectra", name: "Sectra" },
  ];
  for (const b of brandList) await db.insert(brands).values(b);

  console.log("Fournisseurs (usage interne)...");
  const supplierList = [
    { id: "sup-1", name: "Distributeur Grande Région A", contact: "commandes@exemple-fournisseur-a.eu", country: "LU" },
    { id: "sup-2", name: "Grossiste composants BT B", contact: "ventes@exemple-fournisseur-b.eu", country: "BE" },
  ];
  for (const s of supplierList) await db.insert(suppliers).values(s);

  console.log("Produits de démonstration...");

  type SeedProduct = {
    slug: string;
    name: string;
    shortDescription: string;
    description: string;
    categorySlug: string;
    brandSlug: string;
    internalRef: string;
    manufacturerRef: string;
    purchasePriceCents: number;
    priceParticulierCents: number;
    priceProCents: number;
    phase: string | null;
    powerKw: number | null;
    voltage: string | null;
    poles: string | null;
    ipRating: string;
    dimensions: string;
    weightKg: number;
    specs: { label: string; value: string }[];
    contents: { qty: string; label: string }[];
    images: string[];
    stockQty: number;
    leadTimePrepDays: number;
    leadTimeShipDays: number;
    featured: boolean;
  };

  const items: SeedProduct[] = [
    {
      slug: "coffret-pv-ac-triphase-10kw",
      name: "Coffret photovoltaïque AC triphasé 10 kW",
      shortDescription: "Coffret de protection AC précâblé pour installation PV triphasée jusqu'à 10 kW.",
      description:
        "Coffret AC précâblé et repéré, dimensionné pour une installation photovoltaïque triphasée jusqu'à 10 kW en sortie d'onduleur. Sectionnement, protections par départ et parafoudre type 2 intégrés. Livré testé, étiqueté et prêt à raccorder sur chantier.",
      categorySlug: "tableaux-photovoltaiques",
      brandSlug: "norivolt",
      internalRef: "VB-PVAC-10K-TRI",
      manufacturerRef: "NRV-AC3P-10K (exemple)",
      purchasePriceCents: 39000,
      priceParticulierCents: 89000,
      priceProCents: 69000,
      phase: "triphasé",
      powerKw: 10,
      voltage: "400V AC",
      poles: "4P",
      ipRating: "IP54",
      dimensions: "400 × 300 × 150 mm",
      weightKg: 6.2,
      specs: [
        { label: "Puissance maximale", value: "10 kW" },
        { label: "Type de courant", value: "AC - triphasé" },
        { label: "Tension", value: "400V AC (3P+N)" },
        { label: "Nombre de pôles", value: "4P" },
        { label: "Degré de protection", value: "IP54" },
        { label: "Sectionnement", value: "Interrupteur-sectionneur AC intégré" },
        { label: "Parafoudre", value: "Type 2, Imax 40kA" },
        { label: "Dimensions", value: "400 × 300 × 150 mm" },
        { label: "Poids", value: "6,2 kg" },
      ],
      contents: [
        { qty: "1×", label: "Interrupteur-sectionneur AC 4P 40A" },
        { qty: "1×", label: "Parafoudre type 2 triphasé" },
        { qty: "3×", label: "Disjoncteur de protection départ AC 20A courbe C" },
        { qty: "1×", label: "Bornier de raccordement repéré" },
        { qty: "1×", label: "Peigne de répartition" },
        { qty: "1", label: "Jeu d'étiquettes de repérage réglementaires" },
        { qty: "1", label: "Notice de mise en service" },
      ],
      images: ["panel-ac-tri"],
      stockQty: 14,
      leadTimePrepDays: 4,
      leadTimeShipDays: 3,
      featured: true,
    },
    {
      slug: "coffret-pv-dc-2mppt",
      name: "Coffret photovoltaïque DC 2 MPPT",
      shortDescription: "Coffret DC précâblé pour onduleur 2 MPPT, sectionnement et protections par string.",
      description:
        "Coffret de sectionnement et protection DC précâblé pour onduleur à 2 MPPT. Sectionneurs DC et parafoudre type 2 DC intégrés, connectique repérée par string, prêt à raccorder aux panneaux et à l'onduleur.",
      categorySlug: "tableaux-photovoltaiques",
      brandSlug: "sectra",
      internalRef: "VB-PVDC-2MPPT",
      manufacturerRef: "SCT-DC2M (exemple)",
      purchasePriceCents: 28000,
      priceParticulierCents: 65000,
      priceProCents: 49000,
      phase: null,
      powerKw: null,
      voltage: "1000V DC max",
      poles: "2P",
      ipRating: "IP65",
      dimensions: "300 × 250 × 120 mm",
      weightKg: 3.8,
      specs: [
        { label: "Nombre de MPPT", value: "2" },
        { label: "Nombre de strings", value: "Jusqu'à 4 (2 par MPPT)" },
        { label: "Tension max.", value: "1000V DC" },
        { label: "Degré de protection", value: "IP65" },
        { label: "Sectionnement DC", value: "Sectionneur DC par MPPT" },
        { label: "Parafoudre DC", value: "Type 2, Imax 40kA" },
        { label: "Connectique", value: "Connecteurs solaires type MC4 (exemple)" },
        { label: "Dimensions", value: "300 × 250 × 120 mm" },
      ],
      contents: [
        { qty: "2×", label: "Sectionneur DC porte-fusible" },
        { qty: "1×", label: "Parafoudre DC type 2" },
        { qty: "4×", label: "Fusible DC gPV calibré" },
        { qty: "1×", label: "Bornier DC repéré par string" },
        { qty: "1", label: "Jeu d'étiquettes danger DC" },
        { qty: "1", label: "Notice de mise en service" },
      ],
      images: ["panel-dc"],
      stockQty: 21,
      leadTimePrepDays: 3,
      leadTimeShipDays: 3,
      featured: true,
    },
    {
      slug: "coffret-pv-ac-dc-triphase-15kw",
      name: "Coffret photovoltaïque AC/DC triphasé 15 kW",
      shortDescription: "Coffret combiné AC + DC précâblé pour installation triphasée jusqu'à 15 kW.",
      description:
        "Coffret combiné réunissant les protections AC et DC dans un seul boîtier précâblé, pour installation photovoltaïque triphasée jusqu'à 15 kW. Compartiments séparés AC/DC, sectionnement des deux côtés, parafoudres AC et DC intégrés.",
      categorySlug: "tableaux-photovoltaiques",
      brandSlug: "norivolt",
      internalRef: "VB-PVACDC-15K-TRI",
      manufacturerRef: "NRV-ACDC3P-15K (exemple)",
      purchasePriceCents: 62000,
      priceParticulierCents: 139000,
      priceProCents: 109000,
      phase: "triphasé",
      powerKw: 15,
      voltage: "400V AC / 1000V DC",
      poles: "4P (AC) + 2P (DC)",
      ipRating: "IP54",
      dimensions: "600 × 400 × 200 mm",
      weightKg: 11.5,
      specs: [
        { label: "Puissance maximale", value: "15 kW" },
        { label: "Type de courant", value: "AC + DC (compartiments séparés)" },
        { label: "Tension AC", value: "400V (3P+N)" },
        { label: "Tension DC max.", value: "1000V" },
        { label: "Nombre de MPPT pris en charge", value: "Jusqu'à 3" },
        { label: "Degré de protection", value: "IP54" },
        { label: "Parafoudre", value: "Type 2 AC + Type 2 DC" },
        { label: "Dimensions", value: "600 × 400 × 200 mm" },
      ],
      contents: [
        { qty: "1×", label: "Interrupteur-sectionneur AC 4P 40A" },
        { qty: "3×", label: "Sectionneur DC porte-fusible" },
        { qty: "1×", label: "Parafoudre AC type 2" },
        { qty: "1×", label: "Parafoudre DC type 2" },
        { qty: "3×", label: "Disjoncteur départ AC 20A" },
        { qty: "1×", label: "Bornier AC + bornier DC repérés" },
        { qty: "1", label: "Notice de mise en service" },
      ],
      images: ["panel-ac-dc"],
      stockQty: 7,
      leadTimePrepDays: 6,
      leadTimeShipDays: 4,
      featured: true,
    },
    {
      slug: "coffret-pv-ac-monophase-6kw",
      name: "Coffret photovoltaïque AC monophasé 6 kW",
      shortDescription: "Coffret AC précâblé pour installation PV monophasée jusqu'à 6 kW.",
      description:
        "Coffret AC précâblé et repéré pour installation photovoltaïque monophasée jusqu'à 6 kW en sortie d'onduleur. Compact, sectionnement et protection intégrés.",
      categorySlug: "tableaux-photovoltaiques",
      brandSlug: "norivolt",
      internalRef: "VB-PVAC-6K-MONO",
      manufacturerRef: "NRV-AC1P-6K (exemple)",
      purchasePriceCents: 24000,
      priceParticulierCents: 59000,
      priceProCents: 46000,
      phase: "monophasé",
      powerKw: 6,
      voltage: "230V AC",
      poles: "2P",
      ipRating: "IP54",
      dimensions: "300 × 250 × 120 mm",
      weightKg: 3.1,
      specs: [
        { label: "Puissance maximale", value: "6 kW" },
        { label: "Type de courant", value: "AC - monophasé" },
        { label: "Tension", value: "230V AC" },
        { label: "Degré de protection", value: "IP54" },
        { label: "Sectionnement", value: "Interrupteur-sectionneur AC intégré" },
        { label: "Parafoudre", value: "Type 2, Imax 20kA" },
        { label: "Dimensions", value: "300 × 250 × 120 mm" },
      ],
      contents: [
        { qty: "1×", label: "Interrupteur-sectionneur AC 2P 25A" },
        { qty: "1×", label: "Parafoudre type 2 monophasé" },
        { qty: "2×", label: "Disjoncteur de protection départ AC 16A" },
        { qty: "1×", label: "Bornier de raccordement repéré" },
        { qty: "1", label: "Notice de mise en service" },
      ],
      images: ["panel-ac-mono"],
      stockQty: 18,
      leadTimePrepDays: 3,
      leadTimeShipDays: 3,
      featured: false,
    },
    {
      slug: "coffret-pv-parafoudre-type2",
      name: "Coffret photovoltaïque avec parafoudre type 2 intégré",
      shortDescription: "Coffret AC/DC avec protection parafoudre renforcée type 2, pour sites sensibles à la foudre.",
      description:
        "Coffret précâblé avec protection parafoudre type 2 renforcée côté AC et DC, recommandé pour les installations en zone kéraunique élevée ou les toitures exposées. Sectionnement complet inclus.",
      categorySlug: "tableaux-photovoltaiques",
      brandSlug: "sectra",
      internalRef: "VB-PV-PARAF-T2",
      manufacturerRef: "SCT-SPD2-COMBO (exemple)",
      purchasePriceCents: 31000,
      priceParticulierCents: 72000,
      priceProCents: 56000,
      phase: "triphasé",
      powerKw: 12,
      voltage: "400V AC / 1000V DC",
      poles: "4P (AC) + 2P (DC)",
      ipRating: "IP55",
      dimensions: "400 × 300 × 150 mm",
      weightKg: 6.8,
      specs: [
        { label: "Type de protection", value: "Parafoudre type 2 renforcé AC + DC" },
        { label: "Courant de décharge nominal", value: "40 kA (exemple)" },
        { label: "Tension AC", value: "400V (3P+N)" },
        { label: "Tension DC max.", value: "1000V" },
        { label: "Degré de protection", value: "IP55" },
        { label: "Dimensions", value: "400 × 300 × 150 mm" },
      ],
      contents: [
        { qty: "1×", label: "Parafoudre AC type 2" },
        { qty: "1×", label: "Parafoudre DC type 2" },
        { qty: "1×", label: "Interrupteur-sectionneur AC" },
        { qty: "2×", label: "Sectionneur DC porte-fusible" },
        { qty: "1×", label: "Bornier repéré" },
        { qty: "1", label: "Notice de mise en service" },
      ],
      images: ["panel-parafoudre"],
      stockQty: 9,
      leadTimePrepDays: 5,
      leadTimeShipDays: 3,
      featured: false,
    },
    {
      slug: "coffret-pv-batterie",
      name: "Coffret photovoltaïque pré-équipé pour batterie 5-15 kWh",
      shortDescription: "Coffret précâblé pour installations PV avec stockage batterie, de 5 à 15 kWh.",
      description:
        "Coffret précâblé pré-équipé pour intégrer un système de stockage par batterie (5 à 15 kWh) en complément d'une installation photovoltaïque. Protections dédiées côté batterie, sectionnement et repérage spécifique.",
      categorySlug: "tableaux-photovoltaiques",
      brandSlug: "dynovolt",
      internalRef: "VB-PV-BATT-5-15",
      manufacturerRef: "DYV-BESS-M (exemple)",
      purchasePriceCents: 42000,
      priceParticulierCents: 98000,
      priceProCents: 78000,
      phase: "triphasé",
      powerKw: 10,
      voltage: "400V AC / batterie basse tension",
      poles: "4P",
      ipRating: "IP54",
      dimensions: "500 × 350 × 180 mm",
      weightKg: 9.4,
      specs: [
        { label: "Capacité batterie prise en charge", value: "5 à 15 kWh" },
        { label: "Type de courant", value: "AC + circuit batterie dédié" },
        { label: "Sectionnement batterie", value: "Sectionneur dédié avec verrouillage" },
        { label: "Protection batterie", value: "Disjoncteur DC calibré batterie" },
        { label: "Degré de protection", value: "IP54" },
        { label: "Dimensions", value: "500 × 350 × 180 mm" },
      ],
      contents: [
        { qty: "1×", label: "Sectionneur dédié circuit batterie" },
        { qty: "1×", label: "Disjoncteur DC protection batterie" },
        { qty: "1×", label: "Interrupteur-sectionneur AC" },
        { qty: "1×", label: "Parafoudre type 2" },
        { qty: "1×", label: "Bornier repéré circuit batterie" },
        { qty: "1", label: "Notice de mise en service" },
      ],
      images: ["panel-batterie"],
      stockQty: 5,
      leadTimePrepDays: 7,
      leadTimeShipDays: 4,
      featured: true,
    },
    {
      slug: "coffret-pv-onduleur-triphase",
      name: "Coffret pour onduleur triphasé (jusqu'à 20 kW)",
      shortDescription: "Coffret de raccordement précâblé pour onduleur triphasé jusqu'à 20 kW.",
      description:
        "Coffret dédié au raccordement d'un onduleur photovoltaïque triphasé de forte puissance (jusqu'à 20 kW), avec sectionnement, protections calibrées et repérage adapté aux onduleurs multi-MPPT.",
      categorySlug: "tableaux-photovoltaiques",
      brandSlug: "kelvex",
      internalRef: "VB-PV-OND-TRI-20K",
      manufacturerRef: "KLV-INV3P-20K (exemple)",
      purchasePriceCents: 35000,
      priceParticulierCents: 82000,
      priceProCents: 64000,
      phase: "triphasé",
      powerKw: 20,
      voltage: "400V AC",
      poles: "4P",
      ipRating: "IP54",
      dimensions: "450 × 350 × 160 mm",
      weightKg: 7.6,
      specs: [
        { label: "Puissance onduleur max.", value: "20 kW" },
        { label: "Type de courant", value: "AC - triphasé" },
        { label: "Tension", value: "400V AC (3P+N)" },
        { label: "Degré de protection", value: "IP54" },
        { label: "Dimensions", value: "450 × 350 × 160 mm" },
      ],
      contents: [
        { qty: "1×", label: "Interrupteur-sectionneur AC 4P 63A" },
        { qty: "1×", label: "Parafoudre type 2" },
        { qty: "1×", label: "Disjoncteur de protection calibré onduleur" },
        { qty: "1×", label: "Bornier repéré" },
        { qty: "1", label: "Notice de mise en service" },
      ],
      images: ["panel-onduleur"],
      stockQty: 6,
      leadTimePrepDays: 5,
      leadTimeShipDays: 4,
      featured: false,
    },
    {
      slug: "tableau-residentiel-preequipe-3r",
      name: "Tableau électrique résidentiel préassemblé (3 rangées)",
      shortDescription: "Tableau électrique résidentiel précâblé, 3 rangées, circuits repérés selon distribution standard.",
      description:
        "Tableau électrique résidentiel préassemblé sur 3 rangées, précâblé et repéré selon une distribution de circuits standard (éclairage, prises, gros électroménager). Livré avec disjoncteur de branchement et interrupteur différentiel par rangée.",
      categorySlug: "tableaux-electriques",
      brandSlug: "amperia",
      internalRef: "VB-TE-RES-3R",
      manufacturerRef: "AMP-RES3R (exemple)",
      purchasePriceCents: 16000,
      priceParticulierCents: 42000,
      priceProCents: 32000,
      phase: "monophasé",
      powerKw: null,
      voltage: "230V AC",
      poles: "2P",
      ipRating: "IP40",
      dimensions: "3 rangées 13 modules",
      weightKg: 5.5,
      specs: [
        { label: "Nombre de rangées", value: "3" },
        { label: "Modules par rangée", value: "13" },
        { label: "Différentiels", value: "1 par rangée, 30mA" },
        { label: "Degré de protection", value: "IP40" },
        { label: "Usage", value: "Résidentiel" },
      ],
      contents: [
        { qty: "3×", label: "Interrupteur différentiel 40A 30mA" },
        { qty: "12×", label: "Disjoncteurs divisionnaires calibrés (mix 10/16/20/32A)" },
        { qty: "1×", label: "Peigne d'alimentation par rangée" },
        { qty: "1", label: "Schéma de distribution et étiquettes" },
      ],
      images: ["panel-residentiel"],
      stockQty: 25,
      leadTimePrepDays: 3,
      leadTimeShipDays: 2,
      featured: true,
    },
    {
      slug: "tableau-tertiaire-preequipe-4r",
      name: "Tableau électrique tertiaire préassemblé (4 rangées)",
      shortDescription: "Tableau électrique tertiaire précâblé, 4 rangées, adapté aux locaux professionnels.",
      description:
        "Tableau électrique tertiaire préassemblé sur 4 rangées, dimensionné pour locaux professionnels (bureaux, commerces). Circuits repérés, différentiels par usage, réserve de modules pour évolutions futures.",
      categorySlug: "tableaux-electriques",
      brandSlug: "amperia",
      internalRef: "VB-TE-TER-4R",
      manufacturerRef: "AMP-TER4R (exemple)",
      purchasePriceCents: 29000,
      priceParticulierCents: 78000,
      priceProCents: 61000,
      phase: "triphasé",
      powerKw: null,
      voltage: "400V AC",
      poles: "4P",
      ipRating: "IP40",
      dimensions: "4 rangées 24 modules",
      weightKg: 9.1,
      specs: [
        { label: "Nombre de rangées", value: "4" },
        { label: "Modules par rangée", value: "24" },
        { label: "Alimentation", value: "Triphasée 400V" },
        { label: "Degré de protection", value: "IP40" },
        { label: "Usage", value: "Tertiaire" },
      ],
      contents: [
        { qty: "4×", label: "Interrupteur différentiel 40A 30mA" },
        { qty: "16×", label: "Disjoncteurs divisionnaires calibrés" },
        { qty: "1×", label: "Répartiteur triphasé" },
        { qty: "1", label: "Schéma de distribution et étiquettes" },
      ],
      images: ["panel-tertiaire"],
      stockQty: 8,
      leadTimePrepDays: 5,
      leadTimeShipDays: 3,
      featured: false,
    },
    {
      slug: "coffret-industriel-ip65",
      name: "Coffret industriel préassemblé IP65",
      shortDescription: "Coffret industriel étanche IP65, précâblé selon cahier des charges, pour environnements exigeants.",
      description:
        "Coffret industriel préassemblé en enveloppe IP65, destiné aux environnements humides, poussiéreux ou extérieurs. Câblage et repérage sur mesure selon cahier des charges du projet.",
      categorySlug: "tableaux-electriques",
      brandSlug: "amperia",
      internalRef: "VB-TE-IND-IP65",
      manufacturerRef: "AMP-IND65 (exemple)",
      purchasePriceCents: 38000,
      priceParticulierCents: 95000,
      priceProCents: 74000,
      phase: "triphasé",
      powerKw: null,
      voltage: "400V AC",
      poles: "4P",
      ipRating: "IP65",
      dimensions: "500 × 400 × 200 mm",
      weightKg: 12.3,
      specs: [
        { label: "Degré de protection", value: "IP65" },
        { label: "Alimentation", value: "Triphasée 400V" },
        { label: "Matériau enveloppe", value: "Polyester renforcé (exemple)" },
        { label: "Usage", value: "Industriel / extérieur" },
      ],
      contents: [
        { qty: "1×", label: "Interrupteur-sectionneur général" },
        { qty: "6×", label: "Disjoncteurs de protection selon cahier des charges" },
        { qty: "1×", label: "Presse-étoupes IP65" },
        { qty: "1", label: "Schéma de câblage" },
      ],
      images: ["panel-industriel"],
      stockQty: 4,
      leadTimePrepDays: 8,
      leadTimeShipDays: 4,
      featured: false,
    },
    {
      slug: "onduleur-triphase-10kw",
      name: "Onduleur triphasé 10 kW",
      shortDescription: "Onduleur photovoltaïque triphasé 10 kW, 2 MPPT (référence de démonstration).",
      description:
        "Onduleur photovoltaïque triphasé de 10 kW à 2 MPPT, proposé en complément des coffrets AC/DC précâblés. Référence de démonstration illustrant l'intégration du matériel individuel au catalogue.",
      categorySlug: "materiel-photovoltaique",
      brandSlug: "kelvex",
      internalRef: "VB-OND-TRI-10K",
      manufacturerRef: "KLV-STR10-3P (exemple)",
      purchasePriceCents: 72000,
      priceParticulierCents: 145000,
      priceProCents: 119000,
      phase: "triphasé",
      powerKw: 10,
      voltage: "400V AC",
      poles: "4P",
      ipRating: "IP65",
      dimensions: "450 × 500 × 180 mm",
      weightKg: 18,
      specs: [
        { label: "Puissance nominale", value: "10 kW" },
        { label: "Nombre de MPPT", value: "2" },
        { label: "Rendement max.", value: "98,3 % (exemple)" },
        { label: "Degré de protection", value: "IP65" },
        { label: "Communication", value: "Wi-Fi / Ethernet (exemple)" },
      ],
      contents: [
        { qty: "1×", label: "Onduleur triphasé 10kW" },
        { qty: "1×", label: "Kit de fixation murale" },
        { qty: "1", label: "Notice de mise en service" },
      ],
      images: ["inverter"],
      stockQty: 10,
      leadTimePrepDays: 2,
      leadTimeShipDays: 3,
      featured: false,
    },
    {
      slug: "optimiseurs-lot10",
      name: "Optimiseurs de puissance (lot de 10)",
      shortDescription: "Lot de 10 optimiseurs de puissance pour panneaux photovoltaïques (référence de démonstration).",
      description: "Lot de 10 optimiseurs de puissance compatibles avec la majorité des onduleurs du marché, pour maximiser la production en cas d'ombrage partiel.",
      categorySlug: "materiel-photovoltaique",
      brandSlug: "kelvex",
      internalRef: "VB-OPT-LOT10",
      manufacturerRef: "KLV-OPT-M (exemple)",
      purchasePriceCents: 18000,
      priceParticulierCents: 39000,
      priceProCents: 31000,
      phase: null,
      powerKw: null,
      voltage: "1000V DC max",
      poles: null,
      ipRating: "IP68",
      dimensions: "125 × 105 × 25 mm (unitaire)",
      weightKg: 3.2,
      specs: [
        { label: "Quantité", value: "Lot de 10" },
        { label: "Puissance max. par optimiseur", value: "600W (exemple)" },
        { label: "Degré de protection", value: "IP68" },
      ],
      contents: [
        { qty: "10×", label: "Optimiseur de puissance" },
        { qty: "10×", label: "Kit de fixation panneau" },
      ],
      images: ["optimizer"],
      stockQty: 40,
      leadTimePrepDays: 2,
      leadTimeShipDays: 3,
      featured: false,
    },
    {
      slug: "disjoncteur-differentiel-40a",
      name: "Interrupteur différentiel 40A 30mA (lot de 5)",
      shortDescription: "Lot de 5 interrupteurs différentiels 40A 30mA type AC (référence de démonstration).",
      description: "Lot de 5 interrupteurs différentiels 40A 30mA type AC, utilisés dans l'assemblage des tableaux électriques résidentiels et tertiaires du catalogue.",
      categorySlug: "materiel-electrique",
      brandSlug: "norivolt",
      internalRef: "VB-DIFF-40A-30MA-L5",
      manufacturerRef: "NRV-ID40-30 (exemple)",
      purchasePriceCents: 6000,
      priceParticulierCents: 14500,
      priceProCents: 11000,
      phase: null,
      powerKw: null,
      voltage: "230/400V AC",
      poles: "2P/4P (exemple)",
      ipRating: "IP20",
      dimensions: "Modulaire (2 à 4 modules)",
      weightKg: 1.1,
      specs: [
        { label: "Calibre", value: "40A" },
        { label: "Sensibilité", value: "30mA" },
        { label: "Type", value: "AC" },
        { label: "Quantité", value: "Lot de 5" },
      ],
      contents: [{ qty: "5×", label: "Interrupteur différentiel 40A 30mA" }],
      images: ["breaker"],
      stockQty: 60,
      leadTimePrepDays: 1,
      leadTimeShipDays: 2,
      featured: false,
    },
    {
      slug: "tableau-borne-recharge-22kw",
      name: "Tableau pré-équipé pour borne de recharge 22 kW",
      shortDescription: "Tableau précâblé dédié à l'alimentation d'une borne de recharge triphasée jusqu'à 22 kW.",
      description:
        "Tableau précâblé dédié à l'alimentation électrique d'une borne de recharge pour véhicule électrique, triphasée jusqu'à 22 kW. Protection différentielle de type B recommandée, sectionnement et repérage spécifiques bornes de recharge.",
      categorySlug: "borne-de-recharge",
      brandSlug: "amperia",
      internalRef: "VB-BORNE-22K-TRI",
      manufacturerRef: "AMP-EVSE22 (exemple)",
      purchasePriceCents: 24000,
      priceParticulierCents: 54000,
      priceProCents: 42000,
      phase: "triphasé",
      powerKw: 22,
      voltage: "400V AC",
      poles: "4P",
      ipRating: "IP54",
      dimensions: "300 × 250 × 130 mm",
      weightKg: 4.5,
      specs: [
        { label: "Puissance max. borne", value: "22 kW" },
        { label: "Type de courant", value: "AC - triphasé" },
        { label: "Différentiel recommandé", value: "Type B (à valider selon borne)" },
        { label: "Degré de protection", value: "IP54" },
        { label: "Dimensions", value: "300 × 250 × 130 mm" },
      ],
      contents: [
        { qty: "1×", label: "Interrupteur-sectionneur AC 4P" },
        { qty: "1×", label: "Disjoncteur de protection calibré borne" },
        { qty: "1×", label: "Emplacement réservé différentiel type B" },
        { qty: "1×", label: "Bornier repéré" },
        { qty: "1", label: "Notice de mise en service" },
      ],
      images: ["panel-borne"],
      stockQty: 12,
      leadTimePrepDays: 4,
      leadTimeShipDays: 3,
      featured: true,
    },
  ];

  for (const item of items) {
    await db.insert(products)
      .values({ ...item, status: "ACTIVE", isDemo: true })
      ;
  }

  console.log("Comptes de démonstration...");
  const passwordHash = await bcrypt.hash("Demo1234!", 10);

  await db.insert(users)
    .values({
      id: "user-demo-particulier",
      email: "particulier@voltbox-demo.lu",
      passwordHash,
      role: "PARTICULIER",
      name: "Compte particulier (démo)",
      country: "LU",
    })
    ;

  await db.insert(users)
    .values({
      id: "user-demo-pro",
      email: "pro@voltbox-demo.lu",
      passwordHash,
      role: "PROFESSIONNEL",
      name: "Compte installateur (démo)",
      companyName: "Exemple Installateur Sàrl",
      vatNumber: "LU00000001 (exemple)",
      country: "LU",
      proDiscountPct: 5,
    })
    ;

  await db.insert(users)
    .values({
      id: "user-demo-admin",
      email: "admin@voltbox-demo.lu",
      passwordHash,
      role: "ADMIN",
      name: "Administration VoltBox (démo)",
      country: "LU",
    })
    ;

  await db.insert(promoCodes)
    .values({ code: "BIENVENUE10", percentOff: 10, active: true })
    ;

  console.log("Terminé. Comptes de démonstration (mot de passe: Demo1234!) :");
  console.log("  - particulier@voltbox-demo.lu");
  console.log("  - pro@voltbox-demo.lu");
  console.log("  - admin@voltbox-demo.lu");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
