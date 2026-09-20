// Schema Drizzle - dialecte SQLite - VoltBox
//
// Utilise automatiquement en developpement (DATABASE_URL non postgres://).
// Le dialecte reellement actif est choisi par lib/db/index.ts ; ce fichier
// et schema.pg.ts sont maintenus en parallele avec les memes tables et
// colonnes (voir lib/db/tables.ts qui expose le bon jeu de tables selon
// l'environnement). Ne pas modifier l'un sans repercuter le changement sur
// l'autre.

import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID());

export const users = sqliteTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("PARTICULIER"), // PARTICULIER | PROFESSIONNEL | ADMIN
  name: text("name").notNull(),
  companyName: text("company_name"),
  vatNumber: text("vat_number"),
  phone: text("phone"),
  country: text("country").default("LU"),
  proDiscountPct: real("pro_discount_pct").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const categories = sqliteTable("categories", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  parentSlug: text("parent_slug"),
  order: integer("order").notNull().default(0),
});

export const brands = sqliteTable("brands", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export const suppliers = sqliteTable("suppliers", {
  id: id(),
  name: text("name").notNull(),
  contact: text("contact"),
  country: text("country"),
});

export const products = sqliteTable("products", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  categorySlug: text("category_slug").notNull(),
  brandSlug: text("brand_slug"),
  supplierId: text("supplier_id"),

  internalRef: text("internal_ref").notNull().unique(),
  manufacturerRef: text("manufacturer_ref"),

  purchasePriceCents: integer("purchase_price_cents").notNull().default(0),
  marginPercent: real("margin_percent").notNull().default(0),
  priceParticulierCents: integer("price_particulier_cents").notNull(),
  priceProCents: integer("price_pro_cents").notNull(),

  phase: text("phase"), // monophase | triphase | null
  powerKw: real("power_kw"),
  voltage: text("voltage"),
  poles: text("poles"),
  ipRating: text("ip_rating"),
  dimensions: text("dimensions"),
  weightKg: real("weight_kg"),

  specs: text("specs", { mode: "json" }).$type<{ label: string; value: string }[]>().notNull(),
  contents: text("contents", { mode: "json" }).$type<{ qty: string; label: string }[]>().notNull(),
  images: text("images", { mode: "json" }).$type<string[]>().notNull(),

  stockQty: integer("stock_qty").notNull().default(0),
  leadTimePrepDays: integer("lead_time_prep_days").notNull().default(5),
  leadTimeShipDays: integer("lead_time_ship_days").notNull().default(4),

  status: text("status").notNull().default("ACTIVE"), // ACTIVE | DRAFT | RUPTURE
  isDemo: integer("is_demo", { mode: "boolean" }).notNull().default(true),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),

  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const promoCodes = sqliteTable("promo_codes", {
  id: id(),
  code: text("code").notNull().unique(),
  percentOff: real("percent_off"),
  amountOffCents: integer("amount_off_cents"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
});

export const orders = sqliteTable("orders", {
  id: id(),
  userId: text("user_id"),
  status: text("status").notNull().default("EN_ATTENTE"),
  subtotalCents: integer("subtotal_cents").notNull(),
  vatPercent: real("vat_percent").notNull().default(17),
  vatCents: integer("vat_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  deliveryMethod: text("delivery_method").notNull().default("STANDARD"),
  deliveryCountry: text("delivery_country").notNull().default("LU"),
  promoCode: text("promo_code"),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerCompany: text("customer_company"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const orderItems = sqliteTable("order_items", {
  id: id(),
  orderId: text("order_id").notNull(),
  productId: text("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  productNameSnapshot: text("product_name_snapshot").notNull(),
});

export const invoices = sqliteTable("invoices", {
  id: id(),
  orderId: text("order_id").notNull().unique(),
  number: text("number").notNull().unique(),
  issuedAt: integer("issued_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const quotes = sqliteTable("quotes", {
  id: id(),
  userId: text("user_id"),
  type: text("type").notNull().default("STANDARD"), // STANDARD | SUR_MESURE | CONFIGURATEUR
  status: text("status").notNull().default("NOUVEAU"), // NOUVEAU | EN_COURS | REPONDU | CLOS
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  powerKw: real("power_kw"),
  inverter: text("inverter"),
  quantity: integer("quantity").default(1),
  message: text("message"),
  configuratorSnapshot: text("configurator_snapshot", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const quoteFiles = sqliteTable("quote_files", {
  id: id(),
  quoteId: text("quote_id").notNull(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
});

export const savedConfigurations = sqliteTable("saved_configurations", {
  id: id(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  snapshot: text("snapshot", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const stockMovements = sqliteTable("stock_movements", {
  id: id(),
  productId: text("product_id").notNull(),
  type: text("type").notNull(), // IN | OUT
  quantity: integer("quantity").notNull(),
  reason: text("reason"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type UserRow = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Brand = typeof brands.$inferSelect;
export type Quote = typeof quotes.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
