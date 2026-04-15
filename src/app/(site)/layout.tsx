import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLinks } from "@/components/skip-links";
import { getPublishedRevistaFlipHref } from "@/lib/cms-public";
import { filterMenuByPlacement, getPublicMenuItems } from "@/lib/public-menu";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const menu = await getPublicMenuItems();
  const mainNav = filterMenuByPlacement(menu, "MAIN");
  const quickNav = filterMenuByPlacement(menu, "QUICK");
  const footerRevista = filterMenuByPlacement(menu, "FOOTER_REVISTA");
  const footerConteudo = filterMenuByPlacement(menu, "FOOTER_CONTEUDO");
  const footerContacto = filterMenuByPlacement(menu, "FOOTER_CONTACTO");
  const flipFallback = await getPublishedRevistaFlipHref();
  const ctaRevistaHref =
    quickNav.find((q) => q.href.includes("/revista"))?.href ?? flipFallback;

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLinks />
      <SiteHeader
        mainNav={mainNav}
        quickNav={quickNav}
        ctaRevistaHref={ctaRevistaHref}
      />
      <main
        id="conteudo"
        className="flex-1 min-w-0 overflow-x-hidden bg-[var(--background)]"
        tabIndex={-1}
      >
        {children}
      </main>
      <SiteFooter
        footerRevista={footerRevista}
        footerConteudo={footerConteudo}
        footerContacto={footerContacto}
      />
    </div>
  );
}
