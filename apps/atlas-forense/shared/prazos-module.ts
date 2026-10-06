/**
 * Motor de prazos processuais portado do LexValida (app/core/prazos.py) para TypeScript,
 * com extensão Atlas de extração de prazos por extenso (Task 4).
 *
 * Base normativa implementada:
 * - CPC, art. 219: prazos processuais em dias úteis.
 * - CPC, art. 220: suspensão do curso dos prazos entre 20 de dezembro e 20 de janeiro.
 * - CPC, art. 224, caput: exclui o dia do começo e inclui o do vencimento.
 * - CPC, art. 224, §§ 2º e 3º: publicação no DJe considera-se feita no 1º dia útil seguinte
 *   ao da disponibilização; o prazo começa no 1º dia útil seguinte ao da publicação.
 * - Lei 11.419/2006, art. 5º, §§ 1º-3º: intimação eletrônica por portal.
 * - CPC, arts. 180, 183, 186 e 229: prazo em dobro (o § 2º do art. 229 afasta a dobra
 *   em autos eletrônicos).
 * - CPP, art. 798, caput e § 3º: prazos penais contínuos; vencimento em dia sem expediente
 *   prorroga para o 1º dia útil seguinte.
 *
 * Feriados locais e dias sem expediente variam por tribunal: o calendário DEVE ser
 * complementado com as datas oficiais do órgão (art. 216 do CPC).
 */

export type Contagem = "uteis" | "corridos";
export type Termo = "dje" | "portal" | "ciencia";

export interface CalendarioPrazo {
  /** Mapa "YYYY-MM-DD" -> motivo (feriados locais, portarias de suspensão). */
  feriadosExtras: Record<string, string>;
  usarDiasForensesUsuais: boolean;
  aplicarSuspensaoArt220: boolean;
}

export const CALENDARIO_PADRAO: CalendarioPrazo = {
  feriadosExtras: {},
  usarDiasForensesUsuais: false,
  aplicarSuspensaoArt220: true,
};

/** Cria Date estável ao meio-dia local a partir de "YYYY-MM-DD" (evita deslocamento de fuso). */
export function dataDe(chave: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(chave)) {
    throw new Error(`Data inválida: ${chave}`);
  }
  return new Date(`${chave}T12:00:00`);
}

