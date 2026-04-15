"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin/api";
import { getStoredUser } from "@/lib/admin/token";

type Row = {
  id: string;
  email: string;
  name: string;
  role: string;
  enabled: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [allow, setAllow] = useState(false);

  useEffect(() => {
    const u = getStoredUser();
    if (u?.role !== "MASTER_ADMIN") {
      router.replace("/admin/dashboard");
      return;
    }
    setAllow(true);
  }, [router]);

  useEffect(() => {
    if (!allow) return;
    let cancelled = false;
    const t = setTimeout(() => {
      (async () => {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        params.set("size", "50");
        const res = await adminFetch(`/api/admin/users?${params}`);
        const json = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (!cancelled) {
            setError(
              typeof json.message === "string" ? json.message : "Erro ao carregar",
            );
          }
          return;
        }
        if (!cancelled) {
          setError(null);
          setRows(json.content ?? []);
          setTotal(json.totalElements ?? 0);
        }
      })();
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q, allow]);

  if (!allow) {
    return (
      <p className="text-sm text-muted-foreground">A carregar…</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Utilizadores</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pesquisa e listagem (apenas master). Total: {total}
        </p>
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="user-q">
          Pesquisar
        </label>
        <input
          id="user-q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Email ou nome"
          className="mt-1 w-full max-w-md rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Função</th>
              <th className="px-4 py-3 font-medium">Ativo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">{r.name}</td>
                <td className="px-4 py-3">{r.role}</td>
                <td className="px-4 py-3">{r.enabled ? "Sim" : "Não"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
