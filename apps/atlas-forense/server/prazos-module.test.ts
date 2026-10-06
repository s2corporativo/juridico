import { describe, expect, it } from "vitest";
import {
  chaveData,
  calcularPrazo,
  dataDe,
  ehUtil,
  expandirNumerosExtenso,
  extrairPrazoDoTeor,
  feriadosNacionais,
  pascoa,
  proximoUtil,
  suspenso,
} from "../shared/prazos-module";
import {
  calcularIntercorrente,
  calcularPrescricao,
  somarAnos,
} from "../shared/prescricao-module";

// Casos portados do LexValida (tests/test_nucleo.py) com os mesmos valores esperados.

describe("Páscoa e feriados (Meeus/Jones/Butcher)", () => {
  it("calcula a Páscoa de anos conhecidos", () => {
    expect(chaveData(pascoa(2024))).toBe("2024-03-31");
    expect(chaveData(pascoa(2025))).toBe("2025-04-20");
    expect(chaveData(pascoa(2026))).toBe("2026-04-05");
  });

  it("inclui 20 de novembro a partir de 2024 (Lei 14.759/2023)", () => {
    expect(feriadosNacionais(2023)["2023-11-20"]).toBeUndefined();
    expect(feriadosNacionais(2024)["2024-11-20"]).toBeDefined();
  });

  it("exclui 12/10 (Nossa Senhora Aparecida) da contagem útil", () => {
    expect(ehUtil(dataDe("2026-10-12"))).toBe(false);
  });
});

describe("Suspensão do art. 220 do CPC", () => {
  it("suspende de 20/12 a 20/01, inclusive", () => {
    expect(suspenso(dataDe("2026-12-20"))).toBe(true);
    expect(suspenso(dataDe("2026-12-19"))).toBe(false);
    expect(suspenso(dataDe("2027-01-20"))).toBe(true);
    expect(suspenso(dataDe("2027-01-21"))).toBe(false);
  });
});

describe("DJe: publicação no 1º útil seguinte e contagem (CPC 224 §§2º/3º)", () => {
  it("01/10/2026 (quinta) + 15 dias úteis → vencimento 26/10/2026", () => {
    const r = calcularPrazo({ dataEvento: dataDe("2026-10-01"), dias: 15, termo: "dje", contagem: "uteis" });
    expect(chaveData(r.dataIntimacao)).toBe("2026-10-02");
    expect(chaveData(r.inicioContagem)).toBe("2026-10-05");
    expect(chaveData(r.vencimento)).toBe("2026-10-26");
  });

  it("disponibilização 28/09/2026 (segunda) → publicação 29/09; 15 úteis excluindo 12/10 → 21/10/2026", () => {
    const r = calcularPrazo({ dataEvento: dataDe("2026-09-28"), dias: 15, termo: "dje" });
    expect(chaveData(r.vencimento)).toBe("2026-10-21");
    expect(r.memoria.some(m => m.includes("12/10/2026"))).toBe(true);
  });
});

describe("Portal (Lei 11.419/2006, art. 5º)", () => {
  it("consulta tempestiva prevalece; sem consulta, 10 dias corridos", () => {
    const consultado = calcularPrazo({
      dataEvento: dataDe("2026-09-01"),
      dias: 5,
      termo: "portal",
      dataConsultaPortal: dataDe("2026-09-03"),
    });
    expect(chaveData(consultado.dataIntimacao)).toBe("2026-09-03");

    const naoConsultado = calcularPrazo({ dataEvento: dataDe("2026-09-01"), dias: 5, termo: "portal" });
    expect(chaveData(naoConsultado.dataIntimacao)).toBe("2026-09-11");
  });

  it("consulta em dia não útil empurra intimação para o 1º útil seguinte (art. 5º, § 2º)", () => {
    // 05/09/2026 é sábado; 07/09 é feriado nacional (Independência) → 08/09.
    const r = calcularPrazo({
      dataEvento: dataDe("2026-09-01"),
      dias: 5,
      termo: "portal",
      dataConsultaPortal: dataDe("2026-09-05"),
    });
    expect(chaveData(r.dataIntimacao)).toBe("2026-09-08");
    expect(r.memoria.some(m => m.includes("não é dia útil"))).toBe(true);
  });
});

