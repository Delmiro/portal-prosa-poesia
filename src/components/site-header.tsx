"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { Instagram, Menu, Search } from "lucide-react";
import { mainNav, siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

/** Inspiração: portal institucional (ufc.br) — azul, links azuis, item ativo laranja. */
const BLUE_TOP = "bg-[#003366]";
const LINK_BLUE = "text-[#0054a6] hover:text-[#003d7a] hover:underline";
const ACTIVE_ORANGE = "border-t-[3px] border-[#e87722] text-[#c45f12]";

const quickLinks = [
  { href: "/autores", label: "Autores" },
  { href: "/edicoes", label: "Edições" },
  { href: "/edicoes/20/revista", label: "Leitura folheada" },
  { href: "/contato", label: "Contatos" },
] as const;

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchId = useId();
  const [fontPct, setFontPct] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontPct}%`;
  }, [fontPct]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast-portal", highContrast);
    return () => document.documentElement.classList.remove("high-contrast-portal");
  }, [highContrast]);

  const onSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const q = String(fd.get("q") ?? "").trim();
      if (q) router.push(`/edicoes?q=${encodeURIComponent(q)}`);
      else router.push("/edicoes");
    },
    [router]
  );

  return (
    <header id="topo" className="relative z-10 text-zinc-900 shadow-sm">
      {/* 1 — Barra superior (gov / institucional) */}
      <div className={cn(BLUE_TOP, "text-white")}>
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-2 px-3 py-1.5 sm:px-5">
          <Link
            href="/sobre"
            className="rounded-full bg-[#f5c400] px-2.5 py-1 text-[11px] font-semibold text-zinc-900 shadow-sm hover:bg-[#e6b800] sm:px-3 sm:text-xs"
          >
            Acesso à Informação
          </Link>
          <a
            href="https://www.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#f5c400] px-2.5 py-1 text-[11px] font-semibold text-zinc-900 shadow-sm hover:bg-[#e6b800] sm:px-3 sm:text-xs"
          >
            <span aria-hidden>🇧🇷</span>
            BRASIL
          </a>
        </div>
      </div>

      {/* 2 — Atalhos de acessibilidade + tamanho da fonte */}
      <div className="border-b border-zinc-200/80 bg-zinc-100">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-3 py-1.5 text-[11px] sm:px-5 sm:text-xs">
          <nav aria-label="Atalhos de acessibilidade" className="flex flex-wrap items-center gap-x-1 text-[#0054a6]">
            <a href="#conteudo" className={LINK_BLUE}>
              Ir para conteúdo
            </a>
            <span className="text-zinc-400" aria-hidden>
              |
            </span>
            <a href="#menu-principal" className={LINK_BLUE}>
              Ir para menu
            </a>
            <span className="text-zinc-400" aria-hidden>
              |
            </span>
            <a href="#rodape" className={LINK_BLUE}>
              Ir para rodapé
            </a>
            <span className="text-zinc-400" aria-hidden>
              |
            </span>
            <button
              type="button"
              className={cn(LINK_BLUE, "cursor-pointer bg-transparent font-inherit")}
              onClick={() => setHighContrast((v) => !v)}
              aria-pressed={highContrast}
            >
              Alto contraste
            </button>
            <span className="text-zinc-400" aria-hidden>
              |
            </span>
            <Link href="/contato" className={LINK_BLUE}>
              Acessibilidade
            </Link>
          </nav>
          <div className="flex flex-wrap items-center gap-x-1 text-zinc-600">
            <span className="font-medium">Fonte:</span>
            <button
              type="button"
              className="cursor-pointer bg-transparent font-semibold text-[#0054a6] hover:underline"
              onClick={() => setFontPct((p) => Math.min(130, p + 6))}
            >
              A+
            </button>
            <span className="text-zinc-400" aria-hidden>
              |
            </span>
            <button
              type="button"
              className="cursor-pointer bg-transparent font-semibold text-[#0054a6] hover:underline"
              onClick={() => setFontPct((p) => Math.max(82, p - 6))}
            >
              A-
            </button>
            <span className="text-zinc-400" aria-hidden>
              |
            </span>
            <button
              type="button"
              className="cursor-pointer bg-transparent font-semibold text-[#0054a6] hover:underline"
              onClick={() => setFontPct(100)}
            >
              A
            </button>
          </div>
        </div>
      </div>

      {/* 3 — Logo, links rápidos, busca e redes */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-3 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:px-5 sm:py-5">
          <Link href="/" className="group flex max-w-xl shrink-0 gap-3 sm:gap-4">
            <span
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-sm font-bold uppercase leading-none text-white sm:h-[4.5rem] sm:w-[4.5rem] sm:text-sm",
                BLUE_TOP
              )}
              aria-hidden
            >
              AL
            </span>
            <span className="min-w-0 text-left leading-tight">
              <span className="block font-serif text-[10px] font-semibold uppercase tracking-wide text-zinc-600 sm:text-[11px]">
                Periódico da Academia de Letras e Artes
              </span>
              <span className="mt-0.5 block font-serif text-base font-semibold uppercase tracking-tight text-zinc-900 sm:text-lg md:text-xl">
                Antônio Sales
              </span>
              <span className="mt-1 block font-serif text-lg font-semibold leading-snug text-zinc-900 sm:text-xl md:text-2xl">
                {siteConfig.name}
              </span>
            </span>
          </Link>

          <div className="flex min-w-0 flex-1 flex-col items-stretch gap-3 sm:max-w-xl sm:items-end">
            <nav aria-label="Serviços e atalhos" className="flex flex-wrap justify-start gap-x-4 gap-y-1 sm:justify-end">
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} className={cn("text-xs font-medium sm:text-sm", LINK_BLUE)}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <form
              onSubmit={onSearch}
              className="relative w-full sm:max-w-md"
              role="search"
              aria-label="Procurar no portal"
            >
              <label htmlFor={searchId} className="sr-only">
                Procurar no portal
              </label>
              <input
                id={searchId}
                name="q"
                type="search"
                placeholder="Procurar..."
                className="w-full rounded border border-zinc-300 bg-zinc-50 py-2 pr-10 pl-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-[#0054a6] focus:outline-none focus:ring-1 focus:ring-[#0054a6]"
                autoComplete="off"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1.5 text-zinc-500 hover:bg-zinc-200 hover:text-[#0054a6]"
                aria-label="Pesquisar"
              >
                <Search className="size-4" />
              </button>
            </form>
            <div className="flex items-center justify-start gap-2 sm:justify-end">
              <a
                href={siteConfig.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-8 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 hover:border-[#0054a6] hover:text-[#0054a6]"
                aria-label={`Instagram ${siteConfig.instagram.handle}`}
              >
                <Instagram className="size-4" />
              </a>
              <a
                href={siteConfig.sitePublicacao.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-zinc-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 hover:border-[#0054a6] hover:text-[#0054a6] sm:text-[11px]"
              >
                Site
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4 — Menu principal (item ativo: borda superior laranja) */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2 sm:px-4">
          <nav
            id="menu-principal"
            className="hidden min-h-[3rem] flex-1 flex-wrap items-stretch justify-center gap-0 lg:flex xl:justify-start"
            aria-label="Menu principal"
          >
            {mainNav.map((item) => {
              const active = isNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center border-t-[3px] border-transparent px-2.5 py-2.5 text-sm font-normal text-[#0054a6] transition-colors hover:bg-zinc-50 xl:px-3.5",
                    active && ACTIVE_ORANGE
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 py-2 lg:ml-0 lg:shrink-0">
            <Link
              href="/edicoes/20/revista"
              className={cn(
                buttonVariants({ size: "sm" }),
                "gap-1.5 border-0 bg-[#003366] px-3 text-white shadow-none hover:bg-[#00264d]"
              )}
            >
              <span className="hidden sm:inline">Ler revista</span>
              <span className="sm:hidden">Revista</span>
            </Link>

            <details className="relative lg:hidden">
              <summary className="list-none [&::-webkit-details-marker]:hidden">
                <span className="sr-only">Abrir menu</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50"
                  aria-label="Menu"
                  aria-controls="menu-principal-mobile"
                >
                  <Menu className="size-5" />
                </Button>
              </summary>
              <div
                id="menu-principal-mobile"
                className="absolute right-0 z-50 mt-2 max-h-[min(70vh,28rem)] w-[min(100vw-1rem,20rem)] overflow-y-auto rounded-md border border-zinc-200 bg-white py-2 shadow-lg"
              >
                {mainNav.map((item) => {
                  const active = isNavActive(pathname, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "block px-4 py-2.5 text-sm text-[#0054a6] hover:bg-zinc-50",
                        active && "bg-orange-50 font-semibold text-[#c45f12]"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </details>
          </div>
        </div>
      </div>
    </header>
  );
}
