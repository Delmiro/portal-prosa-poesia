import { NextResponse } from "next/server";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { magazinePages, magazines } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";
import { magazineToJson } from "@/lib/magazine-dto";

const Body = z.object({
  pageIdsInOrder: z.array(z.string().uuid()),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    requireAdminOrMaster(auth);
    const { id: magazineId } = await ctx.params;
    const { pageIdsInOrder } = Body.parse(await request.json());
    const db = getDb();
    const [mag] = await db.select().from(magazines).where(eq(magazines.id, magazineId)).limit(1);
    if (!mag) {
      return NextResponse.json({ message: "Revista não encontrada" }, { status: 404 });
    }
    const pages = await db
      .select()
      .from(magazinePages)
      .where(eq(magazinePages.magazineId, magazineId));
    const ids = new Set(pageIdsInOrder);
    if (ids.size !== pageIdsInOrder.length) {
      return NextResponse.json({ message: "IDs duplicados" }, { status: 400 });
    }
    const existing = new Set(pages.map((p) => p.id));
    if (ids.size !== existing.size || ![...ids].every((x) => existing.has(x))) {
      return NextResponse.json({ message: "Lista inválida" }, { status: 400 });
    }
    let i = 0;
    for (const pid of pageIdsInOrder) {
      await db
        .update(magazinePages)
        .set({ sortOrder: i++ })
        .where(eq(magazinePages.id, pid));
    }
    const allPages = await db
      .select()
      .from(magazinePages)
      .where(eq(magazinePages.magazineId, magazineId))
      .orderBy(asc(magazinePages.sortOrder));
    return NextResponse.json(magazineToJson(mag, allPages));
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
    }
    throw e;
  }
}
