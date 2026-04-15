import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /**
   * `pg` faz `require("pg-cloudflare")` em `lib/stream.js`. O OpenNext usa a condição
   * `workerd` do esbuild; sem o pacote completo em `.open-next/`, falha ao resolver
   * `pg-cloudflare/dist/index.js`. Com estes pacotes marcados como externos, o próprio
   * OpenNext copia a árvore completa (ver `copyWorkerdPackages` em @opennextjs/cloudflare).
   *
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages
   */
  serverExternalPackages: ["pg", "pg-cloudflare"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
