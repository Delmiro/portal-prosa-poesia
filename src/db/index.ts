import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export type AppDatabase = NeonHttpDatabase<typeof schema> | NodePgDatabase<typeof schema>;

let neonDb: NeonHttpDatabase<typeof schema> | undefined;
let pgDb: NodePgDatabase<typeof schema> | undefined;

function isNeonHost(url: string): boolean {
  try {
    const h = new URL(url).hostname;
    return h.includes("neon.tech");
  } catch {
    return false;
  }
}

function getNeonDb(): NeonHttpDatabase<typeof schema> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL não definido");
  }
  if (!isNeonHost(url)) {
    throw new Error(
      "No Cloudflare Workers a ligação PostgreSQL tem de ser Neon (hostname …neon.tech). " +
        "Crie um projeto em https://neon.tech, copie a connection string e defina DATABASE_URL. " +
        "Alternativa: Hyperdrive + pg (configuração avançada).",
    );
  }
  if (!neonDb) {
    const sql = neon(url);
    neonDb = drizzleNeon(sql, { schema });
  }
  return neonDb;
}

function getNodePgDb(): NodePgDatabase<typeof schema> {
  if (!pgDb) {
    // Só em Node (Docker, máquina local). Não importar `pg` no topo — o bundle do Worker não suporta.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require("pg") as typeof import("pg");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle: drizzlePg } = require("drizzle-orm/node-postgres") as typeof import(
      "drizzle-orm/node-postgres"
    );
    const url = process.env.DATABASE_URL?.trim();
    if (!url) {
      throw new Error("DATABASE_URL não definido");
    }
    const pool = new Pool({ connectionString: url, max: 10 });
    pgDb = drizzlePg(pool, { schema });
  }
  return pgDb;
}

/** Indica se existe cadeia de ligação (útil para mensagens em rotas API). */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/**
 * Worker Cloudflare: usa Neon (HTTP). Docker/local: usa `pg`.
 * Defina `CF_WORKER=1` nas variáveis de build no painel Cloudflare (e em wrangler vars em runtime).
 */
export function getDb(): AppDatabase {
  if (process.env.CF_WORKER === "1") {
    return getNeonDb();
  }
  return getNodePgDb();
}

/** Apenas em ambiente Node (não disponível no Worker). */
export function getPool() {
  if (process.env.CF_WORKER === "1") {
    throw new Error("getPool() não está disponível no Worker. Use getDb().");
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pool } = require("pg") as typeof import("pg");
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não definido");
  }
  return new Pool({ connectionString: url, max: 10 });
}
