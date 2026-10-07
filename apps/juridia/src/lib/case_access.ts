import { db } from "@/lib/db";

export interface CaseAccessUser {
  uid: string;
  role: string;
}

export async function canAccessCase(caseId: string, user: CaseAccessUser): Promise<boolean> {
  if (!caseId) return false;
  const item = await db.case.findUnique({
    where: { id: caseId },
    select: { client: { select: { userId: true } } },
  });
  if (!item) return false;
  return user.role === "admin" || item.client.userId === user.uid;
}

export async function accessibleCaseIds(user: CaseAccessUser): Promise<string[]> {
  const items = await db.case.findMany({
    where: user.role === "admin" ? {} : { client: { userId: user.uid } },
    select: { id: true },
  });
  return items.map((item) => item.id);
}
