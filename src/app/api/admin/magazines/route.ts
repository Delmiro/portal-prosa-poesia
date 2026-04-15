import { NextResponse } from "next/server";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { magazinePages, magazines } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";
import { magazineToJson } from "@/lib/magazine-dto";

const Create = z.object({
  title: z.string().min(1),
  editionNumber: z.number().int().positive().optional().nullable(),
  volume: z.number().int().positive().optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  description: z.string().optional().nullable(),
  coverImageUrl: z.string().min(1),
  publishedAt: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED"]),
});

export async function GET(request: Request) {
  const ctx = await requireAuth(request);
  requireAdminOrMaster(ctx);
  const db = getDb();
  const all = await db.select().from(magazines);
  const out = [];
  for (const m of all) {
    const pages = await db
      .select()
      .from(magazinePages)
      .where(eq(magazinePages.magazineId, m.id))
      .orderBy(asc(magazinePages.sortOrder));
    out.push(magazineToJson(m, pages));
  }
  return NextResponse.json(out);
}

export async function POST(request: Request) {
  try {
    const ctx = await requireAuth(request);
    requireAdminOrMaster(ctx);
    const body = Create.parse(await request.json());
    const db = getDb();
    const [m] = await db
      .insert(magazines)
      .values({
        title: body.title.trim(),
        editionNumber: body.editionNumber ?? null,
        volume: body.volume ?? null,
        location: body.location?.trim() || null,
        description: body.description ?? null,
        coverImageUrl: body.coverImageUrl.trim(),
        publishedAt: body.publishedAt ?? null,
        status: body.status,
      })
      .returning();
    return NextResponse.json(magazineToJson(m, []));
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
    }
    throw e;
  }
}
