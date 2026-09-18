import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["PARTICULIER", "PROFESSIONNEL"]),
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
  phone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Formulaire invalide." }, { status: 400 });
  }
  const data = parsed.data;

  const existingRows = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
  if (existingRows[0]) {
    return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  await db.insert(users).values({
    email: data.email,
    passwordHash,
    role: data.role,
    name: data.name,
    companyName: data.role === "PROFESSIONNEL" ? data.companyName : undefined,
    vatNumber: data.role === "PROFESSIONNEL" ? data.vatNumber : undefined,
    phone: data.phone,
  });

  return NextResponse.json({ ok: true });
}
