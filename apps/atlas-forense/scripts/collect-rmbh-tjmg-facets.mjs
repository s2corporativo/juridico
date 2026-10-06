import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildRmbhJudgingBodyQuery, summarizeRmbhFacetRows, toRmbhJudgingBodyRow } from "./rmbh-tjmg-facets-runtime.mjs";

const ACCESS_URL = "https://datajud-wiki.cnj.jus.br/api-publica/acesso/";
const BASE_URL = "https://api-publica.datajud.cnj.jus.br";
const ALIAS = "tjmg";
const PAGE_SIZE = 250;
const MAX_PAGES = Number(process.env.RMBH_TJMG_MAX_PAGES ?? "6");
const EXECUTE = process.argv.includes("--execute");
const AUTHORIZED = process.env.RMBH_TJMG_FACETS_AUTHORIZATION === "approved";
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const outputDir = process.env.RMBH_TJMG_OUTPUT_DIR ?? path.resolve(projectRoot, "data", "rmbh-tjmg-facets");

if (!Number.isInteger(MAX_PAGES) || MAX_PAGES < 1 || MAX_PAGES > 12) throw new Error("RMBH_TJMG_MAX_PAGES deve estar entre 1 e 12.");

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
  const municipalDataset = JSON.parse(await readFile(path.join(projectRoot, "data", "rmbh-municipalities.json"), "utf8"));
  const municipalities = municipalDataset.municipalities;
  const fingerprint = createHash("sha256").update(JSON.stringify(buildRmbhJudgingBodyQuery({ pageSize: PAGE_SIZE }))).digest("hex");
  const baseManifest = {
    title: "Facetas TJMG JEC — órgãos vinculados à RMBH",
    source: "CNJ/DataJud API Pública",
    collectedAt: new Date().toISOString(),
    alias: ALIAS,
    scope: { degree: "JE", classCode: 436, period: "2025-01 a 2026-08 (2026 parcial até 26/08)", municipalities: municipalities.length },
    queryFingerprint: fingerprint,
    maximumPages: MAX_PAGES,
    privacy: "A consulta usa size=0, agregações por órgão e uma amostra limitada ao campo orgaoJulgador; nenhum processo, parte, documento, resposta bruta ou chave pública é persistido.",
    limitation: "Cobertura de órgão exige rótulo que mencione a comarca de forma exata; município integrante de comarca-sede não recebe inferência automática.",
  };
  if (!(EXECUTE && AUTHORIZED)) {
    await writeFile(path.join(outputDir, "manifesto_rmbh_tjmg_facetas_dry_run.json"), `${JSON.stringify({ ...baseManifest, mode: "dry_run", authorization: "required_for_execution" }, null, 2)}\n`, "utf8");
    console.log("RMBH_TJMG_DRY_RUN: execução bloqueada até RMBH_TJMG_FACETS_AUTHORIZATION=approved.");
    return;
  }

  let key = await publicKeyInMemory();
  let after;
  let pages = 0;
  const rows = [];
  let limited = false;
  do {
    const response = await fetch(`${BASE_URL}/api_publica_${ALIAS}/_search`, {
      method: "POST",
      headers: { Authorization: `APIKey ${key}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(buildRmbhJudgingBodyQuery({ after, pageSize: PAGE_SIZE })),
      signal: AbortSignal.timeout(40_000),
    });
    if (!response.ok) throw new Error(`Consulta de facetas TJMG indisponível (HTTP ${response.status}).`);
    const payload = await response.json();
    const facet = payload?.aggregations?.facets;
    for (const bucket of facet?.buckets ?? []) {
      const row = toRmbhJudgingBodyRow(bucket, municipalities);
      if (row) rows.push(row);
    }
    after = facet?.after_key;
    pages += 1;
    if (after && pages >= MAX_PAGES) limited = true;
  } while (after && !limited);
  key = undefined;

  rows.sort((left, right) => left.municipality.localeCompare(right.municipality, "pt-BR") || left.judgingBodyCode.localeCompare(right.judgingBodyCode));
  const summary = summarizeRmbhFacetRows(rows);
  const manifest = { ...baseManifest, mode: "execute", authorization: "approved", state: limited ? "partial" : "completed", pages, limited, summary };
  await Promise.all([
    writeFile(path.join(outputDir, "rmbh_tjmg_jec_orgaos_agregados.json"), `${JSON.stringify(rows, null, 2)}\n`, "utf8"),
    writeFile(path.join(outputDir, "manifesto_rmbh_tjmg_facetas.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8"),
  ]);
  console.log(`RMBH_TJMG_FACETAS: ${summary.distinctBodies} órgãos em ${summary.municipalitiesWithBodies} municípios; páginas=${pages}; estado=${manifest.state}.`);
}

main().catch((error) => {
  console.error(`RMBH_TJMG_FACETAS_ERRO: ${error instanceof Error ? error.message : "erro desconhecido"}`);
  process.exitCode = 1;
});
