import { describe, expect, it } from "vitest";
import {
  BRAIN_JURIMETRY_LIMITS,
  buildJurimetrySummary,
  buildThesisKey,
  detectPersonalData,
  isOfficialSourceUrl,
  jurimetrySummaryToPrompt,
  toBrainDecision,
  validateThesisSubmission,
} from "@shared/brain-api";
import { authenticateBrainToken, createRateLimiter, isBrainTokenConfigured } from "./brain-api-auth";

const STRONG_TOKEN = "a".repeat(40);

describe("brain API authentication", () => {
  it("fails closed when the service token is absent or short", () => {
    expect(authenticateBrainToken("Bearer " + STRONG_TOKEN, "")).toEqual({ ok: false, status: 503, error: "brain_api_disabled" });
    expect(authenticateBrainToken("Bearer short", "short")).toEqual({ ok: false, status: 503, error: "brain_api_disabled" });
    expect(isBrainTokenConfigured(undefined)).toBe(false);
    expect(isBrainTokenConfigured(STRONG_TOKEN)).toBe(true);
  });

  it("rejects missing, malformed and wrong credentials with 401", () => {
    expect(authenticateBrainToken(undefined, STRONG_TOKEN)).toEqual({ ok: false, status: 401, error: "unauthorized" });
    expect(authenticateBrainToken("Basic abc", STRONG_TOKEN)).toEqual({ ok: false, status: 401, error: "unauthorized" });
    expect(authenticateBrainToken("Bearer " + "b".repeat(40), STRONG_TOKEN)).toEqual({ ok: false, status: 401, error: "unauthorized" });
    expect(authenticateBrainToken("Bearer " + STRONG_TOKEN + "x", STRONG_TOKEN)).toEqual({ ok: false, status: 401, error: "unauthorized" });
  });

  it("accepts the exact bearer token", () => {
    expect(authenticateBrainToken("Bearer " + STRONG_TOKEN, STRONG_TOKEN)).toEqual({ ok: true });
    expect(authenticateBrainToken(["bearer " + STRONG_TOKEN], STRONG_TOKEN)).toEqual({ ok: true });
  });

  it("limits requests per window and resets afterwards", () => {
    let now = 0;
    const limiter = createRateLimiter({ limit: 2, windowMs: 1_000, now: () => now });
    expect([limiter.take(), limiter.take(), limiter.take()]).toEqual([true, true, false]);
    now = 1_001;
    expect(limiter.take()).toBe(true);
  });
});

describe("official source URL policy", () => {
  it("accepts only HTTPS URLs on official domains", () => {
    expect(isOfficialSourceUrl("https://www.tjmg.jus.br/portal-tjmg/")).toBe(true);
    expect(isOfficialSourceUrl("https://www.planalto.gov.br/ccivil_03/")).toBe(true);
    expect(isOfficialSourceUrl("https://www.camara.leg.br/")).toBe(true);
    expect(isOfficialSourceUrl("http://www.tjmg.jus.br/")).toBe(false);
    expect(isOfficialSourceUrl("https://jusbrasil.com.br/x")).toBe(false);
    expect(isOfficialSourceUrl("https://tjmg.jus.br.evil.com/")).toBe(false);
    expect(isOfficialSourceUrl("https://user:pass@www.tjmg.jus.br/")).toBe(false);
    expect(isOfficialSourceUrl("https://jus.br/")).toBe(false);
    expect(isOfficialSourceUrl("not a url")).toBe(false);
    expect(isOfficialSourceUrl(null)).toBe(false);
  });
});

describe("thesis submission validation", () => {
  const valid = {
    title: "Responsabilidade objetiva do fornecedor por vício oculto em veículo",
    summary: "Tese de que o fornecedor responde objetivamente pelo vício oculto do produto durável nos termos do art. 18 do CDC, com prazo decadencial iniciado na ciência do defeito.",
    kind: "legislation",
    canonicalUrl: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
    authorityRefs: ["CDC art. 18", "REsp 1.234.567/MG"],
  };

  it("accepts a well-formed thesis with an official source", () => {
    const result = validateThesisSubmission(valid);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.thesisKey).toHaveLength(40);
      expect(result.value.thesisKey).toBe(buildThesisKey(valid.title, valid.canonicalUrl));
    }
  });

  it("derives a stable key independent of case, accents and spacing", () => {
    expect(buildThesisKey("Vício  Oculto", "https://a.gov.br/x")).toBe(buildThesisKey("vicio oculto", "https://a.gov.br/x"));
    expect(buildThesisKey("Vício oculto", "https://a.gov.br/x")).not.toBe(buildThesisKey("Vício oculto", "https://a.gov.br/y"));
  });

  it("rejects non-official sources, bad kinds and size violations", () => {
    const result = validateThesisSubmission({ ...valid, canonicalUrl: "https://blog.exemplo.com/tese", kind: "opinion", title: "x", summary: "curto" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.length).toBeGreaterThanOrEqual(4);
  });

  it("rejects personal data and leftover anonymization markers", () => {
    const withCpf = validateThesisSubmission({ ...valid, summary: valid.summary + " Autor CPF 123.456.789-09." });
    const withMarker = validateThesisSubmission({ ...valid, title: "Tese sobre [NOME_0001] e vício oculto" });
    const withEmail = validateThesisSubmission({ ...valid, authorityRefs: ["contato fulano@exemplo.com"] });
    for (const result of [withCpf, withMarker, withEmail]) {
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors.join(" ")).toMatch(/dado pessoal/);
    }
  });

  it("does not flag citation numbers as personal data", () => {
    expect(detectPersonalData("REsp 1.234.567/MG; Súmula 308 do TST; art. 927 do CC")).toEqual([]);
    expect(detectPersonalData("Processo 0001234-77.2015.8.13.0026")).toEqual([]);
  });

  it("limits authorityRefs", () => {
    const result = validateThesisSubmission({ ...valid, authorityRefs: ["1", "2", "3", "4", "5", "6"] });
    expect(result.ok).toBe(false);
  });
});

