import { describe, expect, it } from "vitest";
import { buildCaseKey, buildCausalPilotQuery, deriveAnnotations, extractSearchPage, hashRecord, sanitizeCausalHit, toPersistableCausalRecord } from "../scripts/causal-rmbh-pilot-runtime.mjs";

describe("coletor-piloto causal DataJud/RMBH", () => {
  it("monta consulta JEC restrita a TJMG, órgãos, assuntos e período", () => {
    const query = buildCausalPilotQuery({ bodyCodes: [40011], subjectCodes: [899, 1156], from: "2025-01-01", to: "2025-12-31" });
    expect(query).toMatchObject({ size: 100, track_total_hits: true, sort: [{ "@timestamp": { order: "asc" } }] });
    expect(query.query.bool.filter).toEqual(expect.arrayContaining([
      { term: { grau: "JE" } }, { terms: { "classe.codigo": [436] } }, { terms: { "orgaoJulgador.codigo": [40011] } }, { terms: { "assuntos.codigo": [899, 1156] } },
    ]));
    expect(query._source).not.toContain("partes");
  });
  it("rejeita lote acima do limite oficial de termos e órgãos", () => {
    expect(() => buildCausalPilotQuery({ bodyCodes: Array.from({ length: 25 }, (_, i) => i), subjectCodes: [1] })).toThrow("1 e 24");
    expect(() => buildCausalPilotQuery({ bodyCodes: [1], subjectCodes: Array.from({ length: 1_025 }, (_, i) => i) })).toThrow("1.024");
  });
  it("sanitiza hit sem partes e normaliza assuntos e movimentos", () => {
    const record = sanitizeCausalHit({ numeroProcesso: "0001234-77.2015.8.13.0026", tribunal: "TJMG", grau: "JE", dataAjuizamento: "2025-02-03T10:00:00.000Z", classe: { codigo: 436, nome: "Procedimento do Juizado Especial Cível" }, orgaoJulgador: { codigo: 40011, nome: "JEC Betim", codigoMunicipioIBGE: 3106705 }, assuntos: [[{ codigo: 1156, nome: "Direito do Consumidor" }]], movimentos: [{ codigo: 26, nome: "Distribuição", dataHora: "2025-02-03T10:00:00.000Z" }], partes: [{ nome: "Pessoa não deve sair" }] }, [123]);
    expect(record).toMatchObject({ processNumber: "00012347720158130026", bodyCode: 40011, municipalityIbgeCode: 3106705, subjects: [{ code: 1156, label: "Direito do Consumidor" }] });
    expect(record).not.toHaveProperty("partes");
  });
  it("usa search_after do último hit e separa hash de chave pública", () => {
    const page = extractSearchPage({ hits: { total: { value: 1, relation: "eq" }, hits: [{ _source: { numeroProcesso: "00012347720158130026", assuntos: [], movimentos: [] }, sort: ["2026-01-01"] }] } });
    expect(page.nextSearchAfter).toEqual(["2026-01-01"]);
    expect(buildCaseKey("tjmg", "00012347720158130026", "s".repeat(32))).toMatch(/^tjmg:[a-f0-9]{64}$/);
    expect(hashRecord(page.records[0])).toHaveLength(64);
  });
  it("não grava CNJ bruto, paginação nem campos inesperados no artefato do piloto", () => {
    const rawNumber = "00012347720158130026";
    const record = sanitizeCausalHit({
      numeroProcesso: rawNumber,
      tribunal: "TJMG",
      classe: { codigo: 436, nome: "Procedimento do Juizado Especial Cível" },
      orgaoJulgador: { codigo: 40011, nome: "JEC Betim" },
      assuntos: [{ codigo: 1, nome: "Indenização por dano moral" }],
      movimentos: [],
    }, ["2026-01-01"]);
    const output = toPersistableCausalRecord({ ...record, unexpected: "should-not-survive" }, "tjmg", "s".repeat(32));
    expect(output.caseKey).toBe(buildCaseKey("tjmg", rawNumber, "s".repeat(32)));
    expect(output).not.toHaveProperty("processNumber");
    expect(output).not.toHaveProperty("sort");
    expect(output).not.toHaveProperty("unexpected");
    expect(JSON.stringify(output)).not.toContain(rawNumber);
    expect(JSON.stringify(output)).not.toContain("should-not-survive");
    expect(() => toPersistableCausalRecord({
      ...record,
      movements: [{ name: "Juntado CPF 123.456.789-01", date: null, code: 1 }],
    }, "tjmg", "s".repeat(32))).toThrow(/não sanitizados/);
  });
  it("rejeita respostas do DataJud incompletas sem fingir coleta vazia", () => {
    expect(() => extractSearchPage({ hits: { total: { value: 0 } } })).toThrow(/inválida/);
    expect(() => extractSearchPage({ timed_out: true, hits: { hits: [] } })).toThrow(/timeout/);
    expect(() => extractSearchPage({ _shards: { failed: 1 }, hits: { hits: [] } })).toThrow(/parcial/);
    expect(extractSearchPage({ timed_out: false, _shards: { failed: 0 }, hits: { total: { value: 0, relation: "eq" }, hits: [] } }).records).toEqual([]);
  });
  it("transforma assuntos em anotações pendentes sem afirmar resultado", () => {
    const annotations = deriveAnnotations({ subjects: [{ code: 1, label: "Dano moral" }, { code: 2, label: "Negativação indevida" }] }, 9);
    expect(annotations).toEqual(expect.arrayContaining([
      expect.objectContaining({ role: "pedido", claimType: "dano_moral", confidence: 0.65, evidenceRefId: 9 }),
      expect.objectContaining({ role: "fato_gerador", claimType: "outro", confidence: 0.55 }),
    ]));
  });
});
