// Testes do cliente Atlas (integração Cérebro ↔ Atlas). Executar: bun run tests/atlas-client.test.ts
import {
  atlasRequest,
  decisionToBrainItem,
  extractSearchTerms,
  fetchAtlasJurimetry,
  fetchAtlasKnowledgeSnapshot,
  getAtlasConfig,
  searchAtlasCompendium,
  submitThesisToAtlas,
  webResultToBrainItem,
  type AtlasDecision,
} from "../src/lib/atlas_client";

let passed = 0;
let failed = 0;
function assert(cond: boolean, name: string, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.error(`  ✗ ${name}${detail ? " | " + detail : ""}`); }
}

const TOKEN = "t".repeat(40);
const config = { baseUrl: "http://127.0.0.1:3010", token: TOKEN };

function decision(id: string, date: string | null = "2025-01-01T00:00:00.000Z", extra: Partial<AtlasDecision> = {}): AtlasDecision {
  return {
    externalId: id, citationId: `atlas:${id}`, tribunal: "TJMG", justice: "Estadual", city: "Betim", court: "Turma Recursal",
    judgingBody: null, decisionType: "acordao", decisionDate: date, legalArea: "Consumidor", theme: "Vício do produto",
    summary: "Resumo", sourceStatus: "official_confirmed", officialUrl: "https://www.tjmg.jus.br/x", sourceVerifiedAt: null, ...extra,
  };
}

function mockFetch(handler: (url: URL, init: RequestInit) => { status?: number; body: unknown }): typeof fetch {
  return (async (input: URL | string, init?: RequestInit) => {
    const { status = 200, body } = handler(new URL(String(input)), init ?? {});
    return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  }) as unknown as typeof fetch;
}

// ── Configuração ─────────────────────────────────────────────────────────────
{
  assert(getAtlasConfig({ ATLAS_API_URL: "http://127.0.0.1:3010", ATLAS_BRAIN_API_TOKEN: TOKEN } as unknown as NodeJS.ProcessEnv)?.baseUrl === "http://127.0.0.1:3010", "config válida em loopback");
  assert(getAtlasConfig({} as unknown as NodeJS.ProcessEnv) === null, "sem env: desligado");
  assert(getAtlasConfig({ ATLAS_API_URL: "http://127.0.0.1:3010", ATLAS_BRAIN_API_TOKEN: "curto" } as unknown as NodeJS.ProcessEnv) === null, "token curto: desligado");
  assert(getAtlasConfig({ ATLAS_API_URL: "http://atlas.exemplo.com", ATLAS_BRAIN_API_TOKEN: TOKEN, NODE_ENV: "production" } as unknown as NodeJS.ProcessEnv) === null, "produção exige https fora de loopback");
  assert(getAtlasConfig({ ATLAS_API_URL: "https://atlas.exemplo.com", ATLAS_BRAIN_API_TOKEN: TOKEN, NODE_ENV: "production" } as unknown as NodeJS.ProcessEnv) !== null, "produção aceita https");
  assert(getAtlasConfig({ ATLAS_API_URL: "https://u:p@atlas.exemplo.com", ATLAS_BRAIN_API_TOKEN: TOKEN } as unknown as NodeJS.ProcessEnv) === null, "rejeita credenciais na URL");
  assert(getAtlasConfig({ ATLAS_API_URL: "nao-e-url", ATLAS_BRAIN_API_TOKEN: TOKEN } as unknown as NodeJS.ProcessEnv) === null, "rejeita URL inválida");
}

// ── Termos de busca ──────────────────────────────────────────────────────────
{
  const terms = extractSearchTerms("A cliente João Silva compareceu; vício oculto no veículo e vício oculto na garantia, cobrança indevida [NOME_0001] 12345 inscrição");
  assert(!terms.some((t) => /[A-Z\d\[\]]/.test(t)), "sem maiúsculas, dígitos ou marcadores", terms.join(","));
  assert(terms.includes("oculto"), "mantém vocabulário jurídico", terms.join(","));
  assert(!terms.includes("cliente") && !terms.includes("joão"), "exclui palavras vazias e nomes próprios");
  assert(extractSearchTerms("a b c", 3).length === 0, "texto sem termos úteis retorna vazio");
  assert(extractSearchTerms("garantia garantia garantia legal inscrição negativação", 2)[0] === "garantia", "ordena por frequência");
  assert(extractSearchTerms("garantia legal inscrição negativação indenização", 2).length === 2, "respeita o máximo");
}

// ── Requisição ───────────────────────────────────────────────────────────────
{
  let seen: { url?: URL; auth?: string } = {};
  const ok = mockFetch((url, init) => { seen = { url, auth: (init.headers as Record<string, string>).Authorization }; return { body: { ok: true } }; });
  const r = await atlasRequest("/jurimetry", { query: { from: "2026-01", to: undefined } }, { config, fetchImpl: ok });
  assert(r.ok, "requisição ok");
  assert(seen.url?.pathname === "/api/internal/brain/jurimetry", "prefixo da API interna");
  assert(seen.url?.searchParams.get("from") === "2026-01" && !seen.url?.searchParams.has("to"), "query omite indefinidos");
  assert(seen.auth === `Bearer ${TOKEN}`, "envia bearer");

  const unauth = await atlasRequest("/x", {}, { config, fetchImpl: mockFetch(() => ({ status: 401, body: { error: "unauthorized" } })) });
  assert(!unauth.ok && unauth.error === "unauthorized" && unauth.status === 401, "propaga erro HTTP");

  const down = await atlasRequest("/x", {}, { config, fetchImpl: (async () => { throw new TypeError("fail"); }) as unknown as typeof fetch });
  assert(!down.ok && down.error === "atlas_unreachable", "rede indisponível não lança");

  const off = await atlasRequest("/x", {}, { config: null });
  assert(!off.ok && off.error === "atlas_not_configured", "sem config: atlas_not_configured");
}

