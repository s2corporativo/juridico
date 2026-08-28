import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCivilConsumerBaseDiagnosticQuery, summarizeCivilConsumerBaseDiagnostic } from "./rmbh-civil-consumer-preflight-runtime.mjs";

const ACCESS_URL = "https://datajud-wiki.cnj.jus.br/api-publica/acesso/";
const BASE_URL = "https://api-publica.datajud.cnj.jus.br";
const ALIAS = "tjmg";
const EXECUTE = process.argv.includes("--execute");
const AUTHORIZED = process.env.RMBH_CIVIL_CONSUMER_AUTHORIZATION === "approved";
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const outputDir = process.env.RMBH_CIVIL_CONSUMER_DIAGNOSTIC_OUTPUT_DIR ?? path.resolve(projectRoot, "data", "rmbh-civil-consumer-preflight-diagnostic");
const ALLOWED_FIELD_MARKERS = ["grau", "classe.codigo", "dataAjuizamento"];

async function publicKeyInMemory() {
  const response = await fetch(ACCESS_URL, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Acesso público DataJud indisponível (HTTP ${response.status}).`);
  const text = (await response.text()).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const marker = text.indexOf("Authorization: APIKey");
  const key = marker < 0 ? null : text.slice(marker, marker + 280).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0];
  if (!key) throw new Error("Chave pública DataJud indisponível.");
  return key;
}

function collectSafeErrorTypes(value, types = new Set()) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectSafeErrorTypes(item, types));
    return types;
  }
  if (!value || typeof value !== "object") return types;
  const type = value.type;
  if (typeof type === "string" && /^[a-z_]{2,80}$/u.test(type)) types.add(type);
  Object.values(value).forEach((item) => collectSafeErrorTypes(item, types));
  return types;
}

function sanitizeErrorDiagnostic(payload, status) {
  const serialized = JSON.stringify(payload ?? {});
  return {
    httpStatus: status,
    errorTypes: [...collectSafeErrorTypes(payload)].sort().slice(0, 8),
    implicatedQueryFields: ALLOWED_FIELD_MARKERS.filter((field) => serialized.includes(field)),
    responseBodyPersisted: false,
  };
}

async function readJsonSafely(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const query = buildCivilConsumerBaseDiagnosticQuery();
  const manifestBase = {
    title: "Diagnóstico agregado de consulta-base TJMG — Cível/Consumidor JEC",
    source: "CNJ/DataJud API Pública",
    collectedAt: new Date().toISOString(),
    alias: ALIAS,
    scope: { degree: "JE", classCode: 436, period: "2025-01 a 2026-08 (2026 parcial até 26/08)", excludes: ["assuntos", "agregações", "_source", "hits"] },
    queryFingerprint: createHash("sha256").update(JSON.stringify(query)).digest("hex"),
    privacy: "Consulta única size=0 e _source=false; não solicita, registra ou imprime processos, partes, documentos, resposta bruta ou chave pública.",
    limitation: "Diagnóstico técnico da consulta-base. Não confirma indexação de assunto nem produz métrica territorial ou temática.",
  };
  if (!(EXECUTE && AUTHORIZED)) {
    await writeFile(path.join(outputDir, "manifesto_diagnostico_rmbh_civel_consumidor.json"), `${JSON.stringify({ ...manifestBase, mode: "dry_run", authorization: "required_for_execution" }, null, 2)}\n`, "utf8");
    console.log("RMBH_CIVEL_CONSUMIDOR_DIAGNOSTICO_DRY_RUN: execução bloqueada até autorização explícita.");
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
  const payload = await readJsonSafely(response);
  if (!response.ok) {
    const diagnostic = sanitizeErrorDiagnostic(payload, response.status);
    await writeFile(path.join(outputDir, "manifesto_diagnostico_rmbh_civel_consumidor.json"), `${JSON.stringify({ ...manifestBase, mode: "execute", authorization: "approved", state: "query_base_rejected", diagnostic }, null, 2)}\n`, "utf8");
    console.log(`RMBH_CIVEL_CONSUMIDOR_DIAGNOSTICO: estado=query_base_rejected; http=${response.status}; tipos=${diagnostic.errorTypes.join(",") || "indisponível"}.`);
    process.exitCode = 1;
    return;
  }
  const summary = summarizeCivilConsumerBaseDiagnostic(payload);
  await writeFile(path.join(outputDir, "manifesto_diagnostico_rmbh_civel_consumidor.json"), `${JSON.stringify({ ...manifestBase, mode: "execute", authorization: "approved", state: "query_base_accepted", summary }, null, 2)}\n`, "utf8");
  console.log(`RMBH_CIVEL_CONSUMIDOR_DIAGNOSTICO: estado=query_base_accepted; total=${summary.observedProcessCount}; relacao=${summary.totalRelation}.`);
}

main().catch((error) => {
  console.error(`RMBH_CIVEL_CONSUMIDOR_DIAGNOSTICO_ERRO: ${error instanceof Error ? error.message : "erro desconhecido"}`);
  process.exitCode = 1;
});
