/**
 * Read-only verification of every original declared retained in EvidenceRef.
 * Requires DATABASE_URL and both JURIDIA_PRIVATE_UPLOAD_* variables.
 * Usage: bun scripts/audit-private-originals.ts
 *
 * Does not print file names, client IDs, hashes, paths, private text or keys.
 */
import { db } from "../src/lib/db";
import { readPrivateOriginal } from "../src/lib/private-originals";

async function main() {
  if (!process.env.JURIDIA_PRIVATE_UPLOAD_ROOT ||
      !/^[a-fA-F0-9]{64}$/.test(process.env.JURIDIA_PRIVATE_UPLOAD_KEY ?? "")) {
    console.log(JSON.stringify({ status: "not_configured", releaseBlocked: true }));
    process.exitCode = 2;
    return;
  }
  let cursor: { id: string } | undefined;
  let evidenceRows = 0;
  let declared = 0;
  let verified = 0;
  let failed = 0;
  let invalidMetadata = 0;
  const unique = new Set<string>();
  while (true) {
    const batch = await db.evidenceRef.findMany({
      select: { id: true, caseId: true, documentHash: true, metadata: true },
      orderBy: { id: "asc" }, take: 250,
      ...(cursor ? { skip: 1, cursor } : {}),
    });
    if (!batch.length) break;
    cursor = { id: batch[batch.length - 1].id };
    evidenceRows += batch.length;
    for (const ref of batch) {
      let metadata: { originalRetained?: unknown };
      try { metadata = JSON.parse(ref.metadata); }
      catch { invalidMetadata++; continue; }
      if (metadata.originalRetained !== true) continue;
      declared++;
      if (!ref.documentHash) { failed++; continue; }
      const key = ref.caseId + "/" + ref.documentHash;
      if (unique.has(key)) continue;
      unique.add(key);
      try {
        await readPrivateOriginal(ref.caseId, ref.documentHash);
        verified++;
      } catch { failed++; }
    }
  }
  const outcome = {
    status: failed === 0 && invalidMetadata === 0 && declared > 0 ? "verified" : "blocked",
    releaseBlocked: failed > 0 || invalidMetadata > 0 || declared === 0,
    evidenceRows, originalsDeclared: declared,
    uniqueOriginals: unique.size, verified, failed, invalidMetadata,
  };
  console.log(JSON.stringify(outcome));
  if (outcome.releaseBlocked) process.exitCode = 2;
}
main()
  .catch(error => {
    console.error("PRIVATE_ORIGINAL_AUDIT_FAILED", error instanceof Error ? error.name : "unknown");
    process.exitCode = 3;
  })
  .finally(async () => { await db.$disconnect(); });
