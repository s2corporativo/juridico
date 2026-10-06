// tests/minuta-pipeline.test.ts — testes das funções puras do pipeline multi-etapas
// Executar: bun run tests/minuta-pipeline.test.ts
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mergeSkills,
  chunkSkillContent,
  describeMarker,
  buildMarkerList,
  buildFactsBlock,
  labelFromKey,
  styleDirective,
  extractJson,
  outlineToText,
  applyReviewCorrections,
  fallbackDraft,
} from "../src/lib/minuta_pipeline";

test("mergeSkills: dedup por slug com prioridade manual", () => {
  const manual = [{ slug: "a", name: "A", content: "conteudo a", origin: "manual" as const }];
  const auto = [
    { slug: "a", name: "A auto", content: "x".repeat(50), origin: "auto" as const, matchScore: 0.9 },
    { slug: "b", name: "B", content: "conteudo b", origin: "auto" as const, matchScore: 0.8 },
  ];
  const { selected } = mergeSkills(manual, auto);
  assert.equal(selected.length, 2);
  assert.equal(selected[0].slug, "a");
  assert.equal(selected[0].name, "A"); // versão manual vence
  assert.equal(selected[0].origin, "manual");
  assert.equal(selected[1].slug, "b");
});

test("mergeSkills: respeita maxSkills e orçamento total", () => {
  const auto = Array.from({ length: 10 }, (_, i) => ({
    slug: `s${i}`,
    name: `S${i}`,
    content: "x".repeat(3000),
    origin: "auto" as const,
    matchScore: 0.5,
  }));
  const { selected, dropped } = mergeSkills([], auto);
  // maxSkills=6, mas o orçamento total (10000) limita a floor(10000/2200)=4 skills
  assert.equal(selected.length, 4);
  assert.equal(dropped, 6);
  const total = selected.reduce((acc, s) => acc + s.content.length, 0);
  assert.ok(total <= 10000, `total ${total} deve caber no orçamento de 10000`);
});

test("chunkSkillContent trunca preservando limite", () => {
  const long = "paragrafo. ".repeat(500); // ~5500 chars
  const cut = chunkSkillContent(long, 1000);
  assert.ok(cut.length <= 1000);
  const short = "curto";
  assert.equal(chunkSkillContent(short, 1000), "curto");
});

test("describeMarker e buildMarkerList", () => {
  assert.equal(describeMarker("[NOME_1]"), "nome de pessoa/empresa");
  assert.equal(describeMarker("[CPF_2]"), "número de CPF");
  assert.equal(describeMarker("lixo"), "dado anonimizado");
  const reverse = new Map([
    ["[NOME_1]", "Fulano"],
    ["[VALOR_1]", "R$ 100,00"],
  ]);
  const list = buildMarkerList(reverse);
  assert.ok(list.includes("[NOME_1] → nome de pessoa/empresa"));
  assert.ok(list.includes("APENAS"));
  const empty = buildMarkerList(new Map());
  assert.ok(empty.includes("Nenhum marcador"));
});

test("buildFactsBlock filtra campos vazios e rotula", () => {
  const block = buildFactsBlock({ nomeAutor: "Fulano", endereco: "", "valor da causa": "R$ 10" });
  assert.ok(block.includes("Nome Autor: Fulano"));
  assert.ok(!block.includes("endereco"));
  assert.equal(labelFromKey("valorDaCausa"), "Valor Da Causa");
});

test("styleDirective cai no formal para desconhecidos", () => {
  assert.ok(styleDirective("formal").includes("formal"));
  assert.ok(styleDirective("tecnico").includes("técnico"));
  assert.equal(styleDirective("inexistente"), styleDirective("formal"));
  assert.equal(styleDirective(undefined), styleDirective("formal"));
});

test("extractJson: direto, com cerca, e com texto ao redor", () => {
  assert.deepEqual(extractJson('{"a":1}'), { a: 1 });
  assert.deepEqual(extractJson('```json\n{"a": [1,2]}\n```'), { a: [1, 2] });
  assert.deepEqual(extractJson('resposta: {"a":{"b":2}} fim'), { a: { b: 2 } });
  assert.equal(extractJson("sem json aqui"), null);
  assert.equal(extractJson('{"quebrado": '), null);
});

test("outlineToText cobre todas as partes", () => {
  const txt = outlineToText({
    teoriaDoCaso: "Consumidor lesado",
    teses: ["Falha de serviço"],
    secoes: [{ titulo: "I. Endereçamento", objetivo: "dirigir a peça" }],
    pedidos: ["Danos morais"],
    riscos: ["Decadência"],
  });
  for (const frag of ["Consumidor lesado", "Falha de serviço", "I. Endereçamento", "Danos morais", "Decadência"]) {
    assert.ok(txt.includes(frag));
  }
  assert.ok(outlineToText({}).includes("estrutura clássica"));
});

test("applyReviewCorrections: aplica match exato e descarta injeções", () => {
  const draft = "O autor [NOME_1] ajuizou a ação. O réu [NOME_2] contestou.";
  const { text, applied, skipped } = applyReviewCorrections(draft, [
    { trecho: "ajuizou a ação", problema: "x", sugestao: "propôs a demanda" },
    { trecho: "não existe no texto", problema: "x", sugestao: "y" },
    { trecho: "contestou", problema: "x", sugestao: "apresentou [Nome Suspeito] contraponto" },
  ]);
  assert.ok(text.includes("propôs a demanda"));
  assert.equal(applied, 1);
  assert.equal(skipped, 2); // trecho ausente + sugestão suspeita de PII
});

test("fallbackDraft mantém marcadores e aviso offline", () => {
  const draft = fallbackDraft("Petição inicial", "fatos [NOME_1]", ["CNJ 615"]);
  assert.ok(draft.includes("RASCUNHO") || draft.includes("offline"));
  assert.ok(draft.includes("[NOME_1]"));
  assert.ok(draft.includes("CNJ 615"));
});
