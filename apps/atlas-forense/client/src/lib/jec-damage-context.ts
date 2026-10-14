/**
 * Apenas coocorrência de ASSUNTOS CNJ na amostra pública dos JECs.
 * NÃO identifica fato gerador, procedência, nexo causal nem valor da condenação.
 */
export const DAMAGE_SUBJECTS = [
  "Indenização por dano moral",
  "Indenização por dano material",
] as const;

const PROCEDURAL_OR_GENERIC = new Set([
  "Obrigação de fazer / não fazer",
  "Tutela de Urgência",
  "Liminar",
  "Antecipação de Tutela",
]);

type TaggedProcess = { assuntos: string[] };
export type DamageContext = {
  damage: string;
  total: number;
  semAssuntoContextual: number;
  assuntosCorrelatos: { assunto: string; processos: number }[];
};

/** Registra assuntos adjacentes, jamais afirma que causaram o dano. */
export function contextualSubjects(assuntos: string[]): string[] {
  return Array.from(new Set(assuntos.filter((subject) =>
    !DAMAGE_SUBJECTS.includes(subject as (typeof DAMAGE_SUBJECTS)[number]) &&
    !PROCEDURAL_OR_GENERIC.has(subject) &&
    subject.trim().length > 0,
  )));
}

export function summarizeDamageContexts(rows: TaggedProcess[]): DamageContext[] {
  return DAMAGE_SUBJECTS.map((damage) => {
    const selected = rows.filter((row) => row.assuntos.includes(damage));
    const contextCounts = new Map<string, number>();
    let semAssuntoContextual = 0;
    for (const row of selected) {
      const contexts = contextualSubjects(row.assuntos);
      if (contexts.length === 0) semAssuntoContextual++;
      for (const subject of contexts) contextCounts.set(subject, (contextCounts.get(subject) || 0) + 1);
    }
    return {
      damage,
      total: selected.length,
      semAssuntoContextual,
      assuntosCorrelatos: Array.from(contextCounts.entries())
        .map(([assunto, processos]) => ({ assunto, processos }))
        .sort((a, b) => b.processos - a.processos || a.assunto.localeCompare(b.assunto, "pt-BR")),
    };
  });
}
