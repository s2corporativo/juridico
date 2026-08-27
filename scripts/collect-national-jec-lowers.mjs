import { createHash, createHmac, randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  createAliasTelemetry,
  buildLowerQuery,
  addLowerAggregate,
  buildLowerMetricRows,
  failAlias,
  finishAlias,
  isRetryableDataJudError,
  limitAlias,
  recordLowerPage,
  recordRetry,
  retryDataJudRequest,
  retryDelayMs,
  parseJudgingBodyCodes,
  sanitizeDataJudError,
  summarizeLowerRun,
} from "./national-lower-runtime.mjs";

const ACCESS_URL = "https://datajud-wiki.cnj.jus.br/api-publica/acesso/";
const BASE_URL = "https://api-publica.datajud.cnj.jus.br";
const PAGE_SIZE = 250;
const EXECUTE = process.argv.includes("--execute");
const AUTHORIZED = process.env.NATIONAL_LOWER_AUTHORIZATION === "approved";
const aliases = [["tjac", "AC"], ["tjal", "AL"], ["tjam", "AM"], ["tjap", "AP"], ["tjba", "BA"], ["tjce", "CE"], ["tjdft", "DF"], ["tjes", "ES"], ["tjgo", "GO"], ["tjma", "MA"], ["tjmg", "MG"], ["tjms", "MS"], ["tjmt", "MT"], ["tjpa", "PA"], ["tjpb", "PB"], ["tjpe", "PE"], ["tjpi", "PI"], ["tjpr", "PR"], ["tjrj", "RJ"], ["tjrn", "RN"], ["tjro", "RO"], ["tjrr", "RR"], ["tjrs", "RS"], ["tjsc", "SC"], ["tjse", "SE"], ["tjsp", "SP"], ["tjto", "TO"]];
const readOption = prefix => process.argv.find(argument => argument.startsWith(prefix))?.slice(prefix.length);
const aliasOption = readOption("--alias=")?.toLowerCase();
const maxPagesOption = Number(readOption("--max-pages=") ?? "0");
const pageDelayMs = Number(readOption("--page-delay-ms=") ?? "750");
const maxRetries = Number(readOption("--max-retries=") ?? "2");
const retryBaseDelayMs = Number(readOption("--retry-base-delay-ms=") ?? "1500");
const judgingBodyCodes = parseJudgingBodyCodes(readOption("--orgao-codes="));
const outputDir = process.env.NATIONAL_LOWER_OUTPUT_DIR ?? new URL("../../juizados_pesquisa/output_nacional_jec/", import.meta.url).pathname;
const selectedAliases = aliasOption ? aliases.filter(([alias]) => alias === aliasOption) : aliases;

if (aliasOption && selectedAliases.length === 0) throw new Error("Alias de piloto inválido.");
if (!Number.isInteger(maxPagesOption) || maxPagesOption < 0) throw new Error("O limite de páginas deve ser inteiro não negativo.");
if (!Number.isInteger(pageDelayMs) || pageDelayMs < 250 || pageDelayMs > 30_000) throw new Error("A pausa entre páginas deve estar entre 250 e 30000 ms.");
if (!Number.isInteger(maxRetries) || maxRetries < 0 || maxRetries > 4) throw new Error("O limite de retentativas deve estar entre 0 e 4.");
if (!Number.isInteger(retryBaseDelayMs) || retryBaseDelayMs < 250 || retryBaseDelayMs > 10_000) throw new Error("A pausa-base de retentativa deve estar entre 250 e 10000 ms.");

const isLimitedPilot = Boolean(aliasOption || maxPagesOption > 0 || judgingBodyCodes.length > 0);
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

function query() {
  return buildLowerQuery({ judgingBodyCodes, pageSize: PAGE_SIZE });
}

function month(value) {
  const compact = String(value ?? "").replace(/\D/g, "");
  return compact.length >= 6 ? `${compact.slice(0, 4)}-${compact.slice(4, 6)}` : null;
}

function isFinalLower(value) {
  return String(value ?? "").trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR") === "baixa definitiva";
}

