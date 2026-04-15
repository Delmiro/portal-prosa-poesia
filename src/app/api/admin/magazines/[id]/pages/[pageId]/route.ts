import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { magazinePages } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";

type Ctx = { params: Promise<{ id: string; pageId: string }> };

export async function DELETE(request: Request, ctx: Ctx) {
  const auth = await requireAuth(request);
  requireAdminOrMaster(auth);
  const { id: magazineId, pageId } = await ctx.params;
  const db = getDb();
  const [p] = await db
    .select()
    .from(magazinePages)
    .where(eq(magazinePages.id, pageId))
    .limit(1);
  if (!p || p.magazineId !== magazineId) {
    return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
  }
  await db.delete(magazinePages).where(eq(magazinePages.id, pageId));
  return new NextResponse(null, { status: 204 });
}
