// minuta_pipeline.ts — Pipeline de geração de minutas em MÚLTIPLAS ETAPAS
// (arquitetura com perfis especializados).
//
// Cada etapa usa um perfil de IA especializado (system prompt próprio):
//   1. ROTEIRISTA (outline)  → plano estruturado da peça em JSON
//   2. REDATOR (draft)       → minuta completa em Markdown, guiada pelo plano
//   3. REVISOR (review)      → 2ª passada de forma, vedações e fidelidade
//
// A montagem de prompts é FUNÇÃO PURA (testável sem LLM nem banco).
// Este módulo NÃO conhece segredos e NÃO fala com a rede.

// ── Perfis de estilo (aprendizado de estilo) ───────────────

export const STYLE_DIRECTIVES: Record<string, string> = {
  formal:
    "Linguagem jurídica formal clássica: períodos completos, tratamento cerimonioso (EXCELENTÍSSIMO SENHOR DOUTOR JUIZ), vocabulário forense tradicional, sem gírias ou abreviações.",
  objetivo:
    "Estilo objetivo e direto: frases curtas, parágrafos enxutos, facts primeiro e fundamento depois, sem retórica desnecessária — mas mantendo o registro formal da peça.",
  tecnico:
    "Estilo altamente técnico: citação precisa de artigos (CPC, CC, CDC, CLT e legislação especial), terminologia processual rigorosa, estrutura analítica com subdivisões temáticas.",
};

export function styleDirective(writingStyle?: string | null): string {
  const key = (writingStyle || "formal").toLowerCase();
  return (
    STYLE_DIRECTIVES[key] ||
    STYLE_DIRECTIVES.formal
  );
}

// ── Skills (habilidades auditáveis — skills jurídicas auditáveis) ──

export interface PipelineSkill {
  slug: string;
  name: string;
  content: string;
  origin: "manual" | "auto";
  matchScore?: number;
}

export interface SkillBudget {
  maxSkills: number;      // máximo de skills combinadas
  maxCharsPerSkill: number;
  maxTotalChars: number;
}

export const DEFAULT_SKILL_BUDGET: SkillBudget = {
  maxSkills: 5,
  maxCharsPerSkill: 1200,
  maxTotalChars: 5000,
};

/**
 * Combina skills escolhidas manualmente com skills roteadas automaticamente
 * (skill_router), deduplicando por slug e respeitando o orçamento de tokens.
 * Manuais têm prioridade; automáticas entram por score.
 */
export function mergeSkills(
  manual: PipelineSkill[],
  auto: PipelineSkill[],
  budget: SkillBudget = DEFAULT_SKILL_BUDGET
): { selected: PipelineSkill[]; dropped: number } {
  const bySlug = new Map<string, PipelineSkill>();
  for (const s of manual) {
    if (!bySlug.has(s.slug)) bySlug.set(s.slug, { ...s, origin: "manual" });
  }
  for (const s of auto) {
    if (!bySlug.has(s.slug)) bySlug.set(s.slug, { ...s, origin: "auto" });
  }

  const ranked = Array.from(bySlug.values()).sort((a, b) => {
    if (a.origin !== b.origin) return a.origin === "manual" ? -1 : 1;
    return (b.matchScore ?? 0) - (a.matchScore ?? 0);
  });

  const selected: PipelineSkill[] = [];
  let totalChars = 0;
  let dropped = 0;
  for (const s of ranked) {
    if (selected.length >= budget.maxSkills) { dropped++; continue; }
    const content = chunkSkillContent(s.content, budget.maxCharsPerSkill);
    if (totalChars + content.length > budget.maxTotalChars && selected.length > 0) {
      dropped++;
      continue;
    }
    selected.push({ ...s, content });
    totalChars += content.length;
  }
  return { selected, dropped };
}

/** Trunca o conteúdo da skill preservando o começo (onde ficam as regras #) */
export function chunkSkillContent(content: string, maxChars: number): string {
  if (content.length <= maxChars) return content;
  const cut = content.slice(0, maxChars);
  const lastBreak = Math.max(cut.lastIndexOf("\n\n"), cut.lastIndexOf(". "));
  return lastBreak > maxChars * 0.6 ? cut.slice(0, lastBreak + 1) : cut;
}

// ── Marcadores (tarja-1: o LLM só vê [TIPO_N], nunca dados reais) ───────────

