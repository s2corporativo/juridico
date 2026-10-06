import { describe, expect, it } from "vitest";
import { describeDocumentFreshness, summarizeDocumentFreshness } from "@shared/document-freshness";

describe("situação documental", () => {
  const now = new Date("2026-08-28T12:00:00.000Z");

  it("distingue verificação recente, revisão necessária e ausência de registro", () => {
    expect(describeDocumentFreshness("2026-06-01T12:00:00.000Z", now).status).toBe("confirmed_recent");
    expect(describeDocumentFreshness("2026-05-29T12:00:00.000Z", now).status).toBe("review_due");
    expect(describeDocumentFreshness(null, now).status).toBe("not_verified");
  });

  it("resume situações sem deduzir vigência jurídica", () => {
    const summary = summarizeDocumentFreshness([
      describeDocumentFreshness("2026-08-20T12:00:00.000Z", now),
      describeDocumentFreshness("2026-01-01T12:00:00.000Z", now),
      describeDocumentFreshness(undefined, now),
    ]);
    expect(summary).toEqual({ total: 3, confirmedRecent: 1, reviewDue: 1, notVerified: 1 });
  });
});
