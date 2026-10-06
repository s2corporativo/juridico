import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const TPU_PUBLIC_TREE_URL = "https://www.cnj.jus.br/sgt/consulta_publica_assuntos.php";
export const TPU_CIVIL_CONSUMER_ROOTS = [
  { code: 899, label: "DIREITO CIVIL" },
  { code: 1156, label: "DIREITO DO CONSUMIDOR" },
];
const MAX_NODES = 2_000;
const REQUEST_PAUSE_MS = 180;

export async function readTpuPublicHtml(response) {
  return new TextDecoder("iso-8859-1").decode(await response.arrayBuffer());
}

function normalizeLabel(value) {
  return value.replace(/<[^>]+>/g, "").replace(/&nbsp;/gi, " ").replace(/\s+/g, " ").trim();
}

function decodeAjaxHtml(payload) {
  const start = payload.indexOf("+:var res = '");
  if (start < 0) throw new Error("Resposta institucional sem estrutura de árvore reconhecida.");
  const encoded = payload.slice(start + 13).replace(/';\s*$/, "");
  return encoded.replace(/\\'/g, "'").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\\\/g, "\\");
}

export function parseTpuPublicTreeChildren(payload, expectedParentCode) {
  const html = decodeAjaxHtml(payload);
  const pattern = /id='arvorePublicaId(\d+)'[\s\S]*?summary='arvorePublicaFilhoDo(\d+)'[\s\S]*?id='arvorePublicaDescricao\1'[\s\S]*?>([\s\S]*?)<\/td>/g;
  const children = [];
  const seen = new Set();
  for (const match of html.matchAll(pattern)) {
    const code = Number(match[1]);
    const parentCode = Number(match[2]);
    const label = normalizeLabel(match[3]);
    if (parentCode !== expectedParentCode || !Number.isInteger(code) || !label || seen.has(code)) {
      throw new Error("Estrutura pública de assuntos inconsistente.");
    }
    seen.add(code);
    const segment = html.slice(match.index, match.index + 900);
    children.push({ code, parentCode, label, expandable: new RegExp(`arvorePublicaMaisMenosDo${code}[\\s\\S]*?src=['"]imagens/mais\\.gif`).test(segment) });
  }
  return children;
}

function makeTreeRequestUrl(parentCode) {
  const url = new URL(TPU_PUBLIC_TREE_URL);
  url.searchParams.set("rs", "montarArvoreUtils");
  url.searchParams.set("rst", "");
  url.searchParams.set("rsrnd", "0");
  ["arvorePublica", String(parentCode), "0", "A"].forEach((value) => url.searchParams.append("rsargs[]", value));
  return url;
}

export function extractTpuSourceVersion(homepage) {
  const match = homepage.match(/Vers[^0-9]{0,12}(\d{2}\/\d{2}\/\d{4})/i);
  return match?.[1] ?? "não informada";
}

function assertTree(nodes) {
  const codes = new Set();
  const roots = new Set(TPU_CIVIL_CONSUMER_ROOTS.map(({ code }) => code));
  for (const node of nodes) {
    if (!Number.isInteger(node.code) || !node.label || codes.has(node.code)) throw new Error("Árvore TPU contém nó inválido ou duplicado.");
    if (node.parentCode !== null && !codes.has(node.parentCode)) throw new Error("Árvore TPU contém filho sem ancestral previamente registrado.");
    if (node.parentCode === null && !roots.has(node.code)) throw new Error("Árvore TPU contém raiz não autorizada.");
    codes.add(node.code);
  }
}

export function buildTpuCivilConsumerDataset(nodes, { retrievedAt = new Date().toISOString(), sourceVersion = "não informada" } = {}) {
  assertTree(nodes);
  const descendants = nodes.filter(({ parentCode }) => parentCode !== null);
  const roots = TPU_CIVIL_CONSUMER_ROOTS.map((root) => ({
    ...root,
    descendantCount: descendants.filter((node) => node.rootCode === root.code).length,
  }));
  return {
    schemaVersion: 1,
    scope: "tpu_official_descendants_civil_899_consumer_1156",
    source: {
      authority: "Conselho Nacional de Justiça",
      publicTreeUrl: TPU_PUBLIC_TREE_URL,
      version: sourceVersion,
      method: "Leitura sequencial da expansão pública da árvore de Assuntos TPU; sem dados processuais ou respostas brutas.",
    },
    retrievedAt,
    roots,
    nodes,
    validation: {
      nodeCount: nodes.length,
      descendantCount: descendants.length,
      containsOnlyAuthorizedRoots: true,
      useRestriction: "Mapa taxonômico; não comprova competência, cobertura DataJud, órgão, município ou métrica processual.",
    },
  };
}

export async function refreshTpuCivilConsumerDataset(outputPath, { fetchImpl = fetch, pause = () => new Promise((resolvePause) => setTimeout(resolvePause, REQUEST_PAUSE_MS)), onProgress = () => {} } = {}) {
  const homepageResponse = await fetchImpl(TPU_PUBLIC_TREE_URL, { headers: { accept: "text/html" }, signal: AbortSignal.timeout(30_000) });
  if (!homepageResponse.ok) throw new Error(`Consulta pública TPU respondeu HTTP ${homepageResponse.status}`);
  const homepage = await readTpuPublicHtml(homepageResponse);
  const nodes = TPU_CIVIL_CONSUMER_ROOTS.map((root) => ({ ...root, parentCode: null, rootCode: root.code, depth: 0 }));
  const knownCodes = new Set(nodes.map(({ code }) => code));
  const queue = nodes.map((root) => ({ code: root.code, rootCode: root.code, depth: 0 }));

  while (queue.length > 0) {
    const parent = queue.shift();
    onProgress({ code: parent.code, rootCode: parent.rootCode, depth: parent.depth });
    await pause();
    const response = await fetchImpl(makeTreeRequestUrl(parent.code), { headers: { accept: "text/html" }, signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`Expansão pública TPU do nó ${parent.code} respondeu HTTP ${response.status}`);
    const children = parseTpuPublicTreeChildren(await readTpuPublicHtml(response), parent.code);
    for (const child of children) {
      if (knownCodes.has(child.code)) throw new Error("Árvore TPU contém referência duplicada ou cíclica.");
      if (nodes.length >= MAX_NODES) throw new Error("Árvore TPU excede o limite de segurança de nós.");
      const node = { ...child, rootCode: parent.rootCode, depth: parent.depth + 1 };
      knownCodes.add(node.code);
      nodes.push(node);
      if (node.expandable) queue.push(node);
    }
  }

  const dataset = buildTpuCivilConsumerDataset(nodes, { sourceVersion: extractTpuSourceVersion(homepage) });
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
  return dataset;
}

const directInvocation = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (directInvocation) {
  const outputPath = resolve(process.cwd(), "data/tpu-civil-consumer-tree.json");
  const dataset = await refreshTpuCivilConsumerDataset(outputPath, { onProgress: ({ code, rootCode, depth }) => console.log(`TPU_CIVEL_CONSUMIDOR_EXPANDINDO: nó=${code}; raiz=${rootCode}; nível=${depth}.`) });
  console.log(`TPU_CIVEL_CONSUMIDOR_ATUALIZADA: nós=${dataset.validation.nodeCount}; descendentes=${dataset.validation.descendantCount}; versão=${dataset.source.version}.`);
}
