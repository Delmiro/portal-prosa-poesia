import Link from "next/link";
import { CMS_SECTIONS } from "@/lib/cms-sections";

export default function AdminSecoesIndexPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Secções de conteúdo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Poemas, contos, crónicas, artigos, editorial e galeria — textos publicados no site.
        </p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CMS_SECTIONS.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/admin/secoes/${s.slug}`}
              className="block rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/40"
            >
              <span className="font-medium">{s.label}</span>
              <p className="mt-1 text-xs text-muted-foreground">/{s.slug}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
