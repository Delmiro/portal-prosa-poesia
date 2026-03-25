import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  autoresEdicao20,
  capaEdicao20,
  destaquesConteudo,
  edicao20Meta,
  editorialEdicao20,
} from "@/content/edicao-20";
import { siteConfig } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function Edicao20Page() {
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
            Edição {edicao20Meta.numero}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {edicao20Meta.mesAno} · Volume {edicao20Meta.volume} · {edicao20Meta.local}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/edicoes/20/revista"
              className={cn(buttonVariants({ size: "lg" }), "shadow-sm")}
            >
              Abrir leitura estilo revista
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-xl border border-border/80 shadow-md">
          <Image
            src={capaEdicao20.src}
            alt={capaEdicao20.alt}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold">{editorialEdicao20.tituloPrincipal}</h2>
          <p className="mt-3 text-muted-foreground">{editorialEdicao20.linhaEditores}</p>
          <p className="mt-4 line-clamp-4 leading-relaxed text-muted-foreground">
            {editorialEdicao20.colunaEsquerda.slice(0, 220)}…
          </p>
          <Link
            href="/editorial"
            className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Ler editorial completo
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold">Autores nesta edição</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {autoresEdicao20.map((a) => (
              <li
                key={a.nome}
                className="rounded-full border border-border bg-card px-3 py-1 text-sm text-foreground"
              >
                {a.nome}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold">Textos em destaque</h2>
          <ul className="mt-6 space-y-4">
            {destaquesConteudo.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex gap-4 rounded-lg border border-border/80 p-3 transition hover:border-primary/40 hover:bg-muted/30"
                >
                  <div className="relative hidden aspect-video w-36 shrink-0 overflow-hidden rounded-md sm:block">
                    <Image
                      src={item.imagemSrc}
                      alt={item.imagemAlt}
                      fill
                      sizes="144px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {item.tipo} · {item.autor}
                    </p>
                    <p className="mt-1 font-serif text-lg font-medium">{item.titulo}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.resumo}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
