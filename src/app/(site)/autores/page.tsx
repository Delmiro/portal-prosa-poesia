import { PageHeading } from "@/components/page-heading";
import { AuthorAvatar } from "@/components/author-avatar";
import { autoresEdicao20, edicao20Meta } from "@/content/edicao-20";

export default function AutoresPage() {
  return (
    <div>
      <PageHeading
        title="Autores"
        description={`Participantes da edição ${edicao20Meta.numero} (${edicao20Meta.mesAno}).`}
      />
      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <ul className="space-y-8">
          {autoresEdicao20.map((a, index) => (
            <li
              key={a.nome}
              className="flex gap-6 border-b border-border/60 pb-8 last:border-0"
            >
              <AuthorAvatar src={a.fotoSrc} alt={a.fotoAlt} size="md" priority={index < 2} />
              <div>
                <p className="font-serif text-xl font-semibold">{a.nome}</p>
                <p className="mt-1 text-sm text-muted-foreground">{a.destaque}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-sm text-muted-foreground">
          Em versões futuras: biografias completas, links para obras e foto oficial de cada autor.
        </p>
      </div>
    </div>
  );
}
