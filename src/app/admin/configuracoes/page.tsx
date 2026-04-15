"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { adminFetch, parseApiErrorBody } from "@/lib/admin/api";
import { MENU_PLACEMENT_LABELS, type MenuPlacement } from "@/lib/menu-placement";

type MenuItem = {
  id?: string;
  label: string;
  href: string;
  placement: MenuPlacement;
  sortOrder: number;
  visible: boolean;
};

const PLACEMENTS: MenuPlacement[] = [
  "MAIN",
  "QUICK",
  "FOOTER_REVISTA",
  "FOOTER_CONTEUDO",
  "FOOTER_CONTACTO",
];

export default function AdminSettingsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await adminFetch("/api/admin/menu-items");
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (!cancelled) setError(parseApiErrorBody(json) ?? "Erro ao carregar menu");
        return;
      }
      if (!cancelled) {
        setItems(Array.isArray(json) ? json : []);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const byPlacement = useMemo(() => {
    const m = new Map<MenuPlacement, MenuItem[]>();
    for (const p of PLACEMENTS) m.set(p, []);
    for (const it of items) {
      const list = m.get(it.placement);
      if (list) list.push(it);
    }
    for (const p of PLACEMENTS) {
      m.get(p)?.sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return m;
  }, [items]);

  function setPlacementList(placement: MenuPlacement, next: MenuItem[]) {
    setItems((prev) => {
      const other = prev.filter((i) => i.placement !== placement);
      const stamped = next.map((row, idx) => ({
        ...row,
        placement,
        sortOrder: idx,
      }));
      return [...other, ...stamped];
    });
  }

  function addItem(placement: MenuPlacement) {
    const list = byPlacement.get(placement) ?? [];
    setPlacementList(placement, [
      ...list,
      { label: "Novo item", href: "/", placement, sortOrder: list.length, visible: true },
    ]);
  }

  function removeItem(placement: MenuPlacement, index: number) {
    const list = [...(byPlacement.get(placement) ?? [])];
    list.splice(index, 1);
    setPlacementList(placement, list);
  }

  function patchItem(placement: MenuPlacement, index: number, patch: Partial<MenuItem>) {
    const list = [...(byPlacement.get(placement) ?? [])];
    list[index] = { ...list[index], ...patch };
    setPlacementList(placement, list);
  }

  async function saveMenu() {
    setError(null);
    setSuccess(null);
    setSaving(true);
    const flat = PLACEMENTS.flatMap((p) =>
      (byPlacement.get(p) ?? []).map((row, idx) => ({
        label: row.label.trim(),
        href: row.href.trim(),
        placement: p,
        sortOrder: idx,
        visible: row.visible,
      })),
    );
    const res = await adminFetch("/api/admin/menu-items", {
      method: "PUT",
      body: JSON.stringify(flat),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(parseApiErrorBody(json) ?? "Erro ao guardar menu");
      setSaving(false);
      return;
    }
    setItems(Array.isArray(json) ? json : []);
    setSuccess("Menus atualizados com sucesso.");
    setSaving(false);
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Menus do site</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todos os links do menu principal, atalhos do topo e listas do rodapé vêm daqui. Guarde
          após editar.
        </p>
      </div>

      {PLACEMENTS.map((placement) => (
        <section
          key={placement}
          className="space-y-3 rounded-xl border border-border bg-card p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">{MENU_PLACEMENT_LABELS[placement]}</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => addItem(placement)}>
              Adicionar
            </Button>
          </div>
          <div className="space-y-2">
            {(byPlacement.get(placement) ?? []).map((item, index) => (
              <div
                key={`${placement}-${item.id ?? "new"}-${index}`}
                className="grid gap-2 rounded-lg border border-border p-3 md:grid-cols-12"
              >
                <input
                  className="rounded-lg border border-input px-3 py-2 text-sm md:col-span-4"
                  value={item.label}
                  onChange={(e) => patchItem(placement, index, { label: e.target.value })}
                  placeholder="Nome"
                />
                <input
                  className="rounded-lg border border-input px-3 py-2 text-sm md:col-span-5"
                  value={item.href}
                  onChange={(e) => patchItem(placement, index, { href: e.target.value })}
                  placeholder="/rota ou https://..."
                />
                <label className="flex items-center gap-2 text-sm md:col-span-2">
                  <input
                    type="checkbox"
                    checked={item.visible}
                    onChange={(e) => patchItem(placement, index, { visible: e.target.checked })}
                  />
                  Visível
                </label>
                <button
                  type="button"
                  className="rounded-lg border border-border px-2 py-2 text-xs md:col-span-1"
                  onClick={() => removeItem(placement, index)}
                >
                  Remover
                </button>
              </div>
            ))}
            {(byPlacement.get(placement) ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum item nesta secção.</p>
            )}
          </div>
        </section>
      ))}

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={saveMenu} disabled={saving}>
          {saving ? "A guardar..." : "Guardar todos os menus"}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
    </div>
  );
}
