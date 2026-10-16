import { createHash } from "node:crypto";

export type SkillManifest = {
  slug: string; version: number; area: string; description: string; content: string;
  triggers: string; requiredSources: string; requiredEvidence: string; rules: string;
  exceptions: string; forbiddenClaims: string; allowedTools: string; outputSchema: string;
  manifestHash?: string | null;
};
const lists = ["requiredSources", "requiredEvidence", "rules", "exceptions", "forbiddenClaims", "allowedTools"] as const;
function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([k,v]) => [k, stable(v)]));
  return value;
}
function parsed(raw: string, list: boolean): unknown {
  const obj: unknown = JSON.parse(raw);
  if (list ? !Array.isArray(obj) : !obj || typeof obj !== "object" || Array.isArray(obj))
    throw new Error("invalid_legal_metadata");
  return stable(obj);
}
export function canonicalSkillManifestHash(skill: SkillManifest): string {
  const { slug, version, area, description, content } = skill;
  if (!slug || !area || !description || !content || !Number.isSafeInteger(version) || version < 1)
    throw new Error("invalid_legal_metadata");
  const data: Record<string, unknown> = {
    schema: "juridia-skill-v1", slug, version, area, description, content,
    triggers: parsed(skill.triggers, false), outputSchema: parsed(skill.outputSchema, false),
  };
  for (const key of lists) data[key] = parsed(skill[key], true);
  return createHash("sha256").update(JSON.stringify(stable(data)), "utf8").digest("hex");
}
export function isLegalSkillDigestValid(skill: SkillManifest): boolean {
  if (!skill.manifestHash || !/^[a-f0-9]{64}$/i.test(skill.manifestHash)) return false;
  try { return canonicalSkillManifestHash(skill) === skill.manifestHash; }
  catch { return false; }
}
