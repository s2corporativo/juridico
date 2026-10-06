import { createHmac } from "node:crypto";

export type PublicMovement = { name?: string | null; date?: string | null };
export type LowerProcessRecord = { processNumber: string; movements: PublicMovement[] };

function monthFromMovementDate(value: string) {
  const compact = value.replace(/\D/g, "");
  if (compact.length >= 6) return `${compact.slice(0, 4)}-${compact.slice(4, 6)}`;
  return null;
}

function isFinalLower(name: string | null | undefined) {
  return name?.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR") === "baixa definitiva";
}

export function aggregateTemporaryFinalLowers(records: LowerProcessRecord[], runSecret: string) {
  const distinctProcessMonths = new Set<string>();
  const monthly = new Map<string, number>();
  let eligibleMovements = 0;

  for (const record of records) {
    const temporaryProcessKey = createHmac("sha256", runSecret).update(record.processNumber).digest("hex");
    for (const movement of record.movements) {
      if (!isFinalLower(movement.name) || !movement.date) continue;
      const month = monthFromMovementDate(movement.date);
      if (!month) continue;
      eligibleMovements += 1;
      const key = `${temporaryProcessKey}:${month}`;
      if (distinctProcessMonths.has(key)) continue;
      distinctProcessMonths.add(key);
      monthly.set(month, (monthly.get(month) ?? 0) + 1);
    }
  }

  return {
    monthly: Array.from(monthly.entries()).map(([month, amount]) => ({ month, amount })).sort((a, b) => a.month.localeCompare(b.month)),
    processedRecords: records.length,
    eligibleMovements,
    deduplicatedProcessMonths: distinctProcessMonths.size,
  };
}
