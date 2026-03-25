import { PageHeading } from "@/components/page-heading";

export default function ArtigosPage() {
  return (
    <div>
      <PageHeading
        title="Artigos"
        description="Ensaios, crônicas e artigos de fundo."
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <p className="text-center text-muted-foreground">
          Em breve: artigos com imagem de destaque e metadados da edição.
        </p>
      </div>
    </div>
  );
}