// ── Compêndio: fusão ─────────────────────────────────────────────────────────
{
  const f = mockFetch((url) => {
    const q = url.searchParams.get("q");
    if (q === "garantia") return { body: { ok: true, total: 2, items: [decision("a", "2025-01-01T00:00:00.000Z"), decision("b", "2025-06-01T00:00:00.000Z")] } };
    if (q === "veículo") return { body: { ok: true, total: 1, items: [decision("a", "2025-01-01T00:00:00.000Z")] } };
    return { status: 500, body: { error: "boom" } };
  });
  const r = await searchAtlasCompendium(["garantia", "veículo", "falha"], { limit: 5 }, { config, fetchImpl: f });
  assert(r.ok, "fusão ok com falha parcial");
  if (r.ok) {
    assert(r.data.items.length === 2, "deduplica por externalId");
    assert(r.data.items[0].externalId === "a", "prioriza quem casa mais termos");
    assert(r.data.failedTerms === 1, "contabiliza termos com falha");
  }
  const allFail = await searchAtlasCompendium(["x1x1x1"], {}, { config, fetchImpl: mockFetch(() => ({ status: 503, body: { error: "brain_api_disabled" } })) });
  assert(!allFail.ok && allFail.error === "brain_api_disabled", "todas falham: erro propagado");
  const empty = await searchAtlasCompendium([], {}, { config });
  assert(empty.ok && empty.data.items.length === 0, "sem termos: vazio sem chamar a rede");
}

// ── Jurimetria e teses ───────────────────────────────────────────────────────
{
  const j = await fetchAtlasJurimetry({}, { config, fetchImpl: mockFetch(() => ({ body: { ok: true, partial: true, limits: ["L"], summary: {}, promptBlock: "bloco" } })) });
  assert(j.ok && j.data.partial && j.data.promptBlock === "bloco", "jurimetria projetada");

  let sentBody = "";
  const t = await submitThesisToAtlas(
    { title: "Título da tese", summary: "s".repeat(40), kind: "legislation", canonicalUrl: "https://www.planalto.gov.br/x" },
    { config, fetchImpl: mockFetch((_u, init) => { sentBody = String(init.body); return { status: 201, body: { ok: true, queued: true, duplicate: false, status: "pending_review", thesisKey: "k".repeat(40) } }; }) },
  );
  assert(t.ok && t.data.status === "pending_review" && t.data.queued, "recibo pending_review");
  assert(sentBody.includes("canonicalUrl"), "corpo enviado em JSON");
}

// ── Mapeamentos ──────────────────────────────────────────────────────────────
{
  const item = decisionToBrainItem(decision("z"));
  assert(item.origin === "atlas_compendio" && item.state === "jurisprudencia" && item.confidence === 0.9, "decisão oficial: confiança por qualidade da fonte");
  assert(item.favorable === null, "não infere favorabilidade");
  assert(decisionToBrainItem(decision("y", null, { officialUrl: null })).url === "", "sem URL oficial: url vazia");
  assert(decisionToBrainItem(decision("w", null, { sourceStatus: "outro" })).confidence === 0.5, "status desconhecido: 0.5");
  const web = webResultToBrainItem({ url: "https://x.com", name: "n", snippet: "s", host_name: "x.com" });
  assert(web.state === "hipotese" && web.origin === "web_nao_verificado" && web.confidence === 0.3, "web aberta vira hipótese");
}

// ── Snapshot de conhecimento aprovado (Atlas → JuridIA, sem DB remoto) ───────
{
  const version = "v1:" + "a".repeat(64);
  const body = {
    ok: true, contractVersion: 1, snapshotVersion: version,
    total: 1, page: 0, pageSize: 50, complete: true,
    methodology: "Metadados de descoberta, sem precedente",
    items: [{
      atlasItemId: "7", sourceKey: "stj-dados-abertos", sourceType: "official_update",
      tribunal: "STJ", title: "Dataset STJ", officialUrl: "https://dadosabertos.web.stj.jus.br/dataset/x",
      publishedAt: null, provenanceHash: "b".repeat(64), editorialStatus: "approved",
      documentStatus: "discovery_only", citableAsPrecedent: false, text: null,
    }],
  };
  const ok = await fetchAtlasKnowledgeSnapshot(0, undefined, {
    config, fetchImpl: mockFetch(() => ({ body })),
  });
  assert(ok.ok && ok.data.snapshotVersion === version && ok.data.items.length === 1, "snapshot aprovado validado");
  const wrong = await fetchAtlasKnowledgeSnapshot(0, undefined, {
    config, fetchImpl: mockFetch(() => ({ body: { ...body, items: [{ ...body.items[0], citableAsPrecedent: true }] } })),
  });
  assert(!wrong.ok && wrong.error === "invalid_atlas_knowledge_contract", "snapshot não pode inventar precedente citável");
  const invalidCursor = await fetchAtlasKnowledgeSnapshot(1, undefined, { config });
  assert(!invalidCursor.ok && invalidCursor.error === "invalid_snapshot_cursor", "pagina posterior exige versão");
  const changed = await fetchAtlasKnowledgeSnapshot(0, "v1:" + "c".repeat(64), {
    config, fetchImpl: mockFetch(() => ({ status: 409, body: { error: "snapshot_changed" } })),
  });
  assert(!changed.ok && changed.status === 409, "snapshot alterado rejeita cursor antigo");
}

console.log(`\n${passed} passaram, ${failed} falharam`);
if (failed > 0) throw new Error(`${failed} Atlas client checks failed`);
