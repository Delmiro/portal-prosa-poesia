import { PageHeading } from "@/components/page-heading";

export default function ContosPage() {
  return (
    <div>
      <PageHeading
        title="Contos"
        description="Ficção curta com destaque visual e tempo de leitura estimado."
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <p className="text-center text-muted-foreground">
          Em breve: contos publicados nas edições da revista.
        </p>
      </div>
    </div>
  );
}
