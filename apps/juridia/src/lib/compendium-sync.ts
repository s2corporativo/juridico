// Compendium -> RAG sync — JuridIA consumes Atlas Forense's Compendium.
//
// Atlas exposes its Compendium as public metadata at:
//   GET {ATLAS_API_URL}/api/compendium/teses
//   GET {ATLAS_API_URL}/api/compendium/teses/:slug
//   GET {ATLAS_API_URL}/api/compendium/search?q=...
//
// JuridIA's Cérebro (src/lib/legal_brain.ts) calls searchCompendium() before
// the LLM call to enrich prompts with verified teses (public metadata only).
//
// Cache: in-memory Map<slug, TesePublic> refreshed by syncCompendium().
// Config: ATLAS_API_URL (default http://localhost:3001), ATLAS_API_TOKEN optional.

export interface TesePublic {
  slug: string;
  title: string;
  area: string;
  tribunal?: string;
  source?: string;
  sourceUrl?: string;
  summary: string;
  tags: string[];
  verified: boolean;
  verifiedAt?: string;
}

const ATLAS_API_URL =
  process.env.ATLAS_API_URL || "http://localhost:3001";

const ATLAS_API_TOKEN = process.env.ATLAS_API_TOKEN;

const cache = new Map<string, TesePublic>();
let lastSyncAt = 0;
const SYNC_TTL_MS = 5 * 60 * 1000; // 5 minutes

function authHeaders(): Record<string, string> {
  const h: Record<string, string> = {
    "X-Source-App": "juridia",
    Accept: "application/json",
  };
  if (ATLAS_API_TOKEN) h["X-API-Token"] = ATLAS_API_TOKEN;
  return h;
}

export interface SyncResult {
  fetchedAt: number;
  count: number;
  fromCache: boolean;
  error?: string;
}

// Fetches all teses from Atlas and refreshes the in-memory cache.
// Returns a summary; safe to call repeatedly (TTL-guarded).
export async function syncCompendium(force = false): Promise<SyncResult> {
  const now = Date.now();
  if (!force && now - lastSyncAt < SYNC_TTL_MS && cache.size > 0) {
    return { fetchedAt: lastSyncAt, count: cache.size, fromCache: true };
  }
  try {
    const resp = await fetch(`${ATLAS_API_URL}/api/compendium/teses`, {
      headers: authHeaders(),
      signal: AbortSignal.timeout(10_000),
    });
    if (!resp.ok) {
      return {
        fetchedAt: now,
        count: cache.size,
        fromCache: true,
        error: `atlas_status_${resp.status}`,
      };
    }
    const data = (await resp.json()) as { teses?: TesePublic[] };
    const teses = data.teses ?? [];
    cache.clear();
    for (const t of teses) cache.set(t.slug, t);
    lastSyncAt = now;
    return { fetchedAt: now, count: cache.size, fromCache: false };
  } catch (err) {
    return {
      fetchedAt: now,
      count: cache.size,
      fromCache: true,
      error: err instanceof Error ? err.message : "fetch_failed",
    };
  }
}

// Searches cached teses by keyword (title, summary, area, tags, tribunal).
// Auto-syncs if the cache is empty or stale.
export async function searchCompendium(query: string): Promise<TesePublic[]> {
  if (cache.size === 0 || Date.now() - lastSyncAt > SYNC_TTL_MS) {
    await syncCompendium();
  }
  const q = query.trim().toLowerCase();
  if (!q) return Array.from(cache.values());
  const tokens = q.split(/\s+/);
  return Array.from(cache.values()).filter((t) => {
    const hay = [
      t.title,
      t.summary,
      t.area,
      t.tribunal ?? "",
      t.source ?? "",
      ...t.tags,
    ]
      .join(" ")
      .toLowerCase();
    return tokens.every((tok) => hay.includes(tok));
  });
}

// Returns a specific tese by slug (syncs first to maximize freshness).
export async function getTeseBySlug(slug: string): Promise<TesePublic | undefined> {
  if (cache.size === 0 || Date.now() - lastSyncAt > SYNC_TTL_MS) {
    await syncCompendium();
  }
  const cached = cache.get(slug);
  if (cached) return cached;
  // Fallback: ask Atlas directly for this slug.
  try {
    const resp = await fetch(`${ATLAS_API_URL}/api/compendium/teses/${encodeURIComponent(slug)}`, {
      headers: authHeaders(),
      signal: AbortSignal.timeout(10_000),
    });
    if (!resp.ok) return undefined;
    const tese = (await resp.json()) as TesePublic;
    if (tese && tese.slug) {
      cache.set(tese.slug, tese);
      return tese;
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

// Builds a compact textual context block (for LLM prompt enrichment).
export async function buildCompendiumContext(query: string, max = 5): Promise<string> {
  const hits = (await searchCompendium(query)).slice(0, max);
  if (hits.length === 0) return "";
  const lines = hits.map(
    (t) =>
      `- [${t.source || t.tribunal || "Atlas"}] ${t.title}\n  ${t.summary}`,
  );
  return `Compendium (Atlas Forense — public metadata, verified):\n${lines.join("\n")}`;
}

export function _compendiumCacheStats() {
  return {
    count: cache.size,
    lastSyncAt,
    stale: Date.now() - lastSyncAt > SYNC_TTL_MS,
    atlasApiUrl: ATLAS_API_URL,
  };
}