describe("Ciência e dias corridos (CPP 798)", () => {
  it("contagem corrida prorroga vencimento em dia não útil", () => {
    const r = calcularPrazo({ dataEvento: dataDe("2026-09-29"), dias: 15, termo: "ciencia", contagem: "corridos" });
    expect(chaveData(r.vencimento)).toBe("2026-10-14"); // 14/10 é quarta-feira, útil
  });

  it("ciência 29/09/2026 + 15 úteis → 21/10/2026", () => {
    const r = calcularPrazo({ dataEvento: dataDe("2026-09-29"), dias: 15, termo: "ciencia" });
    expect(chaveData(r.vencimento)).toBe("2026-10-21");
  });
});

describe("Dobra legal (CPC 180/183/186/229)", () => {
  it("dobra de MP aplica; dobra de litisconsortes em autos eletrônicos NÃO aplica", () => {
    const dobro = calcularPrazo({
      dataEvento: dataDe("2026-10-01"),
      dias: 15,
      emDobro: true,
      motivoDobro: "mp",
    });
    expect(dobro.diasComputados).toBe(30);

    const litis = calcularPrazo({
      dataEvento: dataDe("2026-10-01"),
      dias: 15,
      emDobro: true,
      motivoDobro: "litisconsortes",
      autosEletronicos: true,
    });
    expect(litis.diasComputados).toBe(15);
    expect(litis.alertas.some(a => a.includes("229"))).toBe(true);
  });
});

describe("Prescrição (portado de app/core/prescricao.py)", () => {
  it("reparação civil 04/05/2022 → PRESCRITA em 2026 (CC 206 §3º V)", () => {
    const r = calcularPrescricao({
      termoInicial: dataDe("2022-05-04"),
      dataReferencia: dataDe("2026-10-01"),
      tipo: "reparacao_civil",
    });
    expect(r.prescrito).toBe(true);
    expect(chaveData(r.termoFinal)).toBe("2025-05-04");
  });

  it("29/02 → 01/03 quando o ano-alvo não é bissexto (CC 132 §3º)", () => {
    const final = somarAnos(dataDe("2024-02-29"), 1);
    expect(chaveData(final)).toBe("2025-03-01");
  });

  it("interrupção única recomeça o prazo (CC 202)", () => {
    const r = calcularPrescricao({
      termoInicial: dataDe("2020-01-10"),
      dataReferencia: dataDe("2026-06-01"),
      tipo: "geral",
      dataInterrupcao: dataDe("2023-01-10"),
    });
    expect(chaveData(r.termoFinal)).toBe("2033-01-10");
    expect(r.prescrito).toBe(false);
  });

  it("intercorrente CPC: suspensão de 1 ano + prazo da pretensão (STF Súmula 150)", () => {
    const r = calcularIntercorrente({
      rito: "cpc",
      dataCienciaTentativaInfrutifera: dataDe("2020-06-01"),
      dataReferencia: dataDe("2026-10-01"),
      prazoAnos: 3,
      basePrazo: "CC, art. 206, § 3º, V",
    });
    expect(chaveData(r.termoFinal)).toBe("2024-06-01");
    expect(r.prescrito).toBe(true);
  });

  it("intercorrente LEF fixa quinquenal (STJ Súmula 314)", () => {
    const r = calcularIntercorrente({
      rito: "lef",
      dataCienciaTentativaInfrutifera: dataDe("2023-01-01"),
      dataReferencia: dataDe("2026-10-01"),
    });
    expect(chaveData(r.termoFinal)).toBe("2029-01-01");
    expect(r.prescrito).toBe(false);
  });
});

