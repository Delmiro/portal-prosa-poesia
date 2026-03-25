import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="conteudo" className="flex-1 bg-[var(--background)]" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
