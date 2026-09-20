import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { quotes, quoteFiles } from "@/lib/db/schema";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { sendQuoteAcknowledgement, sendQuoteAdminNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const formData = await req.formData();

  const type = (formData.get("type") as string) || "STANDARD";
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string | null;
  const company = formData.get("company") as string | null;
  const powerKw = formData.get("powerKw") ? Number(formData.get("powerKw")) : null;
  const inverter = formData.get("inverter") as string | null;
  const quantity = formData.get("quantity") ? Number(formData.get("quantity")) : 1;
  const message = formData.get("message") as string | null;
  const configuratorSnapshot = formData.get("configuratorSnapshot") as string | null;

  if (!name || !email) {
    return NextResponse.json({ error: "Nom et email requis." }, { status: 400 });
  }

  const quoteId = randomUUID();
  await db.insert(quotes).values({
    id: quoteId,
    userId: session?.user?.id,
    type: type as any,
    name,
    email,
    phone: phone || undefined,
    company: company || undefined,
    powerKw: powerKw ?? undefined,
    inverter: inverter || undefined,
    quantity,
    message: message || undefined,
    configuratorSnapshot: configuratorSnapshot ? JSON.parse(configuratorSnapshot) : undefined,
  });

  const files = formData.getAll("files") as File[];
  const uploadDir = path.join(process.cwd(), "public", "uploads", "quotes", quoteId);
  if (files.length > 0 && files.some((f) => f.size > 0)) {
    await fs.mkdir(uploadDir, { recursive: true });
    for (const file of files) {
      if (!file || file.size === 0) continue;
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(uploadDir, safeName), buffer);
      await db.insert(quoteFiles).values({ quoteId, filename: safeName, url: `/uploads/quotes/${quoteId}/${safeName}` });
    }
  }

  // Best-effort : une erreur d'envoi d'email ne doit jamais faire échouer
  // l'enregistrement de la demande de devis (voir lib/email.ts).
  await Promise.all([
    sendQuoteAcknowledgement({ name, email, type }),
    sendQuoteAdminNotification({ name, email, phone, company, message }),
  ]).catch((err) => console.error("[quotes] envoi email:", err));

  return NextResponse.json({ ok: true, quoteId });
}
