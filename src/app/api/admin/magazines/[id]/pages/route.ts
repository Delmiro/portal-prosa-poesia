import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { magazinePages, magazines, mediaAssets } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";
import { kindFromMime, saveUploadedFile } from "@/lib/media-store";
import { magazineToJson } from "@/lib/magazine-dto";
import { publicBaseUrl } from "@/lib/public-url";
import { isAllowedMime, uploadPolicy } from "@/lib/upload-policy";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const auth = await requireAuth(request);
  requireAdminOrMaster(auth);
  const { id: magazineId } = await ctx.params;
  const db = getDb();
  const [mag] = await db.select().from(magazines).where(eq(magazines.id, magazineId)).limit(1);
  if (!mag) {
    return NextResponse.json({ message: "Revista não encontrada" }, { status: 404 });
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: "Ficheiro em falta" }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length === 0) {
    return NextResponse.json({ message: "Ficheiro vazio" }, { status: 400 });
  }
  const mime = file.type || "application/pdf";
  if (!isAllowedMime(mime, uploadPolicy.pdf)) {
    return NextResponse.json({ message: "Apenas PDF é permitido." }, { status: 400 });
  }
  if (buf.length > uploadPolicy.pdf.maxBytes) {
    return NextResponse.json({ message: "PDF excede o limite de 25MB." }, { status: 400 });
  }
  const { relativePath } = await saveUploadedFile(buf, file.name || "page.pdf");
  const [media] = await db
    .insert(mediaAssets)
    .values({
      filename: file.name || "page.pdf",
      storedPath: relativePath,
      publicUrl: "pending",
      mimeType: mime,
      byteSize: buf.length,
      kind: kindFromMime(mime),
      uploadedById: auth.dbUser.id,
    })
    .returning();
  const url = `${publicBaseUrl()}/api/media/files/${media.id}`;
  await db.update(mediaAssets).set({ publicUrl: url }).where(eq(mediaAssets.id, media.id));
  const pages = await db
    .select()
    .from(magazinePages)
    .where(eq(magazinePages.magazineId, magazineId));
  const next = pages.reduce((acc, p) => Math.max(acc, p.sortOrder), -1) + 1;
  await db.insert(magazinePages).values({
    magazineId,
    sortOrder: next,
    pdfUrl: url,
    label: `Página ${next + 1}`,
  });
  const allPages = await db
    .select()
    .from(magazinePages)
    .where(eq(magazinePages.magazineId, magazineId))
    .orderBy(asc(magazinePages.sortOrder));
  return NextResponse.json(magazineToJson(mag, allPages));
}