export function describeMarker(marker: string): string {
  const match = marker.match(/^\[([A-Z_]+)_(\d+)\]$/);
  if (!match) return "dado anonimizado";
  const type = match[1];
  const descriptions: Record<string, string> = {
    CPF: "número de CPF",
    CNPJ: "número de CNPJ",
    RG: "número de RG/identidade",
    TELEFONE: "número de telefone",
    EMAIL: "endereço de e-mail",
    CEP: "CEP",
    PIS: "número PIS/PASEP",
    PLACA: "placa de veículo",
    CONTA: "conta/agência bancária",
    VALOR: "valor monetário em R$",
    NOME: "nome de pessoa/empresa",
  };
  return descriptions[type] || "dado sensível";
}

export function buildMarkerList(
  reverse: Map<string, string>,
  provenance?: (marker: string) => string
): string {
  const markers = Array.from(reverse.keys());
  if (!markers.length) {
    return "\n\nNenhum marcador foi gerado (não há dados sensíveis detectados). Use ____ para campos a preencher.";
  }
  const list = markers
    .map((m) => {
      const extra = provenance?.(m);
      return `- ${m} → ${describeMarker(m)}${extra ? ` — ${extra}` : ""}`;
    })
    .join("\n");
  return `\n\n## Lista EXAUSTIVA de marcadores disponíveis (use APENAS estes)\n${list}\n\nNÃO crie novos marcadores. NÃO invente [LOCAL_0001], [PROFISSAO_0001] ou qualquer outro. Se faltar um dado, use ____ (sublinhado) como espaço a preencher manualmente.`;
}

// ── Inteiro teor dos fatos ──────────────────────────────────────────────────

export function buildFactsBlock(fields: Record<string, string>): string {
  return Object.entries(fields)
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `• ${labelFromKey(k)}: ${v}`)
    .join("\n");
}

export function labelFromKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

// ── System prompts (um perfil por etapa) ────────────────────────────────────

const BASE_PERSONA =
  "Você é a JuridIA, uma IA jurídica brasileira especialista em redação de minutas e peças processuais. Sua saída é sempre em português do Brasil, em linguagem jurídica formal, com conformidade ao CPC, CC, CDC, legislação especial e Resolução CNJ 615/2025. Você nunca escreve dados sensíveis inventados: usa apenas os marcadores [TIPO_N] fornecidos. Você nunca promete resultado (vedação art. 2º §1º do EOAB) e nunca cita jurisprudência sem indicar que precisa de verificação.";

export function buildSystemPrompt(stage: "outline" | "draft" | "review"): string {
  if (stage === "outline") {
    return `${BASE_PERSONA}\n\nPERFIL ATIVO: ESTRATEGISTA PROCESSUAL. Você planeja a estrutura da peça antes da redação: identifica teoria do caso, teses, fundamentos e ordem dos pedidos. Responde APENAS com JSON válido, sem comentários.`;
  }
  if (stage === "review") {
    return `${BASE_PERSONA}\n\nPERFIL ATIVO: REVISOR SÊNIOR. Você revisa a minuta de um redator júnior: corrige coesão, completude, fidelidade aos fatos, uso correto dos marcadores e vedações deontológicas. Você NÃO reescreve do zero — preserva o que está correto. Responde APENAS com JSON válido, sem comentários.`;
  }
  return `${BASE_PERSONA}\n\nPERFIL ATIVO: REDATOR JURÍDICO SÊNIOR. Você redige a peça completa, seguindo o plano aprovado e o estilo solicitado.`;
}

// ── Etapa 1: ROTEIRO (JSON estruturado) ─────────────────────────────────────

export interface OutlineInput {
  templateName: string;
  templateDirectives: string;
  anonymizedFacts: string;
  issues: { key: string; title: string; area: string }[];
  styleDirective: string;
}

export function buildOutlineUserPrompt(inp: OutlineInput): string {
  return `Planeje a estrutura de uma peça jurídica brasileira.

## Tipo de peça
${inp.templateName}

## Diretrizes do template
${inp.templateDirectives}

## Fatos do caso (dados pseudonimizados com marcadores)
${inp.anonymizedFacts || "(sem fatos informados)"}

## Questões jurídicas detectadas
${inp.issues.length ? inp.issues.map((i) => `- [${i.area}] ${i.title}`).join("\n") : "(nenhuma detectada)"}

## Estilo de redação desejado
${inp.styleDirective}

Responda EXCLUSIVAMENTE com JSON válido no formato:
{
  "teoriaDoCaso": "síntese em 1-2 frases",
  "teses": ["tese jurídica principal", "tese acessória..."],
  "secoes": [
    { "titulo": "I. Endereçamento", "objetivo": "o que esta seção faz" }
  ],
  "pedidos": ["pedido 1", "pedido 2"],
  "riscos": ["ponto de atenção 1"]
}`;
}

