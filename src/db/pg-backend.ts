/**
 * Apenas para Node (Docker, `next start`, scripts, `npm run dev` sem Worker).
 * Não importe este ficheiro a partir de rotas que entram no bundle do Cloudflare Worker.
 */
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { getRuntimeEnv } from "@/lib/runtime-env";
import * as schema from "./schema";

import type { NodePgDatabase } from "drizzle-orm/node-postgres";

let pool: Pool | undefined;
let pgDb: NodePgDatabase<typeof schema> | undefined;

export function getPgDb(): NodePgDatabase<typeof schema> {
  if (!pgDb) {
    const url = getRuntimeEnv("DATABASE_URL");
    if (!url) {
      throw new Error("DATABASE_URL não definido");
    }
    pool = new Pool({ connectionString: url, max: 10 });
    pgDb = drizzle(pool, { schema });
  }
  return pgDb;
}

export function getPool(): Pool {
  const url = getRuntimeEnv("DATABASE_URL");
  if (!url) {
    throw new Error("DATABASE_URL não definido");
  }
  if (!pool) {
    pool = new Pool({ connectionString: url, max: 10 });
  }
  return pool;
}
