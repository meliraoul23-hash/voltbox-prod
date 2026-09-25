import "server-only";
import { db } from "@/lib/db";
import { products, categories, brands } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import type { Product } from "@/lib/db/schema";
export { getApplicablePriceCents } from "@/lib/pricing";

export async function getCategories() {
return db.select().from(categories).orderBy(categories.order);
}

export async function getCategoryBySlug(slug: string) {
const rows = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
return rows[0];
}

export async function getBrands() {
return db.select().from(brands);
}

export async function getAllProducts(): Promise<Product[]> {
return db.select().from(products).where(eq(products.status, "ACTIVE"));
}

export async function getFeaturedProducts(): Promise<Product[]> {
const all = await getAllProducts();
return all.filter((p) => p.featured);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
return db
.select()
.from(products)
.where(and(eq(products.categorySlug, categorySlug), eq(products.status, "ACTIVE")));
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
const rows = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
return rows[0];
}

export async function getProductById(id: string): Promise<Product | undefined> {
const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
return rows[0];
}

export async function getAllProductsAdmin(): Promise<Product[]> {
return db.select().from(products);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
const sameCategory = await getProductsByCategory(product.categorySlug);
return sameCategory.filter((p) => p.id !== product.id).slice(0, limit);
}
