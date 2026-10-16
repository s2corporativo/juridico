// skill_router.ts — Skill Router: dado fatos do caso, identifica skills relevantes
//
// Fluxo: Caso → Fatos → Questões jurídicas → Skills necessárias → Fontes → Pesquisa → Estratégia → Peça

import { db } from "@/lib/db";
import { identifyIssues } from "@/lib/legal_brain";
import { selectLatestApprovedSkills, parseSkillKeywords } from "@/lib/skill-governance";
import { matchingLegalTriggers, triggerEvidenceScore } from "@/lib/skill-matching";
import { retrieveLegalSkills } from "@/lib/legal-intelligence-core";

export interface SkillMatch {
  slug: string;
  name: string;
  area: string;
  version: number;
  matchScore: number; // 0-1
  matchedTriggers: string[];
  content: string; // texto legível da skill
  skillVersionId: string;
  contentHash: string;
}

export interface SkillRouterResult {
  matches: SkillMatch[];
  issues: { key: string; title: string; area: string }[];
  area: string;
}

/**
 * Dado o texto dos fatos do caso, identifica quais skills são relevantes.
 * Processo:
 * 1. Issue Engine determinístico identifica questões jurídicas por keywords
 * 2. Carrega todas as SkillVersions approved
 * 3. Compara gatilhos das skills contra o texto dos fatos
 * 4. Ranqueia por score de matching
 */
export async function routeSkills(facts: string): Promise<SkillRouterResult> {
  // 1. Issue Engine determinístico
  const issues = identifyIssues(facts, null);

  // 2. Carrega skills approved (apenas a versão mais recente de cada slug)
  const allSkills = await db.skillVersion.findMany({
    where: { status: "approved" },
    orderBy: [{ slug: "asc" }, { version: "desc" }],
  });

  // Deduplica: pega apenas a versão mais recente de cada slug
  const usableVersions = selectLatestApprovedSkills(allSkills);

  // v2 pode ser ensaiado sem substituir a seleção existente (shadow).
  // Para liberar modo ativo usar variável somente do servidor após homologação.
  const mode = process.env.JURIDIA_SKILL_INTELLIGENCE_MODE;
  if (mode === "active" || mode === "shadow") {
    const advanced = retrieveLegalSkills(facts, usableVersions, 10);
    if (mode === "active") {
      const selected = new Map(usableVersions.map((v) => [v.slug, v]));
      return {
        matches: advanced.suggestions.flatMap((suggestion) => {
          const v = selected.get(suggestion.slug);
          return v ? [{
            slug: v.slug, name: v.description, area: v.area, version: v.version,
            matchScore: suggestion.score, matchedTriggers: suggestion.evidence,
            content: v.content, skillVersionId: v.id, contentHash: v.contentHash,
          }] : [];
        }),
        issues: issues.map((i) => ({ key: i.key, title: i.title, area: i.area })),
        area: advanced.intent.area ?? "nao_identificada",
      };
    }
    // Shadow: nenhum fato, nome, resultado do caso ou fonte privada é registrado.
    void advanced;
  }
  // 3. Matching legado para fallback seguro e modo shadow.
  const matches: SkillMatch[] = [];

  for (const skill of usableVersions) {
    const triggers = parseSkillKeywords(skill.triggers);

    const matchedTriggers = matchingLegalTriggers(facts, triggers);
    // Área não pode criar candidato sem evidência textual de matéria.
    if (matchedTriggers.length === 0) continue;
    const issueBonus = issues.some((i) => i.area === skill.area) ? 0.2 : 0;
    const matchScore = Math.min(1, triggerEvidenceScore(matchedTriggers.length) + issueBonus);

    if (matchScore > 0) {
      matches.push({
        slug: skill.slug,
        name: skill.description,
        area: skill.area,
        version: skill.version,
        matchScore,
        matchedTriggers,
        content: skill.content,
        skillVersionId: skill.id,
        contentHash: skill.contentHash,
      });
    }
  }

  // 4. Ranqueia por score (maior primeiro)
  matches.sort((a, b) => b.matchScore - a.matchScore);

  // 5. Determina a área predominante
  const areaCount: Record<string, number> = {};
  for (const m of matches) {
    areaCount[m.area] = (areaCount[m.area] || 0) + m.matchScore;
  }
  const area = Object.entries(areaCount).sort(([, a], [, b]) => b - a)[0]?.[0] || "nao_identificada";

  return {
    matches: matches.slice(0, 10), // top 10
    issues: issues.map((i) => ({ key: i.key, title: i.title, area: i.area })),
    area,
  };
}
