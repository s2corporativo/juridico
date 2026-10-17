import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Um domínio Atlas; Juridiá ocupa /juridia, sem conflitar com a API do Atlas.
  basePath: "/juridia",
  // Erros de tipo FALHAM o build (fail-closed) — proteção de produção.
  reactStrictMode: true,
};

export default nextConfig;
