import { PageHeading } from "@/components/page-heading";

export default function ContatoPage() {
  return (
    <div>
      <PageHeading
        title="Contato"
        description="Envie mensagens à redação ou propostas de parceria."
      />
      <div className="mx-auto max-w-lg px-4 pb-20 sm:px-6">
        <p className="text-center text-muted-foreground">
          Em breve: formulário com validação e envio via API.
        </p>
      </div>
    </div>
  );
}
