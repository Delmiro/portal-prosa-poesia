import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";

export default function AdminHomePage() {
  return (
    <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
      <h1 className="font-serif text-2xl font-semibold">Painel</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Estrutura reservada para autenticação, gestão de autores, edições mensais, textos
        (artigos, poemas, contos, crônicas), galerias e uploads via Cloudinary.
      </p>
      <Link href="/" className={buttonVariants({ variant: "outline", className: "mt-6" })}>
        Voltar ao site público
      </Link>
    </div>
  );
}
