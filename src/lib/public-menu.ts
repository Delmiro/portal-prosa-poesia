import { eq } from "drizzle-orm";
import { getDb, isDatabaseConfigured } from "@/db";
import { menuItems } from "@/db/schema";
import { mainNav } from "@/lib/site";
import type { MenuPlacement } from "@/lib/menu-placement";
import { isMenuPlacement } from "@/lib/menu-placement";

const PLACEMENT_ORDER: Record<MenuPlacement, number> = {
  MAIN: 0,
  QUICK: 1,
  FOOTER_REVISTA: 2,
  FOOTER_CONTEUDO: 3,
  FOOTER_CONTACTO: 4,
};

export type PublicMenuItem = {
  id: string;
  label: string;
  href: string;
  placement: MenuPlacement;
  sortOrder: number;
  visible: boolean;
};

/** Fallback quando não há BD ou tabela vazia (mesmo conteúdo que o site estático). */
function fallbackMenu(): PublicMenuItem[] {
  const main: PublicMenuItem[] = mainNav.map((item, i) => ({
    id: `fallback-main-${i}`,
    label: item.label,
    href: item.href,
    placement: "MAIN",
    sortOrder: i,
    visible: true,
  }));
  const quick: PublicMenuItem[] = [
    { id: "fq0", label: "Autores", href: "/autores", placement: "QUICK", sortOrder: 0, visible: true },
    { id: "fq1", label: "Edições", href: "/edicoes", placement: "QUICK", sortOrder: 1, visible: true },
    { id: "fq2", label: "Leitura folheada", href: "/edicoes", placement: "QUICK", sortOrder: 2, visible: true },
    { id: "fq3", label: "Contatos", href: "/contato", placement: "QUICK", sortOrder: 3, visible: true },
  ];
  const fr: PublicMenuItem[] = [
    { id: "fr0", label: "Edições", href: "/edicoes", placement: "FOOTER_REVISTA", sortOrder: 0, visible: true },
    { id: "fr1", label: "Leitura folheada", href: "/edicoes", placement: "FOOTER_REVISTA", sortOrder: 1, visible: true },
    { id: "fr2", label: "Editorial", href: "/editorial", placement: "FOOTER_REVISTA", sortOrder: 2, visible: true },
    { id: "fr3", label: "Galeria", href: "/galeria", placement: "FOOTER_REVISTA", sortOrder: 3, visible: true },
  ];
  const fc: PublicMenuItem[] = [
    { id: "fc0", label: "Poemas", href: "/poemas", placement: "FOOTER_CONTEUDO", sortOrder: 0, visible: true },
    { id: "fc1", label: "Contos", href: "/contos", placement: "FOOTER_CONTEUDO", sortOrder: 1, visible: true },
    { id: "fc2", label: "Crônicas", href: "/cronicas", placement: "FOOTER_CONTEUDO", sortOrder: 2, visible: true },
    { id: "fc3", label: "Artigos", href: "/artigos", placement: "FOOTER_CONTEUDO", sortOrder: 3, visible: true },
  ];
  const fco: PublicMenuItem[] = [
    { id: "fco0", label: "Autores", href: "/autores", placement: "FOOTER_CONTACTO", sortOrder: 0, visible: true },
    { id: "fco1", label: "Sobre", href: "/sobre", placement: "FOOTER_CONTACTO", sortOrder: 1, visible: true },
    { id: "fco2", label: "Administração", href: "/admin", placement: "FOOTER_CONTACTO", sortOrder: 2, visible: true },
    { id: "fco3", label: "Contato", href: "/contato", placement: "FOOTER_CONTACTO", sortOrder: 3, visible: true },
  ];
  return [...main, ...quick, ...fr, ...fc, ...fco];
}

export async function getPublicMenuItems(): Promise<PublicMenuItem[]> {
  if (!isDatabaseConfigured()) {
    return fallbackMenu();
  }
  try {
    const db = getDb();
    const rows = await db.select().from(menuItems).where(eq(menuItems.visible, true));
    if (rows.length === 0) {
      return fallbackMenu();
    }
    const mapped = rows
      .map((m) => ({
        id: m.id,
        label: m.label,
        href: m.href,
        placement: (isMenuPlacement(m.placement) ? m.placement : "MAIN") as MenuPlacement,
        sortOrder: m.sortOrder,
        visible: m.visible,
      }))
      .sort(
        (a, b) =>
          PLACEMENT_ORDER[a.placement] - PLACEMENT_ORDER[b.placement] ||
          a.sortOrder - b.sortOrder,
      );
    return mapped;
  } catch {
    return fallbackMenu();
  }
}

export function filterMenuByPlacement(
  items: PublicMenuItem[],
  placement: MenuPlacement,
): { href: string; label: string }[] {
  return items
    .filter((i) => i.placement === placement && i.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ href, label }) => ({ href, label }));
}
