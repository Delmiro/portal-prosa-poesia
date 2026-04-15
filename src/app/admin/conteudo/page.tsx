"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin/api";

type SitePage = {
  id: string;
  slug: string;
  title: string;
  status: string;
};

export default function AdminContentPage() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await adminFetch("/api/admin/site-pages");
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
        setPages(Array.isArray(json) ? json : []);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Conteúdo do site</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Páginas estáticas geridas na base de dados.
        </p>
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 && !error && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={4}>
                  Nenhuma página.
                </td>
              </tr>
            )}
            {pages.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.slug}</td>
                <td className="px-4 py-3">{p.status}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/conteudo/${p.id}`}
                    className="text-primary underline underline-offset-4"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
