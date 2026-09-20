import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref")?.trim();
  if (!ref) return NextResponse.json({ product: null });
  const rows = await db.select().from(products).where(eq(products.internalRef, ref)).limit(1);
  return NextResponse.json({ product: rows[0] ?? null });
}
