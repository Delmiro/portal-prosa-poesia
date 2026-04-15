"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { adminFetch } from "@/lib/admin/api";

type ProfileUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  profile: {
    bio: string | null;
    avatarMediaId: string | null;
    socialLinksJson: string | null;
  } | null;
};

export default function AdminProfilePage() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [bio, setBio] = useState("");
  const [socialLinksJson, setSocialLinksJson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await adminFetch("/api/profile/me");
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (!cancelled) {
          setError(
            typeof json.message === "string" ? json.message : "Erro ao carregar",
          );
        }
        return;
      }
      const u = json as ProfileUser;
      if (!cancelled) {
        setError(null);
        setUser(u);
        setBio(u.profile?.bio ?? "");
        setSocialLinksJson(u.profile?.socialLinksJson ?? "");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    setLoading(true);
    try {
      const res = await adminFetch("/api/profile/me", {
        method: "PUT",
        body: JSON.stringify({
          bio: bio || null,
          socialLinksJson: socialLinksJson || null,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          typeof json.message === "string" ? json.message : "Erro ao guardar",
        );
        return;
      }
      setUser(json as ProfileUser);
      setSaved(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Perfil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dados públicos do seu utilizador.
        </p>
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {user && (
        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm">
            <span className="text-muted-foreground">Email: </span>
            {user.email}
          </p>
          <p className="mt-2 text-sm">
            <span className="text-muted-foreground">Nome: </span>
            {user.name}
          </p>
          <p className="mt-2 text-sm">
            <span className="text-muted-foreground">Função: </span>
            {user.role}
          </p>
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div>
          <label className="text-sm font-medium" htmlFor="admin-bio">
            Biografia
          </label>
          <textarea
            id="admin-bio"
            rows={5}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className={cn(
              "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="admin-social">
            Ligações sociais (JSON)
          </label>
          <textarea
            id="admin-social"
            rows={3}
            value={socialLinksJson}
            onChange={(e) => setSocialLinksJson(e.target.value)}
            placeholder='{"twitter":"..."}'
            className={cn(
              "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-mono",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          />
        </div>
        {saved && (
          <p className="text-sm text-green-600 dark:text-green-400">
            Alterações guardadas.
          </p>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "A guardar…" : "Guardar"}
        </Button>
      </form>
    </div>
  );
}
