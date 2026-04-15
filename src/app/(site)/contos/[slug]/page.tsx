import { CmsEntryDetail } from "@/components/cms/cms-entry-detail";

export default async function ContoDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CmsEntryDetail section="contos" slug={slug} />;
}