async function withRetry(run, { stage, telemetry, preflight }) {
  try {
    return await retryDataJudRequest({
      run: async () => {
        if (preflight) preflight.attempts += 1;
        return run();
      },
      maxRetries,
      retryBaseDelayMs,
      sleep,
      onRetry: delay => {
        if (telemetry) recordRetry(telemetry, stage, delay);
        if (preflight) {
          preflight.retries += 1;
          preflight.retryDelayMs += delay;
        }
      },
    });
  } catch (error) {
    throw new Error(`${stage}: ${sanitizeDataJudError(error)}`);
  }
}

async function officialKey(preflight) {
  return withRetry(async () => {
    const response = await fetch(ACCESS_URL, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(15_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = (await response.text()).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
    const marker = text.indexOf("Authorization: APIKey");
    const key = marker < 0 ? null : text.slice(marker, marker + 280).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0];
    if (!key) throw new Error("chave pública indisponível");
    return key;
  }, { stage: "acesso_publico", preflight });
}

async function startScroll(key, alias, telemetry) {
  return withRetry(async () => {
    const response = await fetch(`${BASE_URL}/api_publica_${alias}/_search?scroll=1m`, {
      method: "POST",
      headers: { Authorization: `APIKey ${key}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(query()),
      signal: AbortSignal.timeout(40_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }, { stage: "inicio_scroll", telemetry });
}

async function nextScroll(key, scrollId, telemetry) {
  return withRetry(async () => {
    const response = await fetch(`${BASE_URL}/_search/scroll`, {
      method: "POST",
      headers: { Authorization: `APIKey ${key}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ scroll: "1m", scroll_id: scrollId }),
      signal: AbortSignal.timeout(40_000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }, { stage: "continuidade_scroll", telemetry });
}

async function clearScroll(key, scrollId) {
  if (!scrollId) return;
  await fetch(`${BASE_URL}/_search/scroll`, {
    method: "DELETE",
    headers: { Authorization: `APIKey ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ scroll_id: [scrollId] }),
    signal: AbortSignal.timeout(15_000),
  }).catch(() => undefined);
}

async function writeJson(filename, value) {
  await writeFile(path.join(outputDir, filename), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const fingerprint = createHash("sha256").update(JSON.stringify(query())).digest("hex");
  const mode = EXECUTE && AUTHORIZED ? (isLimitedPilot ? "pilot" : "execute") : "dry_run";
  const startedAt = new Date().toISOString();
  const baseline = {
    title: mode === "pilot" ? "Baixas nacionais JEC — piloto de paginação" : mode === "execute" ? "Baixas nacionais JEC — execução nacional" : "Baixas nacionais JEC — dry-run de paginação",
    source: "CNJ/DataJud API Pública",
    executedAt: startedAt,
    mode,
    expectedTribunals: selectedAliases.length,
    scope: { degree: "JE", classCode: 436, cohort: "2025-01 a 2026-08", exactMovement: "Baixa Definitiva", judgingBodyCodes: judgingBodyCodes.length > 0 ? judgingBodyCodes : undefined },
    pageSize: PAGE_SIZE,
    pageDelayMs,
    retryPolicy: { maxRetries, retryBaseDelayMs, maximumDelayMs: 30_000 },
    pilot: isLimitedPilot ? { alias: aliasOption ?? "todos", maxPagesPerAlias: maxPagesOption || null, judgingBodyCodes: judgingBodyCodes.length > 0 ? judgingBodyCodes : undefined } : null,
    queryFingerprint: fingerprint,
    dataPolicy: "Somente numeroProcesso, movimentos mínimos e, quando filtrado, código de órgão em memória; HMAC efêmero por processo+mês; não persistir identificadores, hashes, respostas ou chave.",
    authorization: EXECUTE && AUTHORIZED ? "approved" : "required_for_execution",
  };
  if (!(EXECUTE && AUTHORIZED)) {
    await writeJson("manifesto_baixas_nacionais_dry_run.json", baseline);
    console.log("BAIXAS_DRY_RUN: estrutura registrada; execute bloqueado até NATIONAL_LOWER_AUTHORIZATION=approved.");
    return;
  }

  const preflight = { state: "running", attempts: 0, retries: 0, retryDelayMs: 0, error: null };
  let key;
  try {
    key = await officialKey(preflight);
    preflight.state = "completed";
  } catch (error) {
    preflight.state = "failed";
    preflight.error = sanitizeDataJudError(error);
    const manifest = {
      ...baseline,
      ...summarizeLowerRun({ aliases: selectedAliases.length, telemetry: [], metricRows: 0, queryFingerprint: fingerprint, startedAt, completedAt: new Date().toISOString() }),
      preflight,
      privacy: "A falha ocorreu antes da consulta de processos; nenhum identificador, HMAC, resposta, agregado ou chave foi persistido.",
    };
    await writeJson(`manifesto_baixas_nacionais_${isLimitedPilot ? "piloto" : "execucao"}.json`, manifest);
    console.log(`BAIXAS_NACIONAIS_INTERROMPIDA: acesso DataJud indisponível após ${preflight.attempts} tentativa(s).`);
    return;
  }

  let runSecret = randomBytes(32).toString("hex");
  const results = [];
  const telemetry = [];
  for (const [alias, uf] of selectedAliases) {
    let scrollId = null;
    let limited = false;
    const seen = new Set();
    const months = new Map();
    const aliasTelemetry = createAliasTelemetry(alias, uf);
    try {
      let body = await startScroll(key, alias, aliasTelemetry);
      scrollId = body?._scroll_id ?? null;
      while (true) {
        const hits = Array.isArray(body?.hits?.hits) ? body.hits.hits : [];
        if (hits.length === 0) break;
        let pageEligible = 0;
        let pageDeduplicated = 0;
        for (const hit of hits) {
          const source = hit?._source ?? {};
          const judgingBodyCode = judgingBodyCodes.length > 0 ? String(source?.orgaoJulgador?.codigo ?? "") : null;
          if (judgingBodyCodes.length > 0 && !judgingBodyCodes.includes(judgingBodyCode)) continue;
          const processKey = createHmac("sha256", runSecret).update(String(source.numeroProcesso ?? "")).digest("hex");
          for (const movement of Array.isArray(source.movimentos) ? source.movimentos : []) {
            if (!isFinalLower(movement.nome)) continue;
            const movementMonth = month(movement.dataHora);
            if (!movementMonth) continue;
            pageEligible += 1;
            const dedupeKey = `${processKey}:${movementMonth}`;
            if (seen.has(dedupeKey)) continue;
            seen.add(dedupeKey);
            pageDeduplicated += 1;
            addLowerAggregate(months, { month: movementMonth, judgingBodyCode });
          }
        }
        recordLowerPage(aliasTelemetry, { processedRecords: hits.length, eligibleMovements: pageEligible, deduplicatedProcessMonths: pageDeduplicated });
        if (maxPagesOption > 0 && aliasTelemetry.pages >= maxPagesOption) {
          limited = true;
          break;
        }
        if (!scrollId) throw new Error("cursor de scroll ausente");
        await sleep(pageDelayMs);
        body = await nextScroll(key, scrollId, aliasTelemetry);
        scrollId = body?._scroll_id ?? scrollId;
      }
      results.push(...buildLowerMetricRows({ alias, uf, monthTotals: months, territorial: judgingBodyCodes.length > 0 }));
      telemetry.push(limited ? limitAlias(aliasTelemetry) : finishAlias(aliasTelemetry));
    } catch (error) {
      telemetry.push(failAlias(aliasTelemetry, error));
    } finally {
      seen.clear();
      await clearScroll(key, scrollId);
    }
  }
  key = undefined;
  runSecret = undefined;
  const manifest = {
    ...baseline,
    ...summarizeLowerRun({ aliases: selectedAliases.length, telemetry, metricRows: results.length, queryFingerprint: fingerprint, startedAt, completedAt: new Date().toISOString() }),
    preflight,
    privacy: "Resultados persistíveis contêm apenas alias, UF, mês e quantidade; identificadores, HMACs, respostas e chave foram descartados ao fim da execução.",
  };
  const suffix = isLimitedPilot ? "piloto" : "execucao";
  await writeJson(`manifesto_baixas_nacionais_${suffix}.json`, manifest);
  await writeJson(`baixas_nacionais_jec_agregadas_${suffix}.json`, results);
  console.log(`BAIXAS_NACIONAIS: ${results.length} células agregadas; ${manifest.failedTribunals} aliases com falha; ${manifest.limitedTribunals} aliases limitados; ${manifest.retryCount} retentativas.`);
}

main().catch(error => {
  console.error(`BAIXAS_NACIONAIS_ERRO: ${sanitizeDataJudError(error)}`);
  process.exitCode = 1;
});
