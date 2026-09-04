// EJC — Exportação .docx do memo de fundamentação (aba Pesquisa).
// POST { pergunta, motor, tempoMs, memo, fontes, fontesWeb } → arquivo .docx gerado
// localmente (LGPD: nada é persistido nem transmitido a serviços externos; o download
// é direto para o navegador do usuário). Conteúdo referenciado, nunca copiado/inventado.

import { NextRequest, NextResponse } from 'next/server';
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from 'docx';

interface FonteDocx {
  slug: string;
  titulo: string;
  tipoDocumento?: string;
  confiabilidade?: string;
  status?: string;
  fonte?: string | null;
  urlFonte?: string | null;
  dataConsulta?: string | null;
}

interface MemoDocx {
  modo?: string;
  resumo?: string;
  fundamentos?: { tese?: string; aplicacao?: string; fontes?: string[] }[];
  contra_argumentos?: { ponto?: string; resposta?: string; fontes?: string[] }[];
  sugestao_peca?: string;
  lacunas?: string[];
}

interface Payload {
  pergunta?: string;
  motor?: string;
  tempoMs?: number;
  memo?: MemoDocx;
  fontes?: FonteDocx[];
  fontesWeb?: { titulo?: string; url?: string }[];
}

const VERDE = '1F5C4D';
const OURO = '8A7226';
const CINZA = '5B6B66';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Payload;
    const pergunta = (body.pergunta ?? '').trim();
    if (!pergunta || !body.memo) {
      return NextResponse.json({ error: 'Informe pergunta e memo para exportar' }, { status: 400 });
    }
    const memo = body.memo;
    const fontes = (body.fontes ?? []).slice(0, 30);
    const fontesWeb = (body.fontesWeb ?? []).slice(0, 10);
    const motor = (body.motor ?? '—').slice(0, 200);
    const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const duracao = typeof body.tempoMs === 'number' ? `${(body.tempoMs / 1000).toFixed(1)}s` : '—';

    const p = {
      linha: (runs: Array<{ t: string; b?: boolean; i?: boolean }>) =>
        new Paragraph({
          children: runs.map((r) => new TextRun({ text: r.t, bold: r.b, italics: r.i, size: 21 })),
          spacing: { after: 80 },
        }),
      titulo: (texto: string) =>
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          children: [new TextRun({ text: texto, bold: true, size: 26, color: VERDE })],
          spacing: { before: 260, after: 120 },
        }),
      item: (texto: string) =>
        new Paragraph({
          children: [new TextRun({ text: texto, size: 21 })],
          bullet: { level: 0 },
          spacing: { after: 60 },
        }),
      nota: (texto: string) =>
        new Paragraph({
          children: [new TextRun({ text: texto, size: 18, italics: true, color: CINZA })],
          spacing: { after: 80 },
        }),
    };

    const filhos: Paragraph[] = [
      // Cabeçalho de marca
      new Paragraph({
        children: [new TextRun({ text: 'JURIMETRIA DPT', bold: true, size: 34, color: VERDE })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'De Paula Teixeira Advocacia — Minas Gerais', size: 20, color: OURO })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: OURO, space: 6 } },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Memo de Fundamentação Jurídica', bold: true, size: 30 })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 160 },
      }),

      // 1. Consulta
      p.titulo('1. Consulta'),
      p.linha([{ t: 'Pergunta: ', b: true }, { t: pergunta }]),
      p.linha([
        { t: 'Motor: ', b: true },
        { t: motor },
        { t: '  ·  Duração: ', b: true },
        { t: duracao },
        { t: '  ·  Gerado em: ', b: true },
        { t: dataHora },
      ]),
      p.linha([{ t: 'Modo: ', b: true }, { t: memo.modo === 'degradado' ? 'degradado (sem IA — honesto)' : 'agente IA' }]),

      // 2. Resumo
      p.titulo('2. Resumo executivo'),
      new Paragraph({ children: [new TextRun({ text: (memo.resumo ?? '').slice(0, 4000), size: 21 })], spacing: { after: 120 } }),
    ];

    // 3. Fundamentos
    filhos.push(p.titulo('3. Fundamentos'));
    const fundamentos = (memo.fundamentos ?? []).filter((f) => f.tese);
    if (!fundamentos.length) {
      filhos.push(p.nota('Nenhum fundamento registrado nesta pesquisa.'));
    } else {
      fundamentos.forEach((f, i) => {
        filhos.push(new Paragraph({
          children: [new TextRun({ text: `${i + 1}. ${f.tese}`, bold: true, size: 22 })],
          spacing: { before: 140, after: 40 },
        }));
        if (f.aplicacao) filhos.push(new Paragraph({ children: [new TextRun({ text: f.aplicacao.slice(0, 2000), size: 21 })], spacing: { after: 40 } }));
        if (f.fontes?.length) filhos.push(p.linha([{ t: 'Fontes: ', b: true }, { t: f.fontes.join(', ') }]));
      });
    }

    // 4. Contra-argumentos
    filhos.push(p.titulo('4. Contra-argumentos e respostas'));
    const contra = (memo.contra_argumentos ?? []).filter((c) => c.ponto && !c.ponto.startsWith('Nenhum'));
    if (!contra.length) filhos.push(p.nota('Nenhum contra-argumento relevante registrado.'));
    else contra.forEach((c) => filhos.push(p.linha([{ t: `${c.ponto}: `, b: true }, { t: (c.resposta ?? '').slice(0, 1500) }])));

    // 5. Uso em peça
    let secao = 5;
    if (memo.sugestao_peca) {
      filhos.push(p.titulo(`${secao}. Uso em peça`), new Paragraph({ children: [new TextRun({ text: memo.sugestao_peca.slice(0, 2000), size: 21 })], spacing: { after: 100 } }));
      secao += 1;
    }

    // 6. Fontes rastreáveis
    filhos.push(p.titulo(`${secao}. Fontes rastreáveis (${fontes.length})`));
    if (!fontes.length) filhos.push(p.nota('Nenhuma fonte da base neste memo.'));
    else fontes.forEach((f, i) => {
      filhos.push(new Paragraph({
        children: [new TextRun({ text: `${i + 1}. ${f.titulo}`, bold: true, size: 21 })],
        spacing: { before: 100, after: 20 },
      }));
      filhos.push(p.linha([
        { t: 'Slug: ', b: true }, { t: f.slug, i: true },
        { t: '  ·  Confiabilidade: ', b: true }, { t: f.confiabilidade ?? '—' },
        { t: '  ·  Status: ', b: true }, { t: f.status ?? '—' },
      ]));
      filhos.push(p.linha([{ t: 'Fonte: ', b: true }, { t: f.fonte ?? '—' }, { t: '  ·  Consulta: ', b: true }, { t: f.dataConsulta ?? '—' }]));
      if (f.urlFonte) filhos.push(p.linha([{ t: 'URL oficial: ', b: true }, { t: f.urlFonte }]));
    });

    // 7. Pistas externas
    if (fontesWeb.length) {
      filhos.push(p.titulo('Pistas externas (conferir antes de citar — não injetadas na base)'));
      fontesWeb.forEach((w) => filhos.push(p.linha([{ t: `${w.titulo ?? '—'} — `, i: true }, { t: w.url ?? '' }])));
    }

    // Lacunas honestas
    if (memo.lacunas?.length) {
      filhos.push(p.titulo('Lacunas honestas'));
      memo.lacunas.forEach((l) => filhos.push(p.item(l.slice(0, 400))));
    }

    // Avisos
    filhos.push(
      p.titulo('Avisos e limites de uso'),
      p.item('Este memo foi gerado localmente pelo sistema Jurimetria DPT a partir da base de conhecimento do escritório; nenhum dado foi transmitido a serviços externos e nada foi persistido pela exportação (LGPD).'),
      p.item('Regra absoluta: nenhuma informação jurídica é inventada — todo conteúdo factual possui fonte, URL oficial e data de consulta; lacunas são declaradas explicitamente.'),
      p.item('Antes do protocolo, confira cada citação no documento original (link da fonte oficial) e valide prazos e precedentes à luz do processo concreto e da legislação vigente.'),
      p.item('Conteúdo com confiabilidade C ou status REVISAO_HUMANA não deve fundamentar documento definitivo sem validação adicional.'),
      new Paragraph({
        children: [
          new TextRun({
            text: `Gerado em ${dataHora} · Jurimetria DPT — Plataforma de Jurimetria e Inteligência Jurídica`,
            size: 18,
            italics: true,
            color: CINZA,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 360 },
      }),
    );

    const doc = new Document({
      creator: 'Jurimetria DPT — De Paula Teixeira Advocacia',
      title: `Memo de Fundamentação — ${pergunta.slice(0, 120)}`,
      description: 'Memo de fundamentação jurídica gerado localmente (base EJC, LGPD)',
      styles: { default: { document: { run: { font: 'Calibri', size: 21 } } } },
      sections: [
        { properties: { page: { margin: { top: 1200, bottom: 1200, left: 1300, right: 1300 } } }, children: filhos },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const nomeArquivo =
      'memo-' +
      (pergunta
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'pesquisa') +
      '.docx';

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${nomeArquivo}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    console.error('[api/ejc/pesquisa/docx][POST]', e);
    return NextResponse.json({ error: 'Falha ao gerar memo .docx' }, { status: 500 });
  }
}
