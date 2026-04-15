import { CmsEntryDetail } from "@/components/cms/cms-entry-detail";

export default async function ArtigoDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CmsEntryDetail section="artigos" slug={slug} />;
}
