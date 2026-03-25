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
    <div className="min-w-0">
      <section className="relative overflow-hidden border-b border-zinc-200 bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,oklch(0.99_0.01_95)_0%,oklch(0.97_0.01_95)_100%)]"
          aria-hidden
        />
        <div className="site-container relative site-section-y">
          <p className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-zinc-500 sm:text-xs">
            Edição {edicao20Meta.numero} · {edicao20Meta.mesAno} · {edicao20Meta.local}
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Volume {edicao20Meta.volume}
          </p>
          <h1 className="site-hero-title mt-6 text-center font-serif font-semibold tracking-tight text-zinc-900">
            {siteConfig.name}
          </h1>
          <p className="site-hero-lead mx-auto mt-4 max-w-2xl text-center font-medium text-zinc-800">
            {siteConfig.institution}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-zinc-600 sm:text-lg">
            {siteConfig.description}
          </p>
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <Link
              href="/edicoes/20"
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full justify-center gap-2 sm:w-auto has-data-[icon=inline-end]:pr-3"
              )}
            >
              Ler edição atual
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Link>
            <Link
              href="/sobre"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full justify-center sm:w-auto")}
            >
              Sobre o projeto
            </Link>
            <Link
              href="/edicoes/20/revista"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full justify-center sm:w-auto")}
            >
              Virar páginas como revista
            </Link>
          </div>
        </div>
      </section>

      <section className="site-container site-section-y">
        <blockquote className="mx-auto max-w-3xl border-l-4 border-[#d33a2c] pl-5 font-serif text-base leading-relaxed text-zinc-800 italic sm:pl-6 sm:text-lg whitespace-pre-line">
          {manifestoRevista}
        </blockquote>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-900 py-12 text-white sm:py-16 md:py-20">
        <div className="site-container text-center">
          <p className="font-serif text-lg font-semibold leading-snug sm:text-2xl">
            {chamadaAutoresPdf.titulo}
          </p>
          <p className="mt-2 text-sm text-white/90 sm:text-base">
            {chamadaAutoresPdf.creditoEditores}
          </p>
          <p className="mt-6 text-xl font-bold tracking-wide text-[#fca5a5] sm:text-2xl">
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

      <section className="site-container site-section-y">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="border-l-4 border-[#d33a2c] pl-4 font-serif text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
              Destaques da edição 20
            </h2>
            <p className="mt-2 max-w-xl text-zinc-600">
              Seleção de textos da edição em PDF — microconto, humor e poesia.
            </p>
          </div>
          <Link
            href="/edicoes"
            className="shrink-0 text-sm font-semibold text-[#d33a2c] underline-offset-4 hover:underline"
          >
            Ver todas as edições
          </Link>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
          {destaquesConteudo.map((item, index) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group block overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition hover:border-[#d33a2c]/45 hover:shadow-md"
              >
                <Thumb16x9
                  src={item.imagemSrc}
                  alt={item.imagemAlt}
                  priority={index === 0}
                />
                <div className="p-4 sm:p-5">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-zinc-500 sm:text-xs">
                    {item.tipo} · {item.autor}
                  </p>
                  <p className="mt-2 font-serif text-base font-medium leading-snug text-zinc-900 group-hover:text-[#d33a2c] sm:text-lg">
                    {item.titulo}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.resumo}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-14 md:py-20">
        <div className="site-container">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 shrink-0 rounded-full bg-[#d33a2c]" aria-hidden />
            <PenLine className="size-5 shrink-0 text-zinc-500" aria-hidden />
            <h2 className="min-w-0 font-serif text-xl font-semibold text-zinc-900 sm:text-2xl">
              Autores nesta edição
            </h2>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
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
          <div className="mt-10 flex justify-center sm:justify-start">
            <Link
              href="/autores"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full sm:w-auto")}
            >
              Página de autores
            </Link>
          </div>
        </div>
      </section>

      <section className="site-container site-section-y">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 shrink-0 rounded-full bg-[#d33a2c]" aria-hidden />
          <BookOpen className="size-5 shrink-0 text-zinc-500" aria-hidden />
          <h2 className="min-w-0 font-serif text-xl font-semibold text-zinc-900 sm:text-2xl">
            Seções da revista
          </h2>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {[
            { label: "Editorial", href: "/editorial", desc: "Abertura dos editores" },
            { label: "Artigos", href: "/artigos", desc: "Ensaios e textos de fundo" },
            { label: "Poemas", href: "/poemas", desc: "Versos e voz" },
            { label: "Contos", href: "/contos", desc: "Ficção curta e microcontos" },
          ].map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-[#d33a2c]/50 hover:shadow-md sm:p-6"
            >
              <p className="font-serif text-base font-semibold text-zinc-900 sm:text-lg">{section.label}</p>
              <p className="mt-2 text-sm text-zinc-600">{section.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
