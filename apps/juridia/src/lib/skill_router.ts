// skill_router.ts — Skill Router: dado fatos do caso, identifica skills relevantes
//
// Fluxo: Caso → Fatos → Questões jurídicas → Skills necessárias → Fontes → Pesquisa → Estratégia → Peça

import { db } from "@/lib/db";
import { identifyIssues } from "@/lib/legal_brain";
import { isEligibleSkillVersion, parseSkillKeywords } from "@/lib/skill-governance";
import { matchingLegalTriggers, triggerEvidenceScore } from "@/lib/skill-matching";

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
  const bySlug = new Map<string, typeof allSkills[0]>();
  const blockedSlugs = new Set<string>();
  for (const s of allSkills) {
    // Uma versão approved inválida bloqueia o slug: jamais recuar silenciosamente.
    if (bySlug.has(s.slug) || blockedSlugs.has(s.slug)) continue;
    if (!isEligibleSkillVersion(s)) { blockedSlugs.add(s.slug); continue; }
    bySlug.set(s.slug, s);
  }

  // 3. Matching: compara gatilhos contra o texto
  const matches: SkillMatch[] = [];

  for (const skill of bySlug.values()) {
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
