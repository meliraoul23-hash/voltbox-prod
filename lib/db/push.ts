// Cree les tables directement a partir du schema (sans systeme de
// migrations versionnees) - suffisant pour le developpement local et cette
// demo, quel que soit le dialecte actif (SQLite ou PostgreSQL selon
// DATABASE_URL). Pour une vraie mise en production PostgreSQL, remplacez ce
// script par de vraies migrations `drizzle-kit generate` + `drizzle-kit
// migrate` avec un historique versionne.
import Database from "better-sqlite3";
import postgres from "postgres";
import path from "path";
import fs from "fs";
import { isPostgresUrl } from "./dialect";

const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

const sqliteDdl = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'PARTICULIER',
  name TEXT NOT NULL,
  company_name TEXT,
  vat_number TEXT,
  phone TEXT,
  country TEXT DEFAULT 'LU',
  pro_discount_pct REAL NOT NULL DEFAULT 0,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  parent_slug TEXT,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  country TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  brand_slug TEXT,
  supplier_id TEXT,
  internal_ref TEXT NOT NULL UNIQUE,
  manufacturer_ref TEXT,
  purchase_price_cents INTEGER NOT NULL DEFAULT 0,
  margin_percent REAL NOT NULL DEFAULT 0,
  price_particulier_cents INTEGER NOT NULL,
  price_pro_cents INTEGER NOT NULL,
  phase TEXT,
  power_kw REAL,
  voltage TEXT,
  poles TEXT,
  ip_rating TEXT,
  dimensions TEXT,
  weight_kg REAL,
  specs TEXT NOT NULL,
  contents TEXT NOT NULL,
  images TEXT NOT NULL,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  lead_time_prep_days INTEGER NOT NULL DEFAULT 5,
  lead_time_ship_days INTEGER NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  is_demo INTEGER NOT NULL DEFAULT 1,
  featured INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER,
  updated_at INTEGER
);

CREATE TABLE IF NOT EXISTS promo_codes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  percent_off REAL,
  amount_off_cents INTEGER,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  status TEXT NOT NULL DEFAULT 'EN_ATTENTE',
  subtotal_cents INTEGER NOT NULL,
  vat_percent REAL NOT NULL DEFAULT 17,
  vat_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  delivery_method TEXT NOT NULL DEFAULT 'STANDARD',
  delivery_country TEXT NOT NULL DEFAULT 'LU',
  promo_code TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_company TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  product_name_snapshot TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  number TEXT NOT NULL UNIQUE,
  issued_at INTEGER
);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  type TEXT NOT NULL DEFAULT 'STANDARD',
  status TEXT NOT NULL DEFAULT 'NOUVEAU',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  power_kw REAL,
  inverter TEXT,
  quantity INTEGER DEFAULT 1,
  message TEXT,
  configurator_snapshot TEXT,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS quote_files (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS saved_configurations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  snapshot TEXT NOT NULL,
  created_at INTEGER
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT,
  created_at INTEGER
);
`;

const postgresDdl = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'PARTICULIER',
  name TEXT NOT NULL,
  company_name TEXT,
  vat_number TEXT,
  phone TEXT,
  country TEXT DEFAULT 'LU',
  pro_discount_pct DOUBLE PRECISION NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  parent_slug TEXT,
  "order" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS brands (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  country TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  brand_slug TEXT,
  supplier_id TEXT,
  internal_ref TEXT NOT NULL UNIQUE,
  manufacturer_ref TEXT,
  purchase_price_cents INTEGER NOT NULL DEFAULT 0,
  margin_percent DOUBLE PRECISION NOT NULL DEFAULT 0,
  price_particulier_cents INTEGER NOT NULL,
  price_pro_cents INTEGER NOT NULL,
  phase TEXT,
  power_kw DOUBLE PRECISION,
  voltage TEXT,
  poles TEXT,
  ip_rating TEXT,
  dimensions TEXT,
  weight_kg DOUBLE PRECISION,
  specs JSONB NOT NULL,
  contents JSONB NOT NULL,
  images JSONB NOT NULL,
  stock_qty INTEGER NOT NULL DEFAULT 0,
  lead_time_prep_days INTEGER NOT NULL DEFAULT 5,
  lead_time_ship_days INTEGER NOT NULL DEFAULT 4,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  is_demo BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS promo_codes (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  percent_off DOUBLE PRECISION,
  amount_off_cents INTEGER,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  status TEXT NOT NULL DEFAULT 'EN_ATTENTE',
  subtotal_cents INTEGER NOT NULL,
  vat_percent DOUBLE PRECISION NOT NULL DEFAULT 17,
  vat_cents INTEGER NOT NULL,
  shipping_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,
  delivery_method TEXT NOT NULL DEFAULT 'STANDARD',
  delivery_country TEXT NOT NULL DEFAULT 'LU',
  promo_code TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_company TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  product_name_snapshot TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  number TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  type TEXT NOT NULL DEFAULT 'STANDARD',
  status TEXT NOT NULL DEFAULT 'NOUVEAU',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  power_kw DOUBLE PRECISION,
  inverter TEXT,
  quantity INTEGER DEFAULT 1,
  message TEXT,
  configurator_snapshot JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quote_files (
  id TEXT PRIMARY KEY,
  quote_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS saved_configurations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT now()
);
`;

async function main() {
  if (isPostgresUrl(databaseUrl)) {
    const sql = postgres(databaseUrl, { max: 1 });
    await sql.unsafe(postgresDdl);
    console.log("[postgres] Tables créées / vérifiées avec succès.");
    await sql.end();
    return;
  }

  const sqlitePath = databaseUrl.replace(/^file:/, "");
  const resolvedPath = path.isAbsolute(sqlitePath) ? sqlitePath : path.join(process.cwd(), sqlitePath);
  if (fs.existsSync(resolvedPath)) {
    console.log(`[sqlite] Base existante détectée (${resolvedPath}) - création des tables manquantes uniquement.`);
  }
  const sqlite = new Database(resolvedPath);
  sqlite.exec(sqliteDdl);
  console.log("[sqlite] Tables créées / vérifiées avec succès.");
  sqlite.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
