/**
 * Motor de prescrição portado do LexValida (app/core/prescricao.py) para TypeScript.
 *
 * Somente prazos de previsão legal expressa e incontroversa estão catalogados. Para qualquer
 * outra pretensão, informe o prazo e a base legal manualmente (parâmetro `prazoAnos` +
 * `baseLegal`). Termo inicial (actio nata) e causas suspensivas/interruptivas são fatos que
 * o advogado deve fixar: o sistema não os presume.
 */

import { dataDe, chaveData, fmtBR } from "./prazos-module";

export interface CatalogoPrescricao {
  anos: number;
  base: string;
  descricao: string;
}

export const CATALOGO: Record<string, CatalogoPrescricao> = {
  geral: {
    anos: 10,
    base: "CC, art. 205",
    descricao: "Prazo geral, quando a lei não fixar prazo menor",
  },
  reparacao_civil: {
    anos: 3,
    base: "CC, art. 206, § 3º, V",
    descricao: "Pretensão de reparação civil",
  },
  enriquecimento_sem_causa: {
    anos: 3,
    base: "CC, art. 206, § 3º, IV",
    descricao: "Ressarcimento de enriquecimento sem causa",
  },
  divida_liquida_instrumento: {
    anos: 5,
    base: "CC, art. 206, § 5º, I",
    descricao: "Cobrança de dívida líquida constante de instrumento público ou particular",
  },
  cdc_fato_do_produto: {
    anos: 5,
    base: "CDC, art. 27",
    descricao: "Reparação por fato do produto ou do serviço",
  },
  fazenda_publica: {
    anos: 5,
    base: "Decreto 20.910/1932, art. 1º",
    descricao: "Dívidas passivas da Fazenda Pública",
  },
  trabalhista: {
    anos: 5,
    base: "CF, art. 7º, XXIX; CLT, art. 11",
    descricao:
      "Créditos trabalhistas (quinquenal, limitada a 2 anos após a extinção do contrato)",
  },
};

export function ehAnoBissexto(ano: number): boolean {
  return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
}

/**
 * CC, art. 132, § 3º: prazos de anos expiram no dia de igual número do de início, ou no
 * imediato, se faltar exata correspondência (29/02 -> 01/03).
 */
export function somarAnos(d: Date, anos: number): Date {
  const alvo = d.getFullYear() + anos;
  if (d.getMonth() === 1 && d.getDate() === 29 && !ehAnoBissexto(alvo)) {
    return dataDe(`${alvo}-03-01`);
  }
  return dataDe(chaveData(d).replace(/^\d{4}/, String(alvo)));
}

export interface ResultadoPrescricao {
  termoInicial: Date;
  termoFinal: Date;
  prescrito: boolean;
  dataReferencia: Date;
  memoria: string[];
  alertas: string[];
}

export interface CalcularPrescricaoParams {
  termoInicial: Date;
  dataReferencia: Date;
  tipo?: string | null;
  prazoAnos?: number | null;
  baseLegal?: string | null;
  dataInterrupcao?: Date | null;
  dataExtincaoContrato?: Date | null;
}

export function calcularPrescricao(params: CalcularPrescricaoParams): ResultadoPrescricao {
  const {
    termoInicial,
    dataReferencia,
    tipo = null,
    prazoAnos: prazoAnosEntrada = null,
    baseLegal: baseLegalEntrada = null,
    dataInterrupcao = null,
    dataExtincaoContrato = null,
  } = params;
  const memoria: string[] = [];
  const alertas: string[] = [
    "O termo inicial e as causas suspensivas/interruptivas são juízos jurídicos do advogado.",
  ];
  let prazoAnos = prazoAnosEntrada;
  let baseLegal = baseLegalEntrada;
  if (tipo) {
    if (!CATALOGO[tipo]) {
      throw new Error(`Tipo não catalogado: ${tipo}. Informe prazoAnos e baseLegal.`);
    }
    prazoAnos = CATALOGO[tipo].anos;
    baseLegal = CATALOGO[tipo].base;
  }
  if (!prazoAnos || !baseLegal) {
    throw new Error("Informe `tipo` catalogado ou `prazoAnos` + `baseLegal`.");
  }

  let inicio = termoInicial;
  memoria.push(
    `Termo inicial informado: ${fmtBR(inicio)}. Prazo: ${prazoAnos} anos (${baseLegal}).`
  );
  if (dataInterrupcao) {
    if (dataInterrupcao.getTime() < inicio.getTime()) {
      throw new Error("A interrupção não pode ser anterior ao termo inicial.");
    }
    memoria.push(
      `Interrupção em ${fmtBR(dataInterrupcao)}: o prazo recomeça a correr dessa data ` +
        `(CC, art. 202, parágrafo único). A interrupção só pode ocorrer uma vez (art. 202, caput).`
    );
    inicio = dataInterrupcao;
  }

  let final = somarAnos(inicio, prazoAnos);
  memoria.push(`Termo final: ${fmtBR(final)} (CC, art. 132, § 3º).`);

  if (tipo === "trabalhista" && dataExtincaoContrato) {
    const bienal = somarAnos(dataExtincaoContrato, 2);
    memoria.push(
      `Limite bienal após a extinção do contrato: ${fmtBR(bienal)} (CF, art. 7º, XXIX).`
    );
    if (bienal.getTime() < final.getTime()) {
      final = bienal;
      memoria.push("Prevalece o limite bienal.");
    }
  }

  const prescrito = dataReferencia.getTime() > final.getTime();
  memoria.push(
    `Em ${fmtBR(dataReferencia)}: ${prescrito ? "PRESCRITA" : "NÃO prescrita"} a pretensão.`
  );
  if (!prescrito) {
    const diasRestantes = Math.round(
      (final.getTime() - dataReferencia.getTime()) / (24 * 60 * 60 * 1000)
    );
    if (diasRestantes <= 90) {
      alertas.push(`Faltam ${diasRestantes} dias para o termo final.`);
    }
  }
  return { termoInicial, termoFinal: final, prescrito, dataReferencia, memoria, alertas };
}

