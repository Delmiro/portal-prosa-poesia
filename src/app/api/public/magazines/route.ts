import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { magazinePages, magazines } from "@/db/schema";
import { magazineToJson } from "@/lib/magazine-dto";

export async function GET() {
  const db = getDb();
  const all = await db.select().from(magazines).where(eq(magazines.status, "PUBLISHED"));
  const sorted = [...all].sort((a, b) => {
    const da = a.publishedAt ? String(a.publishedAt) : "";
    const db_ = b.publishedAt ? String(b.publishedAt) : "";
    return db_.localeCompare(da);
  });
  const out = [];
  for (const m of sorted) {
    const pages = await db
      .select()
      .from(magazinePages)
      .where(eq(magazinePages.magazineId, m.id))
      .orderBy(asc(magazinePages.sortOrder));
    out.push(magazineToJson(m, pages));
  }
  return NextResponse.json(out);
}
