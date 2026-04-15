import { PageHeading } from "@/components/page-heading";
import { CmsSectionEntryList } from "@/components/cms/cms-section-entry-list";

export default async function ArtigosPage() {
  return (
    <div>
      <PageHeading
        title="Artigos"
        description="Ensaios, crônicas e artigos de fundo."
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <CmsSectionEntryList section="artigos" />
      </div>
    </div>
  );
}