export interface CalcularIntercorrenteParams {
  rito: "cpc" | "lef";
  dataCienciaTentativaInfrutifera: Date;
  dataReferencia: Date;
  prazoAnos?: number | null;
  basePrazo?: string | null;
  dataInterrupcao?: Date | null;
}

/**
 * Prescrição intercorrente.
 *
 * rito "cpc": CPC, art. 921, §§ 1º, 4º, 4º-A e 5º (redação da Lei 14.195/2021). Termo inicial na
 * ciência da primeira tentativa infrutífera de localização do devedor ou de bens; suspensão do
 * curso por uma única vez, pelo prazo máximo de 1 ano; a efetiva citação, intimação ou constrição
 * interrompe. O prazo é o da pretensão executada (STF, Súmula 150).
 * rito "lef": Lei 6.830/1980, art. 40, caput e §§ 2º e 4º; STJ, Súmula 314: suspensão por 1 ano e,
 * findo esse prazo, início da prescrição quinquenal intercorrente.
 */
export function calcularIntercorrente(params: CalcularIntercorrenteParams): ResultadoPrescricao {
  const {
    rito,
    dataCienciaTentativaInfrutifera,
    dataReferencia,
    prazoAnos: prazoAnosEntrada = null,
    basePrazo: basePrazoEntrada = null,
    dataInterrupcao = null,
  } = params;
  const memoria: string[] = [];
  const alertas: string[] = [
    "Conferir as teses repetitivas aplicáveis e eventuais causas de interrupção não informadas.",
  ];
  if (rito !== "cpc" && rito !== "lef") {
    throw new Error("rito deve ser 'cpc' ou 'lef'");
  }
  let prazoAnos = prazoAnosEntrada;
  let basePrazo = basePrazoEntrada;
  if (rito === "lef") {
    prazoAnos = 5;
    basePrazo = "Lei 6.830/1980, art. 40, § 4º; STJ, Súmula 314";
  }
  if (!prazoAnos || !basePrazo) {
    throw new Error(
      "Informe o prazo da pretensão executada e a base legal (STF, Súmula 150)."
    );
  }
  const inicioSusp = dataCienciaTentativaInfrutifera;
  const fimSusp = somarAnos(inicioSusp, 1);
  const baseSusp =
    rito === "cpc"
      ? "CPC, art. 921, §§ 1º e 4º"
      : "Lei 6.830/1980, art. 40, caput e § 2º; STJ, Súmula 314";
  memoria.push(`Ciência da primeira tentativa infrutífera: ${fmtBR(inicioSusp)}.`);
  memoria.push(`Suspensão de 1 ano (única) até ${fmtBR(fimSusp)} (${baseSusp}).`);
  let inicioPrazo = fimSusp;
  if (dataInterrupcao) {
    if (dataInterrupcao.getTime() < inicioSusp.getTime()) {
      throw new Error("Interrupção anterior ao termo inicial.");
    }
    const baseInt =
      rito === "cpc" ? "CPC, art. 921, § 4º-A" : "causa interruptiva informada";
    memoria.push(
      `Interrupção em ${fmtBR(dataInterrupcao)} (${baseInt}): o prazo recomeça dessa data, sem nova suspensão.`
    );
    inicioPrazo =
      dataInterrupcao.getTime() > inicioSusp.getTime() ? dataInterrupcao : inicioSusp;
  }
  const final = somarAnos(inicioPrazo, prazoAnos);
  memoria.push(
    `Prazo de ${prazoAnos} anos (${basePrazo}) contado de ${fmtBR(inicioPrazo)}: termo final ${fmtBR(final)}.`
  );
  const prescrito = dataReferencia.getTime() > final.getTime();
  memoria.push(
    `Em ${fmtBR(dataReferencia)}: ${prescrito ? "CONSUMADA" : "NÃO consumada"} a prescrição intercorrente.`
  );
  if (prescrito) {
    alertas.push(
      "Reconhecimento exige oitiva prévia das partes (CPC, art. 921, § 5º; Lei 6.830/1980, art. 40, § 4º)."
    );
  }
  return {
    termoInicial: dataCienciaTentativaInfrutifera,
    termoFinal: final,
    prescrito,
    dataReferencia,
    memoria,
    alertas,
  };
}
