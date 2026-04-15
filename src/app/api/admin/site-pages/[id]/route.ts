import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { sitePages } from "@/db/schema";
import { requireAdminOrMaster, requireAuth } from "@/lib/auth/request";

const Body = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  blocksJson: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: Request, ctx: Ctx) {
  const auth = await requireAuth(request);
  requireAdminOrMaster(auth);
  const { id } = await ctx.params;
  const db = getDb();
  const [p] = await db.select().from(sitePages).where(eq(sitePages.id, id)).limit(1);
  if (!p) {
    return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
  }
  return NextResponse.json({
    id: p.id,
    slug: p.slug,
    title: p.title,
    blocksJson: p.blocksJson,
    status: p.status,
  });
}

export async function PUT(request: Request, ctx: Ctx) {
  try {
    const auth = await requireAuth(request);
    requireAdminOrMaster(auth);
    const { id } = await ctx.params;
    const body = Body.parse(await request.json());
    const db = getDb();
    const slug = body.slug.trim().toLowerCase();
    const [other] = await db.select().from(sitePages).where(eq(sitePages.slug, slug)).limit(1);
    if (other && other.id !== id) {
      return NextResponse.json({ message: "Slug já existe" }, { status: 400 });
    }
    const [p] = await db
      .update(sitePages)
      .set({
        slug,
        title: body.title.trim(),
        blocksJson: body.blocksJson ?? null,
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(sitePages.id, id))
      .returning();
    if (!p) {
      return NextResponse.json({ message: "Não encontrado" }, { status: 404 });
    }
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

export async function DELETE(request: Request, ctx: Ctx) {
  const auth = await requireAuth(request);
  requireAdminOrMaster(auth);
  const { id } = await ctx.params;
  const db = getDb();
  await db.delete(sitePages).where(eq(sitePages.id, id));
  return new NextResponse(null, { status: 204 });
}
