/**
 * 60 synthetic security/control regressions.
 * NOT a human-annotated jurisprudence relevance benchmark or model accuracy measure.
 */
import { test, expect } from "bun:test";
import { verifyCitations } from "../src/lib/citation_gate";
import { pseudonymize } from "../src/lib/pseudonymizer";

const law = (n: number) => ({
  id: "fixture-" + n,
  tipo: "artigo_lei",
  diploma: "CDC",
  numero: "art. " + n,
  tribunal: null,
  textoTrecho: "Trecho inventado exclusivamente para validar a política de citações sem fonte jurídica real.",
  vigente: true,
  urlOficial: "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
  revisadoPor: "human:lawyer-test",
});

for (let i = 0; i < 10; i++) {
  const lawNum = i + 30;
  test("synthetic reviewed law is retrievable " + i, () => {
    expect(verifyCitations(`Aplica-se o art. ${lawNum} do CDC.`,[law(lawNum)]).bloquear).toBe(false);
  });
  test("synthetic automated curator never grants citation " + i, () => {
    expect(verifyCitations(`Aplica-se o art. ${lawNum} do CDC.`,[{...law(lawNum),revisadoPor:"atlas-curadoria"}]).bloquear).toBe(true);
  });
  test("synthetic missing official URL blocks source " + i, () => {
    expect(verifyCitations(`Aplica-se o art. ${lawNum} do CDC.`,[{...law(lawNum),urlOficial:null}]).bloquear).toBe(true);
  });
  test("synthetic unverified REsp must not be accepted " + i, () => {
    expect(verifyCitations(`Conforme REsp ${9000000+i}, prevalece a tese.`,[]).bloquear).toBe(true);
  });
  test("synthetic precedent with unrelated content requires lawyer review " + i, () => {
    const src={...law(lawNum),tipo:"jurisprudencia",diploma:"REsp",numero:String(9000000+i),tribunal:"STJ"};
    expect(verifyCitations(`Conforme REsp ${9000000+i}, a tese é obrigatória.`,[src]).bloquear).toBe(true);
  });
  test("synthetic sensitive facts are pseudonymized " + i, () => {
    const text=`Ana Maria Silva, CPF 123.456.789-09, processo 5001234-${String(10+i)}.2024.8.13.0027`;
    const scrubbed=pseudonymize(text).text;
    expect(scrubbed).not.toContain("Ana Maria Silva");
    expect(scrubbed).not.toContain("123.456.789-09");
    expect(scrubbed).not.toContain("5001234-");
  });
}
