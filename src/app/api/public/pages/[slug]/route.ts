import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { sitePages } from "@/db/schema";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const db = getDb();
  const [p] = await db
    .select()
    .from(sitePages)
    .where(and(eq(sitePages.slug, slug.toLowerCase()), eq(sitePages.status, "PUBLISHED")))
    .limit(1);
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
