import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { mediaAssets } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";
import { kindFromMime, saveUploadedFile } from "@/lib/media-store";
import { publicBaseUrl } from "@/lib/public-url";
import { isAllowedMime, uploadPolicy } from "@/lib/upload-policy";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ctx = await requireAuth(request);
  requireAdminOrMaster(ctx);
  const form = await request.formData();
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ message: "Ficheiro em falta" }, { status: 400 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  if (buf.length === 0) {
    return NextResponse.json({ message: "Ficheiro vazio" }, { status: 400 });
  }
  const mime = file.type || "application/octet-stream";
  if (!isAllowedMime(mime, uploadPolicy.coverImage)) {
    return NextResponse.json(
      { message: "Tipo inválido. Apenas imagens são permitidas para capa." },
      { status: 400 },
    );
  }
  if (buf.length > uploadPolicy.coverImage.maxBytes) {
    return NextResponse.json({ message: "Imagem excede o limite de 8MB." }, { status: 400 });
  }
  const { relativePath } = await saveUploadedFile(buf, file.name || "upload");
  const db = getDb();
  const [row] = await db
    .insert(mediaAssets)
    .values({
      filename: file.name || "upload",
      storedPath: relativePath,
      publicUrl: "pending",
      mimeType: mime,
      byteSize: buf.length,
      kind: kindFromMime(mime),
      uploadedById: ctx.dbUser.id,
    })
    .returning();
  const url = `${publicBaseUrl()}/api/media/files/${row.id}`;
  const [updated] = await db
    .update(mediaAssets)
    .set({ publicUrl: url })
    .where(eq(mediaAssets.id, row.id))
    .returning();
  return NextResponse.json({
    id: updated.id,
    filename: updated.filename,
    publicUrl: updated.publicUrl,
    mimeType: updated.mimeType,
    byteSize: updated.byteSize,
    kind: updated.kind,
    createdAt: updated.createdAt?.toISOString?.() ?? String(updated.createdAt),
  });
}
