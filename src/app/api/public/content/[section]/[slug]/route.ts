import { NextResponse } from "next/server";
import { isCmsSectionSlug } from "@/lib/cms-sections";
import { getPublishedEntry } from "@/lib/cms-public";

type Ctx = { params: Promise<{ section: string; slug: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { section, slug } = await ctx.params;
  if (!isCmsSectionSlug(section)) {
    return NextResponse.json({ message: "Secção inválida" }, { status: 400 });
  }
  const row = await getPublishedEntry(section, slug);
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
    createdAt: row.createdAt?.toISOString?.() ?? String(row.createdAt),
  });
}
