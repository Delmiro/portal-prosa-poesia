import { PageHeading } from "@/components/page-heading";
import { CmsSectionEntryList } from "@/components/cms/cms-section-entry-list";

export default async function ContosPage() {
  return (
    <div>
      <PageHeading
        title="Contos"
        description="Ficção curta com destaque visual e tempo de leitura estimado."
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <CmsSectionEntryList section="contos" />
      </div>
    </div>
  );
}
