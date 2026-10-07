// skill_router.ts — Skill Router: dado fatos do caso, identifica skills relevantes
//
// Fluxo: Caso → Fatos → Questões jurídicas → Skills necessárias → Fontes → Pesquisa → Estratégia → Peça

import { db } from "@/lib/db";
import { identifyIssues } from "@/lib/legal_brain";

export interface SkillMatch {
  slug: string;
  name: string;
  area: string;
  version: number;
  matchScore: number; // 0-1
  matchedTriggers: string[];
  content: string; // texto legível da skill
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
    select: { id: true, slug: true, version: true, area: true, description: true, triggers: true },
  });

  // Deduplica: pega apenas a versão mais recente de cada slug
  const bySlug = new Map<string, (typeof allSkills)[number]>();
  for (const s of allSkills) {
    if (!bySlug.has(s.slug) || s.version > bySlug.get(s.slug)!.version) {
      bySlug.set(s.slug, s);
    }
  }

  // 3. Matching: compara gatilhos contra o texto
  const lowerFacts = facts.toLowerCase();
  const matches: SkillMatch[] = [];

  for (const skill of bySlug.values()) {
    let triggers: string[] = [];
    try {
      const parsed = JSON.parse(skill.triggers);
      triggers = parsed.keywords || parsed.triggers || [];
    } catch {
      triggers = [];
    }

    const matchedTriggers: string[] = [];
    for (const trigger of triggers) {
      if (lowerFacts.includes(trigger.toLowerCase())) {
        matchedTriggers.push(trigger);
      }
    }

    // Matching em duas camadas: gatilho textual + aderência às questões detectadas.
    // Não basta pertencer à mesma área: com ~2.000 skills isso faria centenas
    // entrarem por um bônus genérico.
    const triggerScore = triggers.length > 0 ? matchedTriggers.length / triggers.length : 0;
    const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/g, " ");
    const descTokens = new Set(normalize(skill.description).split(/\s+/).filter((x) => x.length > 3));
    const issueTokens = new Set(normalize(issues.map((i) => i.title).join(" ")).split(/\s+/).filter((x) => x.length > 3));
    let overlap = 0;
    for (const t of descTokens) if (issueTokens.has(t)) overlap++;
    const descriptionScore = Math.min(0.45, overlap * 0.12);
    const issueAreaBonus = issues.some((i) => i.area === skill.area) && (triggerScore > 0 || descriptionScore > 0) ? 0.15 : 0;
    const matchScore = Math.min(1, triggerScore * 0.75 + descriptionScore + issueAreaBonus);

    if (matchedTriggers.length > 0 || descriptionScore > 0) {
      matches.push({
        slug: skill.slug,
        name: skill.description,
        area: skill.area,
        version: skill.version,
        matchScore,
        matchedTriggers,
        content: "",
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
  const area = Object.entries(areaCount).sort(([, a], [, b]) => b - a)[0]?.[0] || "civil";

  const selectedMeta = matches.slice(0, 10);
  const full = selectedMeta.length
    ? await db.skillVersion.findMany({ where: { slug: { in: selectedMeta.map((m) => m.slug) }, status: "approved" }, orderBy: { version: "desc" } })
    : [];
  const contentBySlug = new Map<string, string>();
  for (const s of full) if (!contentBySlug.has(s.slug)) contentBySlug.set(s.slug, s.content);
  const selected = selectedMeta.map((m) => ({ ...m, content: contentBySlug.get(m.slug) || "" }));

  return {
    matches: selected, // top 10
    issues: issues.map((i) => ({ key: i.key, title: i.title, area: i.area })),
    area,
  };
}