/** Chave "YYYY-MM-DD" de um Date (componentes locais). */
export function chaveData(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dia}`;
}

/** Formato brasileiro DD/MM/YYYY. */
export function fmtBR(d: Date): string {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function adicionarDias(d: Date, dias: number): Date {
  const c = new Date(d.getTime());
  c.setDate(c.getDate() + dias);
  return c;
}

/** Páscoa (algoritmo anônimo gregoriano, Meeus/Jones/Butcher). */
export function pascoa(ano: number): Date {
  const a = ano % 19;
  const b = Math.floor(ano / 100);
  const c = ano % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return dataDe(`${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`);
}

/** Feriados nacionais fixados em lei (Lei 662/1949 e alterações; Lei 6.802/1980; Lei 14.759/2023). */
export function feriadosNacionais(ano: number): Record<string, string> {
  const f: Record<string, string> = {
    [`${ano}-01-01`]: "Confraternização Universal",
    [`${ano}-04-21`]: "Tiradentes",
    [`${ano}-05-01`]: "Dia do Trabalho",
    [`${ano}-09-07`]: "Independência",
    [`${ano}-10-12`]: "Nossa Senhora Aparecida (Lei 6.802/1980)",
    [`${ano}-11-02`]: "Finados",
    [`${ano}-11-15`]: "Proclamação da República",
    [`${ano}-12-25`]: "Natal",
  };
  if (ano >= 2024) {
    f[`${ano}-11-20`] = "Dia Nacional de Zumbi e da Consciência Negra (Lei 14.759/2023)";
  }
  return f;
}

/**
 * Datas usualmente sem expediente forense. NÃO são universais: conferir a resolução
 * do tribunal competente antes de utilizar. Ativadas apenas por opção explícita.
 */
export function diasSemExpedienteForenseUsuais(ano: number): Record<string, string> {
  const p = pascoa(ano);
  return {
    [chaveData(adicionarDias(p, -48))]: "Segunda-feira de Carnaval (conferir calendário do tribunal)",
    [chaveData(adicionarDias(p, -47))]: "Terça-feira de Carnaval (conferir calendário do tribunal)",
    [chaveData(adicionarDias(p, -3))]: "Quinta-feira Santa (conferir calendário do tribunal)",
    [chaveData(adicionarDias(p, -2))]: "Sexta-feira da Paixão (conferir calendário do tribunal)",
    [chaveData(adicionarDias(p, 60))]: "Corpus Christi (conferir calendário do tribunal)",
    [`${ano}-11-01`]: "Todos os Santos (conferir calendário do tribunal)",
    [`${ano}-12-08`]: "Nossa Senhora da Conceição (conferir calendário do tribunal)",
  };
}

export function motivoNaoUtil(d: Date, cal: CalendarioPrazo = CALENDARIO_PADRAO): string | null {
  const dow = d.getDay();
  if (dow === 6) return "sábado";
  if (dow === 0) return "domingo";
  const chave = chaveData(d);
  if (cal.feriadosExtras[chave]) return cal.feriadosExtras[chave];
  const nac = feriadosNacionais(d.getFullYear());
  if (nac[chave]) return nac[chave];
  if (cal.usarDiasForensesUsuais) {
    const forense = diasSemExpedienteForenseUsuais(d.getFullYear());
    if (forense[chave]) return forense[chave];
  }
  return null;
}

/** CPC, art. 220: suspensão de 20/12 a 20/01, inclusive. */
export function suspenso(d: Date, cal: CalendarioPrazo = CALENDARIO_PADRAO): boolean {
  if (!cal.aplicarSuspensaoArt220) return false;
  const mes = d.getMonth() + 1;
  const dia = d.getDate();
  return (mes === 12 && dia >= 20) || (mes === 1 && dia <= 20);
}

export function ehUtil(d: Date, cal: CalendarioPrazo = CALENDARIO_PADRAO): boolean {
  return motivoNaoUtil(d, cal) === null;
}

export function proximoUtil(d: Date, considerarSuspensao = false, cal: CalendarioPrazo = CALENDARIO_PADRAO): Date {
  let c = adicionarDias(d, 1);
  while (!ehUtil(c, cal) || (considerarSuspensao && suspenso(c, cal))) {
    c = adicionarDias(c, 1);
  }
  return c;
}

export interface ResultadoPrazo {
  termoInicialEvento: Date;
  dataIntimacao: Date;
  inicioContagem: Date;
  vencimento: Date;
  dias: number;
  diasComputados: number;
  contagem: Contagem;
  emDobro: boolean;
  memoria: string[];
  alertas: string[];
}

export interface CalcularPrazoParams {
  dataEvento: Date;
  dias: number;
  termo?: Termo;
  contagem?: Contagem;
  calendario?: CalendarioPrazo;
  emDobro?: boolean;
  motivoDobro?: "mp" | "fazenda" | "defensoria" | "litisconsortes" | null;
  dataConsultaPortal?: Date | null;
  autosEletronicos?: boolean;
}

export function calcularPrazo(params: CalcularPrazoParams): ResultadoPrazo {
  const {
    dataEvento,
    dias,
    termo = "dje",
    contagem = "uteis",
    calendario = CALENDARIO_PADRAO,
    emDobro = false,
    motivoDobro = null,
    dataConsultaPortal = null,
    autosEletronicos = true,
  } = params;
  if (!Number.isFinite(dias) || dias <= 0) {
    throw new Error("O prazo deve ser um número positivo de dias.");
  }
  const cal = calendario;
  const memoria: string[] = [];
  const alertas: string[] = [
    "Feriados locais e portarias de suspensão do tribunal devem ser incluídos no calendário.",
  ];

  // 1. Data em que se considera feita a intimação
  let intimacao: Date;
  if (termo === "dje") {
    const publicacao = proximoUtil(dataEvento, false, cal);
    memoria.push(
      `Disponibilização no DJe em ${fmtBR(dataEvento)}; publicação considerada em ` +
        `${fmtBR(publicacao)}, 1º dia útil seguinte (CPC, art. 224, § 2º).`
    );
    intimacao = publicacao;
  } else if (termo === "portal") {
    const limite = adicionarDias(dataEvento, 10);
    if (dataConsultaPortal && dataConsultaPortal.getTime() <= limite.getTime()) {
      intimacao = dataConsultaPortal;
      memoria.push(
        `Intimação por portal enviada em ${fmtBR(dataEvento)} e consultada em ` +
          `${fmtBR(intimacao)} (Lei 11.419/2006, art. 5º, § 1º).`
      );
    } else {
      intimacao = limite;
      memoria.push(
        `Intimação por portal enviada em ${fmtBR(dataEvento)} sem consulta tempestiva; ` +
          `considerada feita em ${fmtBR(intimacao)}, após 10 dias corridos ` +
          `(Lei 11.419/2006, art. 5º, § 3º).`
      );
    }
    if (!ehUtil(intimacao, cal)) {
      // Lei 11.419, art. 5º, § 2º: consulta em dia não útil considera-se no 1º útil seguinte
      const nova = proximoUtil(adicionarDias(intimacao, -1), false, cal);
      memoria.push(
        `${fmtBR(intimacao)} não é dia útil (${motivoNaoUtil(intimacao, cal)}); ` +
          `intimação considerada em ${fmtBR(nova)} (Lei 11.419/2006, art. 5º, § 2º).`
      );
      intimacao = nova;
    }
  } else {
    intimacao = dataEvento;
    memoria.push(`Ciência considerada em ${fmtBR(intimacao)}, conforme informado.`);
  }

  // 2. Dobra legal
  let diasEfetivos = dias;
  if (emDobro) {
    if (motivoDobro === "litisconsortes" && autosEletronicos) {
      alertas.push(
        "Dobra de litisconsortes NÃO aplicada: autos eletrônicos (CPC, art. 229, § 2º)."
      );
    } else {
      diasEfetivos = dias * 2;
      const base =
        motivoDobro === "mp"
          ? "CPC, art. 180"
          : motivoDobro === "fazenda"
            ? "CPC, art. 183"
            : motivoDobro === "defensoria"
              ? "CPC, art. 186"
              : motivoDobro === "litisconsortes"
                ? "CPC, art. 229"
                : "dobra legal informada";
      memoria.push(`Prazo em dobro: ${dias} x 2 = ${diasEfetivos} dias (${base}).`);
    }
  }

  // 3. Início e contagem
  const considerarSuspensao = contagem === "uteis";
  const inicio = proximoUtil(intimacao, considerarSuspensao, cal);
  memoria.push(
    `Exclui-se o dia do começo; a contagem inicia em ${fmtBR(inicio)} ` +
      `(CPC, art. 224, caput e § 3º).`
  );

  let vencimento: Date;
  if (contagem === "uteis") {
    let d = inicio;
    let contados = 1;
    const pulados: string[] = [];
    while (contados < diasEfetivos) {
      d = adicionarDias(d, 1);
      const motivo = motivoNaoUtil(d, cal);
      if (motivo) {
        if (d.getDay() >= 1 && d.getDay() <= 5) {
          pulados.push(`${fmtBR(d)} (${motivo})`);
        }
        continue;
      }
      if (suspenso(d, cal)) {
        pulados.push(`${fmtBR(d)} (suspensão do art. 220 do CPC)`);
        continue;
      }
      contados += 1;
    }
    vencimento = d;
    memoria.push(`Contagem em dias úteis (CPC, art. 219): ${diasEfetivos} dias úteis.`);
    if (pulados.length > 0) {
      memoria.push("Dias úteis da semana excluídos da contagem: " + pulados.join("; ") + ".");
    }
  } else {
    vencimento = adicionarDias(inicio, diasEfetivos - 1);
    memoria.push(`Contagem em dias corridos: ${diasEfetivos} dias (CPP, art. 798).`);
    if (!ehUtil(vencimento, cal)) {
      const prorrogado = proximoUtil(vencimento, false, cal);
      memoria.push(
        `Vencimento em ${fmtBR(vencimento)} (${motivoNaoUtil(vencimento, cal)}); ` +
          `prorrogado para ${fmtBR(prorrogado)} (CPP, art. 798, § 3º).`
      );
      vencimento = prorrogado;
    }
  }

  memoria.push(`Vencimento: ${fmtBR(vencimento)}.`);
  return {
    termoInicialEvento: dataEvento,
    dataIntimacao: intimacao,
    inicioContagem: inicio,
    vencimento,
    dias,
    diasComputados: diasEfetivos,
    contagem,
    emDobro: diasEfetivos !== dias,
    memoria,
    alertas,
  };
}

// ---------------------------------------------------------------------------
// Extração de prazo do teor (portado de app/servicos/intimacoes.py + app/core/texto.py)
// com extensão Atlas: números por extenso (Task 4).
// ---------------------------------------------------------------------------

const NUMEROS_EXTENSO: Record<string, number> = {
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  onze: 11,
  doze: 12,
  treze: 13,
  catorze: 14,
  quatorze: 14,
  quinze: 15,
  dezesseis: 16,
  dezessete: 17,
  dezoito: 18,
  dezenove: 19,
  dezanove: 19,
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50,
  sessenta: 60,
  setenta: 70,
  oitenta: 80,
  noventa: 90,
  cem: 100,
  duzentos: 200,
  duzentas: 200,
  trezentos: 300,
  trezentas: 300,
  quatrocentos: 400,
  quatrocentas: 400,
  quinhentos: 500,
  quinhentas: 500,
};

const RX_EXTO_COMPOSTO =
  /\b(vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa)\s+e\s+(um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove)\b/g;
const RX_EXTO_SIMPLES = /\b(um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|catorze|quatorze|quinze|dezesseis|dezessete|dezoito|dezenove|dezanove|vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa|cem|duzentos|duzentas|trezentos|trezentas|quatrocentos|quatrocentas|quinhentos|quinhentas)\b/g;

/** Converte prazos por extenso em dígitos SOMENTE para extração; o texto original jamais é alterado. */
export function expandirNumerosExtenso(texto: string): string {
  const compostos = texto.replace(RX_EXTO_COMPOSTO, (_m, dezena: string, unidade: string) =>
    String(NUMEROS_EXTENSO[dezena] + NUMEROS_EXTENSO[unidade])
  );
  return compostos.replace(RX_EXTO_SIMPLES, (palavra) => String(NUMEROS_EXTENSO[palavra] ?? palavra));
}

/** Remove acentos e lower-case (portado de app/core/texto.py sem_acento + normalizar). */
export function normalizarTexto(texto: string): string {
  const nfkd = (texto || "").normalize("NFKD");
  const semAcento = nfkd.replace(/[\u0300-\u036f]/g, "");
  return semAcento.toLowerCase();
}

const RX_PRAZO: RegExp[] = [
  /prazo\s+(?:legal\s+)?(?:comum\s+)?de\s+(\d{1,3})\s*(?:\([^)]{1,30}\))?\s*dias?\s*(uteis|corridos)?/,
  /\b(?:em|no\s+prazo\s+de)\s+(\d{1,3})\s*(?:\([^)]{1,30}\))?\s*dias?\s*(uteis|corridos)?/,
  /\b(\d{1,3})\s*(?:\([^)]{1,30}\))?\s*dias?\s*(uteis|corridos)?\s*para\s/,
];

export interface PrazoExtraido {
  dias: number;
  unidade: "uteis" | "corridos" | null;
}

/**
 * Extrai o prazo declarado no teor. Sem prazo declarado → null: o sistema não presume
 * o prazo do ato. Prazos por extenso ("dez dias", "vinte e cinco dias") são convertidos
 * para dígitos antes das regex oficiais (extensão Atlas Task 4); dígitos explícitos
 * mantêm prioridade.
 */
export function extrairPrazoDoTeor(texto: string): PrazoExtraido | null {
  const normalizado = normalizarTexto(texto || "");
  const expandido = expandirNumerosExtenso(normalizado);
  for (const regex of RX_PRAZO) {
    const m = regex.exec(expandido);
    if (m) {
      const dias = parseInt(m[1], 10);
      if (0 < dias && dias <= 365) {
        const unidade = m[2] === "uteis" ? "uteis" : m[2] === "corridos" ? "corridos" : null;
        return { dias, unidade };
      }
    }
  }
  return null;
}
