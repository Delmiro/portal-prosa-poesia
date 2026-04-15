import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublishedEntry } from "@/lib/cms-public";
import type { CmsSectionSlug } from "@/lib/cms-sections";
import { CMS_SECTIONS } from "@/lib/cms-sections";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

function sectionLabel(slug: CmsSectionSlug) {
  return CMS_SECTIONS.find((s) => s.slug === slug)?.label ?? slug;
}

export async function CmsEntryDetail({
  section,
  slug,
}: {
  section: CmsSectionSlug;
  slug: string;
}) {
  const entry = await getPublishedEntry(section, slug);
  if (!entry) notFound();
  const label = sectionLabel(section);
  const hasHtml = entry.body.includes("<") && entry.body.includes(">");
  return (
    <article className="pb-20">
      <div className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <Link
            href={`/${section}`}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 -ml-2")}
          >
            <ArrowLeft className="size-4" />
            {label}
          </Link>
          <p className="mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            {entry.title}
          </h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 pt-10 sm:px-6">
        {entry.imageUrl && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={entry.imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}
        <div
          className={cn(
            "prose prose-neutral max-w-none dark:prose-invert",
            "prose-p:leading-relaxed",
          )}
        >
          {hasHtml ? (
            <div dangerouslySetInnerHTML={{ __html: entry.body }} />
          ) : (
            <div className="whitespace-pre-wrap text-base leading-relaxed">{entry.body}</div>
          )}
        </div>
      </div>
    </article>
  );
}
