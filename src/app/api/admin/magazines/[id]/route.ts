import { NextResponse } from "next/server";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { magazinePages, magazines } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";
import { magazineToJson } from "@/lib/magazine-dto";

const Update = z.object({
  title: z.string().min(1),
  editionNumber: z.number().int().positive().optional().nullable(),
  volume: z.number().int().positive().optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  description: z.string().optional().nullable(),
  coverImageUrl: z.string().min(1),
  publishedAt: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED"]),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, ctx: Ctx) {
  const auth = await requireAuth(request);
  requireAdminOrMaster(auth);
  const { id } = await ctx.params;
  const db = getDb();
  const [m] = await db.select().from(magazines).where(eq(magazines.id, id)).limit(1);
  if (!m) {
    return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
  }
  const pages = await db
    .select()
    .from(magazinePages)
    .where(eq(magazinePages.magazineId, id))
    .orderBy(asc(magazinePages.sortOrder));
  return NextResponse.json(magazineToJson(m, pages));
}

export async function PUT(request: Request, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    requireAdminOrMaster(auth);
    const { id } = await ctx.params;
    const body = Update.parse(await request.json());
    const db = getDb();
    const [m] = await db
      .update(magazines)
      .set({
        title: body.title.trim(),
        editionNumber: body.editionNumber ?? null,
        volume: body.volume ?? null,
        location: body.location?.trim() || null,
        description: body.description ?? null,
        coverImageUrl: body.coverImageUrl.trim(),
        publishedAt: body.publishedAt ?? null,
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(magazines.id, id))
      .returning();
    if (!m) {
      return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
    }
    const pages = await db
      .select()
      .from(magazinePages)
      .where(eq(magazinePages.magazineId, id))
      .orderBy(asc(magazinePages.sortOrder));
    return NextResponse.json(magazineToJson(m, pages));
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
    }
    throw e;
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  const auth = await requireAuth(request);
  requireAdminOrMaster(auth);
  const { id } = await ctx.params;
  const db = getDb();
  const [m] = await db.select().from(magazines).where(eq(magazines.id, id)).limit(1);
  if (!m) {
    return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
  }
  await db.delete(magazines).where(eq(magazines.id, id));
  return new NextResponse(null, { status: 204 });
}
