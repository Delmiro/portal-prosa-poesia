"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin/api";

type DashboardStats = {
  userCount: number;
  sitePageCount: number;
  magazineCount: number;
  recentActivities: Array<{
    type: string;
    description: string;
    at: string;
  }>;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await adminFetch("/api/admin/dashboard");
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (!cancelled) {
          setError(
            typeof json.message === "string" ? json.message : "Erro ao carregar",
          );
        }
        return;
      }
      if (!cancelled) setData(json as DashboardStats);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <p className="text-sm text-muted-foreground">A carregar…</p>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Painel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumo da plataforma e atividade recente.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Utilizadores" value={data.userCount} />
        <StatCard label="Páginas do site" value={data.sitePageCount} />
        <StatCard label="Revistas" value={data.magazineCount} />
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-sm font-medium">Atividade recente</h2>
        <ul className="mt-4 space-y-3">
          {data.recentActivities.length === 0 && (
            <li className="text-sm text-muted-foreground">Sem registos.</li>
          )}
          {data.recentActivities.map((a, i) => (
            <li
              key={`${a.at}-${i}`}
              className="flex flex-col gap-0.5 border-b border-border pb-3 text-sm last:border-0 last:pb-0"
            >
              <span>{a.description}</span>
              <span className="text-xs text-muted-foreground">
                {a.at ? new Date(a.at).toLocaleString("pt-PT") : "—"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl font-semibold tabular-nums">
        {value}
      </p>
    </div>
  );
}
