import { db } from "@/lib/db";

export async function logAuditEvent(params: {
  action: string;
  resource: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
  userId?: string | null;
  ip?: string | null;
}): Promise<void> {
  try {
    await db.auditEvent.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId ?? null,
        metadata: JSON.stringify(params.metadata ?? {}),
        ip: params.ip ?? null,
      },
    });
  } catch {
    // Auditoria não interrompe o fluxo principal, mas nunca inventa identidade.
  }
}

export async function logUsageEntry(params: {
  type: "debit" | "credit" | "refund" | "adjustment";
  operation: string;
  amount: number;
  reason: string;
  metadata?: Record<string, unknown>;
  userId?: string | null;
}): Promise<void> {
  try {
    const userId = params.userId ?? null;
    const last = await db.usageLedger.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    const prevBalance = last?.balance ?? 0;
    const newBalance = prevBalance + params.amount;

    await db.usageLedger.create({
      data: {
        userId,
        type: params.type,
        operation: params.operation,
        amount: params.amount,
        balance: newBalance,
        reason: params.reason,
        metadata: JSON.stringify(params.metadata ?? {}),
      },
    });
  } catch {
    // Ledger auxiliar não interrompe o fluxo principal.
  }
}
