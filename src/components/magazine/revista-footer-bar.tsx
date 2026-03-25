import { edicao20Publicacao } from "@/content/edicao-20";

export function RevistaFooterBar() {
  return (
    <div className="shrink-0 bg-black py-1.5 text-center text-[9px] font-medium text-white sm:text-[10px]">
      {edicao20Publicacao.nomeRodape}
    </div>
  );
}
