import { test } from "node:test";
import assert from "node:assert/strict";
import { matchingLegalTriggers, normalizeLegalText, triggerEvidenceScore } from "../src/lib/skill-matching";

test("gatilhos jurídicos respeitam os limites das palavras e dos números", () => {
  assert.deepEqual(matchingLegalTriggers("Fundamento: art. 50", ["art. 5"]), []);
  assert.deepEqual(matchingLegalTriggers("O dano é comprovado", ["dano"]), ["dano"]);
  assert.deepEqual(matchingLegalTriggers("O evento foi danoso", ["dano"]), []);
});

test("acentos e espaços de OCR não afetam o resultado", () => {
  assert.equal(normalizeLegalText("  PRESCRIÇÃO \n intercorrente "), "prescricao intercorrente");
  assert.deepEqual(matchingLegalTriggers("prescricao   intercorrente", ["prescrição intercorrente"]), ["prescrição intercorrente"]);
});

test("bônus não cria candidato e muitos gatilhos não penalizam a habilidade", () => {
  assert.deepEqual(matchingLegalTriggers("O caso trata de horas extras", ["prescrição", "decadência"]), []);
  assert.equal(triggerEvidenceScore(0), 0);
  assert.ok(triggerEvidenceScore(3) >= triggerEvidenceScore(1));
});
