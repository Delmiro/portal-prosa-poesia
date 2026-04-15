/** Secções com listagem CMS (conteúdos geridos em /admin/secoes). */
export const CMS_SECTIONS = [
  { slug: "poemas", label: "Poemas" },
  { slug: "contos", label: "Contos" },
  { slug: "cronicas", label: "Crônicas" },
  { slug: "artigos", label: "Artigos" },
  { slug: "editorial", label: "Editorial" },
  { slug: "galeria", label: "Galeria" },
] as const;

export type CmsSectionSlug = (typeof CMS_SECTIONS)[number]["slug"];

export function isCmsSectionSlug(s: string): s is CmsSectionSlug {
  return (CMS_SECTIONS as readonly { slug: string }[]).some((x) => x.slug === s);
}
