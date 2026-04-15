import { PageHeading } from "@/components/page-heading";
import { CmsSectionEntryList } from "@/components/cms/cms-section-entry-list";

export default async function PoemasPage() {
  return (
    <div>
      <PageHeading
        title="Poemas"
        description="Versos com respiro tipográfico e leitura confortável."
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <CmsSectionEntryList section="poemas" />
      </div>
    </div>
  );
}
