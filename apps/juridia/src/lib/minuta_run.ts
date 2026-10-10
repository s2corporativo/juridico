import { createGovernedZai } from "./external-ai-boundary";
// minuta_run.ts — Orquestração do pipeline de minutas (multi-etapas).
//
// É a ÚNICA implementação do fluxo de geração: tanto a rota JSON clássica
// (POST /api/generate-minuta) quanto a rota de streaming (POST
// /api/generate-minuta/stream) executam runMinutaPipeline(). A diferença é
// apenas o observador: com onEvent, o runner emite eventos em tempo real
// (etapas + deltas de token da REDAÇÃO) e usa chamada em streaming no
// estágio de redação; sem observador, comporta-se exatamente como antes.
//
// Este módulo NÃO conhece HTTP: as rotas são wrappers finos (auth + serialização).

import { createHash } from "node:crypto";
import ZAI from "z-ai-web-dev-sdk";
import { db } from "@/lib/db";
import { pseudonymize, rehydrate } from "@/lib/pseudonymizer";
import { validateResponse, ensureDraftMarker } from "@/lib/ai_governance";
import { logAuditEvent, logUsageEntry } from "@/lib/audit";
import { routeSkills } from "@/lib/skill_router";
import { ragSearch } from "@/lib/rag_lite";
import {
  buildSystemPrompt,
  buildOutlineUserPrompt,
  buildDraftUserPrompt,
  buildReviewUserPrompt,
  buildFactsBlock,
  buildMarkerList,
  labelFromKey,
  buildReferencesBlock,
  mergeSkills,
  outlineToText,
  applyReviewCorrections,
  styleDirective,
  fallbackDraft,
  extractJson,
  type CaseOutline,
  type PipelineSkill,
  type ReviewFinding,
} from "@/lib/minuta_pipeline";
import type {
  GenerateMinutaRequest,
  GenerateMinutaResponse,
  DocumentDTO,
  ReferenceUsed,
  PipelineStageInfo,
} from "@/lib/types";

// ── Eventos emitidos para o observador (SSE na rota de streaming) ────────────

export type MinutaRunEvent =
  | {
      type: "stage";
      stage: "prepare" | "outline" | "draft" | "review" | "finalize";
      status: "start" | "done" | "error" | "skipped";
      note?: string;
      ms?: number;
      tokens?: number;
    }
  | { type: "draft_delta"; text: string }
  | { type: "done"; result: GenerateMinutaResponse };

export type MinutaRunObserver = (e: MinutaRunEvent) => void;

// ── Chamada LLM (não-streaming, igual à original) ────────────────────────────

interface LlmResult {
  text: string;
  tokens: number;
}

type ZaiClient = NonNullable<Awaited<ReturnType<typeof ZAI.create>>>;

async function callLlm(
  zai: ZaiClient,
  system: string,
  user: string,
  opts: { temperature: number; maxTokens: number }
): Promise<LlmResult> {
  const completion = await zai.chat.completions.create({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    thinking: { type: "disabled" },
    temperature: opts.temperature,
    max_tokens: opts.maxTokens,
  });
  return {
    text: completion.choices[0]?.message?.content || "",
    tokens:
      (completion as unknown as { usage?: { total_tokens?: number } }).usage?.total_tokens || 0,
  };
}

// ── Chamada LLM em streaming (etapa de redação) ──────────────────────────────
// O SDK (z-ai-web-dev-sdk ≥0.0.18) retorna response.body (ReadableStream de
// SSE do provider) quando stream:true. Se o provider ignorar stream e
// responder JSON, caímos para o texto completo como um único delta.

async function* iterateProviderSse(
  body: ReadableStream<Uint8Array>
): AsyncGenerator<{ delta?: string; tokens?: number }> {
  const decoder = new TextDecoder();
  let buffer = "";
  const reader = body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value as unknown as ArrayBuffer, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const json = JSON.parse(payload) as {
          choices?: { delta?: { content?: string }; message?: { content?: string } }[];
          usage?: { total_tokens?: number };
        };
        const delta =
          json.choices?.[0]?.delta?.content ?? json.choices?.[0]?.message?.content ?? "";
        const tokens = json.usage?.total_tokens;
        if (delta || tokens) yield { delta: delta || undefined, tokens };
      } catch {
        // linha não-JSON (keepalive etc.) — ignora
      }
    }
  }
}

