import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const cloudflare = defineCloudflareConfig({});

/**
 * O OpenNext, por defeito, corre `npm run build` para compilar o Next.
 * Se `build` no package.json for `opennextjs-cloudflare build`, isso gerava recursão infinita.
 * Com `buildCommand` explícito, o pipeline interno usa `next build` diretamente.
 *
 * Assim o painel Cloudflare pode usar `npm run build` (= OpenNext completo + `.open-next/`).
 */
export default {
  ...cloudflare,
  buildCommand: "npx next build",
};
