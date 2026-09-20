export function centsToEuro(cents: number): string {
  return (cents / 100).toLocaleString("fr-LU", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function euroToCents(euro: number): number {
  return Math.round(euro * 100);
}
