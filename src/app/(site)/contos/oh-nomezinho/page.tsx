import { contoOhNomezinho } from "@/content/edicao-20";
import { LeituraPublicacao } from "@/components/leitura-publicacao";

export default function OhNomezinhoPage() {
  const { titulo, autor, corpo } = contoOhNomezinho;
  return (
    <LeituraPublicacao tipo="Conto" titulo={titulo} autor={autor}>
      <div className="whitespace-pre-line">{corpo}</div>
    </LeituraPublicacao>
  );
}
