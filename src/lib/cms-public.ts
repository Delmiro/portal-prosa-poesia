import { and, asc, desc, eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { contentEntries, magazines, magazinePages } from "@/db/schema";
import { magazineToJson } from "@/lib/magazine-dto";
import type { CmsSectionSlug } from "@/lib/cms-sections";
import { isCmsSectionSlug } from "@/lib/cms-sections";
export type PublishedMagazineWithPages = {
  magazine: typeof magazines.$inferSelect;
  pages: (typeof magazinePages.$inferSelect)[];
};

export async function getPublishedMagazinesList() {
  if (!isDatabaseConfigured()) return [];
  try {
    const db = getDb();
    const all = await db.select().from(magazines).where(eq(magazines.status, "PUBLISHED"));
    const sorted = [...all].sort((a, b) => {
      const da = a.publishedAt ? String(a.publishedAt) : "";
      const db_ = b.publishedAt ? String(b.publishedAt) : "";
      return db_.localeCompare(da);
    });
    const out = [];
    for (const m of sorted) {
      const pages = await db
        .select()
        .from(magazinePages)
        .where(eq(magazinePages.magazineId, m.id))
        .orderBy(asc(magazinePages.sortOrder));
      out.push(magazineToJson(m, pages));
    }
    return out;
  } catch {
    return [];
  }
}

export async function getPublishedEntries(section: CmsSectionSlug) {
  if (!isDatabaseConfigured()) return [];
  try {
    const db = getDb();
    return await db
      .select()
      .from(contentEntries)
      .where(
        and(eq(contentEntries.sectionSlug, section), eq(contentEntries.status, "PUBLISHED")),
      )
      .orderBy(asc(contentEntries.sortOrder), desc(contentEntries.createdAt));
  } catch {
    return [];
  }
}

export async function getPublishedEntry(section: string, slug: string) {
  if (!isCmsSectionSlug(section)) return null;
  if (!isDatabaseConfigured()) return null;
  try {
    const db = getDb();
    const [row] = await db
      .select()
      .from(contentEntries)
      .where(
        and(
          eq(contentEntries.sectionSlug, section),
          eq(contentEntries.slug, slug),
          eq(contentEntries.status, "PUBLISHED"),
        ),
      )
      .limit(1);
    return row ?? null;
  } catch {
    return null;
  }
}

/** Edição publicada pelo número (segmento de URL `/edicoes/20`). */
/** Links da edição mais recente (por data de publicação / criação). */
export async function getLatestPublishedEditionLinks(): Promise<{
  edicaoHref: string;
  flipHref: string;
}> {
  const list = await getPublishedMagazinesList();
  const first = list[0];
  if (!first) {
    return { edicaoHref: "/edicoes", flipHref: "/edicoes" };
  }
  const n = first.editionNumber;
  const hasPages = (first.pages?.length ?? 0) > 0;
  if (n != null) {
    return {
      edicaoHref: `/edicoes/${n}`,
      flipHref: hasPages ? `/edicoes/${n}/revista` : `/edicoes/${n}`,
    };
  }
  return { edicaoHref: "/edicoes", flipHref: "/edicoes" };
}

/** CTA “virar páginas” quando o menu não define `/revista`. */
export async function getPublishedRevistaFlipHref(): Promise<string> {
  const { flipHref } = await getLatestPublishedEditionLinks();
  return flipHref;
}

export async function getPublishedMagazineByEditionNumber(
  editionParam: string,
): Promise<PublishedMagazineWithPages | null> {
  if (!isDatabaseConfigured()) return null;
  const n = Number.parseInt(editionParam, 10);
  if (!Number.isFinite(n) || n < 1) return null;
  try {
    const db = getDb();
    const [m] = await db
      .select()
      .from(magazines)
      .where(and(eq(magazines.status, "PUBLISHED"), eq(magazines.editionNumber, n)))
      .limit(1);
    if (!m) return null;
    const pages = await db
      .select()
      .from(magazinePages)
      .where(eq(magazinePages.magazineId, m.id))
      .orderBy(asc(magazinePages.sortOrder));
    return { magazine: m, pages };
  } catch {
    return null;
  }
}
