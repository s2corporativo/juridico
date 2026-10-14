import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeCase, summarizeAnalyses } from "./causal-movement-analysis.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputDir = process.env.ATLAS_CAUSAL_PILOT_OUTPUT_DIR ?? path.join(root, "data", "rmbh-causal-pilot");
const inputPath = process.env.ATLAS_CAUSAL_PILOT_INPUT ?? path.join(inputDir, "rmbh_causal_pilot_sanitized.json");
const outputPath = process.env.ATLAS_CAUSAL_ANALYSIS_OUTPUT ?? path.join(inputDir, "rmbh_causal_pilot_analysis.json");
const records = JSON.parse(await readFile(inputPath, "utf8"));
if (!Array.isArray(records)) throw new Error("O artefato sanitizado deve ser uma lista de casos.");
const analyses = records.map(analyzeCase);
const output = { generatedAt: new Date().toISOString(), source: inputPath, methodologyVersion: "causal-movement-analysis-v1", privacy: "Análise sobre artefato já sanitizado; sem nomes de partes, documentos integrais ou resultado jurídico definitivo.", summary: summarizeAnalyses(analyses), cases: analyses };
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`ATLAS_CAUSAL_ANALYSIS: ${analyses.length} casos analisados; candidatos=${output.summary.candidatesPendingReview}; saída=${outputPath}`);