async function callLlmStream(
  zai: ZaiClient,
  system: string,
  user: string,
  opts: { temperature: number; maxTokens: number },
  onDelta: (text: string) => void
): Promise<LlmResult> {
  const completion = (await zai.chat.completions.create({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    thinking: { type: "disabled" },
    temperature: opts.temperature,
    max_tokens: opts.maxTokens,
    stream: true,
  })) as unknown;

  // Provider respondeu JSON (ignorou stream) → trata como resposta única.
  if (!(completion instanceof Object && "getReader" in completion)) {
    const r = completion as { choices?: { message?: { content?: string } }[]; usage?: { total_tokens?: number } };
    const text = r.choices?.[0]?.message?.content || "";
    if (text) onDelta(text);
    return { text, tokens: r.usage?.total_tokens || 0 };
  }

  let text = "";
  let tokens = 0;
  for await (const evt of iterateProviderSse(completion as ReadableStream<Uint8Array>)) {
    if (evt.delta) {
      text += evt.delta;
      onDelta(evt.delta);
    }
    if (evt.tokens) tokens = evt.tokens;
  }
  return { text, tokens };
}

// ── Helpers finais (antes na rota; agora vivem com o pipeline) ───────────────

const MARKER_PATTERN = /\[([A-ZÀ-Ú_]+)_(\d+)\]/g;

function finalRestoredMatches(text: string): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(MARKER_PATTERN.source, MARKER_PATTERN.flags);
  while ((m = re.exec(text)) !== null) out.push(m[0]);
  return out;
}

