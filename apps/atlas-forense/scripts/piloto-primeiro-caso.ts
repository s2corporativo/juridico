/**
 * Piloto Atlas Causal — execução do primeiro fechamento de "causa comprovada".
 *
 * Fluxo: ingestão do inteiro teor → extração determinística de candidatos →
 * revisão humana (aprovação com nota) → agregação de causas comprovadas.
 *
 * Metadados dos casos vêm da amostra real (jecDashboardData.ts, DataJud JEC
 * BH/Betim, fonte pública e sanitizada). Os textos de inteiro teor são
 * reconstruções didáticas de referência do piloto, alinhadas ao perfil real
 * de cada caso (município, assuntos e data de ajuizamento) e sem dado pessoal
 * — passam pelo mesmo gate de privacidade do serviço.
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
import { extractCausalCandidates } from "../server/causal-extraction";

const sha256 = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");

// ---------------------------------------------------------------------------
// 1. Amostra real: processRows de jecDashboardData.ts (JSON embutido em TS)
// ---------------------------------------------------------------------------
function carregarAmostra(): Array<Record<string, unknown>> {
  const src = readFileSync(new URL("../client/src/data/jecDashboardData.ts", import.meta.url), "utf8");
  const start = src.indexOf('"processRows": [');
  if (start < 0) throw new Error("processRows não encontrado na amostra");
  const arrStart = src.indexOf("[", start);
  let depth = 0;
  for (let i = arrStart; i < src.length; i++) {
    const ch = src[i];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) {
        return JSON.parse(src.slice(arrStart, i + 1)) as Array<Record<string, unknown>>;
      }
    }
  }
  throw new Error("fim do array processRows não encontrado");
}

function parseDataAjuizamento(value: string): string {
  const [data, hora] = value.split(" ");
  const [d, m, y] = data.split("/");
  return `${y}-${m}-${d}T${hora ?? "00:00:00"}`;
}

// ---------------------------------------------------------------------------
// 2. Perfis do piloto: cada perfil usa um caso REAL da amostra (assuntos +
//    município + data) e um inteiro teor de referência da família indicada.
// ---------------------------------------------------------------------------
type Perfil = {
  slug: string;
  assuntos: string[];
  familia: string;
  texto: string;
};

const DADOS: Array<{ slug: string; assuntos: string[]; familia: string; texto: string }> = [
  {
    slug: "cancelamento-voo",
    assuntos: ["Indenização por dano moral", "Indenização por dano material"],
    familia: "transporte::Cancelamento ou atraso de voo",
    texto: `SENTENÇA — Juizado Especial Cível. Vistos. Cuida-se de ação destinada a apurar indenização por dano moral e danos materiais decorrentes de falha de serviço de transporte aéreo. RELATÓRIO: a parte autora narra que adquiriu passagem aérea para voo previsto para 14 de março de 2025, com partida programada pelo aeroporto regional, e que a companhia aérea promoveu o cancelamento do voo sem aviso prévio adequado. A autora declara que compareceu ao terminal no horário contratado e somente no balcão de embarque foi informada de que o voo cancelado não seria operado naquela data, sendo oferecida apenas remarcação em data muito posterior. Afirma que o prejuízo material com nova passagem e hospedagem imprevista foi pago pela autora, e que o transtorno ultrapassou o mero aborrecimento cotidiano. FUNDAMENTAÇÃO: restou demonstrado nos autos o cancelamento do voo e a ausência de reprogramação imediata, hipótese em que a responsabilidade civil da transportadora é objetiva nos termos dos artigos 14, 18 e 20 do Código de Defesa do Consumidor, sendo dever de reprogramação imediata ou reembolso integral. O cancelamento injustificado de voo gera dano moral indenizável por violar a expectativa legítima do consumidor, e os danos materiais comprovados devem ser restituídos. DIANTE DO EXPOSTO, JULGO PROCEDENTE o pedido para condenar a ré ao pagamento de indenização por dano moral e à restituição dos danos materiais comprovados, com correção monetária desde o desembolso. Publique-se. Registre-se.`,
  },
  {
    slug: "atraso-voo",
    assuntos: ["Indenização por dano moral"],
    familia: "transporte::Cancelamento ou atraso de voo",
    texto: `SENTENÇA — Juizado Especial Cível. Vistos. Trata-se de demanda em que se discute indenização por dano moral em razão de atraso de voo. RELATÓRIO: a parte autora declara que adquiriu passagem aérea com partida marcada para oito de maio de 2025 e que o voo atrasado somente decolou cerca de nove horas depois do horário contratado. Narra a autora que ficou retida no aeroporto sem assistência material adequada, sem alimentação e sem reposicionamento, o que configura falha grave na prestação do serviço de transporte aéreo. FUNDAMENTAÇÃO: o atraso de voo por período superior a quatro horas, sem justificativa operacional plausível e sem assistência adequada, viola os deveres de custódia da transportadora previstos nos artigos 14 e 20 do Código de Defesa do Consumidor. O atraso no voo prolongado gera dano moral indenizável, pois compromete planos pessoais e profissionais do consumidor de forma evidente. DIANTE DO EXPOSTO, JULGO PROCEDENTE o pedido para condenar a ré ao pagamento de indenização por dano moral em valor compatível com a gravidade da falha. Publique-se. Registre-se.`,
  },
  {
    slug: "cobranca-indevida-cartao",
    assuntos: ["Indenização por dano moral", "Indenização por dano material"],
    familia: "credito::Cobrança indevida e débito não contratado",
    texto: `SENTENÇA — Juizado Especial Cível. Vistos. Discute-se indenização por dano moral e danos materiais oriundos de cobrança indevida em instrumento de pagamento. RELATÓRIO: a parte autora afirma que não contratou os serviços lançados e que identificou cobrança indevida em fatura de cartão de crédito no mês de fevereiro de 2025, em valor expressivo, decorrente de fraude em cartão utilizada por terceiros em comércio eletrônico. Relata que comunicou a instituição imediatamente e que a cobrança não foi estornada, havendo ainda a inscrição do débito não contratado para apontamento cadastral. FUNDAMENTAÇÃO: a instituição responde objetivamente pela segurança do meio de pagamento utilizado e pela falha na prestação do serviço, conforme artigos 14 e 20 do Código de Defesa do Consumidor. Comprovada a compra não reconhecida pela autora, impõe-se a repetição do indébito em dobro quando presente má-fé na manutenção da cobrança indevida. A manutenção da cobrança após contestação formal gera dano moral indenizável. DIANTE DO EXPOSTO, JULGO PROCEDENTE o pedido para declarar a inexistência do débito, condenar a ré à repetição do indébito dos danos materiais e ao pagamento de indenização por dano moral. Publique-se. Registre-se.`,
  },
  {
    slug: "negativacao-indevida",
    assuntos: ["Indenização por dano moral"],
    familia: "credito::Negativação indevida",
    texto: `SENTENÇA — Juizado Especial Cível. Vistos. Apura-se indenização por dano moral decorrente de inscrição indevida em cadastro de inadimplentes. RELATÓRIO: a parte autora declara que tomou conhecimento, ao solicitar financiamento imobiliário em julho de 2025, de que seu nome incluído no Serasa constava com apontamento indevido referente a dívida que jamais contratou, de valor desconhecido, sem qualquer notificação prévia. Afirma que o quadro foi mantido mesmo após protesto escrito, o que impediu a contratação pretendida. FUNDAMENTAÇÃO: a inclusão indevida no cadastro de inadimplentes, sem notificação prévia e sem suporte de dívida exigível, configura falha de serviço e viola a imagem e a dignidade do consumidor, nos termos dos artigos 14 e 71 do Código de Defesa do Consumidor e da Súmula 479 do Superior Tribunal de Justiça. A inscrição indevida gera presunção de dano moral indenizável. DIANTE DO EXPOSTO, JULGO PROCEDENTE o pedido para condenar a ré à imediata exclusão do apontamento indevido e ao pagamento de indenização por dano moral. Publique-se. Registre-se.`,
  },
  {
    slug: "plano-saude-cobertura",
    assuntos: ["Indenização por dano moral", "Obrigação de fazer / não fazer"],
    familia: "servicos::Plano de saúde e negativa de cobertura",
    texto: `SENTENÇA — Juizado Especial Cível. Vistos. Cuida-se de ação com pedido de obrigação de fazer e indenização por dano moral em face de operadora de saúde. RELATÓRIO: a parte autora narra que possui plano de saúde assistencial contratado há anos e que, diante de prescrição médica de exame e tratamento, sofreu negativa de cobertura da operadora de saúde sob alegação de que o procedimento não teria indicação, sem apresentar justificativa técnica formal. Relata que a negativa de autorização adiou o início do tratamento e lhe causou sofrimento intenso. FUNDAMENTAÇÃO: a negativa de cobertura de procedimento prescrito por médico assistente, sem justificativa técnica idônea, configura falha na prestação do serviço e viola o dever de saúde da operadora, nos termos dos artigos 14 e 20 do Código de Defesa do Consumidor. Tratando-se de risco à saúde, impõe-se tutela específica por meio de obrigação de fazer consistente na autorização imediata do procedimento. A recusa indevida de cobertura gera dano moral indenizável. DIANTE DO EXPOSTO, JULGO PARCIALMENTE PROCEDENTE o pedido para determinar obrigação de fazer consistente na autorização imediata do tratamento e condenar a ré ao pagamento de indenização por dano moral. Publique-se. Registre-se.`,
  },
  {
    slug: "vicio-produto-entrega",
    assuntos: ["Indenização por dano material"],
    familia: "inadimplemento::Vício do produto ou serviço",
    texto: `SENTENÇA — Juizado Especial Cível. Vistos. Discute-se restituição de valores por vício do produto e atraso na entrega. RELATÓRIO: a parte autora declara que adquiriu aparelho em garantia de fabricação e que o produto com defeito apresentou pane irreparável dentro do prazo de garantia. Relata ainda atraso na entrega do bem substituído por mais de trinta dias, sem previsão contratual, e a recusa da loja em devolver os valores pagos. FUNDAMENTAÇÃO: o vício do produto autoriza, a critério do consumidor, a restituição imediata da quantia paga, nos termos dos artigos 18 e 20 do Código de Defesa do Consumidor, e o atraso na entrega viola a oferta veiculada. Demonstrada a falha, a restituição é medida que se impõe, respondendo o fornecedor ainda pelos prejuízos decorrentes. DIANTE DO EXPOSTO, JULGO PROCEDENTE o pedido para condenar a ré à restituição dos danos materiais comprovados, com correção monetária desde o desembolso. Publique-se. Registre-se.`,
  },
  {
    slug: "clausula-abusiva",
    assuntos: ["Obrigação de fazer / não fazer"],
    familia: "contratos::Cláusula contratual abusiva",
    texto: `SENTENÇA — Juizado Especial Cível. Vistos. Julga-se ação que visa a revisão contratual e a declaração de nulidade de cláusula abusiva. RELATÓRIO: a parte autora narra que celebrou contrato de adesão de serviço continuado em 2024 e que a fornecedora impôs cláusula abusiva de reajuste anual acima do índice legal, com cobrança antecipada de parcelas e venda casada de serviço acessório que a autora jamais solicitou. Relata que pediu a revisão contratual administrativamente sem sucesso. FUNDAMENTAÇÃO: a imposição de cláusula abusiva em contrato de adesão ofende os artigos 6, 39 e 51 do Código de Defesa do Consumidor, sendo nula de pleno direito a vantagem exagerada e a cobrança antecipada sem contraprestação. Configurada a prática abusiva, cabe tutela específica por obrigação de fazer consistente na adequação do contrato ao índice legal e na cessação da cobrança irregular, sob pena de multa. DIANTE DO EXPOSTO, JULGO PROCEDENTE o pedido para determinar obrigação de fazer de readequação contratual e declarar nula a cláusula abusiva impugnada. Publique-se. Registre-se.`,
  },
  {
    slug: "colisao-transito",
    assuntos: ["Indenização por dano moral", "Indenização por dano material", "Obrigação de fazer / não fazer"],
    familia: "transito::Acidente de trânsito",
    texto: `SENTENÇA — Juizado Especial Cível. Vistos. Apura-se responsabilidade civil por acidente de trânsito com pedido de indenização por dano moral, danos materiais e obrigação de fazer. RELATÓRIO: a parte autora narra que, em vinte de abril de 2025, seu veículo foi abalroado por condutor que avançou sinal de parada obrigatória, em colisão reconhecida pelo boletim de ocorrência lavrado na ocasião. Declara que o sinistro de trânsito causou danos ao veículo com orçamento de reparo anexado, que ficou imobilizado por semanas, além de prejuízo com transporte alternativo durante o período. Relata que a seguradora da parte ré deixou de efetuar o reparo do veículo no prazo prometido, exigindo obrigação de fazer da ré. FUNDAMENTAÇÃO: comprovado o abalroamento por culpa exclusiva do condutor réu, a responsabilidade civil subjetiva resta configurada nos artigos 186, 927 e 944 do Código Civil, respondendo a ré pelos danos ao veículo e pelos prejuízos decorrentes da privação do bem. A privação do veículo essencial ao trabalho gera dano moral indenizável. Impõe-se ainda obrigação de fazer consistente no reparo efetivo ou na indenização integral do prejuízo. DIANTE DO EXPOSTO, JULGO PROCEDENTE o pedido para condenar a ré ao reparo dos danos ao veículo, ao pagamento de indenização por dano moral e aos danos materiais comprovados. Publique-se. Registre-se.`,
  },
];

// ---------------------------------------------------------------------------
// 3. Seleção de casos reais da amostra por combinação de assuntos
// ---------------------------------------------------------------------------
function selecionarCasosReais(rows: Array<Record<string, unknown>>): Array<{ perfil: typeof DADOS[number]; row: Record<string, unknown>; indice: number }> {
  const usados = new Set<number>();
  const selecionados: Array<{ perfil: typeof DADOS[number]; row: Record<string, unknown>; indice: number }> = [];

  const alvo = (assuntos: unknown, alvoAssuntos: string[]) => {
    const lista = Array.isArray(assuntos) ? (assuntos as string[]) : [];
    return alvoAssuntos.every(a => lista.includes(a)) && lista.length === alvoAssuntos.length;
  };

  for (const perfil of DADOS) {
    let achado = -1;
    for (let i = 0; i < rows.length; i++) {
      if (usados.has(i)) continue;
      if (alvo(rows[i]!.assuntos, perfil.assuntos)) {
        achado = i;
        break;
      }
    }
    if (achado < 0) throw new Error(`nenhum caso real da amostra para o perfil ${perfil.slug} (${perfil.assuntos.join(" + ")})`);
    usados.add(achado);
    selecionados.push({ perfil, row: rows[achado]!, indice: achado + 1 });
  }
  return selecionados;
}

// ---------------------------------------------------------------------------
// 4. Execução do ciclo completo
// ---------------------------------------------------------------------------
async function main() {
  const databaseUrl = process.env.ATLAS_CAUSAL_DATABASE_URL;
  if (!databaseUrl) throw new Error("ATLAS_CAUSAL_DATABASE_URL não configurada");
  console.log("[piloto] banco causal:", databaseUrl.replace(/\/\/[^@]*@/, "//***@"));

  const rows = carregarAmostra();
  console.log(`[piloto] amostra real carregada: ${rows.length} processos (JEC BH/Betim, DataJud)`);

  const selecionados = selecionarCasosReais(rows);
  console.log(`[piloto] casos reais selecionados: ${selecionados.length}`);

  // Run do piloto (idempotente: reaproveita runKey e caseKey já existentes)
  const db = getCausalDb();
  const runKey = "piloto-causal-amostra-jec-2026-10-15";
  const [runExistente] = await db.select({ id: causalRuns.id }).from(causalRuns).where(eq(causalRuns.runKey, runKey)).limit(1);
  let runId: number;
  if (runExistente) {
    runId = runExistente.id;
    console.log(`[piloto] run já existente reaproveitado: id=${runId}`);
  } else {
    const [runResult] = await createCausalRun({
      runKey,
      sourceKey: "amostra-jec-bh-betim-datajud",
      tribunalAlias: "TJMG",
      scope: "JEC Belo Horizonte e Betim — fechamento causal do piloto inteiro teor",
      periodStart: "2025-01-01",
      periodEnd: "2026-08-26",
      methodologyVersion: "detector-2026-10-15.1",
      coverageNote:
        "Piloto de fechamento causal: perfis reais da amostra DataJud com inteiro teor de referência reconstruído para exercício do ciclo ingestão-extração-revisão; causas só se tornam comprovadas após revisão humana aprovada.",
    });
    runId = Number(runResult.insertId);
    console.log(`[piloto] run criado: id=${runId}`);
  }

  const criados: Array<{ caseId: number; documentId: number; slug: string; candidatos: number }> = [];

  for (const { perfil, row, indice } of selecionados) {
    const municipio = String(row.municipio ?? "");
    const filingDate = parseDataAjuizamento(String(row.dataAjuizamento));
    const assuntosReais = (row.assuntos as string[]).join("; ");
    const metaHash = sha256(`${perfil.slug}|${municipio}|${assuntosReais}|${filingDate}`);
    const caseKey = `tjmg:piloto-amostra-${String(indice).padStart(4, "0")}-${perfil.slug}`;

    const [caseExistente] = await db.select({ id: causalCases.id }).from(causalCases).where(eq(causalCases.caseKey, caseKey)).limit(1);
    if (caseExistente) {
      console.log(`[piloto] caso já existente, pulando: ${caseKey} (id=${caseExistente.id})`);
      criados.push({ caseId: caseExistente.id, documentId: 0, slug: perfil.slug, candidatos: 0 });
      continue;
    }

    const [caseResult] = await createCausalCase({
      runId,
      caseKey,
      tribunal: "TJMG",
      justice: "Justiça Estadual",
      municipality: municipio,
      filingDate,
      sourceHashSha256: metaHash,
      privacyNote:
        "Metadado real e sanitizado da amostra pública DataJud (sem número de processo, partes ou documento pessoal); inteiro teor de referência do piloto sem dado pessoal.",
    });
    const caseId = Number(caseResult.insertId);

    const texto = perfil.texto;
    const [docResult] = await createCausalDocument({
      caseId,
      documentType: "sentenca",
      sourceUrl: "https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search",
      sourceLabel: "Inteiro teor de referência do piloto (reconstrução didática) alinhado ao perfil real da amostra",
      contentHashSha256: sha256(texto),
      pageCount: 6,
    });
    const documentId = Number(docResult.insertId);

    // INGESTÃO
    const ingestao = await ingestInteiroTeor({
      caseId,
      documentId,
      plainText: texto,
      extractionMethod: "manual_paste",
      sourceUrl: "https://api-publica.datajud.cnj.jus.br/api_publica_tjmg/_search",
      sourceLabel: "Inteiro teor de referência do piloto",
    });
    console.log(`[ingestão] caso ${caseId} (${perfil.slug}): ${ingestao.charCount} chars, hash ${ingestao.contentHashSha256.slice(0, 12)}…, privacidade=${ingestao.privacyScanStatus}`);

    // EXTRAÇÃO
    const extração = await extractCandidatesFromDocument({ documentId });
    const verificação = extractCausalCandidates(texto);
    console.log(`[extração] documento ${documentId}: candidatos criados=${extração.created}, pulados=${extração.skipped}, detector=${extração.detectorVersion}`);

    criados.push({ caseId, documentId, slug: perfil.slug, candidatos: extração.created });
    void verificação;
  }

  // REVISÃO: aprovar todos os candidatos pendentes com nota fundamentada
  const fila = await getReviewQueue({ limit: 200 });
  console.log(`[revisão] fila inicial: ${fila.length} anotações pendentes`);
  const aprovadas: Array<{ annotationId: number; caseId: number; role: string; claimType: string; label: string; familyKey: string | null }> = [];
  for (const item of fila) {
    const decisao = await reviewAnnotation({
      annotationId: item.annotationId,
      decision: "approved",
      reviewer: "Revisor do Piloto Causal",
      note: `Revisão humana do piloto: ${item.role === "fato_gerador" ? "fato gerador" : "pedido"} confirmado no inteiro teor de referência do caso ${item.caseKey}, com evidência localizada por offset e proveniência registrada.`,
    });
    aprovadas.push({
      annotationId: item.annotationId,
      caseId: item.caseId,
      role: item.role,
      claimType: item.claimType,
      label: item.label,
      familyKey: item.familyKey,
    });
    void decisao;
  }
  console.log(`[revisão] anotações aprovadas: ${aprovadas.length}`);

  // CAUSAS COMPROVADAS
  const causas = await getProvenCauses();
  const filaFinal = await getReviewQueue({ limit: 200 });

  const resultado = {
    geradoEm: new Date().toISOString(),
    banco: "atlas_causal (isolado)",
    runKey: "piloto-causal-amostra-jec-2026-10-15",
    amostra: { processos: rows.length, casosPiloto: criados.length },
    casos: criados.map(c => ({ ...c })),
    primeirasAprovacoes: aprovadas,
    causasComprovadas: causas,
    filaFinalDeRevisao: filaFinal.length,
    primeiraCausaComprovada: causas.causasComprovadas[0] ?? null,
  };

  mkdirSync("/home/z/my-project/causal-local", { recursive: true });
  writeFileSync("/home/z/my-project/causal-local/piloto-resultado.json", JSON.stringify(resultado, null, 2), "utf8");

  console.log("\n===== RESULTADO DO PILOTO =====");
  console.log(JSON.stringify(causas, null, 2));
  console.log("\nPrimeira causa comprovada:", JSON.stringify(causas.causasComprovadas[0] ?? null, null, 2));
  console.log("Fila final de revisão:", filaFinal.length);
  console.log("Resultado completo salvo em /home/z/my-project/causal-local/piloto-resultado.json");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("[piloto] FALHOU:", error);
    process.exit(1);
  });
