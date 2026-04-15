import Link from "next/link";
import { getPublishedEntries } from "@/lib/cms-public";
import type { CmsSectionSlug } from "@/lib/cms-sections";

export async function CmsSectionEntryList({ section }: { section: CmsSectionSlug }) {
  const entries = await getPublishedEntries(section);
  if (entries.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        Ainda não há textos publicados nesta secção.
      </p>
    );
  }
  return (
    <ul className="mx-auto max-w-3xl space-y-4">
      {entries.map((e) => (
        <li key={e.id}>
          <Link
            href={`/${section}/${e.slug}`}
            className="block rounded-xl border border-border/80 bg-card p-5 shadow-sm transition hover:border-primary/40 hover:bg-muted/30"
          >
            <h2 className="font-serif text-xl font-semibold">{e.title}</h2>
            {e.excerpt && (
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{e.excerpt}</p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}
