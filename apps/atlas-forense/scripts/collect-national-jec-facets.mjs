import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

const ACCESS_URL = "https://datajud-wiki.cnj.jus.br/api-publica/acesso/";
const BASE_URL = "https://api-publica.datajud.cnj.jus.br";
const PERIOD = { gte: "20250101000000", lte: "20260826235959" };
const PAGE_SIZE = 250;
const aliases = [["tjac", "AC"], ["tjal", "AL"], ["tjam", "AM"], ["tjap", "AP"], ["tjba", "BA"], ["tjce", "CE"], ["tjdft", "DF"], ["tjes", "ES"], ["tjgo", "GO"], ["tjma", "MA"], ["tjmg", "MG"], ["tjms", "MS"], ["tjmt", "MT"], ["tjpa", "PA"], ["tjpb", "PB"], ["tjpe", "PE"], ["tjpi", "PI"], ["tjpr", "PR"], ["tjrj", "RJ"], ["tjrn", "RN"], ["tjro", "RO"], ["tjrr", "RR"], ["tjrs", "RS"], ["tjsc", "SC"], ["tjse", "SE"], ["tjsp", "SP"], ["tjto", "TO"]];

function query(kind, after) {
  const field = kind === "subject" ? "assuntos.codigo" : "orgaoJulgador.codigo";
  const source = kind === "subject" ? ["assuntos"] : ["orgaoJulgador"];
  return { size: 0, track_total_hits: true, query: { bool: { must: [{ match: { grau: "JE" } }, { terms: { "classe.codigo": [436] } }, { range: { dataAjuizamento: PERIOD } }] } }, aggs: { facets: { composite: { size: PAGE_SIZE, sources: [{ code: { terms: { field } } }], ...(after ? { after } : {}) }, aggs: { sample: { top_hits: { size: 1, _source: { includes: source } } } } } } };
}

function csvEscape(value) { const text = String(value ?? ""); return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }

async function keyInMemory() {
  const response = await fetch(ACCESS_URL, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Acesso DataJud indisponível (HTTP ${response.status}).`);
  const html = (await response.text()).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const marker = html.indexOf("Authorization: APIKey");
  const key = marker >= 0 ? html.slice(marker, marker + 280).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0] : null;
  if (!key) throw new Error("Chave pública não localizada em memória.");
  return key;
}

function labelFromBucket(kind, bucket) {
  if (kind === "subject") {
    const assuntos = bucket.sample?.hits?.hits?.[0]?._source?.assuntos;
    const item = Array.isArray(assuntos) ? assuntos.find(subject => String(subject?.codigo) === String(bucket.key?.code)) : null;
    return typeof item?.nome === "string" ? item.nome : `Assunto CNJ ${bucket.key?.code}`;
  }
  const body = bucket.sample?.hits?.hits?.[0]?._source?.orgaoJulgador;
  return typeof body?.nome === "string" ? body.nome : `Órgão ${bucket.key?.code}`;
}

async function collectKind(key, alias, kind) {
  const buckets = []; let after; let pages = 0; let relation = "unknown";
  do {
    const response = await fetch(`${BASE_URL}/api_publica_${alias}/_search`, { method: "POST", headers: { Authorization: `APIKey ${key}`, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(query(kind, after)), signal: AbortSignal.timeout(35_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const body = await response.json();
    relation = body?.hits?.total?.relation ?? "eq";
    if (relation !== "eq") throw new Error("total_lower_bound");
    const facet = body?.aggregations?.facets;
    for (const bucket of facet?.buckets ?? []) buckets.push({ code: String(bucket.key?.code), label: labelFromBucket(kind, bucket), amount: Number(bucket.doc_count ?? 0) });
    after = facet?.after_key;
    pages += 1;
  } while (after);
  return { buckets, pages, relation };
}

async function main() {
  const outputDir = new URL("../../juizados_pesquisa/output_nacional_jec/", import.meta.url);
  await mkdir(outputDir, { recursive: true });
  let key = await keyInMemory();
  const fingerprint = createHash("sha256").update(JSON.stringify(query("subject"))).digest("hex");
  const facets = new Map(); const errors = []; const pages = { subject: 0, judging_body: 0 };
  for (const [alias] of aliases) {
    for (const kind of ["subject", "judging_body"]) {
      try {
        const result = await collectKind(key, alias, kind);
        pages[kind] += result.pages;
        for (const bucket of result.buckets) {
          const id = `${kind}:${bucket.code}`;
          const previous = facets.get(id) ?? { kind, code: bucket.code, label: bucket.label, amount: 0 };
          previous.amount += bucket.amount; facets.set(id, previous);
        }
      } catch (error) { errors.push({ alias, kind, reason: error instanceof Error ? error.message : "erro" }); }
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  key = undefined;
  if (errors.length) throw new Error(`Coleta incompleta: ${JSON.stringify(errors)}`);
  const rows = [...facets.values()].sort((a, b) => a.kind.localeCompare(b.kind) || b.amount - a.amount);
  const csv = ["kind,code,label,amount,query_fingerprint", ...rows.map(row => [row.kind, row.code, row.label, row.amount, fingerprint].map(csvEscape).join(","))].join("\n");
  const manifest = { title: "Facetas nacionais JEC — assuntos e órgãos", source: "CNJ/DataJud API Pública", collectedAt: new Date().toISOString(), period: "2025-01 a 2026-08 (2026 parcial até 26/08)", scope: "grau JE, classe 436", aliases: aliases.length, successfulAliases: aliases.length, errors: [], rows: rows.length, pages, pageSize: PAGE_SIZE, pagination: "Agregação composite paginada até ausência de after_key em cada alias e tipo de faceta.", queryFingerprint: fingerprint, privacy: "Apenas buckets agregados e rótulos de classificação; nenhum processo, parte, CPF ou chave foi persistido.", limitation: "Assuntos são multivalorados e podem se sobrepor; contagens não representam processos exclusivos nem decisões de mérito." };
  await Promise.all([writeFile(new URL("facetas_nacionais_jec_2025_2026.csv", outputDir), csv, "utf8"), writeFile(new URL("manifesto_facetas_nacionais_jec.json", outputDir), `${JSON.stringify(manifest, null, 2)}\n`, "utf8")]);
  console.log(`FACETAS_NACIONAIS: ${rows.length} facetas integrais; páginas assuntos=${pages.subject}; páginas órgãos=${pages.judging_body}; saída em ${outputDir.pathname}`);
}

main().catch(error => { console.error(`FACETAS_NACIONAIS_ERRO: ${error instanceof Error ? error.message : "erro desconhecido"}`); process.exitCode = 1; });
