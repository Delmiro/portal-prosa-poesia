import { NextResponse } from "next/server";
import { isCmsSectionSlug } from "@/lib/cms-sections";
import { getPublishedEntries } from "@/lib/cms-public";

type Ctx = { params: Promise<{ section: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { section } = await ctx.params;
  if (!isCmsSectionSlug(section)) {
    return NextResponse.json({ message: "Secção inválida" }, { status: 400 });
  }
  const rows = await getPublishedEntries(section);
  return NextResponse.json(
    rows.map((r) => ({
      id: r.id,
      sectionSlug: r.sectionSlug,
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      imageUrl: r.imageUrl,
      sortOrder: r.sortOrder,
      createdAt: r.createdAt?.toISOString?.() ?? String(r.createdAt),
    })),
  );
}
