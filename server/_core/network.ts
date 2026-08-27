/** Resolve a escuta do HTTP server sem expor o upstream de produção. */
export function getServerListenOptions(port: number, nodeEnv = process.env.NODE_ENV) {
  return nodeEnv === "production" ? { port, host: "127.0.0.1" } : { port };
}
