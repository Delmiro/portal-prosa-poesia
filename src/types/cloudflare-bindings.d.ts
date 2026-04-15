/** Merge com CloudflareEnv do @opennextjs/cloudflare (segredos e vars definidos no painel/wrangler). */
declare global {
  interface CloudflareEnv {
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    CF_WORKER?: string;
  }
}

export {};