describe("Extração de prazo do teor (RX_PRAZO portado + extensão Atlas por extenso)", () => {
  it("extrai prazos com dígitos e unidade", () => {
    expect(extrairPrazoDoTeor("prazo de 15 (quinze) dias úteis")).toEqual({ dias: 15, unidade: "uteis" });
    expect(extrairPrazoDoTeor("no prazo de 10 dias corridos")).toEqual({ dias: 10, unidade: "corridos" });
    expect(extrairPrazoDoTeor("10 dias para contestar")).toEqual({ dias: 10, unidade: null });
  });

  it("sem prazo declarado → null (o sistema não presume)", () => {
    expect(extrairPrazoDoTeor("fica ciente da sentença.")).toBeNull();
    expect(extrairPrazoDoTeor("")).toBeNull();
  });

  it("EXTENSÃO ATLAS: prazos por extenso simples com unidade", () => {
    expect(extrairPrazoDoTeor("no prazo de dez dias úteis")).toEqual({ dias: 10, unidade: "uteis" });
    expect(extrairPrazoDoTeor("prazo de cinco dias")).toEqual({ dias: 5, unidade: null });
    expect(extrairPrazoDoTeor("no prazo de noventa dias corridos")).toEqual({ dias: 90, unidade: "corridos" });
  });

  it("EXTENSÃO ATLAS: compostos antes dos simples (vinte e cinco → 25)", () => {
    expect(extrairPrazoDoTeor("no prazo de vinte e cinco dias corridos")).toEqual({ dias: 25, unidade: "corridos" });
    expect(extrairPrazoDoTeor("no prazo de trinta e um dias")).toEqual({ dias: 31, unidade: null });
    expect(extrairPrazoDoTeor("prazo de quinze dias")).toEqual({ dias: 15, unidade: null });
  });

  it("dígitos explícitos têm prioridade sobre o extenso no mesmo texto", () => {
    expect(extrairPrazoDoTeor("prazo de 30 dias; ainda que quinze dias sejam comuns")).toEqual({
      dias: 30,
      unidade: null,
    });
  });

  it("faixa 1–365 preservada: quinhentos dias é rejeitado", () => {
    expect(extrairPrazoDoTeor("prazo de quinhentos dias")).toBeNull();
  });

  it("falso positivo evitado: 'uma audiência' não vira prazo", () => {
    expect(extrairPrazoDoTeor("designo uma audiência de conciliação")).toBeNull();
  });

  it("expandirNumerosExtenso não altera texto sem números por extenso", () => {
    expect(expandirNumerosExtenso("prazo de 15 dias")).toBe("prazo de 15 dias");
  });
});

describe("Utilidades de calendário", () => {
  it("proximoUtil salta fim de semana e feriado nacional", () => {
    // sexta 02/10/2026 é útil? 02/10/2026 é sexta-feira: sim.
    const seguinte = proximoUtil(dataDe("2026-10-02"));
    expect(chaveData(seguinte)).toBe("2026-10-05"); // pula sábado e domingo
  });
});

// ---------------------------------------------------------------------------
// Treinamento do motor (Task 10): cenários avançados com valores verificados
// no calendário real — recesso do art. 220, feriados de novembro, dobra da
// Fazenda, portal no limite e extração com teores de referência (fixtures).
// ---------------------------------------------------------------------------

describe("Treinamento: recesso do art. 220 (20/12 a 20/01)", () => {
  it("ciência 15/12/2026 + 15 úteis cruza o recesso e vence em 05/02/2027", () => {
    const r = calcularPrazo({
      dataEvento: dataDe("2026-12-15"),
      dias: 15,
      termo: "ciencia",
      contagem: "uteis",
      calendario: { feriadosExtras: {}, usarDiasForensesUsuais: false, aplicarSuspensaoArt220: true },
    });
    expect(chaveData(r.vencimento)).toBe("2027-02-05");
  });

  it("com aplicarSuspensaoArt220: false o mesmo prazo vence em 07/01/2027", () => {
    const r = calcularPrazo({
      dataEvento: dataDe("2026-12-15"),
      dias: 15,
      termo: "ciencia",
      contagem: "uteis",
      calendario: { feriadosExtras: {}, usarDiasForensesUsuais: false, aplicarSuspensaoArt220: false },
    });
    expect(chaveData(r.vencimento)).toBe("2027-01-07");
  });
});

describe("Treinamento: feriados de novembro na contagem útil", () => {
  it("15/11 (República) e 20/11 (Consciência Negra, Lei 14.759/2023) não são úteis", () => {
    expect(ehUtil(dataDe("2026-11-15"))).toBe(false);
    expect(ehUtil(dataDe("2026-11-20"))).toBe(false);
    expect(ehUtil(dataDe("2026-11-23"))).toBe(true);
  });

  it("contagem de 10 úteis com evento 12/11/2026 salta 15/11 e 20/11 e vence em 27/11/2026", () => {
    const r = calcularPrazo({
      dataEvento: dataDe("2026-11-12"),
      dias: 10,
      termo: "ciencia",
      contagem: "uteis",
      calendario: { feriadosExtras: {}, usarDiasForensesUsuais: false, aplicarSuspensaoArt220: true },
    });
    expect(chaveData(r.vencimento)).toBe("2026-11-27");
  });
});

