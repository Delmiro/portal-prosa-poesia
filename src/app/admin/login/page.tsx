"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearSession, getToken, getStoredUser, setSession } from "@/lib/admin/token";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = getToken();
    const u = getStoredUser();
    if (
      t &&
      u &&
      (u.role === "ADMIN" || u.role === "MASTER_ADMIN")
    ) {
      router.replace("/admin/dashboard");
    }
    if (t && u?.role === "USER") {
      clearSession();
    }
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof data.message === "string" ? data.message : "Falha no login",
        );
        return;
      }
      const role = data.user?.role as string | undefined;
      if (role !== "ADMIN" && role !== "MASTER_ADMIN") {
        setError("Acesso reservado a administradores.");
        return;
      }
      setSession(data.accessToken, {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
      });
      router.replace("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold">Área administrativa</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Inicie sessão com uma conta de administrador.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="text"
              inputMode="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
                "outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
              )}
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="admin-password">
              Palavra-passe
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
                "outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring",
              )}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "A entrar…" : "Entrar"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/" className="underline underline-offset-4 hover:text-foreground">
            Voltar ao site
          </Link>
        </p>
      </div>
    </div>
  );
}
