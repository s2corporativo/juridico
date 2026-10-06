import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_DATAJUD_TERMS = 1_024;
const ROOT_CODES = [899, 1156];

export function buildCivilConsumerDescendantFilter(tree) {
  if (tree?.scope !== "tpu_official_descendants_civil_899_consumer_1156") throw new Error("Árvore TPU fora do escopo Cível/Consumidor autorizado.");
  const codes = tree.nodes.map((node) => node.code);
  if (!codes.every(Number.isInteger) || new Set(codes).size !== codes.length) throw new Error("Árvore TPU contém códigos inválidos ou duplicados.");
  if (!ROOT_CODES.every((code) => codes.includes(code)) || !codes.every((code) => ROOT_CODES.includes(tree.nodes.find((node) => node.code === code)?.rootCode))) {
    throw new Error("Árvore TPU contém raiz ou vínculo de descendência não autorizado.");
  }
  if (codes.length > MAX_DATAJUD_TERMS) throw new Error("Árvore TPU excede o limite conservador de termos para pré-teste DataJud.");
  return {
    schemaVersion: 1,
    scope: "rmbh_civil_consumer_descendant_filter_preparation",
    treeSource: { authority: tree.source.authority, publicTreeUrl: tree.source.publicTreeUrl, version: tree.source.version, retrievedAt: tree.retrievedAt },
    subjectCodes: codes.sort((left, right) => left - right),
    roots: tree.roots.map(({ code, label, descendantCount }) => ({ code, label, descendantCount })),
    readiness: {
      termsCount: codes.length,
      maxConservativeTerms: MAX_DATAJUD_TERMS,
      eligibleForSingleTermsClause: true,
      datajudValidation: "pending",
      executionRestriction: "Não executar este filtro sem autorização específica, consulta agregada size:0, _source:false e validação de classe, grau, órgão e indexação DataJud.",
    },
  };
}

export async function prepareCivilConsumerDescendantFilter(treePath, outputPath) {
  const tree = JSON.parse(await readFile(treePath, "utf8"));
  const filter = buildCivilConsumerDescendantFilter(tree);
  await writeFile(outputPath, `${JSON.stringify(filter, null, 2)}\n`, "utf8");
  return filter;
}

const directInvocation = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (directInvocation) {
  const cwd = process.cwd();
  const filter = await prepareCivilConsumerDescendantFilter(resolve(cwd, "data/tpu-civil-consumer-tree.json"), resolve(cwd, "data/rmbh-civil-consumer-descendant-filter.json"));
  console.log(`FILTRO_TPU_CIVEL_CONSUMIDOR_PREPARADO: termos=${filter.readiness.termsCount}; estado=${filter.readiness.datajudValidation}.`);
}
