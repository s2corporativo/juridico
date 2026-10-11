/** Append-only honorarium events. No mutation of historic entries.
 * The ID of the ORIGINAL honorario_create event is the stable record ID.
 * Existing legacy duplicate create audit events are ignored rather than
 * treating each log entry as another invoice.
 */
export interface LedgerEvent {
  id: string;
  action: string;
  resourceId: string | null;
  userId: string | null;
  metadata: string;
  createdAt: Date;
}
export interface Honorarium {
  id: string;
  ownerId: string | null;
  caseId: string | null;
  descricao: string;
  valor: number;
  vencimento: string | null;
  status: "pendente" | "pago" | "atrasado";
  createdAt: string;
  updatedAt: string;
}
const VALID_STATUS = new Set(["pendente", "pago", "atrasado"]);
function parse(raw: string): Record<string, unknown> {
  try {
    const x = JSON.parse(raw);
    return x && typeof x === "object" && !Array.isArray(x) ? x : {};
  } catch { return {}; }
}
function validAmount(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 &&
    value <= 1_000_000_000;
}
function normalize(record: Record<string, unknown>, base?: Honorarium): Omit<Honorarium,"id"|"ownerId"|"createdAt"|"updatedAt"> | null {
  const desc = record.descricao ?? base?.descricao;
  const amount = record.valor ?? base?.valor;
  const date = record.vencimento === undefined ? base?.vencimento : record.vencimento;
  const status = record.status ?? base?.status;
  const caseId = record.caseId === undefined ? base?.caseId : record.caseId;
  if (typeof desc !== "string" || !desc.trim() || desc.length > 500 ||
      !validAmount(amount) || !VALID_STATUS.has(String(status)) ||
      !(caseId === null || (typeof caseId === "string" && caseId.length > 0)) ||
      !(date === null || (typeof date === "string" && !Number.isNaN(Date.parse(date))))) return null;
  return {
    descricao: desc.trim(), valor: amount,
    vencimento: date as string | null,
    status: status as Honorarium["status"],
    caseId: caseId as string | null,
  };
}
export function replayHonoraria(events: LedgerEvent[]): Honorarium[] {
  const chronological = [...events].filter(e =>
    ["honorario_create", "honorario_update", "honorario_delete"].includes(e.action)
  ).sort((a,b) => a.createdAt.getTime()-b.createdAt.getTime() || a.id.localeCompare(b.id));
  const creates = new Set(chronological.filter(e => e.action==="honorario_create").map(e=>e.id));
  const balances = new Map<string,Honorarium>();
  for(const event of chronological){
    const data=parse(event.metadata);
    if(event.action==="honorario_create"){
      // Legacy log mirror: same action, but resourceId points at first event.
      if (event.resourceId && creates.has(event.resourceId)) continue;
      const normalized=normalize(data);
      if (!normalized) continue;
      balances.set(event.id,{
        id:event.id,ownerId:event.userId,...normalized,
        createdAt:event.createdAt.toISOString(),
        updatedAt:event.createdAt.toISOString(),
      });
      continue;
    }
    const root=event.resourceId;
    if(!root)continue;
    const prior=balances.get(root);
    if(!prior)continue;
    if(event.action==="honorario_delete"){
      balances.delete(root);
      continue;
    }
    const updated=normalize(data,prior);
    if(updated)balances.set(root,{...prior,...updated,updatedAt:event.createdAt.toISOString()});
  }
  return Array.from(balances.values()).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
}

export function parseHonorariumInput(input: Record<string, unknown>,
  prior?: Honorarium): Omit<Honorarium,"id"|"ownerId"|"createdAt"|"updatedAt"> | null {
  return normalize(input,prior);
}