/** Remove cercas de código (```markdown ... ```) que envolvem o documento */
function stripCodeFences(text: string): string {
  let t = text.trim();
  const fenced = t.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n?```\s*$/i);
  if (fenced) t = fenced[1].trim();
  return t;
}

function safeParseArr(raw: string | null): string[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

// Limite de segurança: a minuta-molde entra inteira no prompt de cada caso do
// lote — sem teto, um molde gigante multiplicaria o custo por caso.
const MAX_MOLD_CHARS = 60_000;

export function normalizeMoldContent(raw: string | undefined | null): string {
  if (!raw || typeof raw !== "string") return "";
  const trimmed = stripCodeFences(raw).trim();
  return trimmed.length > MAX_MOLD_CHARS ? trimmed.slice(0, MAX_MOLD_CHARS) : trimmed;
}

// ── Runner principal ─────────────────────────────────────────────────────────

export async function runMinutaPipeline(
  body: GenerateMinutaRequest,
  authUser: { uid: string; email: string; role: string },
  onEvent?: MinutaRunObserver
): Promise<GenerateMinutaResponse> {
  const emit = onEvent ?? (() => {});

  // 1) Template
  const tpl = await db.template.findUnique({ where: { slug: body.templateSlug } });
  if (!tpl) throw new PipelineError("Template não encontrado", 404);

  emit({ type: "stage", stage: "prepare", status: "start" });

  // 2) Inteiro teor + contexto do Cérebro (pseudonimizado junto — tarja-1)
  const factsBlock = buildFactsBlock(body.fields);
  const rawContextForModel = body.brainContext?.trim()
    ? `${factsBlock}\n\n[Contexto do Cérebro Jurídico]\n${body.brainContext.trim()}`
    : factsBlock;
  const pseudonymization = pseudonymize(rawContextForModel);
  // Fatos "puros" (sem o contexto do cérebro) para roteamento de skills
  const factsOnlyPseudonymized = pseudonymize(factsBlock).text;

  // 3) Skills: escolhidas manualmente + roteadas automaticamente por relevância
  const manualSkills: PipelineSkill[] = body.skillSlugs?.length
    ? (
        await db.skill.findMany({ where: { slug: { in: body.skillSlugs } } })
      ).map((s) => ({ slug: s.slug, name: s.name, content: s.content, origin: "manual" as const }))
    : [];

  let autoRouted: PipelineSkill[] = [];
  let detectedIssues: { key: string; title: string; area: string }[] = [];
  try {
    const routed = await routeSkills(factsOnlyPseudonymized);
    detectedIssues = routed.issues;
    autoRouted = routed.matches.map((m) => ({
      slug: m.slug,
      name: m.name,
      content: m.content,
      origin: "auto" as const,
      matchScore: m.matchScore,
    }));
  } catch {
    // skill_router depende da base SkillVersion; sem base, segue só com manuais
  }

  const { selected: skills, dropped: skillsDropped } = mergeSkills(manualSkills, autoRouted);
  const skillsBlock = skills.length
    ? `\n\n## Habilidades (skills) aplicadas — o texto abaixo é o que foi enviado à IA (auditável)\n${skills
        .map((s) => `### ${s.name} (${s.origin === "manual" ? "escolhida" : "roteada"}, #${s.slug})\n${s.content}`)
        .join("\n\n")}`
    : "";

  // 4) Jurisprudência/normas inteligentes — RAG na base curada LegalSource
  let ragResults: Awaited<ReturnType<typeof ragSearch>> = [];
  try {
    ragResults = await ragSearch(factsOnlyPseudonymized || tpl.name, 5);
  } catch {
    // base curada indisponível → fundamentação fica por conta do LLM com regras de vedação
  }
  const references: ReferenceUsed[] = ragResults.map((r) => ({
    diploma: r.source.diploma,
    numero: r.source.numero,
    tribunal: r.source.tribunal,
    urlOficial: r.source.urlOficial,
    score: Number(r.score.toFixed(4)),
  }));
  const referencesBlock = buildReferencesBlock(
    ragResults.map((r) => ({
      diploma: r.source.diploma,
      numero: r.source.numero,
      tribunal: r.source.tribunal,
      urlOficial: r.source.urlOficial,
      textoTrecho: r.source.textoTrecho,
      score: r.score,
    }))
  );

  // 5) Agente registrável (custo/orçamento por geração)
  const inputHash = createHash("sha256")
    .update(
      `${tpl.slug}|${factsBlock}|${skills.map((s) => s.slug).join(",")}|${
        body.moldContent ? "mold:" + createHash("sha256").update(body.moldContent).digest("hex").slice(0, 16) : "nomold"
      }`
    )
    .digest("hex")
    .slice(0, 32);
  const run = await db.agentRun.create({
    data: {
      agentSlug: "legal_draft",
      taskType: "draft",
      status: "running",
      inputHash,
      userId: authUser.uid,
      tokensBudget: 30000,
      providerSnapshot: JSON.stringify({
        provider: "zai",
        pipeline: onEvent ? "multi-stage-v3-stream" : "multi-stage-v2",
      }),
    },
  });
  let stepNo = 0;
  let tokensTotal = 0;
  const stages: PipelineStageInfo[] = [];

  const hashOf = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 32);
  async function recordStep(
    kind: string,
    toolName: string,
    status: string,
    output: Record<string, unknown>,
    tokensIn: number,
    tokensOut: number,
    durationMs: number
  ) {
    stepNo += 1;
    await db.agentRunStep.create({
      data: {
        runId: run.id,
        stepNo,
        kind,
        toolName,
        status,
        inputHash: null,
        outputHash: hashOf(JSON.stringify(output)),
        output: JSON.stringify(output).slice(0, 4000),
        provider: "zai",
        model: "juridia-default",
        tokensIn,
        tokensOut,
        durationMs,
      },
    });
  }

  let zai: ZaiClient | null = null;
  try {
    zai = await createGovernedZai();
  } catch {
    zai = null;
  }

  const styleText = styleDirective(body.writingStyle);

  // Proveniência: qual campo do formulário introduziu cada marcador — ajuda o
  // LLM a usar [NOME_1] como AUTOR e não como rótulo literal ("Nome Autor").
  const fieldLabels = Object.keys(body.fields).filter((k) => body.fields[k]?.trim());
  const markerList = buildMarkerList(
    pseudonymization.map.reverse,
    (marker) => {
      const value = pseudonymization.map.reverse.get(marker) ?? "";
      const owners = fieldLabels.filter((k) => (body.fields[k] || "").includes(value));
      return owners.map((k) => `campo "${labelFromKey(k)}"`).join(" ou ");
    },
  );

  // Minuta-molde aprovada (geração em lote — paridade MinutaIA)
  const moldText = normalizeMoldContent(body.moldContent);

  emit({ type: "stage", stage: "prepare", status: "done", note: `${skills.length} skill(s), ${references.length} fonte(s)` });

  // ═══ ETAPA 1 — ROTEIRISTA (plano estruturado) ═══
  let outlineText = "(plano indisponível — redija com a estrutura clássica)";
  if (zai) {
    emit({ type: "stage", stage: "outline", status: "start" });
    const t0 = Date.now();
    try {
      const r = await callLlm(
        zai,
        buildSystemPrompt("outline"),
        buildOutlineUserPrompt({
          templateName: tpl.name,
          templateDirectives: tpl.prompt,
          anonymizedFacts: pseudonymization.text,
          issues: detectedIssues,
          styleDirective: styleText,
        }),
        { temperature: 0.3, maxTokens: 900 }
      );
      const outline = extractJson<CaseOutline>(r.text);
      if (outline) {
        outlineText = outlineToText(outline);
        stages.push({ stage: "outline", ok: true, ms: Date.now() - t0, tokens: r.tokens });
        emit({ type: "stage", stage: "outline", status: "done", ms: Date.now() - t0, tokens: r.tokens });
      } else {
        stages.push({ stage: "outline", ok: false, ms: Date.now() - t0, tokens: r.tokens, note: "JSON do plano inválido — seguindo estrutura clássica" });
        emit({ type: "stage", stage: "outline", status: "error", ms: Date.now() - t0, tokens: r.tokens, note: "JSON do plano inválido — seguindo estrutura clássica" });
      }
      tokensTotal += r.tokens;
      await recordStep("llm_call", "outline", "done", { ok: !!outline }, 0, r.tokens, Date.now() - t0);
    } catch (e) {
      const note = e instanceof Error ? e.message : "falha no roteirista";
      stages.push({ stage: "outline", ok: false, ms: Date.now() - t0, tokens: 0, note });
      emit({ type: "stage", stage: "outline", status: "error", ms: Date.now() - t0, tokens: 0, note });
      await recordStep("llm_call", "outline", "error", { error: note }, 0, 0, Date.now() - t0);
    }
  } else {
    stages.push({ stage: "outline", ok: false, ms: 0, tokens: 0, note: "provider indisponível" });
    emit({ type: "stage", stage: "outline", status: "skipped", note: "provider indisponível" });
  }

  // ═══ ETAPA 2 — REDATOR (minuta completa; STREAMING quando observado) ═══
  let generated = "";
  let degraded = false;
  if (zai) {
    emit({ type: "stage", stage: "draft", status: "start" });
    const t0 = Date.now();
    try {
      const draftPrompt = buildDraftUserPrompt({
        templateName: tpl.name,
        templateDirectives: tpl.prompt,
        anonymizedFacts: pseudonymization.text,
        skillsBlock,
        markerList,
        referencesBlock,
        outlineText,
        brainContext: "", // já embutido em anonymizedFacts (pseudonimizado)
        styleDirective: styleText,
        moldText,
      });
      // Com observador (rota SSE) a redação é transmitida em tokens;
      // sem observador (rota JSON clássica), chamada única como antes.
      const r = onEvent
        ? await callLlmStream(
            zai,
            buildSystemPrompt("draft"),
            draftPrompt,
            { temperature: 0.55, maxTokens: 6000 },
            (delta) => emit({ type: "draft_delta", text: delta })
          )
        : await callLlm(
            zai,
            buildSystemPrompt("draft"),
            draftPrompt,
            { temperature: 0.55, maxTokens: 6000 }
          );
      generated = r.text;
      tokensTotal += r.tokens;
      stages.push({ stage: "draft", ok: !!generated, ms: Date.now() - t0, tokens: r.tokens });
      emit({ type: "stage", stage: "draft", status: generated ? "done" : "error", ms: Date.now() - t0, tokens: r.tokens });
      await recordStep("llm_call", "draft", generated ? "done" : "error", { chars: generated.length }, 0, r.tokens, Date.now() - t0);
    } catch (e) {
      const note = e instanceof Error ? e.message : "falha no redator";
      stages.push({ stage: "draft", ok: false, ms: Date.now() - t0, tokens: 0, note });
      emit({ type: "stage", stage: "draft", status: "error", ms: Date.now() - t0, tokens: 0, note });
      await recordStep("llm_call", "draft", "error", { error: note }, 0, 0, Date.now() - t0);
    }
  }

  if (!generated) {
    // Fallback AGORA SINALIZADO (antes era 200 silencioso)
    degraded = true;
    generated = fallbackDraft(
      tpl.name,
      pseudonymization.text,
      skills.map((s) => s.name)
    );
  }

  // ═══ ETAPA 3 — REVISOR (2ª passada) ═══
  let reviewCorrections = { applied: 0, skipped: 0 };
  if (zai && !degraded) {
    emit({ type: "stage", stage: "review", status: "start" });
    const t0 = Date.now();
    try {
      const preliminaryValidation = validateResponse(generated);
      const r = await callLlm(
        zai,
        buildSystemPrompt("review"),
        buildReviewUserPrompt({
          templateName: tpl.name,
          draft: generated,
          styleDirective: styleText,
          deterministicFindings: preliminaryValidation.violations.map((v) => ({
            rule: v.rule,
            severity: v.severity,
            detail: v.detail,
          })),
        }),
        { temperature: 0.2, maxTokens: 1600 }
      );
      const review = extractJson<{ corrigir?: ReviewFinding[]; resalvas?: string[] }>(r.text);
      if (review?.corrigir?.length) {
        const appliedResult = applyReviewCorrections(generated, review.corrigir);
        generated = appliedResult.text;
        reviewCorrections = { applied: appliedResult.applied, skipped: appliedResult.skipped };
      }
      tokensTotal += r.tokens;
      stages.push({ stage: "review", ok: true, ms: Date.now() - t0, tokens: r.tokens, note: `${reviewCorrections.applied} correção(ões)` });
      emit({ type: "stage", stage: "review", status: "done", ms: Date.now() - t0, tokens: r.tokens, note: `${reviewCorrections.applied} correção(ões)` });
      await recordStep("llm_call", "review", "done", reviewCorrections, 0, r.tokens, Date.now() - t0);
    } catch (e) {
      const note = e instanceof Error ? e.message : "falha no revisor";
      stages.push({ stage: "review", ok: false, ms: Date.now() - t0, tokens: 0, note });
      emit({ type: "stage", stage: "review", status: "error", ms: Date.now() - t0, tokens: 0, note });
      await recordStep("llm_call", "review", "error", { error: note }, 0, 0, Date.now() - t0);
    }
  }

  emit({ type: "stage", stage: "finalize", status: "start" });

  // 5.5) Limpa cercas de código que o LLM por vezes envolve no Markdown
  generated = stripCodeFences(generated);

  // 6) DESANONIMIZAÇÃO LOCAL + validação FINAL visível ao advogado
  //    (validação roda DEPOIS de garantir a marca de rascunho — o texto
  //     validado é exatamente o que o advogado recebe)
  const restoredContent = rehydrate(generated, pseudonymization.map);

  // GARANTIA DETERMINÍSTICA 1: marcador inventado pelo LLM (não está no mapa)
  // não tem dado correspondente — converte para ____ no texto final.
  const invented: string[] = [];
  let sanitizedContent = restoredContent;
  for (const m of finalRestoredMatches(restoredContent)) {
    if (!pseudonymization.map.reverse.has(m)) {
      invented.push(m);
      sanitizedContent = sanitizedContent.split(m).join("____");
    }
  }

  // GARANTIA DETERMINÍSTICA 2: rótulo de campo usado como se fosse dado
  // (ex.: "Cpf Autor, brasileiro(a)...") → violação visível com o trecho.
  const labelLeaks: string[] = [];
  for (const k of fieldLabels) {
    const label = labelFromKey(k);
    if (label.length < 4) continue;
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`${escaped}[^:;\\n]{0,60}`, "g");
    const matches = sanitizedContent.match(re);
    if (matches && matches.length) labelLeaks.push(matches[0].slice(0, 60));
  }

  const finalContent = ensureDraftMarker(sanitizedContent);
  const validation = validateResponse(finalContent);
  if (invented.length) {
    validation.violations.push({
      rule: "MARCADOR_INVENTADO",
      severity: "warning",
      detail: `A IA usou ${invented.length} marcador(es) que não correspondem a dados do caso (${Array.from(new Set(invented)).slice(0, 5).join(", ")}). Foram convertidos em ____ — revise os trechos afetados.`,
    });
  }
  if (labelLeaks.length) {
    validation.violations.push({
      rule: "ROTULO_USADO_COMO_DADO",
      severity: "warning",
      detail: `Trechos citam rótulos de campo como se fossem dados (ex.: "${labelLeaks[0]}"). Substitua o rótulo pelo valor correto antes de protocolar.`,
      excerpt: labelLeaks[0],
    });
  }
  validation.valid = validation.violations.filter((v) => v.severity === "error").length === 0;

  // 7) Persistência — DONO É O USUÁRIO AUTENTICADO (corrige posse demo).
  //    O mapa marcador→valor NUNCA é persistido (LGPD): vive só em memória;
  //    a reidratação acontece ponta a ponta na mesma requisição.
  const title = body.title?.trim() || `${tpl.name} — ${new Date().toLocaleDateString("pt-BR")}`;
  const doc = await db.document.create({
    data: {
      userId: authUser.uid,
      title,
      templateSlug: tpl.slug,
      templateName: tpl.name,
      rawFacts: factsBlock,
      anonymizedFacts: pseudonymization.text,
      markers: "[]", // intencional: o mapa de PII não é persistido (tarja-1)
      generatedContent: finalContent,
      skillSlugs: JSON.stringify(skills.map((s) => s.slug)),
      status: degraded ? "draft" : "generated",
      batchId: body.batchId || null,
    },
  });

  // Cota do usuário autenticado (antes nunca era checada)
  await db.user.update({
    where: { id: authUser.uid },
    data: { minutasUsed: { increment: 1 } },
  });

  // 8) Agente fechado + auditoria + ledger
  await db.agentRun.update({
    where: { id: run.id },
    data: {
      status: degraded ? "failed" : "completed",
      tokensIn: 0,
      tokensOut: tokensTotal,
      providerSnapshot: JSON.stringify({
        provider: "zai",
        pipeline: onEvent ? "multi-stage-v3-stream" : "multi-stage-v2",
        stages: stages.map((s) => ({ stage: s.stage, ok: s.ok, tokens: s.tokens })),
      }),
    },
  });

  await logAuditEvent({
    action: "generate_minuta",
    resource: "document",
    resourceId: doc.id,
    metadata: {
      templateSlug: tpl.slug,
      templateName: tpl.name,
      skillSlugs: skills.map((s) => s.slug),
      skillsAutoRouted: skills.filter((s) => s.origin === "auto").map((s) => s.slug),
      skillsDropped: skillsDropped,
      markersCount: pseudonymization.total,
      validationViolations: validation.violations.length,
      validationErrors: validation.violations.filter((v) => v.severity === "error").length,
      tokensUsed: tokensTotal,
      anonymized: true,
      degraded,
      runId: run.id,
      batch: Boolean(body.batchId),
      mold: Boolean(moldText),
    },
    userId: authUser.uid,
  });
  await logUsageEntry({
    type: "debit",
    operation: "minuta",
    amount: -1,
    reason: `Geração de ${tpl.name}`,
    metadata: { documentId: doc.id, templateSlug: tpl.slug, tokensUsed: tokensTotal },
    userId: authUser.uid,
  });

  const documentDTO: DocumentDTO = {
    id: doc.id,
    title: doc.title,
    templateSlug: doc.templateSlug,
    templateName: doc.templateName,
    anonymizedFacts: doc.anonymizedFacts,
    generatedContent: doc.generatedContent,
    skillSlugs: safeParseArr(doc.skillSlugs),
    status: doc.status,
    batchId: doc.batchId,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };

  const result: GenerateMinutaResponse = {
    document: documentDTO,
    rawMarkers: Object.fromEntries(pseudonymization.map.reverse),
    tokensUsed: tokensTotal,
    validation: {
      valid: validation.valid,
      violations: validation.violations,
      markedAsDraft: validation.markedAsDraft,
    },
    references,
    pipeline: {
      stages,
      degraded,
      skillsAutoRouted: skills.filter((s) => s.origin === "auto").map((s) => s.slug),
      reviewCorrections,
    },
  };

  emit({ type: "stage", stage: "finalize", status: "done", note: degraded ? "degradado" : undefined });
  emit({ type: "done", result });
  return result;
}

// ── Erro com status HTTP (para as rotas mapearem) ────────────────────────────

export class PipelineError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "PipelineError";
    this.status = status;
  }
}
