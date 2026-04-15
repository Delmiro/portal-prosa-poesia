import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * No Cloudflare Workers, segredos e variáveis chegam a `env` do handler. O runtime Node
 * nem sempre replica tudo em `process.env`. Esta função cobre os dois casos.
 */
export function getRuntimeEnv(name: string): string | undefined {
  const fromProcess = process.env[name];
  if (fromProcess != null && String(fromProcess).trim() !== "") {
    return String(fromProcess).trim();
  }
  try {
    const { env } = getCloudflareContext({ async: false });
    const v = (env as Record<string, unknown>)[name];
    if (typeof v === "string" && v.trim() !== "") {
      return v.trim();
    }
  } catch {
    /* fora do Worker ou sem contexto (build, scripts) */
  }
  return undefined;
}

export function isCloudflareWorkerRuntime(): boolean {
  return getRuntimeEnv("CF_WORKER") === "1";
}
