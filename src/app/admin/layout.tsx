export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background px-4 py-4">
        <p className="text-sm font-medium">Área administrativa</p>
        <p className="text-xs text-muted-foreground">
          Login JWT, CRUD de edições e conteúdos — integração futura com a API Spring Boot.
        </p>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
