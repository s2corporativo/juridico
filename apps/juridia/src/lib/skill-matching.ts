// Correspondência jurídica determinística, sem banco ou LLM.
export function normalizeLegalText(text: string): string {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}
export function matchingLegalTriggers(facts: string, triggers: readonly string[]): string[] {
  const haystack = ` ${normalizeLegalText(facts)} `;
  return triggers.filter((trigger) => {
    const needle = normalizeLegalText(trigger);
    return needle.length > 0 && haystack.includes(` ${needle} `);
  });
}
/** Score é força relativa dos gatilhos, não probabilidade calibrada. */
export function triggerEvidenceScore(hits: number): number {
  return Math.min(1, Math.max(0, hits) * 0.25);
}
