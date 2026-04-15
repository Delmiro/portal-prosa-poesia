import { and, eq } from "drizzle-orm";
import { getDb } from "./index";
import { contentEntries } from "./schema";
import { CMS_SECTIONS } from "@/lib/cms-sections";

/** Mesmo slug em secções diferentes — índice único é (section_slug, slug). */
const DEMO_SLUG = "bem-vindo";

const DEMOS: Record<
  (typeof CMS_SECTIONS)[number]["slug"],
  { title: string; excerpt: string; body: string }
> = {
  poemas: {
    title: "Respiro tipográfico",
    excerpt: "Versos com respiro tipográfico e leitura confortável.",
    body:
      "No silêncio branco da margem,\no verso respira antes de falar.\n\nCada vírgula, uma pausa;\ncada ponto, um encerrar.",
  },
  contos: {
    title: "O primeiro conto",
    excerpt: "Ficção curta para testar a secção Contos.",
    body:
      "Era uma vez um texto de demonstração.\n\nServe para confirmar que a listagem e a página de detalhe em /contos funcionam após publicar no admin.",
  },
  cronicas: {
    title: "Crônica de abertura",
    excerpt: "Observação e atualidade em poucas linhas.",
    body:
      "Este é um exemplo de crônica publicada.\n\nPode ser substituído ou editado em Secções CMS → Crônicas.",
  },
  artigos: {
    title: "Artigo de exemplo",
    excerpt: "Ensaio ou artigo de fundo para validar a secção.",
    body:
      "Corpo do artigo de demonstração.\n\nUse o painel para alterar o título, o resumo e o texto completo.",
  },
  editorial: {
    title: "Palavra da edição",
    excerpt: "Texto editorial visível na secção Editorial.",
    body:
      "Este editorial pode ser substituído pelo texto real da revista.\n\nA publicação é feita pelo estado \"Publicado\" no admin.",
  },
  galeria: {
    title: "Entrada de galeria",
    excerpt: "Texto associado a imagens (adicione URL de imagem no admin se quiser).",
    body:
      "Galeria de fotos: aqui pode descrever o conjunto ou uma legenda.\n\nFaça upload de imagem na mídia e cole a URL no campo de imagem da entrada.",
  },
};

async function main() {
  const db = getDb();
  let inserted = 0;
  let skipped = 0;

  for (const { slug: sectionSlug } of CMS_SECTIONS) {
    const demo = DEMOS[sectionSlug];
    const [existing] = await db
      .select({ id: contentEntries.id })
      .from(contentEntries)
      .where(
        and(eq(contentEntries.sectionSlug, sectionSlug), eq(contentEntries.slug, DEMO_SLUG)),
      )
      .limit(1);

    if (existing) {
      skipped += 1;
      continue;
    }

    await db.insert(contentEntries).values({
      sectionSlug,
      slug: DEMO_SLUG,
      title: demo.title,
      excerpt: demo.excerpt,
      body: demo.body,
      imageUrl: null,
      status: "PUBLISHED",
      sortOrder: 0,
    });
    inserted += 1;
  }

  console.log(
    `CMS demo: ${inserted} inserido(s), ${skipped} já existente(s) (slug "${DEMO_SLUG}" por secção).`,
  );
  process.exit(0);
}

main().catch((e: unknown) => {
  const msg = e instanceof Error ? e.message : String(e);
  if (msg.includes("content_entries") && msg.includes("does not exist")) {
    console.error(
      "Tabela content_entries inexistente. Aplique a migração (ex.: docker/postgres/migrate-004-cms-magazines-content.sql) ou drizzle push antes de correr este seed.",
    );
  } else {
    console.error(e);
  }
  process.exit(1);
});