/** Extração robusta de JSON mesmo com cercas de código ou texto ao redor */
export function extractJson<T = unknown>(raw: string): T | null {
  if (!raw) return null;
  let text = raw.trim();
  // Remove cercas ```json ... ```
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  // Tenta parse direto
  try {
    return JSON.parse(text) as T;
  } catch { /* continua */ }
  // Tenta o maior bloco {...} balanceado
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    else if (text[i] === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(text.slice(start, i + 1)) as T;
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

export interface CaseOutline {
  teoriaDoCaso?: string;
  teses?: string[];
  secoes?: { titulo: string; objetivo: string }[];
  pedidos?: string[];
  riscos?: string[];
}

export function outlineToText(outline: CaseOutline): string {
  const parts: string[] = [];
  if (outline.teoriaDoCaso) parts.push(`Teoria do caso: ${outline.teoriaDoCaso}`);
  if (outline.teses?.length) parts.push(`Teses:\n${outline.teses.map((t) => `- ${t}`).join("\n")}`);
  if (outline.secoes?.length) {
    parts.push(`Estrutura de seções:\n${outline.secoes.map((s) => `- ${s.titulo} — ${s.objetivo}`).join("\n")}`);
  }
  if (outline.pedidos?.length) parts.push(`Pedidos:\n${outline.pedidos.map((p) => `- ${p}`).join("\n")}`);
  if (outline.riscos?.length) parts.push(`Riscos a mitigar:\n${outline.riscos.map((r) => `- ${r}`).join("\n")}`);
  return parts.join("\n\n") || "(plano indisponível — redija com a estrutura clássica)";
}

// ── Etapa 2: REDAÇÃO ────────────────────────────────────────────────────────

export interface ReferencesBlock {
  diploma: string;
  numero: string;
  tribunal: string | null;
  urlOficial: string | null;
  textoTrecho: string;
  score: number;
}

export function buildReferencesBlock(refs: ReferencesBlock[]): string {
  if (!refs.length) {
    return "\n\n## Base normativa curada\n(nenhuma fonte correlata encontrada — fundamente apenas em dispositivos legais que você tem certeza, sem inventar números)";
  }
  const items = refs
    .map(
      (r, i) =>
        `[${i + 1}] ${r.diploma}${r.numero ? ` ${r.numero}` : ""}${r.tribunal ? ` — ${r.tribunal}` : ""} (vigente)\n    Trecho: ${r.textoTrecho.slice(0, 300)}${r.urlOficial ? `\n    Fonte oficial: ${r.urlOficial}` : ""}`
    )
    .join("\n\n");
  return `\n\n## Base normativa curada (fontes VERIFICADAS — prefera estas e cite como [1], [2]...)\n${items}\n\nREGRAS: Cite apenas o que está acima ou dispositivos que você tem CERTEZA absoluta do número e teor. NUNCA invente número de lei, artigo ou processo. Se citar jurisprudência, marque "(verificar)" logo após a citação.`;
}

export interface DraftInput {
  templateName: string;
  templateDirectives: string;
  anonymizedFacts: string;
  skillsBlock: string;
  markerList: string;
  referencesBlock: string;
  outlineText: string;
  brainContext: string;
  styleDirective: string;
  /** Minuta-molde aprovada pelo advogado (geração em lote — geração em lote) */
  moldText?: string;
}

export function buildDraftUserPrompt(inp: DraftInput): string {
  const brain = inp.brainContext
    ? `\n\n## Análise prévia do caso (Cérebro Jurídico — use como contexto estratégico)\n${inp.brainContext}`
    : "";
  const outline = `\n\n## Plano estrutural aprovado (siga esta ordem de seções)\n${inp.outlineText}`;
  const mold = inp.moldText
    ? `\n\n## Minuta-molde aprovada pelo advogado (geração em lote)\nSiga DE PERTO a estrutura, a ordem das seções, o nível de detalhe e o tom desta minuta-molde,\nadaptando os dados ao caso ATUAL. Os marcadores da molde pertencem a OUTRO caso — use apenas\nos marcadores fornecidos nos dados deste caso; onde a molde tiver dados próprios, use os\nequivalentes do caso atual ou ____ (sublinhado).\n\n--- INÍCIO DA MOLDE ---\n${inp.moldText}\n--- FIM DA MOLDE ---`
    : "";
  return `Redija a minuta completa em Markdown, pronta para revisão humana.

## Tipo de minuta
${inp.templateName}

## Diretrizes do template
${inp.templateDirectives}

## Estilo de redação desejado
${inp.styleDirective}

## Dados do caso (pseudonimizados — só marcadores)
${inp.anonymizedFacts || "(sem fatos informados — redija com ____ nos campos essenciais)"}${brain}${outline}${mold}${inp.skillsBlock}${inp.referencesBlock}${inp.markerList}

## Instruções de redação
- Português jurídico brasileiro, completo e formal, em Markdown (##, listas, ênfase).
- Siga o plano de seções; se ele estiver vazio, use a estrutura clássica (Endereçamento, Qualificação, Fatos, Fundamentos, Pedidos, Valor da Causa, Fecho).
- Preserve TODOS os marcadores exatamente como fornecidos, reutilizando-os quando necessário.
- ATENÇÃO ao ler os dados: cada linha é "rótulo do campo: valor". O rótulo apenas DESCREVE o campo — nunca é um dado. NÃO use o rótulo como nome de parte ou fato.
- Exemplo CERTO de qualificação: "[NOME_1], brasileiro(a), portador(a) do CPF [CPF_1]..."
- Exemplo ERRADO (não faça): "Nome Autor, brasileiro(a)..." ou "Cpf Autor portador..." — esses são rótulos, não pessoas.
- NUNCA crie marcadores novos. Falta de dado = ____ (sublinhado).
- Para datas: ____ de ____________ de ______.
- NÃO inclua dados sensíveis reais: você só recebeu marcadores.
- Feche com bloco de assinatura com placeholders: [LOCAL], [DATA], nome do advogado como ____ e OAB/____.`;
}

// ── Etapa 3: REVISÃO (2ª passada) ───────────────────────────────────────────

export interface ReviewInput {
  templateName: string;
  draft: string;
  styleDirective: string;
  deterministicFindings: { rule: string; severity: string; detail: string }[];
}

export function buildReviewUserPrompt(inp: ReviewInput): string {
  return `Revise a minuta abaixo (${inp.templateName}).

## Estilo exigido
${inp.styleDirective}

## Achados do validador determinístico (corrija todos os de severity "error")
${inp.deterministicFindings.length ? inp.deterministicFindings.map((f) => `- [${f.severity}] ${f.rule}: ${f.detail}`).join("\n") : "(nenhum)"}

## Minuta a revisar
${inp.draft}

Responda EXCLUSIVAMENTE com JSON válido:
{
  "corrigir": [ { "trecho": "trecho problemático (literal)", "problema": "o que está errado", "sugestao": "substituição correta" } ],
  "resalvas": ["observação de conformidade 1"]
}
NÃO reescreva a minuta inteira — aponte apenas correções pontuais de trecho. Se não houver nada a corrigir, retorne {"corrigir": [], "resalvas": []}.`;
}

export interface ReviewFinding {
  trecho: string;
  problema: string;
  sugestao: string;
}

/** Aplica correções literais do revisor (só aplica match exato, seguro) */
export function applyReviewCorrections(
  draft: string,
  corrections: ReviewFinding[]
): { text: string; applied: number; skipped: number } {
  let text = draft;
  let applied = 0;
  let skipped = 0;
  for (const c of corrections) {
    if (!c?.trecho || !c?.sugestao || typeof c.trecho !== "string" || typeof c.sugestao !== "string") {
      skipped++;
      continue;
    }
    // segurança: correção não pode introduzir dado que pareça PII literal nova
    if (/\[\s*[A-ZÀ-Ú]/.test(c.sugestao.replace(/\[[A-Z_]+_\d+\]/g, ""))) {
      skipped++;
      continue;
    }
    if (text.includes(c.trecho)) {
      text = text.replace(c.trecho, c.sugestao);
      applied++;
    } else {
      skipped++;
    }
  }
  return { text, applied, skipped };
}

// ── Esqueleto offline (mantido, mas agora SINALIZADO na resposta) ───────────

export function fallbackDraft(templateName: string, anonFacts: string, skillNames: string[]): string {
  const skillList = skillNames.length
    ? skillNames.map((s) => `- ${s}`).join("\n")
    : "(nenhuma habilidade selecionada)";
  return `## ${templateName}

> ⚠ Modo offline — a geração via IA falhou. Abaixo um esboço estruturado com os dados pseudonimizados. Refaça a geração quando a IA estiver disponível.

### I. Endereçamento
EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ____ VARA CÍVEL DA COMARCA DE ____

### II. Qualificação
[NOME_1], já devidamente qualificado, vem respeitosamente à presença de Vossa Excelência propor a presente ação em face de [NOME_2], também qualificado, pelos fatos e fundamentos a seguir.

### III. Fatos
${anonFacts || "(a preencher)"}

### IV. Do Direito
Fundamentação jurídica a complementar pelo advogado responsável.

### V. Habilidades aplicadas
${skillList}

### VI. Pedidos
1. ____ (pedido principal)
2. Condenação em honorários advocatícios e custas
3. Produção de prova documental superveniente

### VII. Valor da causa
Dá-se à causa o valor de R$ ____.

Termos em que pede deferimento.

____, ____ de ____________ de ______.

____ — OAB/____ ____
`;
}
