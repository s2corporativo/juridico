import { describe, expect, it } from "vitest";
import { classifyLegacy, type LegacyKnowledgeRow } from "../scripts/legacy-import-policy";

const row: LegacyKnowledgeRow = {
  id: "legado-1", titulo: "Lei de teste", tipoDocumento: "LEGISLACAO",
  conteudo: "Texto de legislação de teste; nenhum caso real incluído.",
  status: "ATIVO", dadosFicticios: 0,
  confiabilidade: "A", urlFonte: "https://www.planalto.gov.br/teste",
  fonte: "Fonte oficial",
};

describe("quarentena do Atlas legado", () => {
  it("sempre classifica a importação como pendente de revisão", () => {
    const result = classifyLegacy(row);
    expect(result.status).toBe("staged_pending_review");
    expect(result.candidate?.sourceSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(result.candidate).not.toHaveProperty("reviewStatus", "approved");
  });
  it("recusa conteúdo demonstrativo mesmo que esteja ativo", () => {
    expect(classifyLegacy({ ...row, dadosFicticios: 1 }).status).toBe("excluded_demo");
  });
  it("recusa rascunhos ou conteúdo não ativo", () => {
    expect(classifyLegacy({ ...row, status: "REVISAO_HUMANA" }).status).toBe("excluded_non_active");
  });
  it("recusa conteúdo privado e de operação do escritório", () => {
    for (const tipoDocumento of ["PECA","CONTRATO","PRAZO","TRIAGEM","JURIMETRIA","TESE"]) {
      expect(classifyLegacy({ ...row, tipoDocumento }).status).toBe("excluded_non_official_kind");
    }
  });
  it("recusa links não HTTPS ou com credenciais embutidas", () => {
    for (const urlFonte of ["http://inseguro.example/a","https://usuario:segredo@www.planalto.gov.br/a","invalid",""]) {
      expect(classifyLegacy({ ...row, urlFonte }).status).toBe("excluded_source_url");
    }
  });
  it("não considera mudança de texto a mesma versão", () => {
    const before = classifyLegacy(row).candidate?.sourceSha256;
    const after = classifyLegacy({ ...row, conteudo: row.conteudo + " alteração" }).candidate?.sourceSha256;
    expect(after).not.toBe(before);
  });
  it("recusa conteúdo vazio", () => {
    expect(classifyLegacy({ ...row, conteudo: " " }).status).toBe("excluded_empty_content");
  });
});