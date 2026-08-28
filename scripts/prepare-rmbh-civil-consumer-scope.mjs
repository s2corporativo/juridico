import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const sourcePath = path.join(projectRoot, "data", "rmbh_tjmg_jec_orgaos_agregados.json");
const outputPath = path.join(projectRoot, "data", "rmbh-civil-consumer-scope.json");

const CIVIL_LABEL = /\b(cível|civel)\b/i;
const CRIMINAL_LABEL = /\b(criminal|crime|criminais)\b/i;

const source = JSON.parse(await readFile(sourcePath, "utf8"));
if (!Array.isArray(source)) throw new Error("Facetas RMBH inválidas: esperado array.");

const bodies = source
  .filter((row) => typeof row?.judgingBodyCode === "string")
  .filter((row) => CIVIL_LABEL.test(String(row.judgingBodyLabel ?? "")))
  .filter((row) => !CRIMINAL_LABEL.test(String(row.judgingBodyLabel ?? "")))
  .map((row) => ({
    municipality: String(row.municipality),
    municipalityIbgeCode: String(row.municipalityIbgeCode),
    judgingBodyCode: row.judgingBodyCode,
    judgingBodyLabel: String(row.judgingBodyLabel),
    sourceFacetAmount: Number(row.amount),
  }))
  .sort((a, b) => a.municipality.localeCompare(b.municipality, "pt-BR") || a.judgingBodyCode.localeCompare(b.judgingBodyCode));

const codes = new Set();
for (const row of bodies) {
  if (codes.has(row.judgingBodyCode)) throw new Error(`Órgão duplicado no escopo: ${row.judgingBodyCode}`);
  codes.add(row.judgingBodyCode);
}

const municipalities = [...new Set(bodies.map((row) => row.municipality))].sort((a, b) => a.localeCompare(b, "pt-BR"));
const artifact = {
  title: "Escopo confirmado para piloto Cível/Consumidor RMBH",
  version: "2026-08-28-rmbh-civil-consumer-scope-v1",
  sourceKey: "rmbh-tjmg-facets-20260828",
  source: "CNJ/DataJud API Pública; facetas RMBH previamente coletadas",
  selectionRule: "Inclui apenas rótulos institucionais com termo cível/civel e exclui rótulos criminais; não infere competência por município.",
  municipalities,
  bodies,
  limits: {
    maximumBodiesPerExecution: 24,
    noProcessHits: true,
    noRawResponses: true,
    noPersonalData: true,
    municipalityIsLabelBased: true,
  },
};

await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
console.log(`RMBH_CIVIL_CONSUMER_SCOPE: ${bodies.length} órgãos cíveis em ${municipalities.length} municípios.`);
console.log(`RMBH_CIVIL_CONSUMER_SCOPE_OUTPUT: ${outputPath}`);
