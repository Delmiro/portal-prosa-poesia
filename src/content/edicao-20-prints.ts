/**
 * Páginas da edição 20 — ficheiros na raiz de `public/` (nomes das capturas).
 * Ordem = ordem das páginas do PDF (1–20).
 */
const PREFIX = "Captura de tela 2026-03-25 ";

const ORDEM_HORARIOS = [
  "115358",
  "115449",
  "115508",
  "115707",
  "115719",
  "115738",
  "115754",
  "115808",
  "115840",
  "115852",
  "115907",
  "115919",
  "115935",
  "115956",
  "120008",
  "120020",
  "120033",
  "120044",
  "120103",
  "120115",
] as const;

function publicImageUrl(fileName: string): string {
  return `/${encodeURIComponent(fileName)}`;
}

export const edicao20PrintPages = ORDEM_HORARIOS.map((h) =>
  publicImageUrl(`${PREFIX}${h}.png`)
) as readonly string[];

export const EDICAO_20_PRINT_COUNT = edicao20PrintPages.length;
