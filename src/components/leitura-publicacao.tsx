import Link from "next/link";
import { edicao20Meta } from "@/content/edicao-20";

type LeituraPublicacaoProps = {
  tipo: string;
  titulo: string;
  autor: string;
  children: React.ReactNode;
};

export function LeituraPublicacao({
  tipo,
  titulo,
  autor,
  children,
}: LeituraPublicacaoProps) {
  return (
    <article className="mx-auto max-w-prose px-4 pb-24 pt-8 sm:px-6">
      <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
        {tipo} · Edição {edicao20Meta.numero} · {edicao20Meta.mesAno}
      </p>
      <h1 className="mt-4 text-center font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        {titulo}
      </h1>
      <p className="mt-4 text-center text-lg text-muted-foreground">{autor}</p>
      <div className="mt-12 space-y-6 text-[1.05rem] leading-relaxed text-foreground/95">
        {children}
      </div>
      <p className="mt-16 text-center text-sm text-muted-foreground">
        <Link href="/edicoes" className="underline-offset-4 hover:underline">
          Voltar às edições
        </Link>
      </p>
    </article>
  );
}
