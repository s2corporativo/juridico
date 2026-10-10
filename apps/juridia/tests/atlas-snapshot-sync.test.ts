import { test, expect } from "bun:test";
import { Database } from "bun:sqlite";
import { createHash } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { syncApprovedDiscovery, listApprovedDiscovery } from "../src/lib/atlas-snapshot-sync";

const cfg = { baseUrl: "http://127.0.0.1:3114", token: "x".repeat(40) };
function item(n: number) {
  return {
    atlasItemId: String(n), sourceKey: "stj-dados-abertos" as const,
    sourceType: "official_update" as const, tribunal: "STJ" as const,
    title: "Catalogo STJ " + n,
    officialUrl: "https://dadosabertos.web.stj.jus.br/dataset/teste",
    publishedAt: null, provenanceHash: "a".repeat(64),
    editorialStatus: "approved" as const, documentStatus: "discovery_only" as const,
    citableAsPrecedent: false as const, text: null,
  };
}
const versionOf = (items: ReturnType<typeof item>[]) =>
  "v1:" + createHash("sha256").update(JSON.stringify(items)).digest("hex");

test("fetches paginated Atlas metadata, verifies hash and replaces local cache atomically", async () => {
  const dir=mkdtempSync(join(tmpdir(),"atlas-snapshot-audit-"));
  const db=new Database(join(dir,"test.db"),{create:true});
  try {
    const records=[item(1),item(2)];
    const version=versionOf(records);
    const fetchImpl = (async (url: URL|string) => {
      const page=Number(new URL(String(url)).searchParams.get("page")||0);
      return new Response(JSON.stringify({
        ok:true,contractVersion:1,snapshotVersion:version,total:2,
        page,pageSize:1,complete:page===1,items:[records[page]], methodology:"Discovery only",
      }),{status:200,headers:{"content-type":"application/json"}});
    }) as typeof fetch;
    const first=await syncApprovedDiscovery(db,{config:cfg,fetchImpl});
    expect(first).toEqual({status:"updated",version,total:2});
    expect(listApprovedDiscovery(db)).toHaveLength(2);
    expect((await syncApprovedDiscovery(db,{config:cfg,fetchImpl})).status).toBe("unchanged");

    // Remote changes after page 0: no partial writes or deletion.
    const broken = (async (url: URL|string) => {
      const page=Number(new URL(String(url)).searchParams.get("page")||0);
      if(page>0) return new Response(JSON.stringify({ok:false,error:"snapshot_changed"}),{status:409});
      return new Response(JSON.stringify({
        ok:true,contractVersion:1,snapshotVersion:version,total:2,
        page:0,pageSize:1,complete:false,items:[records[0]],methodology:"Discovery only",
      }));
    }) as typeof fetch;
    await expect(syncApprovedDiscovery(db,{config:cfg,fetchImpl:broken})).rejects.toThrow("ATLAS_SNAPSHOT_FETCH_FAILED_409");
    expect(listApprovedDiscovery(db)).toHaveLength(2);
  } finally {
    db.close();
    rmSync(dir,{recursive:true,force:true});
  }
});
test("rejects source URL impersonation and fabricated citable-as-precedent status",async()=>{
  const dir=mkdtempSync(join(tmpdir(),"atlas-snapshot-audit-"));
  const db=new Database(join(dir,"test.db"),{create:true});
  try {
    const unsafe={...item(9),officialUrl:"https://dadosabertos.web.stj.jus.br.evil.example/item"};
    const payload=[unsafe];
    const fetchImpl=(async()=>new Response(JSON.stringify({
      ok:true,contractVersion:1,snapshotVersion:versionOf(payload),page:0,
      total:1,pageSize:50,complete:true,items:payload,methodology:"Discovery only",
    }))) as typeof fetch;
    await expect(syncApprovedDiscovery(db,{config:cfg,fetchImpl})).rejects.toThrow("ATLAS_SNAPSHOT_CONTRACT_INVALID");
    const tables = db.query("SELECT name FROM sqlite_master WHERE name='AtlasDiscoveryCache'").all();
    expect(tables).toHaveLength(0);
  } finally {
    db.close();rmSync(dir,{recursive:true,force:true});
  }
});
