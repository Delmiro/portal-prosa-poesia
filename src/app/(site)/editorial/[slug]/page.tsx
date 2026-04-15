import { CmsEntryDetail } from "@/components/cms/cms-entry-detail";

export default async function EditorialDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CmsEntryDetail section="editorial" slug={slug} />;
}
