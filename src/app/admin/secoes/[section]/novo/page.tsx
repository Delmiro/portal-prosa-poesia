"use client";

import { useParams } from "next/navigation";
import { isCmsSectionSlug, type CmsSectionSlug } from "@/lib/cms-sections";
import { ContentEntradaForm } from "@/app/admin/secoes/entrada-form";

export default function NovaEntradaPage() {
  const params = useParams();
  const raw = typeof params.section === "string" ? params.section : "";
  if (!isCmsSectionSlug(raw)) {
    return <p className="text-sm text-destructive">Secção inválida.</p>;
  }
  const section = raw as CmsSectionSlug;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Novo texto</h1>
        <p className="mt-1 text-sm text-muted-foreground">Secção: {section}</p>
      </div>
      <ContentEntradaForm mode="create" section={section} />
    </div>
  );
}
