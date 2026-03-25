/**
 * Atalhos de acesso rápido (padrão editorial, ex.: Smashing Magazine).
 */
export function SkipLinks() {
  const linkClass =
    "rounded-sm text-[0.8125rem] font-medium text-[#d33a2c] underline-offset-[3px] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[#d33a2c] focus-visible:ring-offset-2";

  return (
    <div className="border-b border-zinc-200/90 bg-[#f7f7f7] print:hidden">
      <div className="site-container flex flex-wrap items-center gap-x-2 gap-y-1 py-2.5 text-zinc-600">
        <a href="#conteudo" className={linkClass}>
          Ir para o conteúdo principal
        </a>
        <span className="text-zinc-300" aria-hidden>
          ·
        </span>
        <a href="#topo" className={linkClass}>
          Ir para o menu
        </a>
        <span className="text-zinc-300" aria-hidden>
          ·
        </span>
        <a href="#rodape" className={linkClass}>
          Ir para o rodapé
        </a>
      </div>
    </div>
  );
}
