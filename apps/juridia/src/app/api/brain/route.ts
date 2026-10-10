import { createGovernedZai } from "@/lib/external-ai-boundary";
import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import { logAuditEvent, logUsageEntry } from "@/lib/audit";
import { ragSearch } from "@/lib/rag_lite";
import { requireAuth } from "@/lib/auth";
import { pseudonymize } from "@/lib/pseudonymizer";
import {
  decisionToBrainItem,
  extractSearchTerms,
  fetchAtlasJurimetry,
  isAtlasConfigured,
  searchAtlasCompendium,

  type AtlasJurimetry,
  type BrainJurisprudenceItem,
} from "@/lib/atlas_client";

export const dynamic = "force-dynamic";
export const maxDuration = 180;

// ── Evidence Ledger: estados epistêmicos ────────────────────────────────────
type EpistemicState =
  | "fato_extraido"
  | "alegacao_cliente"
  | "inferencia_ia"
  | "fato_controvertido"
  | "direito_positivo"
  | "jurisprudencia"
  | "hipotese";

interface EvidenceItem {
  claim: string;
  state: EpistemicState;
  source?: string;
  confidence: number;
  note?: string;
}

interface BrainStep {
  id: string;
  name: string;
  status: "pending" | "running" | "done" | "error";
  result?: unknown;
  error?: string;
}

interface BrainResult {
  ramoJuridico: string;
  ramoConfianca: number;
  parties: { role: string; name?: string; type: string; state: EpistemicState }[];
  timeline: { date: string; event: string; state: EpistemicState }[];
  requests: { text: string; state: EpistemicState }[];
  values: { label: string; amount: string; state: EpistemicState }[];
  legalIssues: { question: string; area: string; relevance: "alta" | "média" | "baixa"; state: EpistemicState; note?: string }[];
  applicableLaw: { diploma: string; numero: string; textoTrecho: string; vigente: boolean; urlOficial?: string | null; applicability: string; state: "direito_positivo"; confidence: number }[];
  jurisprudence: BrainJurisprudenceItem[];
  jurimetry: AtlasJurimetry | null;
  atlas: { configured: boolean; status: "ok" | "partial" | "unavailable" | "no_terms"; error?: string; termsUsed: string[]; fallback: boolean };
  viability: {
    hypothesis: "favorável" | "incerto" | "desfavorável";
    hypothesisNote: string;
    strengths: EvidenceItem[];
    weaknesses: EvidenceItem[];
    reasoning: string;
    evidence: EvidenceItem[];
  };
  gaps: { what: string; why: string; question: string; state: EpistemicState }[];
  strategy: { proceduralPath: string; immediateActions: EvidenceItem[]; documentsToCollect: string[]; risks: EvidenceItem[]; recommendation: string };
  steps: BrainStep[];
  totalTokens: number;
}

