import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import { logAuditEvent, logUsageEntry } from "@/lib/audit";
import { ragSearch } from "@/lib/rag_lite";
import { requireAuth } from "@/lib/auth";
import { ownsCase } from "@/lib/owned-case";
import { canonicalHash } from "@/lib/evidence";
import { prepareBrainEjcContext, safeEvidencePrompt } from "@/lib/brain-ejc";
import { validateBrainExtraction } from "@/lib/brain-ejc-evidence-gate";
import {
  decisionToBrainItem,
  extractSearchTerms,
  fetchAtlasJurimetry,
  isAtlasConfigured,
  searchAtlasCompendium,
  webResultToBrainItem,
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

  if (typeof body.caseId !== "string" ||
      (body.facts !== undefined && typeof body.facts !== "string") ||
      (body.title !== undefined && typeof body.title !== "string")) {
    return NextResponse.json({ error: "Parâmetros de análise inválidos" }, { status: 400 });
  }
  const caseId = body.caseId?.trim() || "";
  const title = body.title?.trim() || `Análise — ${new Date().toLocaleDateString("pt-BR")}`;
  if (!caseId || caseId === "default-case" || caseId === "cerebro-session") {
    return NextResponse.json({ error: "caseId real obrigatório para análise do Cérebro" }, { status: 400 });
  }
  if (!await ownsCase(authUser.uid, caseId)) return NextResponse.json({ error: "case_not_found" }, { status: 404 });

  let context;
  try {
    context = await prepareBrainEjcContext(authUser.uid, caseId, body.facts || "");
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível preparar os autos" }, { status: 400 });
  }
  const safeFacts = context.safeText;
  const allowedEvidence = safeEvidencePrompt(context.evidence);
  const steps: BrainStep[] = STEPS.map((s) => ({ ...s, status: "pending" as const }));
  const r: Partial<BrainResult> = { steps };
  let tokens = 0;
  const agentRun = await db.agentRun.create({
    data: {
      caseId, userId: authUser.uid, agentSlug: "legal_brain", taskType: "analyze", status: "running",
      inputHash: canonicalHash({ caseId, safeFacts, title, nonce: Date.now() }),
      contractVersion: "legal_brain_ejc_v2", startedAt: new Date(),
    },
  });
  // Não registrar análise concluída se o provedor estiver indisponível.
  let zai: Awaited<ReturnType<typeof ZAI.create>>;
  try {
    zai = await ZAI.create();
  } catch {
    await db.agentRun.update({
      where: { id: agentRun.id },
      data: { status: "failed", finishedAt: new Date() },
    });
    return NextResponse.json({
      error: "Provedor indisponível. Nenhuma análise jurídica foi aprovada.",
      status: "degraded",
      deterministic: context.deterministic,
    }, { status: 503 });
  }
  const tok = (c: unknown) => tokens += (c as { usage?: { total_tokens?: number } }).usage?.total_tokens || 0;

  // ── ETAPA 0: Classificação do ramo jurídico ──────────────────────────────
  steps[0].status = "running";
  try {
    const c = await zai.chat.completions.create({
      messages: [
        { role: "system", content: `Classifique o caso em UM destes 16 ramos. Responda APENAS com JSON: {"ramo":"...","confianca":0.0-1.0}. Ramos: civil, penal, trabalhista, tributario, consumer, family, previdenciario, empresarial, administrativo, bancario, ambiental, saude, imobiliario, internacional, digital_lgpd, transito` },
        { role: "user", content: safeFacts.slice(0, 500) },
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
        { role: "system", content: `Extraia informações estruturadas em JSON. Para CADA item, rotule o estado epistêmico: "fato_extraido" (literal do texto), "alegacao_cliente" (não confirmado), "inferencia_ia" (inferido). Responda APENAS com JSON, sem markdown. Use marcadores [NOME_0001] se houver dados sensíveis. Cada item deve incluir evidence_ref_ids contendo somente IDs presentes em Evidências autorizadas; sem evidência, não apresente o item como fato.

{"parties":[{"role":"autor|réu|requerente|requerido|terceiro","name":"nome ou marcador","type":"pessoa física|pessoa jurídica|órgão público","state":"fato_extraido|alegacao_cliente|inferencia_ia","evidence_ref_ids":["id permitido"]}],"timeline":[{"date":"data","event":"evento","state":"fato_extraido|alegacao_cliente|inferencia_ia","evidence_ref_ids":["id permitido"]}],"requests":[{"text":"pedido","state":"alegacao_cliente|inferencia_ia","evidence_ref_ids":["id permitido"]}],"values":[{"label":"rótulo","amount":"R$ X","state":"fato_extraido|alegacao_cliente|inferencia_ia","evidence_ref_ids":["id permitido"]}]}` },
        { role: "user", content: `## Texto pseudonimizado dos autos\n${safeFacts}\n\n## Evidências autorizadas\n${allowedEvidence}` },
      ],
      thinking: { type: "disabled" }, temperature: 0.3, max_tokens: 1000,
    });
    const m = (c.choices[0]?.message?.content || "").match(/\{[\s\S]*\}/);
    if (!m) throw new Error("Extração EJC não retornou JSON válido");
    {
      const p = JSON.parse(m[0]);
      const extraction = validateBrainExtraction(p, new Set(context.evidence.map((e) => e.id)));
      r.parties = extraction.parties.flatMap((item) =>
        typeof item.role === "string" && typeof item.type === "string"
          ? [{ role: item.role, type: item.type, name: typeof item.name === "string" ? item.name : undefined,
               state: item.state, evidenceRefIds: item.evidenceRefIds }] : []);
      r.timeline = extraction.timeline.flatMap((item) =>
        typeof item.date === "string" && typeof item.event === "string"
          ? [{ date: item.date, event: item.event, state: item.state,
               evidenceRefIds: item.evidenceRefIds }] : []);
      r.requests = extraction.requests.flatMap((item) =>
        typeof item.text === "string"
          ? [{ text: item.text, state: item.state, evidenceRefIds: item.evidenceRefIds }] : []);
      r.values = extraction.values.flatMap((item) =>
        typeof item.label === "string" && typeof item.amount === "string"
          ? [{ label: item.label, amount: item.amount, state: item.state,
               evidenceRefIds: item.evidenceRefIds }] : []);
    }
    tok(c); steps[1].status = "done"; steps[1].result = r.parties;
  } catch (e) { steps[1].status = "error"; steps[1].error = e instanceof Error ? e.message : "Erro"; r.parties = []; r.timeline = []; r.requests = []; r.values = []; }

  // ── ETAPA 2: Questões jurídicas ───────────────────────────────────────────
  steps[2].status = "running";
  try {
    const c = await zai.chat.completions.create({
      messages: [
        { role: "system", content: `Identifique as QUESTÕES JURÍDICAS do caso. Para cada, indique área, relevância (alta/média/baixa) e estado epistêmico ("fato_extraido" se surge dos fatos, "inferencia_ia" se é inferência jurídica, "alegacao_cliente" se é alegação). Responda APENAS com JSON: {"legalIssues":[{"question":"...","area":"civil|penal|trabalhista|tributario|consumer|family|previdenciario|empresarial|administrativo|bancario|ambiental|saude|imobiliario|internacional|digital_lgpd|transito","relevance":"alta|média|baixa","state":"fato_extraido|alegacao_cliente|inferencia_ia","note":"explicação curta"}]}` },
        { role: "user", content: `Fatos pseudonimizados:\n${safeFacts}\n\nPartes:\n${JSON.stringify(r.parties)}\nPedidos:\n${JSON.stringify(r.requests)}` },
      ],
      thinking: { type: "disabled" }, temperature: 0.4, max_tokens: 800,
    });
    const m = (c.choices[0]?.message?.content || "").match(/\{[\s\S]*\}/);
    if (!m) throw new Error("Questões jurídicas não retornaram JSON válido");
    const p = JSON.parse(m[0]);
    if (!Array.isArray(p.legalIssues)) throw new Error("Questões jurídicas sem estrutura válida");
    r.legalIssues = p.legalIssues;
    tok(c); steps[2].status = "done"; steps[2].result = r.legalIssues;
  } catch (e) { steps[2].status = "error"; steps[2].error = e instanceof Error ? e.message : "Erro"; r.legalIssues = []; }

  // ── ETAPA 3: Legislação aplicável (RAG-lite TF-IDF cosine similarity) ─────
  steps[3].status = "running";
  try {
    const issues = r.legalIssues || [];
    // Constroi query combinando fatos + questões jurídicas
    const ragQuery = `${safeFacts} ${issues.map((i) => i.question).join(" ")}`;
    // Busca semântica na base curada (TF-IDF cosine similarity)
    const ragResults = await ragSearch(ragQuery, 8);
    r.applicableLaw = ragResults.map((res) => ({
      diploma: res.source.diploma,
      numero: res.source.numero,
      textoTrecho: res.source.textoTrecho,
      vigente: res.source.vigente,
      urlOficial: res.source.urlOficial,
      applicability: `RAG score: ${res.score.toFixed(3)} — ${res.source.diploma} ${res.source.numero} ${res.source.tribunal || ""}`,
      state: "direito_positivo" as const,
      confidence: Math.min(1, res.score + 0.3), // ajusta confiança com base no score
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
      r.atlas.fallback = true;
      const searchQuery = issues.length > 0 ? `jurisprudência STJ ${issues.slice(0, 2).map((i) => i.question).join(" ")}` : `jurisprudência ${safeFacts.slice(0, 100)}`;
      const raw = (await zai.functions.invoke("web_search", { query: searchQuery, num: 8 })) as unknown as { url: string; name: string; snippet: string; host_name: string }[];
      r.jurisprudence = Array.isArray(raw) ? raw.slice(0, 8).map(webResultToBrainItem) : [];
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
        { role: "user", content: `## Fatos pseudonimizados\n${safeFacts}\n\n## Legislação\n${lawCtx}\n\n## Jurisprudência\n${jurCtx}\n\n## Jurimetria (Atlas, descritiva)\n${jurimetryCtx}\n\n## Pedidos\n${JSON.stringify(r.requests)}` },
      ],
      thinking: { type: "disabled" }, temperature: 0.4, max_tokens: 1500,
    });
    const m = (c.choices[0]?.message?.content || "").match(/\{[\s\S]*\}/);
    if (!m) throw new Error("Análise de viabilidade não retornou JSON válido");
    { const p = JSON.parse(m[0]); if (!p || typeof p.reasoning !== "string" || !p.hypothesis) throw new Error("Análise de viabilidade incompleta"); r.viability = { hypothesis: p.hypothesis || "incerto", hypothesisNote: p.hypothesisNote || "Hipótese sem base estatística — requer validação jurisprudencial e revisão humana.", strengths: p.strengths || [], weaknesses: p.weaknesses || [], reasoning: p.reasoning || "", evidence: p.evidence || [] }; }
    tok(c); steps[5].status = "done"; steps[5].result = r.viability;
  } catch (e) { steps[5].status = "error"; steps[5].error = e instanceof Error ? e.message : "Erro"; r.viability = { hypothesis: "incerto", hypothesisNote: "Análise indisponível — requer revisão manual.", strengths: [], weaknesses: [], reasoning: "", evidence: [] }; }

  // ── ETAPA 6: Lacunas e perguntas ──────────────────────────────────────────
  steps[6].status = "running";
  try {
    const c = await zai.chat.completions.create({
      messages: [
        { role: "system", content: `Identifique LACUNAS factuais/probatórias e faça PERGUNTAS para o cliente. Cada lacuna deve ter estado epistêmico. Responda APENAS com JSON: {"gaps":[{"what":"informação faltante","why":"por que importa","question":"pergunta para o cliente","state":"fato_extraido|alegacao_cliente|inferencia_ia"}]}` },
        { role: "user", content: `## Fatos pseudonimizados\n${safeFacts}\n\n## Questões\n${JSON.stringify(r.legalIssues)}\n\n## Análise\n${JSON.stringify(r.viability)}` },
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
        { role: "user", content: `## Fatos pseudonimizados\n${safeFacts}\n## Legislação\n${JSON.stringify(r.applicableLaw?.map((l) => l.diploma + " " + l.numero))}\n## Viabilidade\n${JSON.stringify(r.viability)}\n## Lacunas\n${JSON.stringify(r.gaps)}` },
      ],
      thinking: { type: "disabled" }, temperature: 0.5, max_tokens: 1000,
    });
    const m = (c.choices[0]?.message?.content || "").match(/\{[\s\S]*\}/);
    if (!m) throw new Error("Estratégia não retornou JSON válido");
    { const p = JSON.parse(m[0]); if (!p.strategy || typeof p.strategy.recommendation !== "string") throw new Error("Estratégia incompleta"); r.strategy = p.strategy; }
    tok(c); steps[7].status = "done"; steps[7].result = r.strategy;
  } catch (e) { steps[7].status = "error"; steps[7].error = e instanceof Error ? e.message : "Erro"; r.strategy = { proceduralPath: "", immediateActions: [], documentsToCollect: [], risks: [], recommendation: "Análise indisponível" }; }

  // Gate jurídico do Cérebro EJC: não declarar completo o resultado degradado.
  const mandatorySteps = ["extract", "issues", "viability", "strategy"];
  const incomplete = steps.some((s) => mandatorySteps.includes(s.id) && s.status !== "done");
  if (incomplete) {
    await db.agentRun.update({
      where: { id: agentRun.id },
      data: { status: "failed", tokensOut: tokens, finishedAt: new Date() },
    });
    return NextResponse.json({
      error: "Análise incompleta; nenhum parecer foi salvo como concluído.",
      status: "degraded",
      deterministic: context.deterministic,
      steps,
    }, { status: 503 });
  }

  const brainResult = { ...r, steps, totalTokens: tokens };
  const lastSnapshot = await db.intelligenceSnapshot.findFirst({ where: { caseId }, orderBy: { version: "desc" } });
  const snapshot = await db.intelligenceSnapshot.create({
    data: {
      caseId,
      version: (lastSnapshot?.version || 0) + 1,
      payload: JSON.stringify({
        source: "case_files_and_evidence_refs",
        evidenceRefs: context.evidence.map(({ id, documentId, pageNumber, quoteHash, sourceKind, verified }) => ({ id, documentId, pageNumber, quoteHash, sourceKind, verified })),
        deterministic: context.deterministic,
        analysis: brainResult,
        reviewStatus: "pending",
      }),
      isDraft: true,
    },
  });
  await db.agentRun.update({
    where: { id: agentRun.id },
    data: { status: "completed", tokensOut: tokens, resultSnapshotId: snapshot.id, providerSnapshot: JSON.stringify({ provider: "zai", tokens }), finishedAt: new Date() },
  });
  await db.brainAnalysis.create({
    data: { caseId, title, factsInput: safeFacts, result: JSON.stringify(brainResult), ramoJuridico: r.ramoJuridico || null, hypothesis: r.viability?.hypothesis || null, tokensUsed: tokens },
  });
  await logAuditEvent({ action: "brain_analysis", resource: "case", resourceId: caseId, metadata: { title, totalTokens: tokens, stepsCompleted: steps.filter((s) => s.status === "done").length, snapshotId: snapshot.id, evidenceCount: context.evidence.length }, userId: authUser.uid });
  await logUsageEntry({ type: "debit", operation: "brain_analysis", amount: -3, reason: `Análise cerebral: ${title}`, metadata: { totalTokens: tokens, caseId, snapshotId: snapshot.id }, userId: authUser.uid });

  return NextResponse.json({ ...brainResult, caseId, snapshotId: snapshot.id, snapshotVersion: snapshot.version, evidence: context.evidence });
}

// GET /api/brain — lista histórico de análises por caso
export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Guard de autenticação (auditoria de rotas — ver docs/auditoria-rotas-juridia.md) ──
  const __auth = await requireAuth(req);
  if (!__auth.ok) return __auth.response;
  const authUser = __auth.user;

  const url = new URL(req.url);
  const caseId = url.searchParams.get("caseId") || "";
  if (!caseId || caseId === "default-case" || caseId === "cerebro-session") return NextResponse.json({ error: "caseId real obrigatório" }, { status: 400 });

  if (!await ownsCase(authUser.uid, caseId)) return NextResponse.json({ error: "case_not_found" }, { status: 404 });
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
