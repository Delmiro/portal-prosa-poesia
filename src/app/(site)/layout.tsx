import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLinks } from "@/components/skip-links";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLinks />
      <SiteHeader />
      <main
        id="conteudo"
        className="flex-1 min-w-0 overflow-x-hidden bg-[var(--background)]"
        tabIndex={-1}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
