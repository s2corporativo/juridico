/** Resolve a escuta do HTTP server sem presumir a topologia de hospedagem. */
export function getServerListenOptions(port: number, host = process.env.HOST) {
  return host ? { port, host } : { port };
}
