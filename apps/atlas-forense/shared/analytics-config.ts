/** Analytics apenas se configurado de forma completa e com HTTPS válido. */
export function analyticsConfig(endpoint?: string, websiteId?: string):
  { src: string; websiteId: string } | null {
  if (!endpoint?.trim() || !websiteId?.trim()) return null;
  if (!/^[A-Za-z0-9_-]{6,100}$/.test(websiteId.trim())) return null;
  try {
    const url = new URL(endpoint.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.hash || url.search) return null;
    // Compatível com servidor Umami original, sem permitir protocolos perigosos.
    return { src: url.href.replace(/\/$/, '') + '/umami', websiteId: websiteId.trim() };
  } catch {
    return null;
  }
}
