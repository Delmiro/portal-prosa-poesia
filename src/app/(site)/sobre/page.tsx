import { PageHeading } from "@/components/page-heading";
import { siteConfig } from "@/lib/site";
import { edicao20Meta, editorialEdicao20, manifestoRevista } from "@/content/edicao-20";

export default function SobrePage() {
  return (
    <div>
      <PageHeading
        title="Sobre o periódico"
        description={`${siteConfig.institution} · Edição ${edicao20Meta.numero} (${edicao20Meta.mesAno}).`}
      />
      <article className="mx-auto max-w-prose space-y-8 px-4 pb-20 sm:px-6">
        <p className="text-center font-serif text-xl font-semibold leading-snug">
          {siteConfig.name}
        </p>
        <p className="leading-relaxed text-muted-foreground">{siteConfig.description}</p>
        <blockquote className="border-l-4 border-primary/40 pl-6 font-serif text-lg italic leading-relaxed text-foreground/90 whitespace-pre-line">
          {manifestoRevista}
        </blockquote>
        <p className="leading-relaxed text-muted-foreground">
          O portal digital replica a experiência da edição em PDF: capa, editorial (
          {editorialEdicao20.linhaEditores}), microcontos, poemas e textos de humor — com
          leitura confortável e navegação por seções.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          A área administrativa (em desenvolvimento) permitirá novas edições mensais,
          padronização de imagens 16:9 e editor rico para o corpo dos textos.
        </p>
      </article>
    </div>
  );
}
