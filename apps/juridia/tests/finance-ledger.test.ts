import { test, expect } from "bun:test";
import { replayHonoraria, parseHonorariumInput, type LedgerEvent } from "../src/lib/finance-ledger";

const start = new Date("2026-10-10T12:00:00.000Z");
const later = new Date("2026-10-10T12:05:00.000Z");
function evt(id:string, action:string, resourceId:string|null, metadata:unknown, createdAt=start, userId:string|null="lawyer-a"):LedgerEvent{
  return {id,action,resourceId,metadata:JSON.stringify(metadata),createdAt,userId};
}
const base={caseId:"case-a",descricao:"Honorários iniciais",valor:1200,vencimento:"2026-11-10",status:"pendente"};
test("honorarium ledger collapses historical audit mirror and retains original identity",()=>{
  const created=evt("created","honorario_create","case-a",base);
  const mirror=evt("mirror","honorario_create","created",base,later);
  const projected=replayHonoraria([mirror,created]);
  expect(projected).toHaveLength(1);
  expect(projected[0].id).toBe("created");
  expect(projected[0].ownerId).toBe("lawyer-a");
});
test("last amendment changes status without creating another invoice; deletion removes all",()=>{
  const created=evt("created","honorario_create","case-a",base);
  const change=evt("change","honorario_update","created",{...base,status:"pago"},later);
  const set=replayHonoraria([change,created]);
  expect(set).toHaveLength(1);
  expect(set[0].status).toBe("pago");
  expect(set[0].ownerId).toBe("lawyer-a");
  const cancelled=evt("deleted","honorario_delete","created",{caseId:"case-a"},new Date("2026-10-10T12:06:00Z"));
  expect(replayHonoraria([cancelled,created,change])).toHaveLength(0);
});
test("orphan events cannot materialize financial records",()=>{
  expect(replayHonoraria([evt("orphan","honorario_update","nonexistent",{...base,valor:9999})])).toHaveLength(0);
  expect(replayHonoraria([evt("orphan","honorario_delete","nonexistent",{...base})])).toHaveLength(0);
});
test("invalid money, missing dates and invalid status are rejected",()=>{
  expect(parseHonorariumInput({...base,valor:NaN})).toBeNull();
  expect(parseHonorariumInput({...base,valor:-1})).toBeNull();
  expect(parseHonorariumInput({...base,status:"invalid"})).toBeNull();
  expect(parseHonorariumInput({...base,vencimento:"garbage"})).toBeNull();
  expect(parseHonorariumInput({...base,descricao:""})).toBeNull();
  expect(parseHonorariumInput(base)?.valor).toBe(1200);
});
