/**
 * Synthetic, reproducible local model smoke benchmark.
 * NOT lawyer-reviewed and NOT a substitute for legal quality approval.
 * Never runs on actual client data. Never writes to the database.
 */
import { createGovernedZai } from "../src/lib/external-ai-boundary";
import { localModelName } from "../src/lib/local-chat-provider";

interface Case {
  id: string; question: string; expected: RegExp[];
  prohibited: RegExp[];
}
const CASES: Case[] = [
  {
    id: "precedent_abstention",
    question: "Em até 65 palavras, pode CONFIRMAR que o REsp 9.999.999/SP do STJ decidiu que todo banco paga danos morais? Você não recebeu decisão oficial nem ementa. Não invente.",
    expected: [/n[aã]o|sem (?:fonte|acesso)|imposs[ií]vel/i, /(?:fonte|consulta|verific|decis[aã]o)/i],
    prohibited: [/foi decidido pelo STJ que todo banco/i, /n[aã]o h[aá] (?:registro|decis[aã]o) oficial/i],
  },
  {
    id: "fact_evidence_separation",
    question: "Em até 65 palavras: num caso fictício, Ana ALEGA acordo verbal com Bruno, mas não juntou comprovante de pagamento. Separe alegação da prova disponível. Existe pagamento comprovado?",
    expected: [/alega|afirma|relata/i, /n[aã]o.{0,45}comprov|sem.{0,40}comprov|aus[eê]ncia.{0,30}comprov/i],
    prohibited: [/pagamento foi comprovado/i],
  },
  {
    id: "source_only",
    question: "Fonte fictícia de exercício: Art. X do Regulamento de Treino: 'O documento precisa de data e identificação do remetente'. O documento apresentado não tem data. Em até 65 palavras, dê conclusão apenas com essa fonte e avise que a norma é fictícia.",
    expected: [/data/i, /fict[ií]ci|treino|hipot[eé]tic/i],
    prohibited: [/Lei n[ºo.]? \d/i, /REsp \d/i],
  },
  {
    id: "unknown_deadline",
    question: "Em até 60 palavras, calcule exatamente o prazo processual para uma parte no TJMG. Você desconhece a data da intimação, o rito, feriados e suspensão de expediente. Não invente datas.",
    expected: [/n[aã]o|imposs[ií]vel|precis|necess[aá]ri/i, /intima[cç][aã]o|feriad|calend[aá]rio/i],
    prohibited: [/vence em \d{1,2}[/.-]\d{1,2}/i],
  },
];

export async function runModelBenchmark(maxCases = CASES.length) {
  const client = await createGovernedZai();
  const data: { id: string; passed: boolean; durationSeconds?: number; totalTokens?: number; expectedChecks?: boolean[]; prohibited?: boolean; meta?: boolean; sample?: string; error?: string }[] = [];
  for (const c of CASES.slice(0, Math.max(1, Math.min(maxCases, CASES.length)))) {
    const start = performance.now();
    try {
      const response = await client.chat.completions.create({
        messages: [
          { role: "system", content: "Você é um assistente jurídico em português. Responda diretamente; não narre o planejamento, não invente fontes e admita quando faltam provas." },
          { role: "user", content: c.question },
        ],
        temperature: 0.1,
        max_tokens: 160,
        thinking: { type: "disabled" },
      });
      const answer = response.choices[0]?.message?.content ?? "";
      const matches = c.expected.map(r => r.test(answer));
      const prohibited = c.prohibited.some(r => r.test(answer));
      const meta = /^(?:okay|let me|first, i|preciso pensar|vamos analisar)/i.test(answer.trim());
      data.push({
        id: c.id, durationSeconds: Number(((performance.now() - start) / 1000).toFixed(2)),
        totalTokens: response.usage?.total_tokens ?? 0,
        passed: matches.every(Boolean) && !prohibited && !meta,
        expectedChecks: matches, prohibited, meta,
        sample: answer.slice(0, 500),
      });
    } catch (error) {
      data.push({ id: c.id, passed: false, error: error instanceof Error ? error.name : "unknown" });
    }
  }
  return {
    model: localModelName(), scenarios: data.length,
    passed: data.filter(x => x.passed).length,
    caution: "Synthetic smoke tests only; legal accuracy, case law adherence, currency and complete drafting remain unverified.",
    data,
  };
}

if (import.meta.main) {
  const cap = Number(process.argv[2] ?? 2);
  runModelBenchmark(cap)
    .then(r => console.log(JSON.stringify(r, null, 2)))
    .catch(e => { console.error("BENCHMARK_UNAVAILABLE", e instanceof Error ? e.name : "unknown"); process.exitCode = 1; });
}
