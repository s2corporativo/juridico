/**
 * Auditoria de integridade da curadoria — porta parcial de src/lib/ejc/auditoria.ts
 * (EJC, Zai GLM), com escopo reduzido de propósito: várias das checagens
 * originais (slug kebab-case, JSON válido em metadados, chunk órfão, FK
 * quebrada) viraram impossíveis por construção no schema do Atlas — enums
 * reais, FKs de verdade, JSON nativo — em vez de checadas em runtime como no
 * EJC (SQLite sem enum, JSON como string). O que sobra aqui é justamente o
 * que nenhum schema consegue garantir sozinho: varredura de LGPD, coerência
 * entre confiabilidade declarada e domínio da fonte, duplicidade semântica
 * e saúde do RAG.
 *
 * Fora de escopo deste MVP: a comparação com a taxonomia de 113 subáreas
 * declaradas do EJC (capítulos vazios) — exigiria portar um arquivo de
 * taxonomia inteiro que hoje não tem nenhum outro uso no Atlas.
 */

export type Severity = "OK" | "INFO" | "AVISO" | "ERRO";

export type Finding = { code: string; severity: Severity; title: string; detail: string; total: number; examples: string[] };

export type AuditSection = { name: string; status: Severity; findings: Finding[] };

const EXAMPLE_LIMIT = 8;
const WEIGHT: Record<Severity, number> = { OK: 0, INFO: 0, AVISO: 0.5, ERRO: 4 };

function finding(code: string, severity: Severity, title: string, detail: string, examples: string[], total?: number): Finding {
  return { code, severity, title, detail, total: total ?? examples.length, examples: examples.slice(0, EXAMPLE_LIMIT) };
}

function worstSeverity(findings: Finding[]): Severity {
  if (findings.some((f) => f.severity === "ERRO")) return "ERRO";
  if (findings.some((f) => f.severity === "AVISO")) return "AVISO";
  if (findings.some((f) => f.severity === "INFO")) return "INFO";
  return "OK";
}

function register(section: Finding[], f: Finding) {
  if (f.total > 0) section.push(f);
}

export const OFFICIAL_DOMAINS = [
  "planalto.gov.br", ".gov.br", ".jus.br", "camara.leg.br", "senado.leg.br", "in.gov.br", "normas.leg.br",
];
export function isOfficialDomain(url: string): boolean {
  return OFFICIAL_DOMAINS.some((d) => url.includes(d));
}

export function jaccardSimilarity(a: string, b: string): number {
  const sa = new Set(a.toLowerCase().split(/\s+/));
  const sb = new Set(b.toLowerCase().split(/\s+/));
  const inter = [...sa].filter((x) => sb.has(x)).length;
  const uni = new Set([...sa, ...sb]).size;
  return uni ? inter / uni : 0;
}

// LGPD — mesmas expressões do EJC (src/lib/ejc/auditoria.ts)
const RE_CPF = /\b\d{3}[.\s-]?\d{3}[.\s-]?\d{3}[-\s]?\d{2}\b/g;
const RE_EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const RE_TELEFONE = /(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}/g;

function isYearRange(s: string): boolean {
  return /^(?:19|20)\d{2}[-\s](?:19|20)\d{2}$/.test(s);
}
function isEightDigitDate(s: string): boolean {
  if (!/^\d{8}$/.test(s)) return false;
  const d1 = Number(s.slice(0, 2)), m1 = Number(s.slice(2, 4)), y1 = Number(s.slice(4, 8));
  if (y1 >= 1900 && y1 <= 2100 && m1 >= 1 && m1 <= 12 && d1 >= 1 && d1 <= 31) return true;
  const y2 = Number(s.slice(0, 4)), m2 = Number(s.slice(4, 6)), d2 = Number(s.slice(6, 8));
  return y2 >= 1900 && y2 <= 2100 && m2 >= 1 && m2 <= 12 && d2 >= 1 && d2 <= 31;
}
function isUrlContext(text: string, idx: number, len: number): boolean {
  const start = Math.max(0, idx - 48);
  const ctx = text.slice(start, idx + len + 24);
  return /https?:\/\/|nreg=|\.cgi|\?[\w-]+=|&\w+=/.test(ctx);
}
function isSlugContext(text: string, idx: number, len: number): boolean {
  const left = idx > 0 ? text[idx - 1] : "";
  const right = idx + len < text.length ? text[idx + len] : "";
  return /[a-z0-9-]/.test(left) && /[a-z0-9-]/.test(right);
}

export type LgpdScannable = { key: string; text: string };

/** Varredura de LGPD sobre um conjunto de textos (título+conteúdo já concatenados pelo chamador). */
export function scanLgpd(items: LgpdScannable[]): AuditSection {
  const findings: Finding[] = [];
  const cpfHits: string[] = [];
  const emailHits: string[] = [];
  const telHits: string[] = [];

  for (const item of items) {
    const text = item.text;
    for (const m of text.matchAll(RE_CPF)) {
      if (isUrlContext(text, m.index ?? 0, m[0].length) || isSlugContext(text, m.index ?? 0, m[0].length)) continue;
      cpfHits.push(`${item.key}: "${m[0]}"`);
    }
    for (const m of text.matchAll(RE_EMAIL)) {
      if (isSlugContext(text, m.index ?? 0, m[0].length)) continue;
      emailHits.push(`${item.key}: "${m[0]}"`);
    }
    for (const m of text.matchAll(RE_TELEFONE)) {
      const t = m[0].trim();
      if (isYearRange(t) || isEightDigitDate(t)) continue;
      if (isUrlContext(text, m.index ?? 0, m[0].length) || isSlugContext(text, m.index ?? 0, m[0].length)) continue;
      telHits.push(`${item.key}: "${m[0]}"`);
    }
  }
  register(findings, finding("LGP-01", "ERRO", "Padrão de CPF encontrado no conteúdo", "Dado pessoal sensível não pode residir na base geral.", cpfHits));
  register(findings, finding("LGP-02", "ERRO", "Endereço de e-mail encontrado no conteúdo", "E-mail identifica titular — revisar e anonimizar.", emailHits));
  register(findings, finding("LGP-03", "AVISO", "Padrão de telefone encontrado no conteúdo", "Falsos positivos de intervalos de anos e datas (DDMMAAAA/AAAAMMDD) já filtrados; conferir os demais.", telHits));
  return { name: "LGPD e privacidade", status: worstSeverity(findings), findings };
}

