import { PageHeading } from "@/components/page-heading";
import { CmsSectionEntryList } from "@/components/cms/cms-section-entry-list";

export default async function CronicasPage() {
  return (
    <div>
      <PageHeading
        title="Crônicas"
        description="Textos curtos de atualidade e observação — integrados por edição da revista."
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <CmsSectionEntryList section="cronicas" />
      </div>
    </div>
  );
}
