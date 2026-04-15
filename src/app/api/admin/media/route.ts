import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { mediaAssets } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";

export async function GET(request: Request) {
  const ctx = await requireAuth(request);
  requireAdminOrMaster(ctx);
  const db = getDb();
  const rows = await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
  return NextResponse.json(
    rows.map((m) => ({
      id: m.id,
      filename: m.filename,
      publicUrl: m.publicUrl,
      mimeType: m.mimeType,
      byteSize: m.byteSize,
      kind: m.kind,
      createdAt: m.createdAt?.toISOString?.() ?? String(m.createdAt),
    })),
  );
}
