"use client";

import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  ImageIcon,
  LayoutDashboard,
  Layers,
  LogOut,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearSession, getStoredUser, type StoredUser } from "@/lib/admin/token";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  masterOnly?: boolean;
};

const items: NavItem[] = [
  { href: "/admin/dashboard", label: "Painel", icon: LayoutDashboard },
  {
    href: "/admin/utilizadores",
    label: "Utilizadores",
    icon: Users,
    masterOnly: true,
  },
  { href: "/admin/midia", label: "Mídia", icon: ImageIcon },
  { href: "/admin/revistas", label: "Revistas", icon: BookOpen },
  { href: "/admin/secoes", label: "Secções CMS", icon: Layers },
  { href: "/admin/conteudo", label: "Conteúdo", icon: FileText },
  { href: "/admin/perfil", label: "Perfil", icon: UserCircle },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const visible = items.filter(
    (i) => !i.masterOnly || user?.role === "MASTER_ADMIN",
  );

  function logout() {
    clearSession();
    router.push("/admin/login");
  }

  return (
    <aside className="shrink-0 border-b border-border bg-card md:w-56 md:border-b-0 md:border-r">
      <div className="border-b border-border px-4 py-3 md:border-b">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Administração
        </p>
        {user && (
          <p className="mt-1 truncate text-sm font-medium" title={user.email}>
            {user.name || user.email}
          </p>
        )}
      </div>
      <nav className="flex gap-1 overflow-x-auto p-2 md:flex-col md:overflow-visible">
        {visible.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="hidden border-t border-border p-2 md:block">
        <Link
          href="/"
          className="mb-1 block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          Ver site público
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </div>
      <div className="flex gap-2 border-t border-border p-2 md:hidden">
        <Link
          href="/"
          className="flex-1 rounded-lg border border-border px-2 py-2 text-center text-xs"
        >
          Site
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex-1 rounded-lg border border-border px-2 py-2 text-xs"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
