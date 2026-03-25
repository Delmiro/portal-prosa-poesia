import { microcontoGiganteBrasileiro } from "@/content/edicao-20";
import { LeituraPublicacao } from "@/components/leitura-publicacao";

export default function GiganteBrasileiroPage() {
  const { titulo, autor, corpo } = microcontoGiganteBrasileiro;
  return (
    <LeituraPublicacao tipo="Microconto" titulo={titulo} autor={autor}>
      <div className="whitespace-pre-line">{corpo}</div>
    </LeituraPublicacao>
  );
}
