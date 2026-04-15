"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminFetch } from "@/lib/admin/api";

type SitePageDetail = {
  id: string;
  slug: string;
  title: string;
  blocksJson: string | null;
  status: string;
};

export default function AdminSitePageDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const [data, setData] = useState<SitePageDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const res = await adminFetch(`/api/admin/site-pages/${id}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (!cancelled) {
          setError(
            typeof json.message === "string" ? json.message : "Erro ao carregar",
          );
        }
        return;
      }
      if (!cancelled) {
        setError(null);
        setData(json as SitePageDetail);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/conteudo"
          className="text-sm text-primary underline underline-offset-4"
        >
          ← Conteúdo
        </Link>
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-sm text-muted-foreground">A carregar…</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/conteudo"
          className="text-sm text-primary underline underline-offset-4"
        >
          ← Conteúdo
        </Link>
        <h1 className="mt-4 font-serif text-2xl font-semibold">{data.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          /{data.slug} · {data.status}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="text-sm font-medium">Blocos (JSON)</h2>
        <pre className="mt-3 max-h-[480px] overflow-auto rounded-lg bg-muted/50 p-4 text-xs">
          {data.blocksJson ?? "null"}
        </pre>
      </div>
    </div>
  );
}
