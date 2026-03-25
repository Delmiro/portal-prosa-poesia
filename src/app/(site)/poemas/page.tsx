import { PageHeading } from "@/components/page-heading";

export default function PoemasPage() {
  return (
    <div>
      <PageHeading
        title="Poemas"
        description="Versos com respiro tipográfico e leitura confortável."
      />
      <div className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <p className="text-center text-muted-foreground">
          Em breve: listagem de poemas por edição e autor.
        </p>
      </div>
    </div>
  );
}