describe("decision projection for the Brain", () => {
  const decision = {
    externalId: "tjmg-0001",
    cnjNumber: "0001234-77.2015.8.13.0026",
    tribunal: "TJMG",
    justice: "Estadual",
    city: "Betim",
    court: "Turma Recursal",
    judgingBody: "1ª Turma",
    decisionType: "acordao",
    decisionDate: new Date("2025-03-10T00:00:00Z"),
    legalArea: "Consumidor",
    theme: "Vício do produto",
    reasoningSummary: "x".repeat(900),
    sourceStatus: "official_confirmed",
    sourceId: 7,
  };

  it("exposes the official URL only when the source is usable", () => {
    const ok = toBrainDecision(decision, { id: 7, sourceUrl: "https://www5.tjmg.jus.br/jurisprudencia/", publicStatus: "official_confirmed", lastVerifiedAt: new Date("2026-09-01T00:00:00Z") });
    expect(ok.officialUrl).toBe("https://www5.tjmg.jus.br/jurisprudencia/");
    expect(ok.citationId).toBe("atlas:tjmg-0001");
    expect(ok.summary).toHaveLength(600);
    expect(ok.sourceVerifiedAt).toBe("2026-09-01T00:00:00.000Z");

    expect(toBrainDecision(decision, { id: 7, sourceUrl: "https://www5.tjmg.jus.br/x", publicStatus: "not_for_use", lastVerifiedAt: null }).officialUrl).toBeNull();
    expect(toBrainDecision(decision, { id: 7, sourceUrl: "https://blog.exemplo.com/x", publicStatus: "official_confirmed", lastVerifiedAt: null }).officialUrl).toBeNull();
    expect(toBrainDecision(decision, undefined).officialUrl).toBeNull();
  });
});

describe("descriptive jurimetry summary", () => {
  it("states limits and never emits success-rate fields", () => {
    const summary = buildJurimetrySummary({
      civilConsumer: {
        readiness: { state: "completed", coverageNote: "Cobertura parcial" },
        categories: [{ code: "1", label: "Vício do produto", amount: 30 }, { code: "2", label: "Cobrança indevida", amount: 50 }],
        municipalities: [{ municipalityIbgeCode: "3106705", municipalityName: "Belo Horizonte", amount: 60 }],
        bodies: [],
        monthly: [{ month: "2026-01", amount: 80 }],
        total: 80,
      },
      national: null,
    });
    expect(summary.kind).toBe("descriptive");
    expect(summary.limits).toEqual([...BRAIN_JURIMETRY_LIMITS]);
    expect(summary.rmbhCivilConsumer.available).toBe(true);
    expect(summary.rmbhCivilConsumer.topCategories[0].label).toBe("Cobrança indevida");
    expect(summary.nationalJec.available).toBe(false);
    const keys: string[] = [];
    const walk = (value: unknown) => {
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === "object") for (const [key, nested] of Object.entries(value)) { keys.push(key); walk(nested); }
    };
    walk(summary);
    expect(keys.join(" ")).not.toMatch(/exito|êxito|success|procedencia|ranking|win/i);
  });

  it("produces a prompt block that disclaims outcome inference", () => {
    const empty = jurimetrySummaryToPrompt(buildJurimetrySummary({}));
    expect(empty).toMatch(/Sem dados de jurimetria/);
    expect(empty).toMatch(/NÃO indicam resultado/);
    const filled = jurimetrySummaryToPrompt(buildJurimetrySummary({
      civilConsumer: { readiness: {}, categories: [{ code: "1", label: "Vício do produto", amount: 5 }], municipalities: [], bodies: [], monthly: [], total: 5 },
    }));
    expect(filled).toMatch(/5 processos distribuídos/);
    expect(filled).toMatch(/Vício do produto \(5\)/);
  });
});
