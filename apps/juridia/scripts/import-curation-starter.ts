/**
 * Importação idempotente do pacote de HABILIDADES EM RASCUNHO.
 * Nunca confunde seed com aprovação humana nem ativa orientação no roteador.
 * Uso: DATABASE_URL=file:/... bun run scripts/import-curation-starter.ts
 */
import { createHash } from "node:crypto";
import { db } from "../src/lib/db";
import { CURATION_STARTER_PACK } from "../src/lib/curation-starter-pack";
import { assessSkillMaturity } from "../src/lib/skill-maturation";

const expected = process.env.JURIDIA_CURATION_IMPORT === "draft_only";
if (!expected) {
  console.error("Importação desabilitada: defina JURIDIA_CURATION_IMPORT=draft_only.");
  process.exit(2);
}
async function main() {
  let created = 0, unchanged = 0, collisions = 0;
  const outcome: Array<{ slug: string; maturity: number; status: string }> = [];
  for (const draft of CURATION_STARTER_PACK) {
    const existing = await db.skillVersion.findFirst({
      where: { slug: draft.slug }, orderBy: { version: "desc" },
    });
    if (existing) {
      unchanged++;
      continue;
    }
    const content = [
      "PROTOCOLO DE ANÁLISE SUPERVISIONADA — NÃO PUBLICADO.",
      "Tema: " + draft.title + ".",
      "Investigar obrigatoriamente: " + draft.focus,
      "Separar fatos comprovados, alegações, dúvidas e hipóteses.",
      "Formar uma cronologia com fatos, documentos e fonte de cada informação.",
      "Conferir competência, rito, legitimidade, prazos, requisitos e exceções aplicáveis.",
      "Pesquisar normas e precedentes nas fontes oficiais atuais; registrar URL, data, órgão e conteúdo verificável.",
      "Considerar teses contrárias, riscos, ônus probatório e alternativas práticas.",
      "Não inventar leis, precedentes, datas, número de processo ou requisitos.",
      "Não prometer resultado nem classificar conteúdo como aprovado antes de dupla revisão humana.",
      "Resultado esperado: resumo dos fatos, matriz de provas, fundamentos a conferir, riscos e questões pendentes.",
    ].join("\n");
    const data = {
      slug: draft.slug, version: 1, area: draft.area, description: draft.title,
      content, triggers: JSON.stringify({ keywords: draft.keywords }),
      requiredSources: "[]",
      requiredEvidence: JSON.stringify(["Documentos e provas pertinentes à situação concreta","Cronologia verificável"]),
      rules: JSON.stringify(["Exigir base legal e documento primário verificados antes da conclusão"]),
      exceptions: JSON.stringify(["Investigar exceções e hipóteses impeditivas específicas"]),
      forbiddenClaims: JSON.stringify(["Promessa de resultado","Citação normativa ou jurisprudencial inventada"]),
      allowedTools: "[]", outputSchema: "{}",
      status: "draft",
      contentHash: createHash("sha256").update(content, "utf8").digest("hex"),
      approvedBy: null, approvedAt: null, authorUserId: null,
      reviewerUserId: null, manifestHash: null,
    };
    try {
      await db.skillVersion.create({ data });
      created++;
      const assessment = assessSkillMaturity({
        id: draft.slug, slug: draft.slug, version: 1, area: draft.area,
        description: draft.title, content,
        triggers: data.triggers, requiredSources: data.requiredSources,
        forbiddenClaims: data.forbiddenClaims,
      });
      outcome.push({ slug: draft.slug, maturity: assessment.maturity, status: "draft" });
    } catch (error) {
      // Nunca sobrescrever uma versão existente.
      collisions++;
      console.error("Falha ao incluir habilidade:", draft.slug, error instanceof Error ? error.message : "unknown");
    }
  }
  console.log(JSON.stringify({
    packageName: "juridia-curation-starter-v1", total: CURATION_STARTER_PACK.length,
    created, unchanged, collisions, explicitlyUnapproved: true,
    requireOfficialSourceValidation: true,
    initialMaturity: outcome,
  }, null, 2));
  if (collisions) process.exitCode = 1;
}
try { await main(); } finally { await db.$disconnect(); }