describe("Treinamento: dobra da Fazenda Pública (CPC, art. 183)", () => {
  it("dobra 5 úteis para 10 dias computados e cita a base normativa na memória", () => {
    const r = calcularPrazo({
      dataEvento: dataDe("2026-10-06"),
      dias: 5,
      termo: "dje",
      contagem: "uteis",
      emDobro: true,
      motivoDobro: "fazenda",
      autosEletronicos: true,
      calendario: { feriadosExtras: {}, usarDiasForensesUsuais: false, aplicarSuspensaoArt220: true },
    });
    expect(r.diasComputados).toBe(10);
    expect(r.emDobro).toBe(true);
    expect(r.memoria.join(" ")).toMatch(/183/);
  });
});

describe("Treinamento: portal eletrônico no limite (Lei 11.419/2006, art. 5º)", () => {
  it("expedição 01/10/2026: intimação presumida no 10º dia corrido (11/10, ainda tempestiva) e contagem iniciada no dia útil seguinte", () => {
    const r = calcularPrazo({
      dataEvento: dataDe("2026-10-01"),
      dias: 10,
      termo: "portal",
      contagem: "corridos",
      autosEletronicos: true,
      calendario: { feriadosExtras: {}, usarDiasForensesUsuais: false, aplicarSuspensaoArt220: true },
    });
    // 11/10 (10º dia corrido) é o limite tempestivo de consulta; cai no domingo e é
    // prorrogado para 13/10 (12/10 é feriado nacional); contagem inicia em 14/10.
    expect(chaveData(r.dataIntimacao)).toBe("2026-10-13");
    expect(chaveData(r.inicioContagem)).toBe("2026-10-14");
    expect(r.diasComputados).toBe(10);
    expect(r.memoria.join(" ")).toMatch(/10 dias corridos/);
  });
});

describe("Treinamento: vencimento corrido no Natal (CPP, art. 798, § 3º)", () => {
  it("evento 15/12/2026 + 10 corridos vence em 25/12 (Natal) e prorroga para 28/12/2026", () => {
    const r = calcularPrazo({
      dataEvento: dataDe("2026-12-15"),
      dias: 10,
      termo: "ciencia",
      contagem: "corridos",
      autosEletronicos: true,
      calendario: { feriadosExtras: {}, usarDiasForensesUsuais: false, aplicarSuspensaoArt220: false },
    });
    expect(chaveData(r.vencimento)).toBe("2026-12-28");
  });
});

describe("Treinamento: extração com teores de referência (fixtures)", () => {
  it("despacho de laudo pericial: 'no prazo de quinze dias úteis' → 15 úteis", () => {
    expect(extrairPrazoDoTeor(
      "Intimem-se as partes, no prazo de quinze dias úteis, para manifestar-se sobre o laudo pericial juntado aos autos."
    )).toEqual({ dias: 15, unidade: "uteis" });
  });

  it("decisão de réplica: 'no prazo de vinte dias úteis' → 20 úteis", () => {
    expect(extrairPrazoDoTeor(
      "Defiro a inversão do ônus da prova. Intime-se a parte autora para, no prazo de vinte dias úteis, apresentar réplica aos esclarecimentos oferecidos pela ré."
    )).toEqual({ dias: 20, unidade: "uteis" });
  });

  it("intimação com dígitos e parêntese: 'no prazo de 5 (cinco) dias úteis' → 5 úteis", () => {
    expect(extrairPrazoDoTeor(
      "Fica a parte autora intimada para, no prazo de 5 (cinco) dias úteis, especificar as provas que pretenda produzir em audiência."
    )).toEqual({ dias: 5, unidade: "uteis" });
  });

  it("edital de citação: 'compareça no prazo de trinta dias' → 30 dias sem unidade declarada", () => {
    const d = extrairPrazoDoTeor(
      "Edital de citação para réu em lugar incerto: compareça no prazo de trinta dias, contados da última publicação, sob pena de revelia."
    );
    expect(d?.dias).toBe(30);
    expect(d?.unidade).toBeNull();
  });

  it("'prazo de quarenta e oito horas' → null (horas não são dias)", () => {
    expect(extrairPrazoDoTeor(
      "Intime-se a parte para, no prazo de quarenta e oito horas, cumprir a ordem judicial."
    )).toBeFalsy();
  });

  it("acórdão sem prazo declarado → null (o sistema não presume)", () => {
    expect(extrairPrazoDoTeor(
      "Publicação de acórdão com juntada do julgado. As partes ficam intimadas do inteiro teor, sem prazo processual declarado nesta comunicação."
    )).toBeFalsy();
  });
});
