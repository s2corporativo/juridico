/**
 * Read-only, privacy-safe smoke test for public collectors.
 * No DB connection, no row writes, no logging of raw responses or personal data.
 */
import { collectDjenDailyCandidates, collectStjResourceCandidates } from "../server/public-knowledge-collectors";

async function run() {
  const report: Record<string, unknown> = {};
  try {
    const stj = await collectStjResourceCandidates({ maxPages: 1 });
    report.STJ = {
      status: "ok", discoveredResources: stj.discoveredResources,
      candidates: stj.candidates.length, truncated: stj.truncated,
    };
  } catch {
    report.STJ = { status: "failed", error: "STJ_CONNECTOR_UNAVAILABLE" };
  }
  try {
    const djen = await collectDjenDailyCandidates({ maxPages: 1, tribunals: ["TJMG"] });
    report.DJEN = {
      status: "ok", communicationCount: djen.total,
      candidates: djen.candidates.length, truncated: djen.truncated,
    };
  } catch {
    report.DJEN = { status: "failed", error: "DJEN_CONNECTOR_UNAVAILABLE" };
  }
  console.log(JSON.stringify({ mode: "dry_run_no_persistence", sources: report }));
  if (Object.values(report).some(x => (x as { status?: string }).status !== "ok")) process.exitCode = 2;
}
run().catch(() => {
  console.error("PUBLIC_COLLECTORS_DRY_RUN_FAILED");
  process.exitCode = 2;
});
