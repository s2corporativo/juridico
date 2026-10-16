import { createHash } from "node:crypto";

export type VersionedSkill = {
  slug: string;
  version: number;
  status: string;
  content: string;
  contentHash: string;
  approvedBy: string | null;
  approvedAt: Date | null;
  triggers?: string;
};

const AUTOMATED_APPROVERS = new Set([
  "migration", "importacao-lexvalida", "curador-juridico",
  "seed", "seeder", "system", "auto", "test",
]);

export function inspectApprovedSkill(skill: VersionedSkill): string[] {
  const issues: string[] = [];
  if (skill.status !== "approved") issues.push("not_approved");
  if (!skill.approvedAt || !skill.approvedBy?.trim()) issues.push("approval_missing");
  if (AUTOMATED_APPROVERS.has((skill.approvedBy ?? "").trim().toLowerCase())) {
    issues.push("automated_or_unverified_approval");
  }
  if (typeof skill.content !== "string" || skill.content.trim().length < 20) issues.push("empty_content");
  if (createHash("sha256").update(skill.content || "", "utf8").digest("hex") !== skill.contentHash) issues.push("hash_mismatch");
  return issues;
}

export function isEligibleSkillVersion(skill: VersionedSkill): boolean {
  return inspectApprovedSkill(skill).length === 0;
}

/** Fail-closed: only a short bounded list of plain text keywords is executable. */
export function parseSkillKeywords(raw: string): string[] {
  try {
    const obj: unknown = JSON.parse(raw);
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return [];
    const value = obj as Record<string, unknown>;
    const list = Array.isArray(value.keywords) ? value.keywords : value.triggers;
    if (!Array.isArray(list)) return [];
    return list
      .filter((x): x is string => typeof x === "string" && x.trim().length >= 3 && x.length <= 90)
      .map((x) => x.trim().toLowerCase()).slice(0, 64);
  } catch {
    return [];
  }
}

/**
 * Resolve uma única versão aprovada por slug, sem recuo silencioso:
 * versão aprovada mais recente inválida bloqueia o slug, mesmo se uma
 * versão aprovada anterior ainda possuir hash correto.
 * Rascunhos/revisões posteriores não retiram automaticamente a última
 * versão publicada válida; revogação precisa de procedimento próprio.
 */
export function selectLatestApprovedSkills<T extends VersionedSkill>(
  versions: readonly T[],
): T[] {
  const sorted = versions.filter(v => v.status === "approved").sort((a, b) =>
    a.slug.localeCompare(b.slug) || b.version - a.version
  );
  const seen = new Set<string>();
  const usable: T[] = [];
  for (const version of sorted) {
    if (seen.has(version.slug)) continue;
    seen.add(version.slug);
    if (isEligibleSkillVersion(version)) usable.push(version);
  }
  return usable;
}
