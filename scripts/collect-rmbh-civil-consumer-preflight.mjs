import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCivilConsumerPreflightQuery, summarizeCivilConsumerPreflight } from "./rmbh-civil-consumer-preflight-runtime.mjs";

const ACCESS_URL = "https://datajud-wiki.cnj.jus.br/api-publica/acesso/";
const BASE_URL = "https://api-publica.datajud.cnj.jus.br";
const ALIAS = "tjmg";
const EXECUTE = process.argv.includes("--execute");
const AUTHORIZED = process.env.RMBH_CIVIL_CONSUMER_AUTHORIZATION === "approved";
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const outputDir = process.env.RMBH_CIVIL_CONSUMER_OUTPUT_DIR ?? path.resolve(projectRoot, "data", "rmbh-civil-consumer-preflight");

async function publicKeyInMemory() {
  const response = await fetch(ACCESS_URL, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Acesso público DataJud indisponível (HTTP ${response.status}).`);
  const text = (await response.text()).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const marker = text.indexOf("Authorization: APIKey");
  const key = marker < 0 ? null : text.slice(marker, marker + 280).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0];
  if (!key) throw new Error("Chave pública DataJud indisponível.");
  return key;
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const query = buildCivilConsumerPreflightQuery();
  const manifestBase = {
    title: "Pré-teste agregado TJMG — Cível/Consumidor JEC",
    source: "CNJ/DataJud API Pública",
    collectedAt: new Date().toISOString(),
    alias: ALIAS,
    scope: { degree: "JE", classCode: 436, subjectRoots: [899, 1156], period: "2025-01 a 2026-08 (2026 parcial até 26/08)" },
    queryFingerprint: createHash("sha256").update(JSON.stringify(query)).digest("hex"),
    privacy: "Consulta size=0 com agregações; não solicita lista de processos, partes, documentos, resposta bruta ou chave pública persistente.",
    limitation: "Pré-teste de indexação temática. Não identifica município, não atribui órgão a comarca e não produz taxa ou censo territorial.",
  };
  if (!(EXECUTE && AUTHORIZED)) {
    await writeFile(path.join(outputDir, "manifesto_rmbh_civel_consumidor_dry_run.json"), `${JSON.stringify({ ...manifestBase, mode: "dry_run", authorization: "required_for_execution" }, null, 2)}\n`, "utf8");
    console.log("RMBH_CIVEL_CONSUMIDOR_DRY_RUN: execução bloqueada até RMBH_CIVIL_CONSUMER_AUTHORIZATION=approved.");
    return;
  }
  let key = await publicKeyInMemory();
  const response = await fetch(`${BASE_URL}/api_publica_${ALIAS}/_search`, {
    method: "POST",
    headers: { Authorization: `APIKey ${key}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(query),
    signal: AbortSignal.timeout(45_000),
  });
  key = undefined;
  if (!response.ok) throw new Error(`Pré-teste DataJud TJMG indisponível (HTTP ${response.status}).`);
  const summary = summarizeCivilConsumerPreflight(await response.json());
  await writeFile(path.join(outputDir, "manifesto_rmbh_civel_consumidor.json"), `${JSON.stringify({ ...manifestBase, mode: "execute", authorization: "approved", state: summary.usable ? "completed" : "inconclusive", summary }, null, 2)}\n`, "utf8");
  console.log(`RMBH_CIVEL_CONSUMIDOR: subjects=${summary.indexedRootSubjects.length}; bodies=${summary.distinctJudgingBodies}; estado=${summary.usable ? "completed" : "inconclusive"}.`);
}

main().catch((error) => {
  console.error(`RMBH_CIVEL_CONSUMIDOR_ERRO: ${error instanceof Error ? error.message : "erro desconhecido"}`);
  process.exitCode = 1;
});
