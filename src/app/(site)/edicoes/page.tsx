import Image from "next/image";
import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { capaEdicao20, edicao20Meta } from "@/content/edicao-20";

export default function EdicoesPage() {
  return (
    <div>
      <PageHeading
        title="Edições da revista"
        description="Cada edição reúne textos, imagens e vozes — como um número impresso, em formato digital."
      />
      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
        <Link
          href="/edicoes/20"
          className="flex flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm transition hover:border-primary/40"
        >
          <div className="relative aspect-video w-full bg-muted">
            <Image
              src={capaEdicao20.src}
              alt={capaEdicao20.alt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Volume {edicao20Meta.volume} · {edicao20Meta.local}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold">
              Edição {edicao20Meta.numero} · {edicao20Meta.mesAno}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Conteúdo digital alinhado ao PDF da edição 20 — microcontos, poemas e humor.
            </p>
          </div>
        </Link>
        <p className="mt-10 text-center text-sm text-muted-foreground">
          Em breve: arquivo completo de edições anteriores via API.
        </p>
      </div>
    </div>
  );
}
