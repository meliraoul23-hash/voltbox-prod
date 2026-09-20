// Schema Drizzle - dialecte PostgreSQL - VoltBox
//
// Utilise automatiquement des que DATABASE_URL commence par postgres:// ou
// postgresql:// (voir lib/db/index.ts et lib/db/tables.ts). Memes tables et
// colonnes que schema.sqlite.ts - a maintenir en parallele.

import { pgTable, text, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { randomUUID } from "crypto";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID());

export const users = pgTable("users", {
  id: id(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("PARTICULIER"),
  name: text("name").notNull(),
  companyName: text("company_name"),
  vatNumber: text("vat_number"),
  phone: text("phone"),
  country: text("country").default("LU"),
  proDiscountPct: real("pro_discount_pct").notNull().default(0),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const categories = pgTable("categories", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  parentSlug: text("parent_slug"),
  order: integer("order").notNull().default(0),
});

export const brands = pgTable("brands", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
});

export const suppliers = pgTable("suppliers", {
  id: id(),
  name: text("name").notNull(),
  contact: text("contact"),
  country: text("country"),
});

export const products = pgTable("products", {
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

  phase: text("phase"),
  powerKw: real("power_kw"),
  voltage: text("voltage"),
  poles: text("poles"),
  ipRating: text("ip_rating"),
  dimensions: text("dimensions"),
  weightKg: real("weight_kg"),

  specs: jsonb("specs").$type<{ label: string; value: string }[]>().notNull(),
  contents: jsonb("contents").$type<{ qty: string; label: string }[]>().notNull(),
  images: jsonb("images").$type<string[]>().notNull(),

  stockQty: integer("stock_qty").notNull().default(0),
  leadTimePrepDays: integer("lead_time_prep_days").notNull().default(5),
  leadTimeShipDays: integer("lead_time_ship_days").notNull().default(4),

  status: text("status").notNull().default("ACTIVE"),
  isDemo: boolean("is_demo").notNull().default(true),
  featured: boolean("featured").notNull().default(false),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const promoCodes = pgTable("promo_codes", {
  id: id(),
  code: text("code").notNull().unique(),
  percentOff: real("percent_off"),
  amountOffCents: integer("amount_off_cents"),
  active: boolean("active").notNull().default(true),
});

export const orders = pgTable("orders", {
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
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: id(),
  orderId: text("order_id").notNull(),
  productId: text("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  productNameSnapshot: text("product_name_snapshot").notNull(),
});

export const invoices = pgTable("invoices", {
  id: id(),
  orderId: text("order_id").notNull().unique(),
  number: text("number").notNull().unique(),
  issuedAt: timestamp("issued_at", { mode: "date" }).defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: id(),
  userId: text("user_id"),
  type: text("type").notNull().default("STANDARD"),
  status: text("status").notNull().default("NOUVEAU"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  powerKw: real("power_kw"),
  inverter: text("inverter"),
  quantity: integer("quantity").default(1),
  message: text("message"),
  configuratorSnapshot: jsonb("configurator_snapshot"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const quoteFiles = pgTable("quote_files", {
  id: id(),
  quoteId: text("quote_id").notNull(),
  filename: text("filename").notNull(),
  url: text("url").notNull(),
});

export const savedConfigurations = pgTable("saved_configurations", {
  id: id(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  snapshot: jsonb("snapshot").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});

export const stockMovements = pgTable("stock_movements", {
  id: id(),
  productId: text("product_id").notNull(),
  type: text("type").notNull(),
  quantity: integer("quantity").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
});
