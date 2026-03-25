import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MagazineFlipbook } from "@/components/magazine/magazine-flipbook";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function RevistaInterativaPage() {
  return (
    <div className="pb-8 pt-4 sm:pb-12 sm:pt-6">
      <div className="mx-auto max-w-5xl px-3 sm:px-6">
        <Link
          href="/edicoes/20"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2 -ml-1")}
        >
          <ArrowLeft className="size-4" />
          Voltar à edição
        </Link>
        <h1 className="mt-4 font-serif text-2xl font-semibold tracking-tight sm:mt-6 sm:text-3xl md:text-4xl">
          Leitura em revista
        </h1>
      </div>

      <div className="mx-auto mt-6 w-full max-w-[min(100%,96rem)] px-2 py-4 sm:mt-8 sm:px-4 lg:px-6">
        <MagazineFlipbook />
      </div>
    </div>
  );
}
