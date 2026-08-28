export const DOCUMENT_REVIEW_WINDOW_DAYS = 90;

export type DocumentFreshnessStatus = "confirmed_recent" | "review_due" | "not_verified";

export type DocumentFreshness = {
  status: DocumentFreshnessStatus;
  label: string;
  daysSinceVerification: number | null;
  checkedAt: Date | null;
};

export function describeDocumentFreshness(
  checkedAt: Date | string | null | undefined,
  now = new Date(),
): DocumentFreshness {
  if (!checkedAt) {
    return { status: "not_verified", label: "Sem verificação registrada", daysSinceVerification: null, checkedAt: null };
  }

  const parsed = new Date(checkedAt);
  if (Number.isNaN(parsed.getTime())) {
    return { status: "not_verified", label: "Sem verificação registrada", daysSinceVerification: null, checkedAt: null };
  }

  const elapsed = Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / 86_400_000));
  if (elapsed <= DOCUMENT_REVIEW_WINDOW_DAYS) {
    return { status: "confirmed_recent", label: `Verificação documental há ${elapsed}d`, daysSinceVerification: elapsed, checkedAt: parsed };
  }
  return { status: "review_due", label: `Revisão documental necessária · ${elapsed}d`, daysSinceVerification: elapsed, checkedAt: parsed };
}

export function summarizeDocumentFreshness(items: DocumentFreshness[]) {
  return items.reduce(
    (summary, item) => {
      summary.total += 1;
      if (item.status === "confirmed_recent") summary.confirmedRecent += 1;
      if (item.status === "review_due") summary.reviewDue += 1;
      if (item.status === "not_verified") summary.notVerified += 1;
      return summary;
    },
    { total: 0, confirmedRecent: 0, reviewDue: 0, notVerified: 0 },
  );
}
