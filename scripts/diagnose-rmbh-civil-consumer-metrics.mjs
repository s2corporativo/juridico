import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ACCESS_URL = "https://datajud-wiki.cnj.jus.br/api-publica/acesso/";
const ENDPOINT = "https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search";
const stage = process.argv.find((arg) => arg.startsWith("--stage="))?.split("=")[1] ?? "body";
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const outputDir = process.env.RMBH_CIVIL_CONSUMER_DIAGNOSTIC_OUTPUT_DIR ?? path.resolve(projectRoot, "data", "rmbh-civil-consumer-diagnostic");

async function publicKeyInMemory() {
  const response = await fetch(ACCESS_URL, { headers: { Accept: "text/html" }, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Acesso público DataJud indisponível (HTTP ${response.status}).`);
  const text = (await response.text()).replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
  const marker = text.indexOf("Authorization: APIKey");
  const key = marker < 0 ? null : text.slice(marker, marker + 280).match(/[A-Za-z0-9_-]{40,}={0,2}/)?.[0];
  if (!key) throw new Error("Chave pública DataJud indisponível.");
  return key;
}

const tree = JSON.parse(await readFile(path.join(projectRoot, "data", "tpu-civil-consumer-tree.json"), "utf8"));
const scope = JSON.parse(await readFile(path.join(projectRoot, "data", "rmbh-civil-consumer-scope.json"), "utf8"));
const bodyCodes = scope.bodies.slice(0, 24).map((body) => body.judgingBodyCode);
const civilCodes = tree.nodes.filter((node) => node.rootCode === 899).map((node) => String(node.code));
const consumerCodes = tree.nodes.filter((node) => node.rootCode === 1156).map((node) => String(node.code));
const filter = [
  { match: { grau: "JE" } },
  { terms: { "classe.codigo": [436] } },
  { range: { dataAjuizamento: { gte: "20250101000000", lte: "20260827235959" } } },
];
if (stage === "body" || stage === "combined") filter.push({ terms: { "orgaoJulgador.codigo": bodyCodes.map(Number) } });
if (stage === "subjects" || stage === "combined") filter.push({ terms: { "assuntos.codigo": [...civilCodes, ...consumerCodes].map(Number) } });
if (!["base", "body", "subjects", "combined"].includes(stage)) throw new Error("Estágio diagnóstico inválido.");
const query = { size: 0, track_total_hits: true, _source: false, query: { bool: { filter } } };
const response = await fetch(ENDPOINT, { method: "POST", headers: { Authorization: `APIKey ${await publicKeyInMemory()}`, "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(query), signal: AbortSignal.timeout(40_000) });
const payload = response.ok ? await response.json() : null;
const diagnostic = { title: "Diagnóstico sanitizado de indexação Cível/Consumidor", stage, status: response.status, ok: response.ok, matchedDocuments: Number(payload?.hits?.total?.value ?? 0), totalRelation: payload?.hits?.total?.relation ?? "unknown", termsCount: stage === "subjects" || stage === "combined" ? civilCodes.length + consumerCodes.length : 0, bodyCount: stage === "body" || stage === "combined" ? bodyCodes.length : 0, privacy: "size=0; _source=false; sem hits, identificadores, partes, documentos ou resposta bruta." };
await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, `diagnostico-${stage}.json`), `${JSON.stringify(diagnostic, null, 2)}\n`);
console.log(`RMBH_CIVIL_CONSUMER_DIAGNOSTIC: stage=${stage}; status=${diagnostic.status}; matchedDocuments=${diagnostic.matchedDocuments}; relation=${diagnostic.totalRelation}`);
if (!response.ok) process.exitCode = 1;
