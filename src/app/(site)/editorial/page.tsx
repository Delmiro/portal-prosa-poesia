import { PageHeading } from "@/components/page-heading";
import { CmsSectionEntryList } from "@/components/cms/cms-section-entry-list";

export default async function EditorialPage() {
  return (
    <div>
      <PageHeading
        title="Editorial"
        description="Textos de abertura e posicionamento da revista."
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <CmsSectionEntryList section="editorial" />
      </div>
    </div>
  );
}
