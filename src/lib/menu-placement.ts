/** Onde o item aparece no site (gerido em /admin/configuracoes). */
export const MENU_PLACEMENTS = [
  "MAIN",
  "QUICK",
  "FOOTER_REVISTA",
  "FOOTER_CONTEUDO",
  "FOOTER_CONTACTO",
] as const;

export type MenuPlacement = (typeof MENU_PLACEMENTS)[number];

export const MENU_PLACEMENT_LABELS: Record<MenuPlacement, string> = {
  MAIN: "Menu principal (topo)",
  QUICK: "Atalhos (barra superior)",
  FOOTER_REVISTA: "Rodapé — Revista",
  FOOTER_CONTEUDO: "Rodapé — Conteúdos",
  FOOTER_CONTACTO: "Rodapé — Contacto / links",
};

export function isMenuPlacement(s: string): s is MenuPlacement {
  return (MENU_PLACEMENTS as readonly string[]).includes(s);
}
