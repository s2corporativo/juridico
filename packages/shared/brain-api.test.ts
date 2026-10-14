/**
 * Teste de contrato do pacote compartilhado (F1.1) — roda no CI com Node puro:
 *   node --experimental-strip-types --test packages/shared/brain-api.test.ts
 * Sem dependências externas: o contrato deve permanecer autocontido.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BRAIN_API_LEGACY_PREFIX,
  BRAIN_API_PREFIX,
  BRAIN_LEGACY_SUNSET,
  BRAIN_TOKEN_MIN_LENGTH,
  apiErrorBody,
  buildDamageCausalBreakdown,
  buildJurimetrySummary,
  buildThesisKey,
  detectPersonalData,
  generateRequestId,
  isOfficialSourceUrl,
  isValidRequestId,
  isValidSnapshotVersion,
  jurimetrySummaryToPrompt,
  normalizeRequestId,
  toBrainDecision,
  validateKnowledgeSnapshot,
  validateThesisSubmission,
} from "./brain-api.ts";

test("prefixos de rota: v1 canônico, legado preservado, sunset definido", () => {
  assert.equal(BRAIN_API_PREFIX, "/api/v1/brain");
  assert.equal(BRAIN_API_LEGACY_PREFIX, "/api/internal/brain");
  assert.match(BRAIN_LEGACY_SUNSET, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(BRAIN_TOKEN_MIN_LENGTH >= 32);
});

test("request id: geração, validação e normalização", () => {
  for (let i = 0; i < 20; i++) assert.ok(isValidRequestId(generateRequestId()));
  assert.equal(isValidRequestId("abc"), false);
  assert.equal(isValidRequestId("tem espaço"), false);
  assert.equal(isValidRequestId(42), false);
  assert.equal(normalizeRequestId(["a".repeat(8)]), "a".repeat(8));
  const fromInvalid = normalizeRequestId("curto");
  assert.ok(isValidRequestId(fromInvalid));
  const generated = normalizeRequestId(undefined);
  assert.ok(isValidRequestId(generated));
  assert.ok(generated.startsWith("req_"));
});

test("envelope de erro padrão inclui status e requestId; details opcional", () => {
  assert.deepEqual(apiErrorBody("boom", 502), { ok: false, error: "boom", status: 502, requestId: null });
  const body = apiErrorBody("invalid_thesis", 422, "req_abc123456789", ["title inválido"]);
  assert.equal(body.ok, false);
  assert.equal(body.status, 422);
  assert.equal(body.requestId, "req_abc123456789");
  assert.deepEqual(body.details, ["title inválido"]);
  const semDetails = apiErrorBody("x", 400, null, []);
  assert.ok(!("details" in semDetails));
});

test("URL oficial: HTTPS em domínio governamental; rejeita credenciais e não-oficiais", () => {
  assert.equal(isOfficialSourceUrl("https://www.stj.jus.br/docs/x"), true);
  assert.equal(isOfficialSourceUrl("https://www.planalto.gov.br/x"), true);
  assert.equal(isOfficialSourceUrl("http://www.stj.jus.br/x"), false);
  assert.equal(isOfficialSourceUrl("https://blog.exemplo.com/x"), false);
  assert.equal(isOfficialSourceUrl("https://user:pass@stj.jus.br/x"), false);
  assert.equal(isOfficialSourceUrl(null), false);
  assert.equal(isOfficialSourceUrl("não é URL"), false);
  assert.equal(isOfficialSourceUrl("https://fake.stj.jus.br.evil.com/x"), false);
});

test("validação de tese: aceita válida com thesisKey estável; rejeita dado pessoal", () => {
  const valid = validateThesisSubmission({
    title: "Tese sobre responsabilidade civil do fornecedor",
    summary: "O fornecedor responde objetivamente pelos vícios do produto, com inversão do ônus da prova verificada no caso concreto.",
    kind: "jurisprudence",
    canonicalUrl: "https://www3.tjrj.jus.br/inteiroteor/123",
  });
  assert.ok(valid.ok);
  if (valid.ok) {
    assert.equal(valid.value.thesisKey.length, 40);
    assert.equal(valid.value.thesisKey, buildThesisKey(valid.value.title, valid.value.canonicalUrl));
  }
  const invalid = validateThesisSubmission({
    title: "Tese com CPF 123.456.789-09 no texto",
    summary: "Resumo contendo dado pessoal de parte que deve ser bloqueado antes de entrar na fila editorial do compêndio.",
    kind: "legislation",
    canonicalUrl: "https://blog.exemplo.com/x",
  });
  assert.equal(invalid.ok, false);
  if (!invalid.ok) {
    assert.ok(invalid.errors.some(e => e.includes("dado pessoal")));
    assert.ok(invalid.errors.some(e => e.includes("canonicalUrl")));
  }
  assert.deepEqual(detectPersonalData("e-mail fulano@exemplo.com"), ["EMAIL"]);
});

test("toBrainDecision: URL oficial preservada; not_for_use e URL não-oficial esvaziam officialUrl", () => {
  const base = {
    externalId: "stj-1", cnjNumber: null, tribunal: "STJ", justice: "Federal",
    city: null, court: null, judgingBody: "T3", decisionType: "Acórdão",
    decisionDate: new Date("2026-05-02T12:00:00Z"), legalArea: "Consumidor",
    theme: "Vício do produto", reasoningSummary: "r".repeat(700), sourceStatus: "official_confirmed", sourceId: 7,
  };
  const okSource = { id: 7, sourceUrl: "https://www.stj.jus.br/doc", publicStatus: "approved", lastVerifiedAt: new Date("2026-06-01T00:00:00Z") };
  const decision = toBrainDecision(base, okSource);
  assert.equal(decision.citationId, "atlas:stj-1");
  assert.equal(decision.summary!.length, 600);
  assert.equal(decision.officialUrl, "https://www.stj.jus.br/doc");
  assert.equal(toBrainDecision(base, { ...okSource, publicStatus: "not_for_use" }).officialUrl, null);
  assert.equal(toBrainDecision(base, { ...okSource, sourceUrl: "https://blog.com/x" }).officialUrl, null);
});

test("validateKnowledgeSnapshot: aceita payload conforme; rejeita desvio de contrato", () => {
  const item = {
    atlasItemId: "42",
    sourceKey: "stj-dados-abertos" as const,
    sourceType: "official_update" as const,
    tribunal: "STJ" as const,
    title: "Comunicado 3/2026",
    officialUrl: "https://www.stj.jus.br/doc",
    publishedAt: null,
    provenanceHash: "a".repeat(64),
    editorialStatus: "approved" as const,
    documentStatus: "discovery_only" as const,
    citableAsPrecedent: false,
    text: null,
  };
  const snapshot = { ok: true as const, contractVersion: 1 as const, snapshotVersion: `v1:${"b".repeat(64)}`, total: 1, page: 0, pageSize: 50, items: [item], complete: true, methodology: "m" };
  assert.equal(validateKnowledgeSnapshot(snapshot), true);
  assert.equal(validateKnowledgeSnapshot(null), false);
  assert.equal(validateKnowledgeSnapshot({ ...snapshot, contractVersion: 2 }), false);
  assert.equal(validateKnowledgeSnapshot({ ...snapshot, snapshotVersion: "sha256:xxx" }), false);
  assert.equal(validateKnowledgeSnapshot({ ...snapshot, items: [{ ...item, editorialStatus: "pending_review" }] }), false);
  assert.equal(validateKnowledgeSnapshot({ ...snapshot, items: [{ ...item, citableAsPrecedent: true }] }), false);
  assert.equal(validateKnowledgeSnapshot({ ...snapshot, items: [{ ...item, text: "conteúdo" }] }), false);
  assert.equal(validateKnowledgeSnapshot({ ...snapshot, items: [{ ...item, provenanceHash: "curto" }] }), false);
  assert.equal(isValidSnapshotVersion(`v1:${"c".repeat(64)}`), true);
  assert.equal(isValidSnapshotVersion("v1:abc"), false);
});

test("jurimetria: resumo descritivo com limites; nunca calcula êxito", () => {
  const summary = buildJurimetrySummary({
    civilConsumer: {
      readiness: {}, total: 10,
      categories: [
        { code: "a", label: "Dano moral por inscrição indevida", amount: 7 },
        { code: "b", label: "Dano material por cobrança indevida", amount: 3 },
      ],
      municipalities: [{ municipalityIbgeCode: "3106200", municipalityName: "Belo Horizonte", amount: 10 }],
      bodies: [{ judgingBodyCode: "J1", judgingBodyLabel: "1ª Vara Cível", municipalityName: "Belo Horizonte", amount: 10 }],
      monthly: [{ month: "2026-05", amount: 10 }],
    },
    national: null,
  });
  assert.equal(summary.kind, "descriptive");
  assert.equal(summary.rmbhCivilConsumer.available, true);
  assert.equal(summary.rmbhCivilConsumer.damageCausalBreakdown[0]!.damageType, "moral");
  assert.equal(summary.nationalJec.available, false);
  const prompt = jurimetrySummaryToPrompt(summary);
  assert.match(prompt, /RMBH cível\/consumidor/);
  assert.match(prompt, /NÃO indicam resultado/);
  const empty = buildJurimetrySummary({});
  assert.equal(empty.rmbhCivilConsumer.available, false);
  assert.deepEqual(buildDamageCausalBreakdown([]), []);
});
