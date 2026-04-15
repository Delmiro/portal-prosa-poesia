import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { mediaAssets } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";
import { deleteStoredFile } from "@/lib/media-store";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, ctx: Ctx) {
  const auth = await requireAuth(request);
  requireAdminOrMaster(auth);
  const { id } = await ctx.params;
  const db = getDb();
  const [m] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!m) {
    return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
  }
  await deleteStoredFile(m.storedPath);
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
  return new NextResponse(null, { status: 204 });
}
