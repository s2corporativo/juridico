import { db } from "@/lib/db";

const CASE_ID = /^[a-zA-Z0-9_-]{8,128}$/;

/** Independent authorization gate: never allow default or synthetic case IDs. */
export async function hasCaseAccess(
  caseId: string | undefined | null,
  userId: string,
  role: string,
): Promise<boolean> {
  if (!caseId || !CASE_ID.test(caseId) || caseId === "default-case" ||
      caseId === "cerebro-session") return false;
  const item = await db.case.findFirst({
    where: {
      id: caseId,
      ...(role === "admin" ? {} : { client: { is: { userId } } }),
    },
    select: { id: true },
  });
  return Boolean(item);
}

/** Safe case-ID scope for legacy models that store only caseId, with no FK. */
export async function accessibleCaseIds(userId: string, role: string): Promise<string[] | null> {
  if (role === "admin") return null; // administrator may access the full institution
  const cases = await db.case.findMany({
    where: { client: { is: { userId } } },
    select: { id: true },
  });
  return cases.map(item => item.id);
}
