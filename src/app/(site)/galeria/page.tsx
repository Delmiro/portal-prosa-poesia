import { PageHeading } from "@/components/page-heading";
import { CmsSectionEntryList } from "@/components/cms/cms-section-entry-list";

export default async function GaleriaPage() {
  return (
    <div>
      <PageHeading
        title="Galeria de fotos"
        description="Imagens em proporção 16:9, otimizadas para leitura em tela."
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <CmsSectionEntryList section="galeria" />
      </div>
    </div>
  );
}
