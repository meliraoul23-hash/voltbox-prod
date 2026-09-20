// Point d'entree unique pour les tables et les types du schema.
//
// Le dialecte actif (SQLite en dev, PostgreSQL des que DATABASE_URL commence
// par postgres:// ou postgresql://) est choisi ICI, une seule fois, et les
// memes objets de table sont ensuite utilises partout dans l'application
// (`import { products, categories, ... } from "@/lib/db/schema"`) sans
// distinction de dialecte dans le reste du code. schema.sqlite.ts et
// schema.pg.ts declarent les memes tables/colonnes en parallele ; c'est la
// seule chose a maintenir manuellement si vous ajoutez une colonne.
//
// Pas de garde "server-only" ici : ce module est importe par les scripts CLI
// (tsx, hors bundler Next.js) et n'exporte que des objets de table Drizzle et
// des types. Les composants client ne doivent en importer que des `import
// type { ... }`, effaces a la compilation (voir components/ProductCard.tsx
// et autres) ; la protection runtime reelle est sur lib/data/products.ts.
import * as sqliteTables from "./schema.sqlite";
import * as pgTables from "./schema.pg";
import { isPostgresUrl } from "./dialect";

const active = (isPostgresUrl(process.env.DATABASE_URL) ? pgTables : sqliteTables) as typeof sqliteTables;

export const users = active.users;
export const categories = active.categories;
export const brands = active.brands;
export const suppliers = active.suppliers;
export const products = active.products;
export const promoCodes = active.promoCodes;
export const orders = active.orders;
export const orderItems = active.orderItems;
export const invoices = active.invoices;
export const quotes = active.quotes;
export const quoteFiles = active.quoteFiles;
export const savedConfigurations = active.savedConfigurations;
export const stockMovements = active.stockMovements;

// Types structurels (identiques entre les deux dialectes pour tous les
// champs utilises par l'application).
export type Product = typeof sqliteTables.products.$inferSelect;
export type NewProduct = typeof sqliteTables.products.$inferInsert;
export type UserRow = typeof sqliteTables.users.$inferSelect;
export type Category = typeof sqliteTables.categories.$inferSelect;
export type Brand = typeof sqliteTables.brands.$inferSelect;
export type Quote = typeof sqliteTables.quotes.$inferSelect;
export type Order = typeof sqliteTables.orders.$inferSelect;
export type OrderItem = typeof sqliteTables.orderItems.$inferSelect;
