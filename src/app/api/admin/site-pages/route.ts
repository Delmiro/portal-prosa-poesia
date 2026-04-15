import { NextResponse } from "next/server";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { sitePages } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";

const Body = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  blocksJson: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

export async function GET(request: Request) {
  const ctx = await requireAuth(request);
  requireAdminOrMaster(ctx);
  const db = getDb();
  const rows = await db.select().from(sitePages).orderBy(asc(sitePages.slug));
  return NextResponse.json(
    rows.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      blocksJson: p.blocksJson,
      status: p.status,
    })),
  );
}

export async function POST(request: Request) {
  try {
    const ctx = await requireAuth(request);
    requireAdminOrMaster(ctx);
    const body = Body.parse(await request.json());
    const db = getDb();
    const slug = body.slug.trim().toLowerCase();
    const [dup] = await db.select().from(sitePages).where(eq(sitePages.slug, slug)).limit(1);
    if (dup) {
      return NextResponse.json({ message: "Slug já existe" }, { status: 400 });
    }
    const [p] = await db
      .insert(sitePages)
      .values({
        slug,
        title: body.title.trim(),
        blocksJson: body.blocksJson ?? null,
        status: body.status,
      })
      .returning();
    return NextResponse.json({
      id: p.id,
      slug: p.slug,
      title: p.title,
      blocksJson: p.blocksJson,
      status: p.status,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados inválidos" }, { status: 400 });
    }
    throw e;
  }
}
