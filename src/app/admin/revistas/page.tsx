"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch, parseApiErrorBody } from "@/lib/admin/api";
import { Button } from "@/components/ui/button";

type Magazine = {
  id: string;
  title: string;
  editionNumber: number | null;
  volume: number | null;
  location: string | null;
  description: string | null;
  coverImageUrl: string;
  publishedAt: string | null;
  status: string;
  pages: unknown[];
};

export default function AdminMagazinesPage() {
  const [list, setList] = useState<Magazine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "UNPUBLISHED">("DRAFT");
  const [publishedAt, setPublishedAt] = useState("");
  const [editionNumber, setEditionNumber] = useState("");
  const [volume, setVolume] = useState("");
  const [location, setLocation] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  async function loadMagazines() {
    let cancelled = false;
    const res = await adminFetch("/api/admin/magazines");
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (!cancelled) {
        setError(parseApiErrorBody(json) ?? "Erro ao carregar");
      }
      return;
    }
    if (!cancelled) {
      setError(null);
      setList(Array.isArray(json) ? json : []);
    }
  }

  useEffect(() => {
    void loadMagazines();
  }, []);

  async function uploadCover(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const uploadRes = await adminFetch("/api/admin/media/upload", {
      method: "POST",
      body: fd,
    });
    const uploadJson = await uploadRes.json().catch(() => ({}));
    if (!uploadRes.ok) {
      throw new Error(parseApiErrorBody(uploadJson) ?? "Falha no upload da capa");
    }
    return String(uploadJson.publicUrl);
  }

  async function uploadPdf(magazineId: string, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await adminFetch(`/api/admin/magazines/${magazineId}/pages`, {
      method: "POST",
      body: fd,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(parseApiErrorBody(json) ?? "Falha no upload do PDF");
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!pdfFile) {
      setError("Selecione o PDF da revista.");
      return;
    }
    setLoading(true);
    try {
      const coverImageUrl = coverFile ? await uploadCover(coverFile) : "/file.svg";
      const ed = editionNumber.trim() ? Number.parseInt(editionNumber, 10) : null;
      const vol = volume.trim() ? Number.parseInt(volume, 10) : null;
      const res = await adminFetch("/api/admin/magazines", {
        method: "POST",
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
        setError(parseApiErrorBody(json) ?? "Erro ao criar revista");
        return;
      }
      await uploadPdf(String(json.id), pdfFile);
      setTitle("");
      setDescription("");
      setPublishedAt("");
      setEditionNumber("");
      setVolume("");
      setLocation("");
      setStatus("DRAFT");
      setCoverFile(null);
      setPdfFile(null);
      setSuccess("Revista criada com PDF enviado com sucesso.");
      await loadMagazines();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Revistas</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crie e gerencie as edições publicadas no flipbook.
        </p>
      </div>
      <form
        onSubmit={onCreate}
        className="grid gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Título</label>
          <input
            className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Descrição</label>
          <textarea
            className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
            <option value="UNPUBLISHED">Despublicado</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Data de publicação</label>
          <input
            type="date"
            className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">N.º da edição</label>
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
          <label className="text-sm font-medium">Volume</label>
          <input
            type="number"
            min={1}
            className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="opcional"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Local</label>
          <input
            className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="ex.: Fortaleza, CE"
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Capa (imagem opcional)</label>
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Revista (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            className="mt-1 block w-full text-sm"
            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Button type="submit" disabled={loading}>
            {loading ? "A criar..." : "Nova Revista"}
          </Button>
        </div>
      </form>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {success && <p className="text-sm text-green-600">{success}</p>}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.length === 0 && !error && (
          <li className="col-span-full text-sm text-muted-foreground">
            Nenhuma revista.
          </li>
        )}
        {list.map((m) => (
          <li
            key={m.id}
            className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <div className="aspect-[3/4] w-full overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.coverImageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="font-medium leading-snug">{m.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {m.editionNumber != null ? `Ed. ${m.editionNumber} · ` : ""}
                {m.status} · {m.pages?.length ?? 0} páginas
              </p>
              <Link
                href={`/admin/revistas/${m.id}`}
                className="mt-3 inline-block text-sm text-primary underline underline-offset-4"
              >
                Gerir edição
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
