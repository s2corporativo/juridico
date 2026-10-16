import { describe, expect, test } from "bun:test";
import { identifyLegalIntent, retrieveLegalSkills, type LegalCandidate } from "../src/lib/legal-intelligence-core";
import { assessSkillMaturity, reviewCatalogueMaturity } from "../src/lib/skill-maturation";
const source="https://planalto.gov.br/ccivil_03/leis/l8078compilado.htm";
const base:LegalCandidate={
  id:"fixture", slug:"fraude-pix",version:1,area:"consumidor",
  description:"Análise de fraude em pagamento Pix",
  content:"Conferir a existência da transação, evidências técnicas e deveres de informação. Não presumir responsabilidade sem análise de fatos. Reunir comprovações e examinar normas vigentes antes da conclusão.",
  triggers:JSON.stringify({keywords:["fraude pix","transferencia indevida"]}),
  requiredSources:JSON.stringify([source]),
  forbiddenClaims:JSON.stringify(["promessa de resultado"]),
};
describe("nucleo de inteligencia juridica",()=>{
  test("detecta area e forma e permite abstencao",()=>{
    const intent=identifyLegalIntent("Vou ajuizar petição inicial sobre cobrança indevida pelo consumidor.");
    expect(intent.area).toBe("consumidor");
    expect(intent.form).toBe("peticao-inicial");
    const unknown=identifyLegalIntent("uma situação pouco clara e sem uma pretensão jurídica conhecida");
    expect(unknown.confidence).toBe("uncertain");
    expect(unknown.questions.length).toBeGreaterThan(0);
  });
  test("fusão lexical com evidência, sem selecionar area errada",()=>{
    const facts="O consumidor foi vítima de fraude pix e houve transferencia indevida na conta digital.";
    const other={...base,id:"other",slug:"horas-extras",area:"trabalhista",
      triggers:JSON.stringify({keywords:["horas extras"]})};
    const ranked=retrieveLegalSkills(facts,[other,base]);
    expect(ranked.abstained).toBe(false);
    expect(ranked.suggestions).toHaveLength(1);
    expect(ranked.suggestions[0].slug).toBe("fraude-pix");
    expect(ranked.suggestions[0].sourceStatus).toBe("declared_unverified");
  });
  test("não inventa correspondência quando faltam gatilhos",()=>{
    const result=retrieveLegalSkills("Há uma questão desconhecida e nenhum dado suficiente para classificação.",[base]);
    expect(result.abstained).toBe(true);
    expect(result.suggestions).toEqual([]);
  });
  test("pontuação de maturidade não equivale a aprovação jurídica",()=>{
    const complete=assessSkillMaturity(base);
    expect(complete.maturity).toBeGreaterThanOrEqual(70);
    const weak=assessSkillMaturity({...base,requiredSources:"[]",triggers:"{}",content:"Curto",forbiddenClaims:"[]"});
    expect(weak.maturity).toBeLessThan(55);
    expect(weak.signals).toContain("fontes_ausentes");
    const report=reviewCatalogueMaturity([base,{...base,slug:"incompleto",requiredSources:"[]"}]);
    expect(report.stats.total).toBe(2);
    expect(report.warning).toContain("Nenhum conteúdo foi validado");
  });
});
