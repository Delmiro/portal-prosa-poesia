import * as schema from "./schema";
import { isCloudflareWorkerRuntime, getRuntimeEnv } from "@/lib/runtime-env";

import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

/** Neon HTTP (Worker) e `pg` (Node) partilham API Drizzle para o mesmo schema. */
export type AppDatabase = NeonHttpDatabase<typeof schema>;

/** Indica se existe cadeia de ligação (útil para mensagens em rotas API). */
export function isDatabaseConfigured(): boolean {
  return Boolean(getRuntimeEnv("DATABASE_URL"));
}

/**
 * Worker Cloudflare: Neon HTTP (sem `pg`).
 * Docker/local: `pg` via `./pg-backend` (carregamento tardio para não ir no bundle do Worker).
 */
export function getDb(): AppDatabase {
  if (isCloudflareWorkerRuntime()) {
    // Import estático apenas de módulos compatíveis com Workers
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getNeonDb } = require("./neon-db") as typeof import("./neon-db");
    return getNeonDb();
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("./pg-backend").getPgDb() as AppDatabase;
}

/** Apenas em ambiente Node (não disponível no Worker). */
export function getPool() {
  if (isCloudflareWorkerRuntime()) {
    throw new Error("getPool() não está disponível no Worker. Use getDb().");
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("./pg-backend").getPool();
}
