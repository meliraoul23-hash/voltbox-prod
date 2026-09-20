// Note : pas de garde "server-only" ici (contrairement a lib/data/products.ts).
// Ce module est importe directement par les scripts CLI (db:seed, import:csv,
// export:csv) executes avec `tsx` en dehors du bundler Next.js, qui n'ont pas
// la condition d'exports "react-server" necessaire pour que "server-only" ne
// leve pas d'erreur. La protection cote application reste assuree par
// lib/data/products.ts (le seul point d'acces aux donnees utilise par les
// composants client) et par le fait que toutes les routes API/pages qui
// importent "@/lib/db" directement sont deja des modules 100% serveur
// (route handlers, Server Components).
import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import postgres from "postgres";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import path from "path";
import * as sqliteSchema from "./schema.sqlite";
import * as pgSchema from "./schema.pg";
import { isPostgresUrl } from "./dialect";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

// Le client est choisi une seule fois au demarrage du processus, selon le
// prefixe de DATABASE_URL :
//   - "postgres://" ou "postgresql://"  -> PostgreSQL (drizzle-orm/postgres-js)
//   - tout le reste (ex. "file:./dev.db") -> SQLite (better-sqlite3), pour
//     le developpement local sans configuration.
// Le reste de l'application n'a jamais besoin de savoir lequel est actif :
// toutes les requetes s'ecrivent `await db.select()...` /
// `await db.insert()...values(...)`, syntaxe compatible avec les deux
// drivers (voir lib/db/schema.ts pour le choix des tables correspondantes).
function createDb() {
  if (isPostgresUrl(databaseUrl)) {
    const client = postgres(databaseUrl, { max: 10 });
    return drizzlePg(client, { schema: pgSchema });
  }
  const sqlitePath = databaseUrl.replace(/^file:/, "");
  const resolvedPath = path.isAbsolute(sqlitePath) ? sqlitePath : path.join(process.cwd(), sqlitePath);
  const sqlite = new Database(resolvedPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  return drizzleSqlite(sqlite, { schema: sqliteSchema });
}

export const db: any = createDb();
export const usingPostgres = isPostgresUrl(databaseUrl);
