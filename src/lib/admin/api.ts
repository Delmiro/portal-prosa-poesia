import { clearSession, getToken } from "./token";

function apiErrorMessage(data: Record<string, unknown>): string | undefined {
  if (typeof data.message === "string") return data.message;
  const errs = data.errors;
  if (Array.isArray(errs) && errs[0] && typeof errs[0] === "object") {
    const m = (errs[0] as { message?: string }).message;
    if (typeof m === "string") return m;
  }
  return undefined;
}

/** Exportado para páginas admin mostrarem a mesma mensagem que a API devolve. */
export function parseApiErrorBody(data: unknown): string | undefined {
  if (data && typeof data === "object") {
    return apiErrorMessage(data as Record<string, unknown>);
  }
  return undefined;
}

export async function adminFetch(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (
    init?.body &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(path, {
    ...init,
    headers,
    credentials: "same-origin",
  });
  if (res.status === 401 && typeof window !== "undefined") {
    clearSession();
    if (!window.location.pathname.startsWith("/admin/login")) {
      window.location.replace("/admin/login");
    }
  }
  return res;
}
