import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { getPublishedMagazinesList } from "@/lib/cms-public";

export default async function EdicoesPage() {
  const list = await getPublishedMagazinesList();

  return (
    <div>
      <PageHeading
        title="Edições da revista"
        description="Cada edição reúne textos, imagens e vozes — como um número impresso, em formato digital."
      />
      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        {list.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Ainda não há edições publicadas. Configure-as no painel de administração.
          </p>
        ) : (
          <ul className="space-y-6">
            {list.map((m) => {
              const href =
                m.editionNumber != null ? `/edicoes/${m.editionNumber}` : null;
              const vol = m.volume != null ? `Volume ${m.volume}` : null;
              const loc = m.location?.trim() || null;
              const meta = [vol, loc].filter(Boolean).join(" · ");
              const inner = (
                <>
                  <div className="relative aspect-video w-full bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.coverImageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    {meta && (
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {meta}
                      </p>
                    )}
                    <h2 className="mt-2 font-serif text-2xl font-semibold">
                      {m.editionNumber != null ? (
                        <>Edição {m.editionNumber} · </>
                      ) : null}
                      {m.title}
                    </h2>
                    {m.description && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{m.description}</p>
                    )}
                  </div>
                </>
              );
              return (
                <li key={m.id}>
                  {href ? (
                    <Link
                      href={href}
                      className="flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition hover:border-primary/40"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">{m.title}</p>
                      <p className="mt-2">
                        Defina o número da edição no admin para gerar o link público desta página.
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
