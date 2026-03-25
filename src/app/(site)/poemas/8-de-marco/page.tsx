import { poema8DeMarco } from "@/content/edicao-20";
import { LeituraPublicacao } from "@/components/leitura-publicacao";

export default function Poema8DeMarcoPage() {
  const { titulo, autor, corpo } = poema8DeMarco;
  return (
    <LeituraPublicacao tipo="Poema" titulo={titulo} autor={autor}>
      <div className="whitespace-pre-line font-serif text-lg leading-loose">{corpo}</div>
    </LeituraPublicacao>
  );
}
