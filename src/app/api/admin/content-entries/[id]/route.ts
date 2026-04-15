import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contentEntries } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";
import { isCmsSectionSlug } from "@/lib/cms-sections";

const PutBody = z.object({
  sectionSlug: z.string().min(1).max(64),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1).max(300),
  excerpt: z.string().max(2000).optional().nullable(),
  body: z.string().min(1).max(200000),
  imageUrl: z.string().max(2000).optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  sortOrder: z.number().int(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, ctx: Ctx) {
  const auth = await requireAuth(request);
  requireAdminOrMaster(auth);
  const { id } = await ctx.params;
  const db = getDb();
  const [row] = await db.select().from(contentEntries).where(eq(contentEntries.id, id)).limit(1);
  if (!row) {
    return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
  }
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
}

export async function PUT(request: Request, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    requireAdminOrMaster(auth);
    const { id } = await ctx.params;
    const body = PutBody.parse(await request.json());
    if (!isCmsSectionSlug(body.sectionSlug)) {
      return NextResponse.json({ message: "Secção inválida" }, { status: 400 });
    }
    const db = getDb();
    const [row] = await db
      .update(contentEntries)
      .set({
        sectionSlug: body.sectionSlug,
        slug: body.slug.trim().toLowerCase(),
        title: body.title.trim(),
        excerpt: body.excerpt ?? null,
        body: body.body,
        imageUrl: body.imageUrl?.trim() || null,
        status: body.status,
        sortOrder: body.sortOrder,
        updatedAt: new Date(),
      })
      .where(eq(contentEntries.id, id))
      .returning();
    if (!row) {
      return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
    }
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

export async function DELETE(request: Request, ctx: Ctx) {
  const auth = await requireAuth(request);
  requireAdminOrMaster(auth);
  const { id } = await ctx.params;
  const db = getDb();
  const [row] = await db.select().from(contentEntries).where(eq(contentEntries.id, id)).limit(1);
  if (!row) {
    return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
  }
  await db.delete(contentEntries).where(eq(contentEntries.id, id));
  return new NextResponse(null, { status: 204 });
}
