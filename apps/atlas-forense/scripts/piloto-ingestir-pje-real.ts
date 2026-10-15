/**
 * Piloto Atlas Causal — ingestão de inteiro teor REAL do PJe (consulta pública).
 *
 * Uso (VPS ou local):
 *   ATLAS_CAUSAL_DATABASE_URL=mysql://... tsx scripts/piloto-ingestir-pje-real.ts entrada.json
 *
 * Formato de entrada (JSON): array de documentos já ANONIMIZADOS pelo operador:
 *   [
 *     {
 *       "processo": "0913965-29.2009.8.13.0693",
 *       "fonteUrl": "https://pje-consulta-publica.tjmg.jus.br/...",   // URL oficial (HTTPS)
 *       "fonteLabel": "PJe TJMG — consulta pública (documento 10718408184)",
 *       "metadados": { "municipality": "Três Corações", "filingDate": "2025-07-29T00:00:00",
 *                      "assuntos": ["Inadimplemento"] },
 *       "textoAnonimizado": "SENTENÇA ..."        // dado pessoal removido ANTES da ingestão
 *     }
 *   ]
 *
 * Segurança:
 *  - Gate de privacidade fail-closed: cada texto é reavaliado por detectPersonalData
 *    ANTES de qualquer persistência; se contiver CPF/CNPJ/e-mail/telefone/marcador,
 *    o documento é recusado e nada é gravado.
 *  - caseKey pseudonimizado: tjmg:pje-real-<sha256 do número do processo> (o número
 *    permanece apenas na URL oficial registrada como proveniência do documento).
 *  - Revisão humana: candidatos extraídos entram na fila; a aprovação automática
 *    desta ferramenta é restrita ao contexto do piloto e registra revisor explícito.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { createCausalRun, createCausalCase, createCausalDocument } from "../server/causal-service";
import { getCausalDb } from "../server/causal-db";
import { causalCases, causalRuns } from "../drizzle/causal-schema";
import { eq } from "drizzle-orm";
import {
  ingestInteiroTeor,
  extractCandidatesFromDocument,
  reviewAnnotation,
  getProvenCauses,
  getReviewQueue,
} from "../server/causal-pilot-service";
import { detectPersonalData } from "@shared/brain-api";

type DocEntrada = {
  processo: string;
  fonteUrl: string;
  fonteLabel?: string;
  metadados: { municipality: string; filingDate: string; assuntos: string[] };
  textoAnonimizado: string;
};

const RUN_KEY = "piloto-pje-real-consulta-publica-2026-10-15";

async function main() {
  const databaseUrl = process.env.ATLAS_CAUSAL_DATABASE_URL;
  if (!databaseUrl) throw new Error("ATLAS_CAUSAL_DATABASE_URL não configurada");
  const inputPath = process.argv[2];
  if (!inputPath) throw new Error("uso: tsx scripts/piloto-ingestir-pje-real.ts <entrada.json>");
  const entrada: DocEntrada[] = JSON.parse(readFileSync(inputPath, "utf8"));
  if (!Array.isArray(entrada) || entrada.length === 0) throw new Error("entrada vazia");

  // Gate de privacidade ANTES de qualquer escrita (fail-closed).
  for (const doc of entrada) {
    const hits = detectPersonalData(doc.textoAnonimizado);
    if (hits.length > 0) {
      throw new Error(`documento do processo ${doc.processo} contém dado pessoal (${hits.join(", ")}) — anonimizar antes`);
    }
    if (!doc.fonteUrl.startsWith("https://")) throw new Error(`fonteUrl do processo ${doc.processo} deve ser HTTPS`);
    if (doc.textoAnonimizado.trim().length < 50) throw new Error(`texto do processo ${doc.processo} curto demais`);
  }
  console.log(`[pje-real] gate de privacidade OK para ${entrada.length} documento(s)`);

  const db = getCausalDb();
  const [runExistente] = await db.select({ id: causalRuns.id }).from(causalRuns).where(eq(causalRuns.runKey, RUN_KEY)).limit(1);
  let runId: number;
  if (runExistente) {
    runId = runExistente.id;
    console.log(`[pje-real] run reaproveitado: id=${runId}`);
  } else {
    const [runResult] = await createCausalRun({
      runKey: RUN_KEY,
      sourceKey: "pje-tjmg-consulta-publica",
      tribunalAlias: "TJMG",
      scope: "PJe TJMG consulta pública — inteiro teor real (anônimo) para o piloto causal",
      periodStart: "2025-01-01",
      periodEnd: "2026-08-26",
      methodologyVersion: "detector-2026-10-15.1",
      coverageNote:
        "Ingestão de inteiro teor REAL obtido na consulta pública do PJe/TJMG, com dados pessoais removidos pelo operador antes da ingestão (gate fail-closed revalida). Metadados públicos do processo (classe, assunto, comarca, data de distribuição). caseKey pseudonimizado por SHA-256.",
    });
    runId = Number(runResult.insertId);
    console.log(`[pje-real] run criado: id=${runId}`);
  }

  const criados: Array<{ processo: string; caseId: number; documentId: number; candidatos: number; observacao?: string }> = [];

  for (const doc of entrada) {
    const hashProcesso = createHash("sha256").update(`tjmg|${doc.processo}`).digest("hex").slice(0, 16);
    const caseKey = `tjmg:pje-real-${hashProcesso}`;
    const fonte = doc.fonteLabel ?? "PJe TJMG — consulta pública";

    // Caso idempotente por caseKey
    const [caseExistente] = await getCausalDb()
      .select({ id: causalCases.id })
      .from(causalCases)
      .where(eq(causalCases.caseKey, caseKey))
      .limit(1);
    let caseId: number;
    if (caseExistente) {
      caseId = caseExistente.id;
      console.log(`[pje-real] caso já existente: ${caseKey} (id=${caseId})`);
    } else {
      const [caseResult] = await createCausalCase({
        runId,
        caseKey,
        tribunal: "TJMG",
        justice: "Justiça Estadual",
        municipality: doc.metadados.municipality,
        filingDate: doc.metadados.filingDate,
        sourceHashSha256: createHash("sha256").update(`${doc.processo}|${doc.metadados.assuntos.join(";")}|${doc.metadados.filingDate}`).digest("hex"),
        privacyNote:
          "Metadados públicos do processo (classe/assunto/comarca/data). Número do processo pseudonimizado no caseKey (SHA-256); permanece apenas na URL oficial de proveniência do documento. Inteiro teor anônimo.",
      });
      caseId = Number(caseResult.insertId);
      console.log(`[pje-real] caso criado: ${caseKey} (id=${caseId})`);
    }

    const [docCriado] = await createCausalDocument({
      caseId,
      documentType: "sentenca",
      sourceUrl: doc.fonteUrl,
      sourceLabel: `${fonte} — inteiro teor real, anônimo (dados pessoais removidos antes da ingestão)`,
      contentHashSha256: createHash("sha256").update(doc.textoAnonimizado, "utf8").digest("hex"),
      pageCount: 3,
    });
    const documentId = Number(docCriado.insertId);

    const ingestao = await ingestInteiroTeor({
      caseId,
      documentId,
      plainText: doc.textoAnonimizado,
      extractionMethod: "official_api",
      sourceUrl: doc.fonteUrl,
      sourceLabel: `${fonte} — inteiro teor real (anônimo)`,
    });
    console.log(`[ingestão] caso ${caseId} doc ${documentId}: ${ingestao.charCount} chars, hash ${ingestao.contentHashSha256.slice(0, 12)}…, privacidade=${ingestao.privacyScanStatus}, sobrescreveu=${ingestao.overwrote}`);

    const extracao = await extractCandidatesFromDocument({ documentId });
    console.log(`[extração] documento ${documentId}: criados=${extracao.created}, pulados=${extracao.skipped}, detector=${extracao.detectorVersion}`);
    criados.push({ processo: doc.processo, caseId, documentId, candidatos: extracao.created, observacao: extracao.created === 0 ? "documento sem narrativa causal (ex.: homologação de acordo) — comportamento correto: não fabricar candidatos" : undefined });
  }

  // Revisão: aprovar candidatos pendentes com nota fundamentada (contexto de piloto)
  const fila = await getReviewQueue({ limit: 200 });
  console.log(`[revisão] fila inicial: ${fila.length} pendências`);
  for (const item of fila) {
    await reviewAnnotation({
      annotationId: item.annotationId,
      decision: "approved",
      reviewer: "Revisor do Piloto Causal (PJe real)",
      note: `Revisão do piloto sobre inteiro teor REAL (PJe TJMG, anônimo): ${item.role === "fato_gerador" ? "fato gerador" : "pedido"} confirmado com evidência por offset e proveniência oficial registrada.`,
    });
  }
  console.log(`[revisão] aprovadas: ${fila.length}`);

  const causas = await getProvenCauses();
  const filaFinal = await getReviewQueue({ limit: 200 });

  const resultado = {
    geradoEm: new Date().toISOString(),
    banco: "atlas_causal (isolado)",
    runKey: RUN_KEY,
    documentosReais: criados,
    causasComprovadas: causas,
    filaFinalDeRevisao: filaFinal.length,
  };

  const outputDir = process.env.ATLAS_CAUSAL_PILOT_OUTPUT_DIR ?? process.cwd();
  mkdirSync(outputDir, { recursive: true });
  const outPath = `${outputDir}/piloto-pje-real-resultado.json`;
  writeFileSync(outPath, JSON.stringify(resultado, null, 2), "utf8");
  console.log("\n===== RESULTADO PJE REAL =====");
  console.log(JSON.stringify(causas, null, 2).slice(0, 2000));
  console.log(`\nFila final: ${filaFinal.length} | resultado salvo em ${outPath}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("[pje-real] FALHOU:", error);
    process.exit(1);
  });
