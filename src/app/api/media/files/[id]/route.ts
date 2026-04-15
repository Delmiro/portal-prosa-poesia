import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { mediaAssets } from "@/db/schema";
import { readStoredFile } from "@/lib/media-store";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const db = getDb();
  const [m] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!m) {
    return new Response("Não encontrado", { status: 404 });
  }
  try {
    const buf = await readStoredFile(m.storedPath);
    return new Response(buf, {
      headers: {
        "content-type": m.mimeType,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Ficheiro em falta", { status: 404 });
  }
}
