import { describe, expect, it } from "vitest";
import {
  cnjCheckDigits,
  cnjValido,
  extractValidCnj,
  formatarCnj,
  termoPrazoDaFonte,
} from "../shared/office-module";
import {
  janelaDjen,
  mascararEmails,
  planDjenIngestion,
  sanitizeDjenHtml,
  type ComunicaItem,
} from "../shared/djen-module";
import {
  buildLexmlSearchUrl,
  extrairUrn,
  LexmlRespostaNaoSruError,
  normalizeCkanResult,
  parseSruResponse,
  planJurisprudenciaIngestion,
  validateJurisManualInput,
} from "../shared/jurisprudencia-module";

describe("Número CNJ (Resolução 65/2008, mod 97)", () => {
  it("DV verdadeiro do processo 0001234-77.2015.8.13.0026 é 77", () => {
    expect(cnjCheckDigits("000123420158130026")).toBe("77");
    expect(cnjValido("00012347720158130026")).toBe(true);
  });

  it("DV impossível é rejeitado", () => {
    expect(cnjValido("00012348220158130026")).toBe(false);
  });

  it("formatarCnj aplica a máscara NNNNNNN-DD.AAAA.J.TR.OOOO", () => {
    expect(formatarCnj("00012347720158130026")).toBe("0001234-77.2015.8.13.0026");
  });

  it("extractValidCnj extrai e valida de texto livre; inválido → null", () => {
    expect(extractValidCnj("Processo 0001234-77.2015.8.13.0026 em trâmite")).toBe(
      "0001234-77.2015.8.13.0026"
    );
    expect(extractValidCnj("Processo 0001234-82.2015.8.13.0026 em trâmite")).toBeNull();
    expect(extractValidCnj("sem processo")).toBeNull();
  });

  it("termo do prazo por fonte: DJEN → dje; manual → ciencia", () => {
    expect(termoPrazoDaFonte("cnj-djen-comunica")).toBe("dje");
    expect(termoPrazoDaFonte("manual")).toBe("ciencia");
    expect(termoPrazoDaFonte(null)).toBe("ciencia");
  });
});

describe("Sanitização LGPD do conector", () => {
  it("mascara e-mails preservando inicial e domínio oculto", () => {
    expect(mascararEmails("Notificar joao.silva@exemplo.com.br hoje")).toBe(
      "Notificar j***@*** hoje"
    );
  });

  it("mascara CPF com pontuação", () => {
    expect(sanitizeDjenHtml("CPF 123.456.789-09 e-mail fulano@teste.gov.br")).not.toContain(
      "123.456.789-09"
    );
    expect(sanitizeDjenHtml("CPF 123.456.789-09")).toContain("***.***.***-09");
  });

  it("remove HTML e limita comprimento exato", () => {
    const longo = `<p>${"x".repeat(6000)}</p>`;
    expect(sanitizeDjenHtml(longo, 4000)).toHaveLength(4000);
    expect(sanitizeDjenHtml("<b>Negrito</b> &amp; <i>itálico</i>")).toBe("Negrito & itálico");
  });
});

describe("Plano de ingestão DJEN (dedupe por idComunicacao)", () => {
  const item = (id: string, processo?: string): ComunicaItem => ({
    idComunicacao: id,
    numeroProcesso: processo ?? null,
    tribunal: "TJMG",
    orgao: "1ª Vara Cível",
    tipoComunicacao: "Sentença",
    meio: "D",
    dataDisponibilizacao: "2026-09-28",
    texto: "<p>Intime-se no prazo de dez dias.</p>",
    link: null,
  });

  it("dedupe no lote e contra existentes, com estatísticas auditáveis", () => {
    const plano = planDjenIngestion([item("A1"), item("A1"), item("A2")], new Set(["A2"]));
    expect(plano.stats).toEqual({ recebidas: 3, novas: 1, duplicadas: 2, invalidas: 0 });
    expect(plano.itens.map(i => i.item.idComunicacao)).toEqual(["A1"]);
  });

  it("classifica tipo e valida CNJ quando presente; inválido fica sem vínculo", () => {
    const plano = planDjenIngestion(
      [item("B1", "00012347720158130026"), item("B2", "00012348220158130026")],
      new Set()
    );
    expect(plano.itens[0].kind).toBe("sentenca");
    expect(plano.itens[0].cnjNumber).toBe("0001234-77.2015.8.13.0026");
    expect(plano.itens[1].cnjNumber).toBeNull();
  });

  it("janela DJEN é limitada entre 1 e 90 dias", () => {
    const j = janelaDjen(10, new Date("2026-10-01T12:00:00"));
    expect(j.inicio).toBe("2026-09-21");
    expect(j.fim).toBe("2026-10-01");
    expect(janelaDjen(500, new Date("2026-10-01T12:00:00")).inicio).toBe("2026-07-03");
  });
});

