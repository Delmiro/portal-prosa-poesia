import Link from "next/link";
import { Instagram } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const { instagram } = siteConfig;

  return (
    <footer id="rodape" className="mt-auto border-t border-zinc-700 bg-zinc-900 text-zinc-300">
      <div className="site-container py-12 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-12 lg:gap-y-10">
          <div className="lg:col-span-1">
            <p className="border-l-4 border-[#d33a2c] pl-3 font-serif text-lg font-semibold text-white">
              {siteConfig.name}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{siteConfig.institution}</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-500">{siteConfig.description}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Revista</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/edicoes" className="hover:text-white hover:underline">
                  Edições
                </Link>
              </li>
              <li>
                <Link href="/edicoes/20/revista" className="hover:text-white hover:underline">
                  Leitura folheada
                </Link>
              </li>
              <li>
                <Link href="/editorial" className="hover:text-white hover:underline">
                  Editorial
                </Link>
              </li>
              <li>
                <Link href="/galeria" className="hover:text-white hover:underline">
                  Galeria
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Conteúdos</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/poemas" className="hover:text-white hover:underline">
                  Poemas
                </Link>
              </li>
              <li>
                <Link href="/contos" className="hover:text-white hover:underline">
                  Contos
                </Link>
              </li>
              <li>
                <Link href="/cronicas" className="hover:text-white hover:underline">
                  Crônicas
                </Link>
              </li>
              <li>
                <Link href="/artigos" className="hover:text-white hover:underline">
                  Artigos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Redes e contacto</p>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Siga a revista no Instagram — referência na edição em PDF.
            </p>
            <a
              href={siteConfig.sitePublicacao.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-sm text-zinc-300 underline-offset-2 hover:text-white hover:underline"
            >
              {siteConfig.sitePublicacao.label}
            </a>
            <a
              href={instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded border border-zinc-600 bg-zinc-800/80 px-3 py-2 text-sm font-medium text-white transition hover:border-[#d33a2c] hover:bg-zinc-800"
            >
              <Instagram className="size-5 shrink-0" aria-hidden />
              <span>{instagram.handle}</span>
            </a>
            <ul className="mt-6 space-y-2.5 text-sm">
              <li>
                <Link href="/autores" className="hover:text-white hover:underline">
                  Autores
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-white hover:underline">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-white hover:underline">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-zinc-800 bg-zinc-950 py-4 text-center text-xs text-zinc-500">
        <div className="site-container">
          © {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
