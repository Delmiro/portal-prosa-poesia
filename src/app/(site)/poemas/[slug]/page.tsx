import { CmsEntryDetail } from "@/components/cms/cms-entry-detail";

export default async function PoemaDetalhePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CmsEntryDetail section="poemas" slug={slug} />;
}
