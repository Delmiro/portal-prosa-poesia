"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { adminFetch, parseApiErrorBody } from "@/lib/admin/api";
import { Button } from "@/components/ui/button";

type PageInfo = {
  id: string;
  sortOrder: number;
  pdfUrl: string;
  label: string | null;
};

type MagazineDetail = {
  id: string;
  title: string;
  editionNumber: number | null;
  volume: number | null;
  location: string | null;
  description: string | null;
  coverImageUrl: string;
  publishedAt: string | null;
  status: string;
  pages: PageInfo[];
};

export default function AdminMagazineDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";
  const [data, setData] = useState<MagazineDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "UNPUBLISHED">("DRAFT");
  const [publishedAt, setPublishedAt] = useState("");
  const [editionNumber, setEditionNumber] = useState("");
  const [volume, setVolume] = useState("");
  const [location, setLocation] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function hydrateForm(m: MagazineDetail) {
    setTitle(m.title);
    setDescription(m.description ?? "");
    setStatus(m.status as typeof status);
    setPublishedAt(m.publishedAt ?? "");
    setEditionNumber(m.editionNumber != null ? String(m.editionNumber) : "");
    setVolume(m.volume != null ? String(m.volume) : "");
    setLocation(m.location ?? "");
    setCoverImageUrl(m.coverImageUrl);
  }

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      const res = await adminFetch(`/api/admin/magazines/${id}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (!cancelled) {
          setError(parseApiErrorBody(json) ?? "Erro ao carregar");
        }
        return;
      }
      if (!cancelled) {
        setError(null);
        const magazine = json as MagazineDetail;
        setData(magazine);
        hydrateForm(magazine);
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
          href="/admin/revistas"
          className="text-sm text-primary underline underline-offset-4"
        >
          ← Revistas
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

  async function uploadCover(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await adminFetch("/api/admin/media/upload", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(parseApiErrorBody(json) ?? "Falha no upload da capa");
    }
    return String(json.publicUrl);
  }

  async function onUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);
    try {
      const ed = editionNumber.trim() ? Number.parseInt(editionNumber, 10) : null;
      const vol = volume.trim() ? Number.parseInt(volume, 10) : null;
      const res = await adminFetch(`/api/admin/magazines/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          editionNumber: ed != null && Number.isFinite(ed) && ed > 0 ? ed : null,
          volume: vol != null && Number.isFinite(vol) && vol > 0 ? vol : null,
          location: location.trim() || null,
          description: description || null,
          coverImageUrl,
          status,
          publishedAt: publishedAt || null,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(parseApiErrorBody(json) ?? "Erro ao guardar");
        return;
      }
      const updated = json as MagazineDetail;
      setData(updated);
      hydrateForm(updated);
      setSuccess("Revista atualizada.");
    } finally {
      setSaving(false);
    }
  }

  async function onCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccess(null);
    setUploading(true);
    try {
      const url = await uploadCover(file);
      setCoverImageUrl(url);
      setSuccess("Capa enviada. Clique em 'Guardar alterações' para confirmar.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao subir capa");
    } finally {
      setUploading(false);
    }
  }

  async function onAddPdfPage(e: React.FormEvent) {
    e.preventDefault();
    if (!pdfFile) {
      setError("Selecione um PDF.");
      return;
    }
    setError(null);
    setSuccess(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", pdfFile);
      const res = await adminFetch(`/api/admin/magazines/${id}/pages`, {
        method: "POST",
        body: fd,
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(parseApiErrorBody(json) ?? "Erro ao enviar PDF");
        return;
      }
      const updated = json as MagazineDetail;
      setData(updated);
      hydrateForm(updated);
      setPdfFile(null);
      setSuccess("Página adicionada ao flipbook.");
    } finally {
      setUploading(false);
    }
  }

  async function onDelete() {
    if (!confirm("Deseja mesmo apagar esta revista?")) return;
    setRemoving(true);
    const res = await adminFetch(`/api/admin/magazines/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(parseApiErrorBody(json) ?? "Erro ao remover");
      setRemoving(false);
      return;
    }
    router.replace("/admin/revistas");
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/revistas"
          className="text-sm text-primary underline underline-offset-4"
        >
          ← Revistas
        </Link>
        <h1 className="mt-4 font-serif text-2xl font-semibold">{data.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Estado: {data.status}
          {data.editionNumber != null ? ` · Edição ${data.editionNumber}` : ""}
          {data.publishedAt
            ? ` · Publicação: ${new Date(data.publishedAt).toLocaleDateString("pt-PT")}`
            : ""}
        </p>
        {data.description && (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed">{data.description}</p>
        )}
      </div>
      <div className="flex gap-6 max-md:flex-col">
        <div className="w-48 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.coverImageUrl}
            alt=""
            className="aspect-[3/4] w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <form onSubmit={onUpdate} className="mb-6 grid gap-3 rounded-xl border border-border p-4">
            <h2 className="text-sm font-medium">Editar metadados</h2>
            <input
              className="rounded-lg border border-input px-3 py-2 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="rounded-lg border border-input px-3 py-2 text-sm"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <div className="grid gap-3 md:grid-cols-2">
              <select
                className="rounded-lg border border-input px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
              >
                <option value="DRAFT">Rascunho</option>
                <option value="PUBLISHED">Publicado</option>
                <option value="UNPUBLISHED">Despublicado</option>
              </select>
              <input
                type="date"
                className="rounded-lg border border-input px-3 py-2 text-sm"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <label className="text-xs text-muted-foreground">N.º edição</label>
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
                  value={editionNumber}
                  onChange={(e) => setEditionNumber(e.target.value)}
                  placeholder="ex.: 20"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Volume</label>
                <input
                  type="number"
                  min={1}
                  className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Local</label>
                <input
                  className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Cidade"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">URL da capa: {coverImageUrl}</div>
            <input type="file" accept="image/*" onChange={onCoverChange} />
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? "A guardar..." : "Guardar alterações"}
              </Button>
              <Button type="button" variant="destructive" disabled={removing} onClick={onDelete}>
                {removing ? "A remover..." : "Excluir revista"}
              </Button>
            </div>
          </form>
          {success && <p className="mb-3 text-sm text-green-600">{success}</p>}
          {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
          <form onSubmit={onAddPdfPage} className="mb-4 flex items-end gap-3 rounded-xl border border-border p-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Adicionar PDF (nova página)</label>
              <input
                type="file"
                accept="application/pdf"
                className="mt-1 block w-full text-sm"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <Button type="submit" disabled={uploading}>
              {uploading ? "A enviar..." : "Enviar PDF"}
            </Button>
          </form>
          <h2 className="text-sm font-medium">Páginas PDF</h2>
          <div className="mt-3 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-2 font-medium">Ordem</th>
                  <th className="px-4 py-2 font-medium">Etiqueta</th>
                  <th className="px-4 py-2 font-medium">PDF</th>
                </tr>
              </thead>
              <tbody>
                {data.pages.length === 0 && (
                  <tr>
                    <td className="px-4 py-4 text-muted-foreground" colSpan={3}>
                      Sem páginas.
                    </td>
                  </tr>
                )}
                {data.pages.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 tabular-nums">{p.sortOrder}</td>
                    <td className="px-4 py-2">{p.label ?? "—"}</td>
                    <td className="px-4 py-2">
                      <a
                        href={p.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-4"
                      >
                        Abrir
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
