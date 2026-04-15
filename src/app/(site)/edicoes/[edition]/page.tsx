import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getPublishedMagazineByEditionNumber } from "@/lib/cms-public";
import { magazineToJson } from "@/lib/magazine-dto";
import { siteConfig } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default async function EdicaoPublicPage({
  params,
}: {
  params: Promise<{ edition: string }>;
}) {
  const { edition } = await params;
  const data = await getPublishedMagazineByEditionNumber(edition);
  if (!data) notFound();
  const m = magazineToJson(data.magazine, data.pages);
  const vol = m.volume != null ? `Volume ${m.volume}` : null;
  const loc = m.location?.trim() || null;
  const meta = [vol, loc].filter(Boolean).join(" · ");
  const dateLabel = m.publishedAt
    ? new Date(m.publishedAt as unknown as string).toLocaleDateString("pt-PT", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article className="pb-20">
      <div className="border-b border-border/60 bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
          <Link
            href="/edicoes"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 -ml-2")}
          >
            <ArrowLeft className="size-4" />
            Todas as edições
          </Link>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
            {siteConfig.name}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            {m.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {m.editionNumber != null && <>Edição {m.editionNumber}</>}
            {dateLabel && (
              <>
                {m.editionNumber != null ? " · " : ""}
                {dateLabel}
              </>
            )}
            {meta ? ` · ${meta}` : ""}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/edicoes/${edition}/revista`}
              className={cn(buttonVariants({ size: "lg" }), "shadow-sm")}
            >
              Abrir leitura estilo revista
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-xl border border-border/80 shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.coverImageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        {m.description && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-semibold">Sobre esta edição</h2>
            <p className="mt-4 whitespace-pre-wrap leading-relaxed text-muted-foreground">{m.description}</p>
          </section>
        )}
      </div>
    </article>
  );
}
