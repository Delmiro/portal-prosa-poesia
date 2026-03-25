import { PageHeading } from "@/components/page-heading";

export default function CronicasPage() {
  return (
    <div>
      <PageHeading
        title="Crônicas"
        description="Textos curtos de atualidade e observação — integrados por edição da revista."
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <p className="text-center text-muted-foreground">
          Em breve: listagem alimentada pela API Spring Boot (entidade Cronica).
        </p>
      </div>
    </div>
  );
}
