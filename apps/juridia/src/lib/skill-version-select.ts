import type { Prisma } from "@prisma/client";

/** Consulta canônica: integridade exige TODOS os campos cobertos pelo manifesto. */
export const SKILL_VERSION_INTEGRITY_SELECT = {
  id:true, slug:true, version:true, area:true, description:true, content:true,
  triggers:true, requiredSources:true, requiredEvidence:true, rules:true,
  exceptions:true, forbiddenClaims:true, allowedTools:true, outputSchema:true,
  status:true, approvedAt:true, approvedBy:true, contentHash:true,
  manifestHash:true, authorUserId:true, reviewerUserId:true,
} as const satisfies Prisma.SkillVersionSelect;
