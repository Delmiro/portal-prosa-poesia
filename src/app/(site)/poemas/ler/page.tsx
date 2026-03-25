import { poemaLer } from "@/content/edicao-20";
import { LeituraPublicacao } from "@/components/leitura-publicacao";

export default function PoemaLerPage() {
  const { titulo, autor, corpo } = poemaLer;
  return (
    <LeituraPublicacao tipo="Poema" titulo={titulo} autor={autor}>
      <div className="whitespace-pre-line font-serif text-lg leading-loose">{corpo}</div>
    </LeituraPublicacao>
  );
}
