import { PageHeading } from "@/components/page-heading";
import { editorialEdicao20, edicao20Meta } from "@/content/edicao-20";

export default function EditorialPage() {
  return (
    <div>
      <PageHeading
        title={editorialEdicao20.tituloPrincipal}
        description={`Edição ${edicao20Meta.numero} · ${edicao20Meta.mesAno} · ${edicao20Meta.local}`}
      />
      <article className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="columns-1 gap-8 text-justify leading-relaxed text-foreground sm:columns-2">
          <p className="whitespace-pre-line">{editorialEdicao20.colunaEsquerda}</p>
          <p className="mt-6 whitespace-pre-line sm:mt-0">{editorialEdicao20.colunaDireita}</p>
        </div>
        <p className="mt-10 text-right text-sm font-bold text-foreground">{editorialEdicao20.linhaEditores}</p>
      </article>
    </div>
  );
}
