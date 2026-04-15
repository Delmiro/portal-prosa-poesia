"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminFetch, parseApiErrorBody } from "@/lib/admin/api";
import { buttonVariants } from "@/components/ui/button-variants";
import { CMS_SECTIONS, isCmsSectionSlug, type CmsSectionSlug } from "@/lib/cms-sections";

type Row = {
  id: string;
  sectionSlug: string;
  slug: string;
  title: string;
  status: string;
  sortOrder: number;
};

export default function AdminSecoesSectionPage() {
  const params = useParams();
  const sectionParam = typeof params.section === "string" ? params.section : "";
  const sectionOk = isCmsSectionSlug(sectionParam);
  const section = sectionOk ? (sectionParam as CmsSectionSlug) : null;
  const label = CMS_SECTIONS.find((s) => s.slug === section)?.label ?? sectionParam;

  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    if (!section) return;
    setLoading(true);
    const res = await adminFetch(`/api/admin/content-entries?section=${encodeURIComponent(section)}`);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(parseApiErrorBody(json) ?? "Erro ao carregar");
      setRows([]);
    } else {
      setError(null);
      setRows(Array.isArray(json) ? json : []);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (section) void load();
  }, [section]);

  if (!sectionOk || !section) {
    return (
      <p className="text-sm text-destructive" role="alert">
        Secção inválida.
      </p>
    );
  }

  async function onDelete(id: string) {
    if (!confirm("Excluir este texto?")) return;
    const res = await adminFetch(`/api/admin/content-entries/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(parseApiErrorBody(json) ?? "Erro ao excluir");
      return;
    }
    setError(null);
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin/secoes"
            className="text-sm text-primary underline underline-offset-4"
          >
            ← Secções
          </Link>
          <h1 className="mt-2 font-serif text-2xl font-semibold">{label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Textos com URL pública /{section}/…
          </p>
        </div>
        <Link
          href={`/admin/secoes/${section}/novo`}
          className={buttonVariants({ size: "default" })}
        >
          Novo texto
        </Link>
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Ordem</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                  A carregar…
                </td>
              </tr>
            )}
            {!loading && rows.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                  Nenhum texto nesta secção.
                </td>
              </tr>
            )}
            {!loading &&
              rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{r.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.slug}</td>
                  <td className="px-4 py-3">{r.status}</td>
                  <td className="px-4 py-3 tabular-nums">{r.sortOrder}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/secoes/entrada/${r.id}`}
                        className="text-primary underline underline-offset-4"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        className="text-destructive underline underline-offset-4"
                        onClick={() => onDelete(r.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
