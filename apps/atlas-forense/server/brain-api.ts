import { readApprovedKnowledgeSnapshot, readKnowledgeHealth, readLegacyKnowledgeReviewHealth } from "./knowledge-snapshot";
/**
 * API interna Atlas ⇄ Cérebro Jurídico (JuridIA/EJC).
 *
 * Rotas (todas exigem Authorization: Bearer <ATLAS_BRAIN_API_TOKEN>):
 *   GET  /api/v1/brain/compendium/search  → julgados citáveis do Compêndio (metadados públicos)
 *   GET  /api/v1/brain/jurimetry          → jurimetria DESCRITIVA com cobertura e limites
 *   POST /api/v1/brain/theses             → tese aprovada pelo advogado → Fila Editorial (pending_review)
 *   GET  /api/v1/brain/knowledge/*        → snapshot aprovado paginado (contrato versionado)
 *
 * Compatibilidade (F1.2): as mesmas rotas continuam atendendo no prefixo legado
 * /api/internal/brain com headers Deprecation/Sunset até BRAIN_LEGACY_SUNSET.
 *
 * Observabilidade (F1.3): todo erro usa o envelope {ok:false, error, status,
 * requestId} e o header X-Request-Id é ecoado (middleware global do servidor).
 *
 * Contrato: packages/shared/brain-api.ts (fonte única). Nenhum dado de caso/parte entra ou sai por aqui.
 */

import type { Express, NextFunction, Request, RequestHandler, Response } from "express";
import {
  BRAIN_API_LEGACY_PREFIX,
  BRAIN_API_PREFIX,
  BRAIN_LEGACY_SUNSET,
  apiErrorBody,
  normalizeRequestId,
  BRAIN_CITABLE_SOURCE_STATUSES,
  BRAIN_JURIMETRY_LIMITS,
  BRAIN_SEARCH_MAX_PAGE_SIZE,
  BRAIN_THESIS_SOURCE_KEY,
  buildJurimetrySummary,
  jurimetrySummaryToPrompt,
  toBrainDecision,
  validateThesisSubmission,
} from "@shared/brain-api";
import { auditEvents } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { authenticateBrainToken, createRateLimiter } from "./brain-api-auth";
import { editorialMetadataHash } from "./editorial-pipeline";
import {
  enqueueEditorialCandidates,
  finishEditorialRun,
  getDb,
  getNationalCensusOverview,
  getRmbhCivilConsumerOverview,
  recordEditorialRunStart,
  searchCompendium,
} from "./db";

const limiter = createRateLimiter({ limit: 120, windowMs: 60_000 });