describe("Parser LexML SRU tolerante", () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <zs:searchRetrieveResponse xmlns:zs="http://www.loc.gov/zing/srw/">
    <zs:numberOfRecords>2</zs:numberOfRecords>
    <zs:records>
      <zs:record>
        <zs:recordData>
          <oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/">
            <dc:identifier>urn:lex:br:federal:acordao:stj:2023-05-10;1234567</dc:identifier>
            <dc:title><![CDATA[RECURSO ESPECIAL — Boa-fé objetiva]]></dc:title>
            <dc:description>Acórdão sobre prática abusiva no processo 0001234-77.2015.8.13.0026</dc:description>
            <dc:date>2023-05-10</dc:date>
          </oai_dc:dc>
        </zs:recordData>
      </zs:record>
    </zs:records>
  </zs:searchRetrieveResponse>`;

  it("parseia registros SRU com URN, CDATA e entidades", () => {
    const itens = parseSruResponse(xml);
    expect(itens).toHaveLength(1);
    expect(itens[0].externalId).toBe("urn:lex:br:federal:acordao:stj:2023-05-10;1234567");
    expect(itens[0].ementa).toContain("Boa-fé objetiva");
    expect(itens[0].cnjNumber).toBe("0001234-77.2015.8.13.0026");
  });

  it("extrai URN embutida em URL de resolução sem duplicar prefixo", () => {
    expect(extrairUrn("http://lexml.gov.br/urn/urn:lex:br:municipal:lei:2020-01-01;5")).toBe(
      "urn:lex:br:municipal:lei:2020-01-01;5"
    );
  });

  it("challenge anti-bot (HTML) é rejeitado como LEXML_RESPOSTA_NAO_SRU", () => {
    expect(() => parseSruResponse("<html><body>Access Denied</body></html>")).toThrow(
      LexmlRespostaNaoSruError
    );
    expect(() => parseSruResponse("")).toThrow(LexmlRespostaNaoSruError);
  });
});

describe("Normalizador CKAN (STJ Dados Abertos)", () => {
  it("normaliza pacotes do catálogo e ignora pacotes sem id", () => {
    const itens = normalizeCkanResult([
      {
        id: "abc-123",
        title: "Acórdão REsp 1.234.567",
        notes: "Honorários advocatícios",
        organization: { title: "STJ" },
      },
      { title: "sem id" },
    ]);
    expect(itens).toHaveLength(1);
    expect(itens[0].externalId).toBe("abc-123");
    expect(itens[0].tribunal).toBe("STJ");
  });
});

describe("Plano de jurisprudência e registro manual", () => {
  const item = {
    externalId: "urn:lex:br:federal:acordao:stj:2023-05-10;1",
    provider: "lexml-sru" as const,
    tribunal: "STJ",
    orgao: null,
    cnjNumber: null,
    ementa: "Teste de ementa suficientemente longa",
    url: null,
    dataJulgamento: "2023-05-10",
  };

  it("dedupe por externalId com estatísticas", () => {
    const plano = planJurisprudenciaIngestion([item, item], new Set());
    expect(plano.stats).toEqual({ recebidos: 2, novos: 1, duplicados: 1, invalidos: 0 });
  });

  it("registro manual valida CNJ e rejeita DV incorreto (Resolução 65/2008)", () => {
    expect(
      validateJurisManualInput({
        externalId: "TJMG-001",
        tribunal: "TJMG",
        ementa: "Julgado válido com processo correto 0001234-77.2015.8.13.0026",
        cnjNumber: "0001234-77.2015.8.13.0026",
      }).cnjNumber
    ).toBe("0001234-77.2015.8.13.0026");

    expect(() =>
      validateJurisManualInput({
        externalId: "TJMG-002",
        tribunal: "TJMG",
        ementa: "Julgado com DV impossível",
        cnjNumber: "0001234-82.2015.8.13.0026",
      })
    ).toThrow(/não confere/);
  });

  it("registro manual exige ementa mínima após sanitização", () => {
    expect(() =>
      validateJurisManualInput({ externalId: "TJMG-X3", tribunal: "TJMG", ementa: "curta" })
    ).toThrow(/10 caracteres/);
  });

  it("buildLexmlSearchUrl monta CQL com endpoint configurável", () => {
    const url = buildLexmlSearchUrl("http://lexml.gov.br/busca/sru", "boa fe", 5);
    expect(url).toContain("operation=searchRetrieve");
    expect(url).toContain("maximumRecords=5");
  });
});
