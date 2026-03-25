import { humorPapagaio } from "@/content/edicao-20";
import { LeituraPublicacao } from "@/components/leitura-publicacao";

export default function PapagaioFalantePage() {
  const { titulo, autor, corpo } = humorPapagaio;
  return (
    <LeituraPublicacao tipo="Humor" titulo={titulo} autor={autor}>
      <div className="whitespace-pre-line">{corpo}</div>
    </LeituraPublicacao>
  );
}
