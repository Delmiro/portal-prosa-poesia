import { PageHeading } from "@/components/page-heading";

export default function GaleriaPage() {
  return (
    <div>
      <PageHeading
        title="Galeria de fotos"
        description="Imagens em proporção 16:9, otimizadas para leitura em tela."
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <p className="text-center text-muted-foreground">
          Em breve: galerias por edição com lightbox e legendas.
        </p>
      </div>
    </div>
  );
}
