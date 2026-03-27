import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { InstagramOriginalIcon } from "@/components/instagram-original-icon";

export function SiteFooter() {
  const { instagram } = siteConfig;

  return (
    <footer
      id="rodape"
      className="terracotta-gold ornate-band mt-auto border-t border-[var(--gold-strong)] text-white/90"
    >
      <div className="site-container py-12 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-10">
          <div className="lg:col-span-1">
            <p className="border-l-4 border-[var(--gold-soft)] pl-3 font-serif text-lg font-semibold text-white">
              {siteConfig.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/85">{siteConfig.institution}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/75">{siteConfig.description}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">Revista</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/edicoes" className="text-white/90 hover:text-white hover:underline">
                  Edições
                </Link>
              </li>
              <li>
                <Link href="/edicoes/20/revista" className="text-white/90 hover:text-white hover:underline">
                  Leitura folheada
                </Link>
              </li>
              <li>
                <Link href="/editorial" className="text-white/90 hover:text-white hover:underline">
                  Editorial
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="text-white/90 hover:text-white hover:underline">
                  Galeria
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">Conteúdos</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/poemas" className="text-white/90 hover:text-white hover:underline">
                  Poemas
                </Link>
              </li>
              <li>
                <Link href="/contos" className="text-white/90 hover:text-white hover:underline">
                  Contos
                </Link>
              </li>
              <li>
                <Link href="/cronicas" className="text-white/90 hover:text-white hover:underline">
                  Crônicas
                </Link>
              </li>
              <li>
                <Link href="/artigos" className="text-white/90 hover:text-white hover:underline">
                  Artigos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/75">Redes e contacto</p>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Siga a revista no Instagram — referência na edição em PDF.
            </p>
            <a
              href={siteConfig.sitePublicacao.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm text-white/90 underline-offset-2 hover:text-white hover:underline"
            >
              {siteConfig.sitePublicacao.label}
            </a>
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded border border-[var(--gold-strong)]/70 bg-black/15 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black/25"
            >
              <InstagramOriginalIcon className="size-6 shrink-0" />
              <span>{instagram.handle}</span>
            </a>
            <ul className="mt-6 space-y-2.5 text-sm">
              <li>
                <Link href="/autores" className="text-white/90 hover:text-white hover:underline">
                  Autores
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-white/90 hover:text-white hover:underline">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-white/90 hover:text-white hover:underline">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--gold-strong)]/60 bg-black/25 py-4 text-center text-xs text-white/70">
        <div className="site-container">
          © {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
