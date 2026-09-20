import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { savedConfigurations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  const rows = await db
    .select()
    .from(savedConfigurations)
    .where(eq(savedConfigurations.userId, session.user.id));
  return NextResponse.json({ configurations: rows });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  const body = await req.json();
  await db
    .insert(savedConfigurations)
    .values({ userId: session.user.id, name: body.name || "Configuration", snapshot: body.snapshot });
  return NextResponse.json({ ok: true });
}
