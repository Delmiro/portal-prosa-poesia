"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/api";

type MediaRow = {
  id: string;
  filename: string;
  publicUrl: string;
  mimeType: string;
  byteSize: number;
  kind: string;
  createdAt: string;
};

export default function AdminMediaPage() {
  const [rows, setRows] = useState<MediaRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await adminFetch("/api/admin/media");
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
        setRows(Array.isArray(json) ? json : []);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Mídia</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ficheiros enviados para a biblioteca.
        </p>
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Ficheiro</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Tamanho</th>
              <th className="px-4 py-3 font-medium">Pré-visualização</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !error && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={4}>
                  Nenhum ficheiro.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <span className="font-medium">{r.filename}</span>
                  <br />
                  <span className="text-xs text-muted-foreground">{r.kind}</span>
                </td>
                <td className="px-4 py-3">{r.mimeType}</td>
                <td className="px-4 py-3 tabular-nums">
                  {formatBytes(r.byteSize)}
                </td>
                <td className="px-4 py-3">
                  {r.mimeType.startsWith("image/") ? (
                    <a
                      href={r.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4"
                    >
                      Abrir
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
