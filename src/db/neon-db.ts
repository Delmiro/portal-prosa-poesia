import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

let neonDb: NeonHttpDatabase<typeof schema> | undefined;

function isNeonHost(url: string): boolean {
  try {
    return new URL(url).hostname.includes("neon.tech");
  } catch {
    return false;
  }
}

export function getNeonDb(): NeonHttpDatabase<typeof schema> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL não definido");
  }
  if (!isNeonHost(url)) {
    throw new Error(
      "No Cloudflare Workers use PostgreSQL Neon (hostname …neon.tech). Defina DATABASE_URL do Neon.",
    );
  }
  if (!neonDb) {
    const sql = neon(url);
    neonDb = drizzle(sql, { schema });
  }
  return neonDb;
}
