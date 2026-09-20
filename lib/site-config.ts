// Configuration centrale du site : changez ces valeurs pour personnaliser
// l'identite de la boutique sans toucher au reste du code.
export const siteConfig = {
  name: "VoltBox",
  tagline: "Tableaux precables. Prets a poser.",
  legalName: "El Shaddai Energies Sarl",
  description:
    "Tableaux electriques et photovoltaiques precables, reperes et prets a installer, pour installateurs professionnels du Luxembourg et de la Grande Region.",
  email: "elshaidai.info@gmail.com",
  phone: "+352 691 352 240",
  address: "10A rue des Merovingiens, L-8070 Bertrange, Luxembourg",
  vatNumber: "LU37681578",
  rcs: "RCS Luxembourg B299077",
  vatRatePercent: 17, // TVA standard Luxembourg - a confirmer selon la nature exacte des produits/services
  currency: "EUR",
  deliveryZones: ["LU", "BE", "FR", "DE"] as const,
  isDemo: true,
};

export const complianceDisclaimer =
  "Les configurations sont a valider selon les exigences du gestionnaire de reseau, les normes applicables et les caracteristiques de l'installation.";

export const demoDataDisclaimer =
  "Catalogue de demonstration : references, caracteristiques, prix et delais sont des exemples a confirmer avant toute commercialisation.";
