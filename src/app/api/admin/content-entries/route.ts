import { NextResponse } from "next/server";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contentEntries } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";
import { isCmsSectionSlug } from "@/lib/cms-sections";

const Body = z.object({
  sectionSlug: z.string().min(1).max(64),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1).max(300),
  excerpt: z.string().max(2000).optional().nullable(),
  body: z.string().min(1).max(200000),
  imageUrl: z.string().max(2000).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  sortOrder: z.number().int(),
});

export async function GET(request: Request) {
  const ctx = await requireAuth(request);
  requireAdminOrMaster(ctx);
  const { searchParams } = new URL(request.url);
  const section = searchParams.get("section")?.trim();
  if (section && !isCmsSectionSlug(section)) {
    return NextResponse.json({ message: "Secção inválida" }, { status: 400 });
  }
  const db = getDb();
  const rows = section
    ? await db
        .select()
        .from(contentEntries)
        .where(eq(contentEntries.sectionSlug, section))
        .orderBy(asc(contentEntries.sortOrder))
    : await db.select().from(contentEntries).orderBy(asc(contentEntries.sortOrder));
  return NextResponse.json(
    rows.map((r) => ({
      id: r.id,
      sectionSlug: r.sectionSlug,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      body: r.body,
      imageUrl: r.imageUrl,
      status: r.status,
      sortOrder: r.sortOrder,
      createdAt: r.createdAt?.toISOString?.() ?? String(r.createdAt),
      updatedAt: r.updatedAt?.toISOString?.() ?? String(r.updatedAt),
    })),
  );
}

export async function POST(request: Request) {
  try {
    const ctx = await requireAuth(request);
    requireAdminOrMaster(ctx);
    const body = Body.parse(await request.json());
    if (!isCmsSectionSlug(body.sectionSlug)) {
      return NextResponse.json({ message: "Secção inválida" }, { status: 400 });
    }
    const db = getDb();
    const [row] = await db
      .insert(contentEntries)
      .values({
        sectionSlug: body.sectionSlug,
        slug: body.slug.trim().toLowerCase(),
        title: body.title.trim(),
        excerpt: body.excerpt ?? null,
        body: body.body,
        imageUrl: body.imageUrl?.trim() || null,
        status: body.status,
        sortOrder: body.sortOrder,
      })
      .returning();
    return NextResponse.json({
      id: row.id,
      sectionSlug: row.sectionSlug,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      body: row.body,
      imageUrl: row.imageUrl,
      status: row.status,
      sortOrder: row.sortOrder,
      createdAt: row.createdAt?.toISOString?.() ?? String(row.createdAt),
      updatedAt: row.updatedAt?.toISOString?.() ?? String(row.updatedAt),
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ message: "Dados inválidos", issues: e.issues }, { status: 400 });
    }
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("duplicate key") || msg.includes("unique")) {
      return NextResponse.json(
        { message: "Já existe um texto com este slug nesta secção." },
        { status: 409 },
      );
    }
    throw e;
  }
}
