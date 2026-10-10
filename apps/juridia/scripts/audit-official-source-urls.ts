/** Read-only audit: URL reachability is NOT legal approval or text verification.
 * Execute only with an authorized DATABASE_URL; never changes LegalSource.
 */
import { db } from "../src/lib/db";

function officialUrl(value: string | null): URL | null {
  if (!value) return null;
  try {
    const u = new URL(value);
    if (u.protocol !== "https:" || u.username || u.password || u.port ||
        !/^[a-z0-9.-]+$/.test(u.hostname) ||
        !(u.hostname.endsWith(".gov.br") || u.hostname.endsWith(".jus.br"))) return null;
    return u;
  } catch { return null; }
}
export async function auditOfficialUrls(limit = 6) {
  const cap = Math.min(Math.max(limit, 1), 10);
  const sources = await db.legalSource.findMany({
    select: { urlOficial: true, vigente: true, revisadoPor: true },
  });
  const stats = {
    records: sources.length,
    humanSigned: sources.filter(s => /^human:/.test(s.revisadoPor ?? "")).length,
    missingUrl: sources.filter(s => !s.urlOficial).length,
    invalidUrl: sources.filter(s => s.urlOficial && !officialUrl(s.urlOficial)).length,
    checkedUnique: 0,
    reachable: 0,
    unreachable: 0,
    entries: [] as { host: string; path: string; status: string }[],
  };
  const urls = [...new Set(sources.map(s => s.urlOficial).filter((s): s is string => !!officialUrl(s)))].slice(0, cap);
  for (const candidate of urls) {
    const u = officialUrl(candidate)!;
    stats.checkedUnique++;
    let status = "network_unavailable";
    try {
      const resp = await fetch(u.href, {
        redirect: "manual",
        headers: { Accept: "text/html" },
        signal: AbortSignal.timeout(8_000),
      });
      status = resp.ok ? "reachable" : "http_" + resp.status;
      await resp.body?.cancel();
      if (resp.ok) stats.reachable++;
      else stats.unreachable++;
    } catch { stats.unreachable++; }
    stats.entries.push({ host: u.hostname, path: u.pathname, status });
  }
  return stats;
}

if (import.meta.main) {
  auditOfficialUrls(Number(process.argv[2] || 6))
    .then(stats => console.log(JSON.stringify(stats, null, 2)))
    .catch(e => { console.error("SOURCE_AUDIT_FAILED", e instanceof Error ? e.name : "unknown"); process.exitCode = 1; })
    .finally(async () => { await db.$disconnect(); });
}
