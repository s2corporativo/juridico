import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Erros de tipo FALHAM o build (fail-closed) — proteção de produção.
  reactStrictMode: true,
};

export default nextConfig;
