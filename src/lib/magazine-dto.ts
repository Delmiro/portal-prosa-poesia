import type { magazinePages, magazines } from "@/db/schema";

export function magazineToJson(
  m: typeof magazines.$inferSelect,
  pages: (typeof magazinePages.$inferSelect)[],
) {
  const ordered = [...pages].sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    id: m.id,
    title: m.title,
    editionNumber: m.editionNumber ?? null,
    volume: m.volume ?? null,
    location: m.location ?? null,
    description: m.description,
    coverImageUrl: m.coverImageUrl,
    publishedAt: m.publishedAt,
    status: m.status,
    pages: ordered.map((p) => ({
      id: p.id,
      sortOrder: p.sortOrder,
      pdfUrl: p.pdfUrl,
      label: p.label,
    })),
  };
}
