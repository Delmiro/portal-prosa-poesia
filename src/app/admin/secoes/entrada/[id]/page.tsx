"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminFetch, parseApiErrorBody } from "@/lib/admin/api";
import { ContentEntradaForm } from "@/app/admin/secoes/entrada-form";
import { isCmsSectionSlug, type CmsSectionSlug } from "@/lib/cms-sections";

type ApiRow = {
  id: string;
  sectionSlug: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  imageUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
  sortOrder: number;
};

export default function EditarEntradaPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [data, setData] = useState<ApiRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const res = await adminFetch(`/api/admin/content-entries/${id}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (!cancelled) setError(parseApiErrorBody(json) ?? "Erro ao carregar");
        return;
      }
      if (!cancelled) {
        setError(null);
        setData(json as ApiRow);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/admin/secoes" className="text-sm text-primary underline underline-offset-4">
          ← Secções
        </Link>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-muted-foreground">A carregar…</p>;
  }

  if (!isCmsSectionSlug(data.sectionSlug)) {
    return <p className="text-sm text-destructive">Secção inválida nos dados.</p>;
  }

  const section = data.sectionSlug as CmsSectionSlug;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Editar texto</h1>
        <p className="mt-1 text-sm text-muted-foreground">{data.title}</p>
      </div>
      <ContentEntradaForm
        mode="edit"
        id={data.id}
        section={section}
        initial={{
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt ?? "",
          body: data.body,
          imageUrl: data.imageUrl ?? "",
          status: data.status,
          sortOrder: data.sortOrder,
        }}
      />
    </div>
  );
}
