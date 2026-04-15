import { CmsEntryDetail } from "@/components/cms/cms-entry-detail";

export default async function CronicaDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CmsEntryDetail section="cronicas" slug={slug} />;
}
