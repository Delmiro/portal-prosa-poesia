import type { MenuPlacement } from "@/lib/menu-placement";

export type MenuSeedRow = {
  label: string;
  href: string;
  placement: MenuPlacement;
  sortOrder: number;
  visible: boolean;
};

/** Conteúdo inicial alinhado ao menu estático antigo (`mainNav` + rodapé). */
export const DEFAULT_MENU_SEED: MenuSeedRow[] = [
  // MAIN
  { label: "Início", href: "/", placement: "MAIN", sortOrder: 0, visible: true },
  { label: "Edições", href: "/edicoes", placement: "MAIN", sortOrder: 1, visible: true },
  { label: "Autores", href: "/autores", placement: "MAIN", sortOrder: 2, visible: true },
  { label: "Editorial", href: "/editorial", placement: "MAIN", sortOrder: 3, visible: true },
  { label: "Poemas", href: "/poemas", placement: "MAIN", sortOrder: 4, visible: true },
  { label: "Contos", href: "/contos", placement: "MAIN", sortOrder: 5, visible: true },
  { label: "Crônicas", href: "/cronicas", placement: "MAIN", sortOrder: 6, visible: true },
  { label: "Artigos", href: "/artigos", placement: "MAIN", sortOrder: 7, visible: true },
  { label: "Galeria", href: "/galeria", placement: "MAIN", sortOrder: 8, visible: true },
  { label: "Sobre", href: "/sobre", placement: "MAIN", sortOrder: 9, visible: true },
  { label: "Administração", href: "/admin", placement: "MAIN", sortOrder: 10, visible: true },
  { label: "Contato", href: "/contato", placement: "MAIN", sortOrder: 11, visible: true },
  // QUICK
  { label: "Autores", href: "/autores", placement: "QUICK", sortOrder: 0, visible: true },
  { label: "Edições", href: "/edicoes", placement: "QUICK", sortOrder: 1, visible: true },
  { label: "Leitura folheada", href: "/edicoes", placement: "QUICK", sortOrder: 2, visible: true },
  { label: "Contatos", href: "/contato", placement: "QUICK", sortOrder: 3, visible: true },
  // Rodapé
  { label: "Edições", href: "/edicoes", placement: "FOOTER_REVISTA", sortOrder: 0, visible: true },
  { label: "Leitura folheada", href: "/edicoes", placement: "FOOTER_REVISTA", sortOrder: 1, visible: true },
  { label: "Editorial", href: "/editorial", placement: "FOOTER_REVISTA", sortOrder: 2, visible: true },
  { label: "Galeria", href: "/galeria", placement: "FOOTER_REVISTA", sortOrder: 3, visible: true },
  { label: "Poemas", href: "/poemas", placement: "FOOTER_CONTEUDO", sortOrder: 0, visible: true },
  { label: "Contos", href: "/contos", placement: "FOOTER_CONTEUDO", sortOrder: 1, visible: true },
  { label: "Crônicas", href: "/cronicas", placement: "FOOTER_CONTEUDO", sortOrder: 2, visible: true },
  { label: "Artigos", href: "/artigos", placement: "FOOTER_CONTEUDO", sortOrder: 3, visible: true },
  { label: "Autores", href: "/autores", placement: "FOOTER_CONTACTO", sortOrder: 0, visible: true },
  { label: "Sobre", href: "/sobre", placement: "FOOTER_CONTACTO", sortOrder: 1, visible: true },
  { label: "Administração", href: "/admin", placement: "FOOTER_CONTACTO", sortOrder: 2, visible: true },
  { label: "Contato", href: "/contato", placement: "FOOTER_CONTACTO", sortOrder: 3, visible: true },
];
