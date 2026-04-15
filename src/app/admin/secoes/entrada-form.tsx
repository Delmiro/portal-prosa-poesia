"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminFetch, parseApiErrorBody } from "@/lib/admin/api";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import type { CmsSectionSlug } from "@/lib/cms-sections";

type Props =
  | {
      mode: "create";
      section: CmsSectionSlug;
    }
  | {
      mode: "edit";
      id: string;
      section: CmsSectionSlug;
      initial: {
        slug: string;
        title: string;
        excerpt: string;
        body: string;
        imageUrl: string;
        status: "DRAFT" | "PUBLISHED";
        sortOrder: number;
      };
    };

export function ContentEntradaForm(props: Props) {
  const router = useRouter();
  const section = props.section;
  const [slug, setSlug] = useState(props.mode === "edit" ? props.initial.slug : "");
  const [title, setTitle] = useState(props.mode === "edit" ? props.initial.title : "");
  const [excerpt, setExcerpt] = useState(props.mode === "edit" ? props.initial.excerpt : "");
  const [body, setBody] = useState(props.mode === "edit" ? props.initial.body : "");
  const [imageUrl, setImageUrl] = useState(props.mode === "edit" ? props.initial.imageUrl : "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    props.mode === "edit" ? props.initial.status : "DRAFT",
  );
  const [sortOrder, setSortOrder] = useState(
    props.mode === "edit" ? String(props.initial.sortOrder) : "0",
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function uploadImage(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await adminFetch("/api/admin/media/upload", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(parseApiErrorBody(json) ?? "Falha no upload");
    }
    return String(json.publicUrl);
  }

  async function onImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageUrl(url);
      setSuccess("Imagem enviada. Guarde para aplicar.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const order = Number.parseInt(sortOrder, 10);
    if (!Number.isFinite(order)) {
      setError("Ordem inválida.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        sectionSlug: section,
        slug: slug.trim().toLowerCase(),
        title: title.trim(),
        excerpt: excerpt.trim() || null,
        body,
        imageUrl: imageUrl.trim() || null,
        status,
        sortOrder: order,
      };
      const url =
        props.mode === "create"
          ? "/api/admin/content-entries"
          : `/api/admin/content-entries/${props.id}`;
      const res = await adminFetch(url, {
        method: props.mode === "create" ? "POST" : "PUT",
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(parseApiErrorBody(json) ?? "Erro ao guardar");
        return;
      }
      setSuccess("Guardado.");
      if (props.mode === "create") {
        router.replace(`/admin/secoes/${section}`);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/secoes/${section}`}
          className={cn(buttonVariants({ variant: "outline", size: "default" }))}
        >
          ← Voltar
        </Link>
      </div>
      {props.mode === "edit" && (
        <p className="text-xs text-muted-foreground">
          URL: /{section}/{slug}
        </p>
      )}
      <div>
        <label className="text-sm font-medium">Slug (URL)</label>
        <input
          className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          disabled={props.mode === "edit"}
          pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
          title="apenas minúsculas, números e hífens"
        />
        {props.mode === "create" && (
          <p className="mt-1 text-xs text-muted-foreground">
            Ex.: meu-poema-novo — não pode ser alterado depois de criado.
          </p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium">Título</label>
        <input
          className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Resumo (opcional)</label>
        <textarea
          className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Texto</label>
        <textarea
          className="mt-1 w-full rounded-lg border border-input px-3 py-2 font-mono text-sm"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={16}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Pode colar HTML simples (negrito, parágrafos) se precisar de formatação.
        </p>
      </div>
      <div>
        <label className="text-sm font-medium">Imagem (URL ou upload)</label>
        <input
          className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
        />
        <input
          type="file"
          accept="image/*"
          className="mt-2 block w-full text-sm"
          onChange={onImagePick}
          disabled={uploading}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
          >
            <option value="DRAFT">Rascunho</option>
            <option value="PUBLISHED">Publicado</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Ordem</label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-input px-3 py-2 text-sm"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {success && <p className="text-sm text-green-600">{success}</p>}
      <Button type="submit" disabled={saving || uploading}>
        {saving ? "A guardar…" : "Guardar"}
      </Button>
    </form>
  );
}
