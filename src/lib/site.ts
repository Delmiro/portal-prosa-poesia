export const siteConfig = {
  name: "O LÚMEN DA ALAAS",
  institution: "Periódico da Academia de Letras e Artes Antônio Sales",
  description:
    "Veicula eventos, textos e elementos da obra de Antônio Sales e seus contemporâneos, por meio da Prosa e da Poesia.",
  /** Site e Instagram conforme expediente da Edição 20 (PDF “Voz da Palavra”). */
  sitePublicacao: {
    label: "revistavozdapalavra.com.br",
    url: "https://revistavozdapalavra.com.br",
  },
  instagram: {
    url: "https://www.instagram.com/voz.da_palavra/",
    handle: "@voz.da_palavra",
  },
} as const;

export type NavItem = { href: string; label: string };

export const mainNav: NavItem[] = [
  { href: "/", label: "Início" },
  { href: "/edicoes", label: "Edições" },
  { href: "/autores", label: "Autores" },
  { href: "/editorial", label: "Editorial" },
  { href: "/poemas", label: "Poemas" },
  { href: "/contos", label: "Contos" },
  { href: "/cronicas", label: "Crônicas" },
  { href: "/artigos", label: "Artigos" },
  { href: "/galeria", label: "Galeria" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];
