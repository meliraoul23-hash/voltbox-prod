export type DeliveryCountry = "LU" | "BE" | "FR" | "DE";
export type DeliveryMethodKey = "RETRAIT" | "STANDARD" | "EXPRESS" | "TRANSPORTEUR_PALETTE";

export const deliveryCountries: { code: DeliveryCountry; label: string }[] = [
  { code: "LU", label: "Luxembourg" },
  { code: "BE", label: "Belgique" },
  { code: "FR", label: "France" },
  { code: "DE", label: "Allemagne" },
];

const baseCostsCents: Record<DeliveryCountry, Record<DeliveryMethodKey, number>> = {
  LU: { RETRAIT: 0, STANDARD: 1500, EXPRESS: 3500, TRANSPORTEUR_PALETTE: 6500 },
  BE: { RETRAIT: 0, STANDARD: 2200, EXPRESS: 4500, TRANSPORTEUR_PALETTE: 8500 },
  FR: { RETRAIT: 0, STANDARD: 2500, EXPRESS: 5200, TRANSPORTEUR_PALETTE: 9500 },
  DE: { RETRAIT: 0, STANDARD: 2500, EXPRESS: 5200, TRANSPORTEUR_PALETTE: 9500 },
};

export const deliveryMethodLabels: Record<DeliveryMethodKey, string> = {
  RETRAIT: "Retrait à l'atelier (Luxembourg)",
  STANDARD: "Livraison standard (3–5 j ouvrés)",
  EXPRESS: "Livraison express (24–48h)",
  TRANSPORTEUR_PALETTE: "Transporteur — envoi sur palette",
};

export function getShippingCostCents(country: DeliveryCountry, method: DeliveryMethodKey): number {
  if (method === "RETRAIT" && country !== "LU") return baseCostsCents[country].STANDARD;
  return baseCostsCents[country][method];
}

export const availableMethodsFor = (country: DeliveryCountry): DeliveryMethodKey[] =>
  country === "LU"
    ? ["RETRAIT", "STANDARD", "EXPRESS", "TRANSPORTEUR_PALETTE"]
    : ["STANDARD", "EXPRESS", "TRANSPORTEUR_PALETTE"];
