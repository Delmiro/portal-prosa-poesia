import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { magazinePages, magazines } from "@/db/schema";
import { magazineToJson } from "@/lib/magazine-dto";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const db = getDb();
  const [m] = await db.select().from(magazines).where(eq(magazines.id, id)).limit(1);
  if (!m || m.status !== "PUBLISHED") {
    return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
  }
  const pages = await db
    .select()
    .from(magazinePages)
    .where(eq(magazinePages.magazineId, id))
    .orderBy(asc(magazinePages.sortOrder));
  return NextResponse.json(magazineToJson(m, pages));
}
