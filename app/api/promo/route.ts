import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { promoCodes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) return NextResponse.json({ valid: false }, { status: 400 });
  const rows = await db.select().from(promoCodes).where(eq(promoCodes.code, code)).limit(1);
  const promo = rows[0];
  if (!promo || !promo.active) return NextResponse.json({ valid: false });
  return NextResponse.json({
    valid: true,
    code: promo.code,
    percentOff: promo.percentOff ?? 0,
    amountOffCents: promo.amountOffCents ?? 0,
  });
}
