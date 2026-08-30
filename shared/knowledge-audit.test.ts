import { describe, expect, it } from "vitest";
import { checkSemanticDuplicates, checkSourceConsistency, isOfficialDomain, jaccardSimilarity, scanLgpd, summarizeAudit } from "./knowledge-audit";

describe("scanLgpd", () => {
  it("detecta CPF no conteúdo", () => {
    const section = scanLgpd([{ key: "doc-1", text: "Contato do titular: CPF 123.456.789-01." }]);
    const finding = section.findings.find((f) => f.code === "LGP-01");
    expect(finding?.total).toBe(1);
    expect(section.status).toBe("ERRO");
  });

  it("não marca intervalo de anos nem data de 8 dígitos como telefone", () => {
    const section = scanLgpd([{ key: "doc-2", text: "Período de referência: 2025-2026. Consulta em 20260830." }]);
    expect(section.findings.find((f) => f.code === "LGP-03")).toBeUndefined();
  });

  it("base sem nenhum dado pessoal fica OK", () => {
    const section = scanLgpd([{ key: "doc-3", text: "Texto legislativo sem nenhum dado pessoal." }]);
    expect(section.status).toBe("OK");
    expect(section.findings).toHaveLength(0);
  });
});

describe("isOfficialDomain / checkSourceConsistency", () => {
  it("reconhece domínios oficiais conhecidos", () => {
    expect(isOfficialDomain("https://www.planalto.gov.br/ccivil_03/leis/l8078.htm")).toBe(true);
    expect(isOfficialDomain("https://scon.stj.jus.br/SCON/sumstj")).toBe(true);
    expect(isOfficialDomain("https://blog-juridico-qualquer.com.br/artigo")).toBe(false);
  });

  it("sinaliza confiabilidade confirmada sem domínio oficial como erro", () => {
    const section = checkSourceConsistency([{ key: "doc-1", sourceStatus: "official_confirmed", officialUrl: "https://blog-juridico.com.br/x" }]);
    const finding = section.findings.find((f) => f.code === "CUR-04");
    expect(finding?.total).toBe(1);
    expect(section.status).toBe("ERRO");
  });

  it("não sinaliza nada quando a fonte oficial confirmada aponta para domínio oficial", () => {
    const section = checkSourceConsistency([{ key: "doc-1", sourceStatus: "official_confirmed", officialUrl: "https://www.planalto.gov.br/x" }]);
    expect(section.findings).toHaveLength(0);
  });
});

describe("jaccardSimilarity / checkSemanticDuplicates", () => {
  it("calcula sobreposição de termos", () => {
    expect(jaccardSimilarity("prescrição da ação ambiental", "prescrição da ação ambiental")).toBe(1);
    expect(jaccardSimilarity("prescrição da ação", "usucapião de imóvel")).toBe(0);
  });

  it("sinaliza dois documentos quase idênticos no mesmo grupo", () => {
    const section = checkSemanticDuplicates([
      { key: "a", group: "peca|ambiental", title: "Peça de defesa administrativa ambiental", content: "Defesa contra auto de infração ambiental por dano ao meio ambiente causado pela atividade." },
      { key: "b", group: "peca|ambiental", title: "Peça de defesa administrativa ambiental", content: "Defesa contra auto de infração ambiental por dano ao meio ambiente causado pela atividade." },
    ]);
    expect(section.findings.find((f) => f.code === "DUP-01")?.total).toBe(1);
  });

  it("não compara documentos de grupos diferentes", () => {
    const section = checkSemanticDuplicates([
      { key: "a", group: "peca|ambiental", title: "Peça de defesa administrativa ambiental", content: "Defesa contra auto de infração ambiental por dano ao meio ambiente causado pela atividade." },
      { key: "b", group: "checklist|ambiental", title: "Peça de defesa administrativa ambiental", content: "Defesa contra auto de infração ambiental por dano ao meio ambiente causado pela atividade." },
    ]);
    expect(section.findings).toHaveLength(0);
  });
});

describe("summarizeAudit", () => {
  it("base sem nenhum achado é integridade plena, score 100", () => {
    const { score, verdict } = summarizeAudit([{ name: "x", status: "OK", findings: [] }]);
    expect(score).toBe(100);
    expect(verdict).toContain("INTEGRIDADE PLENA");
  });

  it("erro derruba o score mais que aviso, e o veredito exige intervenção", () => {
    const { score, verdict } = summarizeAudit([{ name: "x", status: "ERRO", findings: [{ code: "X", severity: "ERRO", title: "t", detail: "d", total: 1, examples: [] }] }]);
    expect(score).toBeLessThan(100);
    expect(verdict).toContain("REQUER INTERVENÇÃO");
  });
});
