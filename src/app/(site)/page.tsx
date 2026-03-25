import Link from "next/link";
import { ArrowRight, BookOpen, PenLine } from "lucide-react";
import {
  autoresEdicao20,
  chamadaAutoresPdf,
  destaquesConteudo,
  editoresDestaqueEdicao20,
  edicao20Meta,
  manifestoRevista,
} from "@/content/edicao-20";
import { siteConfig } from "@/lib/site";
import { AuthorAvatar } from "@/components/author-avatar";
import { Thumb16x9 } from "@/components/thumb-16x9";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,oklch(0.99_0.01_95)_0%,oklch(0.97_0.01_95)_100%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Edição {edicao20Meta.numero} · {edicao20Meta.mesAno} · {edicao20Meta.local}
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Volume {edicao20Meta.volume}
          </p>
          <h1 className="mt-6 text-center font-serif text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl md:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base font-medium text-zinc-800 sm:text-lg">
            {siteConfig.institution}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-zinc-600 sm:text-xl">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/edicoes/20"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 has-data-[icon=inline-end]:pr-3"
              )}
            >
              Ler edição atual
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Link>
            <Link href="/sobre" className={buttonVariants({ variant: "outline", size: "lg" })}>
              Sobre o projeto
            </Link>
            <Link
              href="/edicoes/20/revista"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Virar páginas como revista
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <blockquote className="border-l-4 border-[#006633] pl-6 font-serif text-lg leading-relaxed text-zinc-800 italic whitespace-pre-line">
          {manifestoRevista}
        </blockquote>
      </section>

      <section className="border-y border-[#004d26] bg-[#006633] py-12 text-white sm:py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="font-serif text-lg font-semibold leading-snug sm:text-2xl">
            {chamadaAutoresPdf.titulo}
          </p>
          <p className="mt-2 text-sm text-white/90 sm:text-base">
            {chamadaAutoresPdf.creditoEditores}
          </p>
          <p className="mt-6 text-xl font-bold tracking-wide text-amber-200 sm:text-2xl">
            {chamadaAutoresPdf.subtitulo}
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-10 sm:flex-row sm:items-start sm:gap-20">
            {editoresDestaqueEdicao20.map((ed) => (
              <div key={ed.nome} className="flex flex-col items-center">
                <AuthorAvatar
                  src={ed.fotoSrc}
                  alt={ed.fotoAlt}
                  size="xl"
                  className="ring-2 ring-white/30"
                  priority
                />
                <p className="mt-4 font-serif text-lg font-semibold sm:text-xl">{ed.nome}</p>
                <p className="mt-1 text-sm text-white/85">{ed.destaque}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="border-l-4 border-[#006633] pl-4 font-serif text-3xl font-semibold tracking-tight text-zinc-900">
              Destaques da edição 20
            </h2>
            <p className="mt-2 max-w-xl text-zinc-600">
              Seleção de textos da edição em PDF — microconto, humor e poesia.
            </p>
          </div>
          <Link
            href="/edicoes"
            className="text-sm font-semibold text-[#006633] underline-offset-4 hover:underline"
          >
            Ver todas as edições
          </Link>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {destaquesConteudo.map((item, index) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group block overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:border-[#006633]/40 hover:shadow-md"
              >
                <Thumb16x9
                  src={item.imagemSrc}
                  alt={item.imagemAlt}
                  priority={index === 0}
                />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    {item.tipo} · {item.autor}
                  </p>
                  <p className="mt-2 font-serif text-lg font-medium leading-snug text-zinc-900 group-hover:text-[#006633]">
                    {item.titulo}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.resumo}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 shrink-0 rounded-full bg-[#006633]" aria-hidden />
            <PenLine className="size-5 text-zinc-500" aria-hidden />
            <h2 className="font-serif text-2xl font-semibold text-zinc-900">
              Autores nesta edição
            </h2>
          </div>
          <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {autoresEdicao20.map((author, index) => (
              <li
                key={author.nome}
                className="flex flex-col items-center text-center sm:items-start sm:text-left"
              >
                <AuthorAvatar
                  src={author.fotoSrc}
                  alt={author.fotoAlt}
                  size="lg"
                  priority={index < 2}
                />
                <p className="mt-4 font-medium">{author.nome}</p>
                <p className="text-sm text-zinc-600">{author.destaque}</p>
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center sm:text-left">
            <Link
              href="/autores"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Página de autores
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 shrink-0 rounded-full bg-[#006633]" aria-hidden />
          <BookOpen className="size-5 text-zinc-500" aria-hidden />
          <h2 className="font-serif text-2xl font-semibold text-zinc-900">
            Seções da revista
          </h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Editorial", href: "/editorial", desc: "Abertura dos editores" },
            { label: "Artigos", href: "/artigos", desc: "Ensaios e textos de fundo" },
            { label: "Poemas", href: "/poemas", desc: "Versos e voz" },
            { label: "Contos", href: "/contos", desc: "Ficção curta e microcontos" },
          ].map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-[#006633]/50 hover:shadow-md"
            >
              <p className="font-serif text-lg font-semibold text-zinc-900">{section.label}</p>
              <p className="mt-2 text-sm text-zinc-600">{section.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
