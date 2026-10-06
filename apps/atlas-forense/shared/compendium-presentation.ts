export type TopicLink = { jurisprudenceId: number; topicId: number };

/** Agrupa todos os temas vinculados a cada julgado; um vínculo nunca sobrescreve o anterior. */
export function buildTopicLabels(topicLinks: TopicLink[], topicTitles: Map<number, string>) {
  const grouped = new Map<number, string[]>();
  for (const link of topicLinks) {
    const title = topicTitles.get(link.topicId);
    if (!title) continue;
    const labels = grouped.get(link.jurisprudenceId) ?? [];
    if (!labels.includes(title)) labels.push(title);
    grouped.set(link.jurisprudenceId, labels);
  }
  return new Map(Array.from(grouped.entries()).map(([jurisprudenceId, labels]) => [jurisprudenceId, labels.join(" · ")]));
}