const STEPS = [
  { id: "classify", name: "Classificação do ramo jurídico" },
  { id: "extract", name: "Extração estruturada" },
  { id: "issues", name: "Questões jurídicas" },
  { id: "law", name: "Legislação aplicável" },
  { id: "jurisprudence", name: "Jurisprudência e jurimetria (Atlas)" },
  { id: "viability", name: "Análise de viabilidade" },
  { id: "gaps", name: "Lacunas e perguntas" },
  { id: "strategy", name: "Estratégia recomendada" },
] as const;

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  let body: { facts?: string; title?: string; caseId?: string } = {};
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON inválido" }, { status: 400 }); }

  const rawFacts = (body.facts || "").trim();
  // Only pseudonymized context is ever presented to an external model.
  // Preserve original client facts locally for the authenticated case dossier.
  const safeCase = pseudonymize(rawFacts);
  const facts = safeCase.text;
  const title = body.title?.trim() || `Análise — ${new Date().toLocaleDateString("pt-BR")}`;

  if (body.caseId) {
    const ownedCase = await db.case.findUnique({
      where: { id: body.caseId },
      select: { client: { select: { userId: true } } },
    });
    if (!ownedCase) return NextResponse.json({ error: "case_not_found" }, { status: 404 });
    if (authUser.role !== "admin" && ownedCase.client.userId !== authUser.uid) {
      return NextResponse.json({ error: "case_access_denied" }, { status: 403 });
    }
  }

  if (facts.length < 30) {
    return NextResponse.json({ error: "Descreva os fatos do caso (mínimo 30 caracteres)" }, { status: 400 });
  }

  const steps: BrainStep[] = STEPS.map((s) => ({ ...s, status: "pending" as const }));
  const r: Partial<BrainResult> = { steps };
  let tokens = 0;
  let zai: Awaited<ReturnType<typeof createGovernedZai>>;
  try {
    zai = await createGovernedZai();
  } catch {
    return NextResponse.json({
      error: "external_case_ai_disabled",
      message: "Análise por IA externa desativada. Utilize pesquisa local até autorização operacional.",
    }, { status: 503 });
  }

  const tok = (c: unknown) => tokens += (c as { usage?: { total_tokens?: number } }).usage?.total_tokens || 0;

  // ── ETAPA 0: Classificação do ramo jurídico ──────────────────────────────
  steps[0].status = "running";
  try {
    const c = await zai.chat.completions.create({
      messages: [
        { role: "system", content: `Classifique o caso em UM destes 16 ramos. Responda APENAS com JSON: {"ramo":"...","confianca":0.0-1.0}. Ramos: civil, penal, trabalhista, tributario, consumer, family, previdenciario, empresarial, administrativo, bancario, ambiental, saude, imobiliario, internacional, digital_lgpd, transito` },
        { role: "user", content: facts.slice(0, 500) },
      ],
      thinking: { type: "disabled" }, temperature: 0.2, max_tokens: 100,
    });
    const m = (c.choices[0]?.message?.content || "").match(/\{[\s\S]*\}/);
    if (m) { const p = JSON.parse(m[0]); r.ramoJuridico = p.ramo || "civil"; r.ramoConfianca = typeof p.confianca === "number" ? p.confianca : 0.7; }
    tok(c); steps[0].status = "done"; steps[0].result = r.ramoJuridico;
  } catch (e) { steps[0].status = "error"; steps[0].error = e instanceof Error ? e.message : "Erro"; r.ramoJuridico = "civil"; r.ramoConfianca = 0.5; }

  // ── ETAPA 1: Extração estruturada (com estados epistêmicos) ──────────────
  steps[1].status = "running";
  try {
    const c = await zai.chat.completions.create({
      messages: [
        { role: "system", content: `Extraia informações estruturadas em JSON. Para CADA item, rotule o estado epistêmico: "fato_extraido" (literal do texto), "alegacao_cliente" (não confirmado), "inferencia_ia" (inferido). Responda APENAS com JSON, sem markdown. Use marcadores [NOME_0001] se houver dados sensíveis.

{"parties":[{"role":"autor|réu|requerente|requerido|terceiro","name":"nome ou null","type":"pessoa física|pessoa jurídica|órgão público","state":"fato_extraido|alegacao_cliente|inferencia_ia"}],"timeline":[{"date":"data","event":"evento","state":"fato_extraido|alegacao_cliente|inferencia_ia"}],"requests":[{"text":"pedido","state":"alegacao_cliente|inferencia_ia"}],"values":[{"label":"rótulo","amount":"R$ X","state":"fato_extraido|alegacao_cliente|inferencia_ia"}]}` },
        { role: "user", content: facts },
      ],
      thinking: { type: "disabled" }, temperature: 0.3, max_tokens: 1000,
    });
    const m = (c.choices[0]?.message?.content || "").match(/\{[\s\S]*\}/);
    if (m) {
      const p = JSON.parse(m[0]);
      r.parties = (p.parties || []).map((x: { role: string; name?: string; type: string; state?: EpistemicState }) => ({ role: x.role, name: x.name, type: x.type, state: x.state || "fato_extraido" }));
      r.timeline = (p.timeline || []).map((x: { date: string; event: string; state?: EpistemicState }) => ({ date: x.date, event: x.event, state: x.state || "fato_extraido" }));
      r.requests = (p.requests || []).map((x: { text?: string; state?: EpistemicState } | string) => typeof x === "string" ? { text: x, state: "alegacao_cliente" as EpistemicState } : { text: x.text || "", state: x.state || "alegacao_cliente" as EpistemicState });
      r.values = (p.values || []).map((x: { label: string; amount: string; state?: EpistemicState }) => ({ label: x.label, amount: x.amount, state: x.state || "fato_extraido" }));
    }
    tok(c); steps[1].status = "done"; steps[1].result = r.parties;
  } catch (e) { steps[1].status = "error"; steps[1].error = e instanceof Error ? e.message : "Erro"; r.parties = []; r.timeline = []; r.requests = []; r.values = []; }

  // ── ETAPA 2: Questões jurídicas ───────────────────────────────────────────
  steps[2].status = "running";
  try {
    const c = await zai.chat.completions.create({
      messages: [
        { role: "system", content: `Identifique as QUESTÕES JURÍDICAS do caso. Para cada, indique área, relevância (alta/média/baixa) e estado epistêmico ("fato_extraido" se surge dos fatos, "inferencia_ia" se é inferência jurídica, "alegacao_cliente" se é alegação). Responda APENAS com JSON: {"legalIssues":[{"question":"...","area":"civil|penal|trabalhista|tributario|consumer|family|previdenciario|empresarial|administrativo|bancario|ambiental|saude|imobiliario|internacional|digital_lgpd|transito","relevance":"alta|média|baixa","state":"fato_extraido|alegacao_cliente|inferencia_ia","note":"explicação curta"}]}` },
        { role: "user", content: `Fatos:\n${facts}\n\nPartes:\n${JSON.stringify(r.parties)}\nPedidos:\n${JSON.stringify(r.requests)}` },
      ],
      thinking: { type: "disabled" }, temperature: 0.4, max_tokens: 800,
    });
    const m = (c.choices[0]?.message?.content || "").match(/\{[\s\S]*\}/);
    if (m) { const p = JSON.parse(m[0]); r.legalIssues = p.legalIssues || []; }
    tok(c); steps[2].status = "done"; steps[2].result = r.legalIssues;
  } catch (e) { steps[2].status = "error"; steps[2].error = e instanceof Error ? e.message : "Erro"; r.legalIssues = []; }

  // ── ETAPA 3: Legislação aplicável (RAG-lite TF-IDF cosine similarity) ─────
  steps[3].status = "running";
  try {
    const issues = r.legalIssues || [];
    // Constroi query combinando fatos + questões jurídicas
    const ragQuery = `${facts} ${issues.map((i) => i.question).join(" ")}`;
    // Busca semântica na base curada (TF-IDF cosine similarity)
    const ragResults = await ragSearch(ragQuery, 8);
    r.applicableLaw = ragResults.map((res) => ({
      diploma: res.source.diploma,
      numero: res.source.numero,
      textoTrecho: res.source.textoTrecho,
      vigente: res.source.vigente,
      urlOficial: res.source.urlOficial,
      applicability: `Fonte para revisão jurídica — ${res.source.diploma} ${res.source.numero} ${res.source.tribunal || ""}`,
      state: "direito_positivo" as const,
      confidence: 0, // retrieval rank is not a legal confidence estimate
    }));
    steps[3].status = "done"; steps[3].result = r.applicableLaw.length;
  } catch (e) { steps[3].status = "error"; steps[3].error = e instanceof Error ? e.message : "Erro"; r.applicableLaw = []; }

  // ── ETAPA 4: Jurisprudência (Compêndio Atlas) + jurimetria descritiva ─────
  // Fonte primária: Compêndio do Atlas (fontes oficiais e citáveis) e jurimetria descritiva.
  // Somente termos jurídicos genéricos saem daqui (sem nomes, números ou valores do caso).
  // Fallback (Atlas desligado/indisponível): busca web aberta, SEMPRE sinalizada como hipótese.
  steps[4].status = "running";
  r.jurimetry = null;
  r.atlas = { configured: isAtlasConfigured(), status: "unavailable", termsUsed: [], fallback: false };
  try {
    const issues = r.legalIssues || [];
    const terms = extractSearchTerms(issues.map((i) => `${i.question} ${i.note || ""}`).join(" "), 3);
    let needsWebFallback = !r.atlas.configured;

    if (r.atlas.configured) {
      if (terms.length === 0) {
        r.atlas.status = "no_terms";
        r.jurisprudence = [];
      } else {
        const [search, jurimetry] = await Promise.all([searchAtlasCompendium(terms, { limit: 8 }), fetchAtlasJurimetry()]);
        r.jurimetry = jurimetry.ok ? jurimetry.data : null;
        if (search.ok) {
          r.jurisprudence = search.data.items.map(decisionToBrainItem);
          r.atlas.termsUsed = search.data.termsUsed;
          r.atlas.status = search.data.failedTerms > 0 || !jurimetry.ok ? "partial" : "ok";
        } else {
          r.atlas.error = search.error;
          needsWebFallback = true;
        }
      }
    }

    if (needsWebFallback) {
      // Never send facts, unique case context or extracted client claims to public search.
      // An unavailable verified source is not a license to invent jurisprudence.
      r.atlas.fallback = false;
      r.atlas.status = "unavailable";
      r.atlas.error = "NO_VERIFIED_JURISPRUDENCE_PROVIDER";
      r.jurisprudence = [];
    }
    steps[4].status = "done"; steps[4].result = r.jurisprudence?.length ?? 0;
  } catch (e) { steps[4].status = "error"; steps[4].error = e instanceof Error ? e.message : "Erro"; r.jurisprudence = r.jurisprudence || []; }

  // ── ETAPA 5: Análise de viabilidade (com Evidence Ledger + hipótese) ─────
  steps[5].status = "running";
  try {
    const lawCtx = (r.applicableLaw || []).map((l) => `${l.diploma} ${l.numero}: ${l.textoTrecho.slice(0, 120)}`).join("\n");
    const jurCtx = (r.jurisprudence || []).map((j) => `- [${j.origin}] ${j.name}: ${j.snippet.slice(0, 100)}`).join("\n");
    const jurimetryCtx = r.jurimetry?.promptBlock ?? "Indisponível (Atlas não consultado ou sem dados).";
    const c = await zai.chat.completions.create({
      messages: [
        { role: "system", content: `Você é um advogado sênior emitindo um PARECER DE VIABILIDADE. NUNCA use percentual ou "chance de êxito" — isso é HIPÓTESE sem base estatística. A jurimetria fornecida é apenas DESCRITIVA (volume de distribuição): jamais a use para estimar êxito ou tendência decisória. Itens de jurisprudência com origem "web_nao_verificado" são hipóteses não verificadas; só trate como jurisprudência os itens "atlas_compendio". Para cada ponto forte/fraco, rotule o estado epistêmico. Responda APENAS com JSON:

{"hypothesis":"favorável|incerto|desfavorável","hypothesisNote":"explicar que é hipótese sem base estatística, requer validação jurisprudencial","strengths":[{"claim":"ponto forte","state":"fato_extraido|alegacao_cliente|inferencia_ia|direito_positivo|jurisprudencia","source":"origem","confidence":0.0-1.0,"note":"explicação"}],"weaknesses":[{"claim":"ponto fraco","state":"fato_extraido|alegacao_cliente|inferencia_ia","source":"origem","confidence":0.0-1.0,"note":"explicação"}],"reasoning":"raciocínio conectando fatos, lei e jurisprudência","evidence":[{"claim":"afirmação consolidada","state":"fato_extraido|inferencia_ia|direito_positivo|jurisprudencia","source":"origem","confidence":0.0-1.0,"note":"nota"}]}` },
        { role: "user", content: `## Fatos\n${facts}\n\n## Legislação\n${lawCtx}\n\n## Jurisprudência\n${jurCtx}\n\n## Jurimetria (Atlas, descritiva)\n${jurimetryCtx}\n\n## Pedidos\n${JSON.stringify(r.requests)}` },
      ],
      thinking: { type: "disabled" }, temperature: 0.4, max_tokens: 1500,
    });
    const m = (c.choices[0]?.message?.content || "").match(/\{[\s\S]*\}/);
    if (m) { const p = JSON.parse(m[0]); r.viability = { hypothesis: p.hypothesis || "incerto", hypothesisNote: p.hypothesisNote || "Hipótese sem base estatística — requer validação jurisprudencial e revisão humana.", strengths: p.strengths || [], weaknesses: p.weaknesses || [], reasoning: p.reasoning || "", evidence: p.evidence || [] }; }
    tok(c); steps[5].status = "done"; steps[5].result = r.viability;
  } catch (e) { steps[5].status = "error"; steps[5].error = e instanceof Error ? e.message : "Erro"; r.viability = { hypothesis: "incerto", hypothesisNote: "Análise indisponível — requer revisão manual.", strengths: [], weaknesses: [], reasoning: "", evidence: [] }; }

  // ── ETAPA 6: Lacunas e perguntas ──────────────────────────────────────────
  steps[6].status = "running";
  try {
    const c = await zai.chat.completions.create({
      messages: [
        { role: "system", content: `Identifique LACUNAS factuais/probatórias e faça PERGUNTAS para o cliente. Cada lacuna deve ter estado epistêmico. Responda APENAS com JSON: {"gaps":[{"what":"informação faltante","why":"por que importa","question":"pergunta para o cliente","state":"fato_extraido|alegacao_cliente|inferencia_ia"}]}` },
        { role: "user", content: `## Fatos\n${facts}\n\n## Questões\n${JSON.stringify(r.legalIssues)}\n\n## Análise\n${JSON.stringify(r.viability)}` },
      ],
      thinking: { type: "disabled" }, temperature: 0.5, max_tokens: 800,
    });
    const m = (c.choices[0]?.message?.content || "").match(/\{[\s\S]*\}/);
    if (m) { const p = JSON.parse(m[0]); r.gaps = p.gaps || []; }
    tok(c); steps[6].status = "done"; steps[6].result = r.gaps;
  } catch (e) { steps[6].status = "error"; steps[6].error = e instanceof Error ? e.message : "Erro"; r.gaps = []; }

  // ── ETAPA 7: Estratégia recomendada (todas as afirmações são hipótese) ───
  steps[7].status = "running";
  try {
    const c = await zai.chat.completions.create({
      messages: [
        { role: "system", content: `Sugira estratégia processual. Todas as ações e riscos são HIPÓTESES — rotule cada uma. Responda APENAS com JSON: {"strategy":{"proceduralPath":"caminho","immediateActions":[{"claim":"ação","state":"hipotese","source":"recomendação IA","confidence":0.5,"note":"nota"}],"documentsToCollect":["doc 1"],"risks":[{"claim":"risco","state":"hipotese","source":"análise IA","confidence":0.5,"note":"nota"}],"recommendation":"recomendação conservadora final"}}` },
        { role: "user", content: `## Fatos\n${facts}\n## Legislação\n${JSON.stringify(r.applicableLaw?.map((l) => l.diploma + " " + l.numero))}\n## Viabilidade\n${JSON.stringify(r.viability)}\n## Lacunas\n${JSON.stringify(r.gaps)}` },
      ],
      thinking: { type: "disabled" }, temperature: 0.5, max_tokens: 1000,
    });
    const m = (c.choices[0]?.message?.content || "").match(/\{[\s\S]*\}/);
    if (m) { const p = JSON.parse(m[0]); r.strategy = p.strategy; }
    tok(c); steps[7].status = "done"; steps[7].result = r.strategy;
  } catch (e) { steps[7].status = "error"; steps[7].error = e instanceof Error ? e.message : "Erro"; r.strategy = { proceduralPath: "", immediateActions: [], documentsToCollect: [], risks: [], recommendation: "Análise indisponível" }; }

  await logAuditEvent({ action: "brain_analysis", resource: "case", resourceId: body.caseId || null, metadata: { totalTokens: tokens, stepsCompleted: steps.filter((s) => s.status === "done").length } });
  await logUsageEntry({ type: "debit", operation: "brain_analysis", amount: -3, reason: "Análise cerebral (contexto confidencial omitido)", metadata: { totalTokens: tokens, caseId: body.caseId } });

  // ── Persistir análise (memória jurídica por processo) ──────────────────
  if (body.caseId) {
    try {
      await db.brainAnalysis.create({
        data: {
          caseId: body.caseId,
          title,
          factsInput: rawFacts,
          result: JSON.stringify({ ...r, steps, totalTokens: tokens }),
          ramoJuridico: r.ramoJuridico || null,
          hypothesis: r.viability?.hypothesis || null,
          tokensUsed: tokens,
        },
      });
    } catch { /* não bloquear o fluxo se falhar a persistência */ }
  }

  return NextResponse.json({ ...r, steps, totalTokens: tokens } as BrainResult);
}

// GET /api/brain — lista histórico de análises por caso
export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const caseId = url.searchParams.get("caseId");
  if (!caseId) return NextResponse.json({ error: "caseId_required" }, { status: 400 });
  const linkedCase = await db.case.findUnique({
    where: { id: caseId },
    select: { client: { select: { userId: true } } },
  });
  if (!linkedCase) return NextResponse.json({ error: "case_not_found" }, { status: 404 });
  if (authUser.role !== "admin" && linkedCase.client.userId !== authUser.uid) {
    return NextResponse.json({ error: "case_access_denied" }, { status: 403 });
  }

  const analyses = await db.brainAnalysis.findMany({
    where: { caseId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({
    analyses: analyses.map((a) => ({
      id: a.id,
      caseId: a.caseId,
      title: a.title,
      factsInput: a.factsInput.slice(0, 200),
      ramoJuridico: a.ramoJuridico,
      hypothesis: a.hypothesis,
      tokensUsed: a.tokensUsed,
      createdAt: a.createdAt.toISOString(),
    })),
  });
}
