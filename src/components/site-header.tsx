"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { BookOpen, Menu, Search, X } from "lucide-react";
import { mainNav, siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { InstagramOriginalIcon } from "@/components/instagram-original-icon";
import { cn } from "@/lib/utils";

/** Topo institucional; links e ativos no estilo editorial (smashingmagazine.com). */
const BLUE_TOP = "terracotta-gold ornate-band";
const LINK_ACCENT = "text-primary hover:text-primary/80 hover:underline";
const ACTIVE_NAV =
  "border-t-[3px] border-primary bg-[#fffdf9]/80 text-[#1a1a1a] font-medium";

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontPct}%`;
  }, [fontPct]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast-portal", highContrast);
    return () => document.documentElement.classList.remove("high-contrast-portal");
  }, [highContrast]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

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
    <header id="topo" className="relative z-10 text-zinc-900">
      {/* ——— Mobile: barra compacta (estilo apps de notícias / NYT) ——— */}
      <div className="terracotta-gold ornate-band sticky top-0 z-40 border-b border-[var(--gold-strong)] shadow-[0_1px_0_rgba(0,0,0,0.18)] lg:hidden">
        <div
          className="site-container grid grid-cols-[2.75rem_minmax(0,1fr)_auto] items-center gap-2 py-2.5 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]"
          style={{ minHeight: "3.25rem" }}
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-10 shrink-0 text-white hover:bg-white/15"
            aria-label="Abrir menu"
            aria-expanded={mobileNavOpen}
            aria-controls="menu-principal-mobile"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-[1.35rem]" strokeWidth={2} />
          </Button>

          <Link
            href="/"
            className="min-w-0 justify-self-center text-center font-serif text-[0.95rem] font-semibold leading-tight tracking-tight text-white sm:text-base"
          >
            <span className="line-clamp-2">{siteConfig.name}</span>
          </Link>

          <div className="flex shrink-0 items-center justify-end gap-1">
            <Link
              href="/edicoes/20/revista"
              className={cn(
                buttonVariants({ size: "sm" }),
                "ornate-action h-9 gap-1 border-0 bg-primary px-2.5 text-xs font-semibold text-white shadow-none hover:bg-[var(--primary-strong)] sm:px-3"
              )}
              aria-label="Ler revista"
            >
              <BookOpen className="size-4 shrink-0" />
              <span className="hidden min-[380px]:inline">Revista</span>
            </Link>
            <a
              href={siteConfig.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-10 shrink-0 items-center justify-center rounded-full text-white/90 transition hover:bg-white/15 hover:text-white"
              aria-label={`Instagram ${siteConfig.instagram.handle}`}
            >
              <InstagramOriginalIcon className="size-6" />
            </a>
          </div>
        </div>

        <div className="border-t border-[var(--gold-strong)]/70 bg-[#fff7ea]">
          <nav
            id="menu-principal"
            className="site-container flex flex-nowrap items-stretch gap-0 overflow-x-auto overscroll-x-contain py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Secções do portal"
          >
            {mainNav.map((item) => {
              const active = isNavActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-1.5 text-[0.8rem] font-medium text-zinc-600 transition first:pl-[max(0.25rem,env(safe-area-inset-left))] last:pr-[max(0.25rem,env(safe-area-inset-right))] sm:text-sm",
                    active
                      ? "border-primary text-primary"
                      : "border-transparent hover:text-primary"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ——— Desktop (lg+): cabeçalho institucional completo ——— */}
      <div className="hidden shadow-sm lg:block">
        <div className={cn(BLUE_TOP, "text-white")}>
          <div className="site-container flex items-center justify-end gap-2 py-1.5">
            <Link
              href="/sobre"
              className="rounded-full border border-[var(--gold-strong)] bg-[linear-gradient(180deg,#f6da97_0%,#e8be63_100%)] px-2.5 py-1 text-[11px] font-semibold text-[#4a3215] shadow-sm hover:brightness-95 sm:px-3 sm:text-xs"
            >
              Acesso à Informação
            </Link>
            <a
              href="https://www.gov.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold-strong)] bg-[linear-gradient(180deg,#f6da97_0%,#e8be63_100%)] px-2.5 py-1 text-[11px] font-semibold text-[#4a3215] shadow-sm hover:brightness-95 sm:px-3 sm:text-xs"
            >
              <span aria-hidden>🇧🇷</span>
              BRASIL
            </a>
          </div>
        </div>

        <div className="border-b border-zinc-200/80 bg-zinc-100">
          <div className="site-container flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 py-1.5 text-[11px] sm:text-xs">
            <nav
              aria-label="Atalhos de acessibilidade"
              className="flex min-w-0 max-w-full flex-1 flex-wrap items-center gap-x-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <a href="#conteudo" className={LINK_ACCENT}>
                Ir para conteúdo
              </a>
              <span className="text-zinc-400" aria-hidden>
                |
              </span>
              <a href="#menu-principal-desktop" className={LINK_ACCENT}>
                Ir para menu
              </a>
              <span className="text-zinc-400" aria-hidden>
                |
              </span>
              <a href="#rodape" className={LINK_ACCENT}>
                Ir para rodapé
              </a>
              <span className="text-zinc-400" aria-hidden>
                |
              </span>
              <button
                type="button"
                className={cn(LINK_ACCENT, "cursor-pointer bg-transparent font-inherit")}
                onClick={() => setHighContrast((v) => !v)}
                aria-pressed={highContrast}
              >
                Alto contraste
              </button>
              <span className="text-zinc-400" aria-hidden>
                |
              </span>
              <Link href="/contato" className={LINK_ACCENT}>
                Acessibilidade
              </Link>
            </nav>
            <div className="flex flex-wrap items-center gap-x-1 text-zinc-600">
              <span className="font-medium">Fonte:</span>
              <button
                type="button"
                className="cursor-pointer bg-transparent font-semibold text-primary hover:underline"
                onClick={() => setFontPct((p) => Math.min(130, p + 6))}
              >
                A+
              </button>
              <span className="text-zinc-400" aria-hidden>
                |
              </span>
              <button
                type="button"
                className="cursor-pointer bg-transparent font-semibold text-primary hover:underline"
                onClick={() => setFontPct((p) => Math.max(82, p - 6))}
              >
                A-
              </button>
              <span className="text-zinc-400" aria-hidden>
                |
              </span>
              <button
                type="button"
                className="cursor-pointer bg-transparent font-semibold text-primary hover:underline"
                onClick={() => setFontPct(100)}
              >
                A
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-zinc-200 bg-white">
          <div className="site-container flex flex-col gap-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:py-5">
            <Link href="/" className="group flex max-w-xl shrink-0 gap-3 sm:gap-4">
              <span
                className="terracotta-gold ornate-trim flex h-14 w-14 shrink-0 items-center justify-center rounded-sm font-bold uppercase leading-none text-white sm:h-[4.5rem] sm:w-[4.5rem] sm:text-sm"
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
                  <Link key={item.href} href={item.href} className={cn("text-xs font-medium sm:text-sm", LINK_ACCENT)}>
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
                  className="w-full rounded border border-zinc-300 bg-white py-2 pr-10 pl-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1.5 text-zinc-500 hover:bg-zinc-200 hover:text-primary"
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
                  className="flex size-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-600 hover:border-primary hover:text-primary"
                  aria-label={`Instagram ${siteConfig.instagram.handle}`}
                >
                  <InstagramOriginalIcon className="size-6" />
                </a>
                <a
                  href={siteConfig.sitePublicacao.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-zinc-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 hover:border-primary hover:text-primary sm:text-[11px]"
                >
                  Site
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-zinc-200 bg-white">
          <div className="site-container flex items-center justify-between gap-2 py-0">
            <nav
              id="menu-principal-desktop"
              className="flex min-h-[3rem] flex-1 flex-wrap items-stretch justify-center gap-0 xl:justify-start"
              aria-label="Menu principal"
            >
              {mainNav.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center border-t-[3px] border-transparent px-2.5 py-2.5 text-sm font-normal text-zinc-700 transition-colors hover:bg-[#fffdf9] hover:text-primary xl:px-3.5",
                      active && ACTIVE_NAV
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-2 py-2">
              <Link
                href="/edicoes/20/revista"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "ornate-action gap-1.5 border-0 bg-primary px-3 text-white shadow-none hover:bg-[var(--primary-strong)]"
                )}
              >
                Ler revista
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Painel do menu (mobile): abre pela esquerda */}
      {mobileNavOpen ? (
        <div
          className="fixed inset-0 z-[100] flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
          id="menu-principal-mobile"
        >
          <div className="flex h-full w-[min(100%,22rem)] flex-col border-r border-zinc-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
              <span className="font-serif text-base font-semibold text-zinc-900">Menu</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                aria-label="Fechar"
                onClick={() => setMobileNavOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>

            <form
              onSubmit={(e) => {
                onSearch(e);
                setMobileNavOpen(false);
              }}
              className="border-b border-zinc-100 p-3"
            >
              <label htmlFor={`${searchId}-drawer`} className="sr-only">
                Procurar no portal
              </label>
              <div className="relative">
                <input
                  id={`${searchId}-drawer`}
                  name="q"
                  type="search"
                  placeholder="Procurar..."
                  className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-2.5 pr-10 pl-3 text-sm"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1.5 text-zinc-500"
                  aria-label="Pesquisar"
                >
                  <Search className="size-4" />
                </button>
              </div>
            </form>

            <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-3 pb-[max(1rem,env(safe-area-inset-bottom))]" aria-label="Secções do site">
              {mainNav.map((item) => {
                const active = isNavActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-3 py-3 text-[0.95rem] font-medium text-zinc-800 transition hover:bg-zinc-100",
                      active && "bg-zinc-100 font-semibold text-zinc-900"
                    )}
                    onClick={() => setMobileNavOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/contato"
                className="mt-2 rounded-lg px-3 py-3 text-[0.95rem] font-medium text-zinc-600 hover:bg-zinc-50"
                onClick={() => setMobileNavOpen(false)}
              >
                Acessibilidade / Contato
              </Link>
            </nav>
          </div>
          <button
            type="button"
            className="min-h-0 min-w-0 flex-1 bg-zinc-950/50 backdrop-blur-[2px]"
            aria-label="Fechar menu"
            onClick={() => setMobileNavOpen(false)}
          />
        </div>
      ) : null}
    </header>
  );
}