export type CurationRow = { key: string; sourceStatus: string; officialUrl: string | null };

/** Coerência entre confiabilidade declarada (sourceStatus official_confirmed) e domínio da fonte oficial. */
export function checkSourceConsistency(rows: CurationRow[]): AuditSection {
  const findings: Finding[] = [];
  const naoOficial = rows.filter((r) => r.officialUrl && !isOfficialDomain(r.officialUrl)).map((r) => `${r.key} → ${r.officialUrl}`);
  register(findings, finding("CUR-03", "AVISO", "URLs de fonte fora dos domínios oficiais", "planalto.gov.br / *.gov.br / *.jus.br / camara.leg.br / senado.leg.br etc. Avaliar rebaixar a confiabilidade ou revisar.", naoOficial));
  const confirmadoSemOficial = rows.filter((r) => r.sourceStatus === "official_confirmed" && (!r.officialUrl || !isOfficialDomain(r.officialUrl))).map((r) => r.key);
  register(findings, finding("CUR-04", "ERRO", "Fonte oficial confirmada sem URL de domínio oficial", "official_confirmed exige URL verificável em domínio oficial.", confirmadoSemOficial));
  return { name: "Regras de curadoria", status: worstSeverity(findings), findings };
}

export type DuplicateCandidate = { key: string; group: string; title: string; content: string };

/** Duplicidade semântica: título muito similar (>0,86) e conteúdo similar (>0,6) dentro do mesmo grupo. */
export function checkSemanticDuplicates(rows: DuplicateCandidate[]): AuditSection {
  const findings: Finding[] = [];
  const groups = new Map<string, DuplicateCandidate[]>();
  for (const r of rows) {
    if (!groups.has(r.group)) groups.set(r.group, []);
    groups.get(r.group)!.push(r);
  }
  const dupes: string[] = [];
  for (const group of groups.values()) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        const a = group[i], b = group[j];
        if (jaccardSimilarity(a.title, b.title) > 0.86 && jaccardSimilarity(a.content, b.content) > 0.6) {
          dupes.push(`${a.key} ↔ ${b.key}`);
        }
      }
    }
  }
  register(findings, finding("DUP-01", "ERRO", "Duplicatas semânticas (título >0,86 e conteúdo >0,6 de similaridade)", "Mesmo tipo e área, textos quase idênticos.", dupes));
  return { name: "Duplicidade semântica", status: worstSeverity(findings), findings };
}

export type RagTestSummary = { status: string; score: number | null };

export function checkRagHealth(recentTests: RagTestSummary[], chunkCount: number): AuditSection {
  const findings: Finding[] = [];
  const falhas = recentTests.filter((t) => t.status === "falha").length;
  const parciais = recentTests.filter((t) => t.status === "parcial").length;
  const sucesso = recentTests.filter((t) => t.status === "sucesso").length;
  const comScore = recentTests.filter((t) => typeof t.score === "number");
  const media = comScore.length ? comScore.reduce((acc, t) => acc + (t.score ?? 0), 0) / comScore.length : 0;
  register(findings, finding("RAG-01", falhas > 0 ? "AVISO" : "OK", `Últimas ${recentTests.length} execuções da suíte de RAG`, `sucesso=${sucesso} · parcial=${parciais} · falha=${falhas} · score médio=${media.toFixed(2)}`, [], 1));
  if (chunkCount === 0) register(findings, finding("RAG-02", "ERRO", "Base sem nenhum chunk indexado", "RAG inoperante.", ["total: 0"]));
  return { name: "Saúde do RAG", status: worstSeverity(findings), findings };
}

export type CuratedAudit = { generatedAt: string; score: number; verdict: string; sections: AuditSection[] };

export function summarizeAudit(sections: AuditSection[]): Pick<CuratedAudit, "score" | "verdict"> {
  let weight = 0;
  for (const s of sections) for (const f of s.findings) weight += WEIGHT[f.severity] * f.total;
  const score = Math.max(0, Math.min(100, Math.round(100 - weight * 2)));
  const errors = sections.reduce((acc, s) => acc + s.findings.filter((f) => f.severity === "ERRO").reduce((x, f) => x + f.total, 0), 0);
  const warnings = sections.reduce((acc, s) => acc + s.findings.filter((f) => f.severity === "AVISO").reduce((x, f) => x + f.total, 0), 0);
  const verdict =
    errors === 0 && warnings === 0
      ? "INTEGRIDADE PLENA — base íntegra em todas as verificações."
      : errors === 0
        ? `ÍNTEGRA COM RESSALVAS — ${warnings} ponto(s) de atenção, nenhum erro crítico.`
        : `REQUER INTERVENÇÃO — ${errors} ocorrência(s) crítica(s) e ${warnings} aviso(s).`;
  return { score, verdict };
}
