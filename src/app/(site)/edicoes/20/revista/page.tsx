import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MagazineFlipbook } from "@/components/magazine/magazine-flipbook";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function RevistaInterativaPage() {
  return (
    <div className="pb-8 pt-4 sm:pb-12 sm:pt-6">
      <div className="mx-auto max-w-5xl pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:px-6">
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

      <div className="mx-auto mt-6 w-full min-w-0 max-w-[min(100%,96rem)] py-4 pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:mt-8 sm:pl-4 sm:pr-4 lg:px-6">
        <MagazineFlipbook />
      </div>
    </div>
  );
}
