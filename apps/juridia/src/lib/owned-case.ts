import { db } from "@/lib/db";

/** Acesso a casos é sempre pelo cliente pertencente ao usuário autenticado.
 * O ID fictício 'default-case' NÃO é recurso compartilhado em produção.
 */
export async function ownsCase(userId: string, caseId: string | null | undefined): Promise<boolean> {
  if (!userId || !caseId || caseId === "default-case") return false;
  const result = await db.case.findFirst({
    where: { id: caseId, client: { is: { userId } } },
    select: { id: true },
  });
  return Boolean(result);
}

export async function ownedCaseIds(userId: string): Promise<string[]> {
  if (!userId) return [];
  const cases = await db.case.findMany({
    where: { client: { is: { userId } } },
    select: { id: true },
  });
  return cases.map((item) => item.id);
}