function queryString(req: Request, key: string, max = 160): string | undefined {
  const value = req.query[key];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

function queryInt(req: Request, key: string, fallback: number, min: number, max: number) {
  const parsed = Number.parseInt(String(req.query[key] ?? ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function requestIdOf(req: Request): string {
  return normalizeRequestId((req as Request & { requestId?: string }).requestId);
}

/** Envelope de erro padrão (F1.3): {ok:false, error, status, requestId[, details]}. */
function sendError(req: Request, res: Response, status: number, error: string, details?: string[]): void {
  res.status(status).json(apiErrorBody(error, status, requestIdOf(req), details));
}

function guard(req: Request, res: Response): boolean {
  const auth = authenticateBrainToken(req.headers.authorization, ENV.brainApiToken);
  if (!auth.ok) {
    sendError(req, res, auth.status, auth.error);
    return false;
  }
  if (!limiter.take()) {
    sendError(req, res, 429, "rate_limited");
    return false;
  }
  return true;
}

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export async function handleCompendiumSearch(req: Request, res: Response) {
  if (!guard(req, res)) return;
  try {
    const pageSize = queryInt(req, "pageSize", 8, 1, BRAIN_SEARCH_MAX_PAGE_SIZE);
    const page = queryInt(req, "page", 0, 0, 1_000);
    const result = await searchCompendium({
      query: queryString(req, "q"),
      tribunal: queryString(req, "tribunal", 64),
      city: queryString(req, "city", 128),
      legalArea: queryString(req, "legalArea", 255),
      sourceStatuses: BRAIN_CITABLE_SOURCE_STATUSES,
      page,
      pageSize,
    });
    const sourcesById = new Map(result.sources.map(source => [source.id, source]));
    res.json({
      ok: true,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      items: result.decisions.map(decision => toBrainDecision(decision, sourcesById.get(decision.sourceId))),
      methodology: "Somente registros com fonte citável (oficial confirmada, oficial sem número ou anexo revisado). Conferir fonte oficial e inteiro teor antes de usar.",
    });
  } catch (error) {
    console.error("[BrainAPI] compendium/search falhou:", error instanceof Error ? error.message : error);
    sendError(req, res, 502, "compendium_unavailable");
  }
}

export async function handleJurimetry(req: Request, res: Response) {
  if (!guard(req, res)) return;
  const from = queryString(req, "from", 7);
  const to = queryString(req, "to", 7);
  const municipalityIbgeCode = queryString(req, "municipalityIbgeCode", 7);
  if ((from && !MONTH_RE.test(from)) || (to && !MONTH_RE.test(to)) || (municipalityIbgeCode && !/^\d{7}$/.test(municipalityIbgeCode))) {
    sendError(req, res, 400, "invalid_filter");
    return;
  }
  const [civil, national] = await Promise.allSettled([
    getRmbhCivilConsumerOverview({ from, to, municipalityIbgeCode }),
    getNationalCensusOverview({ from, to }),
  ]);
  if (civil.status === "rejected") console.error("[BrainAPI] jurimetry civil falhou:", civil.reason instanceof Error ? civil.reason.message : civil.reason);
  if (national.status === "rejected") console.error("[BrainAPI] jurimetry nacional falhou:", national.reason instanceof Error ? national.reason.message : national.reason);
  const summary = buildJurimetrySummary({
    civilConsumer: civil.status === "fulfilled" ? (civil.value as never) : null,
    national: national.status === "fulfilled" ? (national.value as never) : null,
  });
  res.json({
    ok: true,
    partial: civil.status === "rejected" || national.status === "rejected",
    filter: { from: from ?? null, to: to ?? null, municipalityIbgeCode: municipalityIbgeCode ?? null },
    limits: [...BRAIN_JURIMETRY_LIMITS],
    summary,
    interpretation: {
      damageCausalBreakdown: summary.rmbhCivilConsumer.damageCausalBreakdown,
      note: "Agrupamento descritivo por tipo de dano e causa/assunto textual; não representa procedência, valor de condenação ou taxa de êxito.",
    },
    promptBlock: jurimetrySummaryToPrompt(summary),
  });
}

export async function handleThesisSubmission(req: Request, res: Response) {
  if (!guard(req, res)) return;
  const validation = validateThesisSubmission((req.body ?? {}) as Record<string, unknown>);
  if (!validation.ok) {
    sendError(req, res, 422, "invalid_thesis", validation.errors);
    return;
  }
  const thesis = validation.value;
  try {
    const runId = await recordEditorialRunStart(`${BRAIN_THESIS_SOURCE_KEY}:${thesis.thesisKey}`, 1);
    if (!runId) throw new Error("run_not_created");
    const summaryWithRefs = thesis.authorityRefs.length
      ? `${thesis.summary} Referências: ${thesis.authorityRefs.join("; ")}`.slice(0, 1_000)
      : thesis.summary;
    const candidate = {
      sourceKey: BRAIN_THESIS_SOURCE_KEY,
      externalKey: thesis.thesisKey,
      kind: thesis.kind,
      title: `Cérebro Jurídico: ${thesis.title}`.slice(0, 500),
      summary: summaryWithRefs,
      canonicalUrl: thesis.canonicalUrl,
      publishedAt: null as Date | null,
    };
    const queued = await enqueueEditorialCandidates(runId, [{ ...candidate, contentHash: editorialMetadataHash(candidate) }]);
    await finishEditorialRun(runId, { status: "completed", discoveredCount: 1, queuedCount: queued, failedCount: 0 });
    const db = await getDb();
    if (db) {
      await db.insert(auditEvents).values({
        entityType: "brain_thesis",
        entityKey: thesis.thesisKey,
        action: queued ? "submitted_pending_review" : "duplicate_ignored",
        actorLabel: "juridia-brain",
        note: `Tese ${thesis.kind} enviada pelo Cérebro; revisão humana obrigatória`.slice(0, 500),
      });
    }
    res.status(queued ? 201 : 200).json({ ok: true, queued: queued > 0, duplicate: queued === 0, status: "pending_review", thesisKey: thesis.thesisKey });
  } catch (error) {
    console.error("[BrainAPI] theses falhou:", error instanceof Error ? error.message : error);
    sendError(req, res, 502, "editorial_queue_unavailable");
  }
}

/** Only approved, metadata-only records. Version is a complete snapshot digest, not a file hash. */
export async function handleKnowledgeSnapshot(req: Request, res: Response) {
  if (!guard(req, res)) return;
  const pageSize = queryInt(req, "pageSize", 50, 1, 100);
  const page = queryInt(req, "page", 0, 0, 1_000);
  const version = queryString(req, "version", 100);
  if (page > 0 && !version) {
    sendError(req, res, 400, "snapshot_version_required");
    return;
  }
  try {
    const snap = await readApprovedKnowledgeSnapshot();
    if (version && version !== snap.snapshotVersion) {
      sendError(req, res, 409, "snapshot_changed");
      return;
    }
    res.json({
      ok: true, contractVersion: 1, snapshotVersion: snap.snapshotVersion,
      total: snap.items.length, page, pageSize,
      items: snap.items.slice(page * pageSize, (page + 1) * pageSize),
      complete: (page + 1) * pageSize >= snap.items.length,
      methodology: "Somente metadados oficiais aprovados. Registros não são precedentes nem texto integral.",
    });
  } catch {
    sendError(req, res, 503, "knowledge_snapshot_unavailable");
  }
}

export async function handleKnowledgeItem(req: Request, res: Response) {
  if (!guard(req, res)) return;
  const id = req.params.id;
  if (!/^\d{1,12}$/.test(id)) {
    sendError(req, res, 400, "invalid_item_id");
    return;
  }
  try {
    const snap = await readApprovedKnowledgeSnapshot();
    const item = snap.items.find(x => x.atlasItemId === id);
    if (!item) { sendError(req, res, 404, "knowledge_item_not_found"); return; }
    res.json({ ok: true, contractVersion: 1, snapshotVersion: snap.snapshotVersion, item });
  } catch {
    sendError(req, res, 503, "knowledge_snapshot_unavailable");
  }
}

export async function handleKnowledgeHealth(req: Request, res: Response) {
  if (!guard(req, res)) return;
  try { res.json(await readKnowledgeHealth()); }
  catch { sendError(req, res, 503, "knowledge_health_unavailable"); }
}

/** Private operational counts; no source bodies or unapproved citations. */
export async function handleLegacyReviewHealth(req: Request, res: Response) {
  if (!guard(req, res)) return;
  try { res.json(await readLegacyKnowledgeReviewHealth()); }
  catch { sendError(req, res, 503, "legacy_review_health_unavailable"); }
}

/**
 * Middleware de deprecação do prefixo legado (F1.2): sinaliza consumidores com
 * Deprecation/Sunset/Link sem alterar corpo nem status — migração sem quebra.
 */
function withDeprecation(handler: (req: Request, res: Response) => void | Promise<void>): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Deprecation", "true");
    res.setHeader("Sunset", BRAIN_LEGACY_SUNSET);
    // req.path aqui é o caminho completo (ex.: /api/internal/brain/jurimetry);
    // remove o prefixo legado para apontar a rota sucessora equivalente em v1.
    const suffix = req.path.startsWith(BRAIN_API_LEGACY_PREFIX)
      ? req.path.slice(BRAIN_API_LEGACY_PREFIX.length)
      : req.path;
    res.setHeader("Link", `<${BRAIN_API_PREFIX}${suffix}>; rel="successor-version"`);
    Promise.resolve(handler(req, res)).catch(next);
  };
}

export function registerBrainApiRoutes(app: Express) {
  const routes: Array<["get" | "post", string, (req: Request, res: Response) => void | Promise<void>]> = [
    ["get", "/compendium/search", handleCompendiumSearch],
    ["get", "/jurimetry", handleJurimetry],
    ["post", "/theses", handleThesisSubmission],
    ["get", "/knowledge/snapshot", handleKnowledgeSnapshot],
    ["get", "/knowledge/items/:id", handleKnowledgeItem],
    ["get", "/knowledge/health", handleKnowledgeHealth],
    ["get", "/knowledge/legacy-health", handleLegacyReviewHealth],
  ];
  // Prefixo canônico: /api/v1/brain (F1.2)
  for (const [method, path, handler] of routes) app[method](`${BRAIN_API_PREFIX}${path}`, handler);
  // Alias legado com headers de deprecação — mantém consumidores antigos vivos até o sunset.
  for (const [method, path, handler] of routes) app[method](`${BRAIN_API_LEGACY_PREFIX}${path}`, withDeprecation(handler));
}
