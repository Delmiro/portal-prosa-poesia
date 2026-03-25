/**
 * Prints exportados para `public/`, em ordem cronológica do nome do ficheiro
 * (equivale à ordem das páginas 1–20 do PDF, se as capturas foram feitas em sequência).
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

export const edicao20PrintPages = ORDEM_HORARIOS.map(
  (h) => `/${PREFIX}${h}.png`
) as readonly string[];

export const EDICAO_20_PRINT_COUNT = edicao20PrintPages.length;
