import { CmsEntryDetail } from "@/components/cms/cms-entry-detail";

export default async function GaleriaDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CmsEntryDetail section="galeria" slug={slug} />;
}
