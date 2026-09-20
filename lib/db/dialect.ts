// Determine le dialecte actif a partir de DATABASE_URL. Fonction pure, sans
// dependance, reutilisee par schema.ts et index.ts pour rester cohérents.
export function isPostgresUrl(url: string | undefined): boolean {
  return !!url && /^postgres(ql)?:\/\//.test(url);
}
