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
import { db } from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

// GET /api/ejc/casos/[id]/relatorio — Relatório Executivo de Caso (.docx)
// Gera arquivo localmente a partir dos dados do banco local (LGPD: nada sai do servidor;
// o download é direto para o navegador do usuário). Conteúdo referenciado, nunca copiado.
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const caso = await db.caseWorkspace.findUnique({
      where: { id },
      include: {
        documentos: {
          orderBy: { createdAt: 'desc' },
          include: {
            document: {
              select: {
                slug: true,
                titulo: true,
                tipoDocumento: true,
                area: true,
                confiabilidade: true,
                status: true,
                urlFonte: true,
                fonte: true,
                dataConsulta: true,
              },
            },
          },
        },
        notas: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!caso) return NextResponse.json({ error: 'Caso não encontrado' }, { status: 404 });

    const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const fmtData = (d: Date | string | null | undefined) =>
      d ? new Date(d).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }) : '—';

    const VERDE = '1F5C4D';
    const OURO = '8A7226';
    const CINZA = '5B6B66';

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
      nota: (texto: string, italico = false) =>
        new Paragraph({
          children: [new TextRun({ text: texto, size: 18, italics: italico, color: CINZA })],
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
        children: [
          new TextRun({ text: 'De Paula Teixeira Advocacia — Minas Gerais', size: 20, color: OURO }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: OURO, space: 6 } },
      }),
      new Paragraph({
        children: [new TextRun({ text: 'Relatório Executivo de Caso', bold: true, size: 30 })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 160 },
      }),

      // Identificação
      p.titulo('1. Identificação'),
      p.linha([{ t: 'Caso: ', b: true }, { t: caso.nome }]),
      p.linha([{ t: 'Cliente: ', b: true }, { t: caso.cliente ?? '— (não informado)' }]),
      p.linha([{ t: 'Status: ', b: true }, { t: caso.status === 'ATIVO' ? 'Ativo' : 'Arquivado' }]),
      p.linha([{ t: 'Criado em: ', b: true }, { t: fmtData(caso.createdAt) }]),
      p.linha([{ t: 'Atualizado em: ', b: true }, { t: fmtData(caso.updatedAt) }]),
      p.linha([
        { t: 'Documentos vinculados: ', b: true },
        { t: String(caso.documentos.length) },
        { t: '  ·  Anotações: ', b: true },
        { t: String(caso.notas.length) },
      ]),

      // Documentos
      p.titulo('2. Documentos vinculados (referência à base de conhecimento)'),
      p.nota(
        'Os documentos abaixo pertencem à base geral do sistema e são vinculados por referência — o conteúdo completo permanece na base e pode ser consultado pelo slug.',
      ),
    ];

    if (caso.documentos.length === 0) {
      filhos.push(p.nota('Nenhum documento vinculado até ' + dataHora + '.', true));
    } else {
      caso.documentos.forEach((vinculo, i) => {
        const d = vinculo.document;
        filhos.push(
          new Paragraph({
            children: [new TextRun({ text: `${i + 1}. ${d.titulo}`, bold: true, size: 22 })],
            spacing: { before: 140, after: 40 },
          }),
        );
        filhos.push(
          p.linha([
            { t: 'Tipo: ', b: true },
            { t: d.tipoDocumento },
            { t: '  ·  Área: ', b: true },
            { t: d.area },
            { t: '  ·  Confiabilidade: ', b: true },
            { t: d.confiabilidade ?? '—' },
            { t: '  ·  Status: ', b: true },
            { t: d.status ?? '—' },
          ]),
        );
        filhos.push(
          p.linha([
            { t: 'Slug: ', b: true },
            { t: d.slug, i: true },
            { t: '  ·  Fonte: ', b: true },
            { t: d.fonte ?? '—' },
          ]),
        );
        if (d.urlFonte) filhos.push(p.linha([{ t: 'URL oficial: ', b: true }, { t: d.urlFonte }]));
        if (vinculo.anotacao) {
          filhos.push(p.nota('Anotação do caso: ' + vinculo.anotacao));
        }
      });
    }

    // Notas
    filhos.push(p.titulo('3. Histórico de anotações'));
    if (caso.notas.length === 0) {
      filhos.push(p.nota('Nenhuma anotação registrada até ' + dataHora + '.', true));
    } else {
      caso.notas.forEach((n, i) => {
        filhos.push(
          new Paragraph({
            children: [new TextRun({ text: `${i + 1}. ${fmtData(n.createdAt)}`, bold: true, size: 21 })],
            spacing: { before: 100, after: 20 },
          }),
        );
        filhos.push(
          new Paragraph({ children: [new TextRun({ text: n.texto, size: 21 })], spacing: { after: 60 } }),
        );
      });
    }

    // Avisos
    filhos.push(
      p.titulo('4. Avisos e limites de uso'),
      p.item(
        'Este relatório foi gerado localmente pelo sistema Jurimetria DPT a partir do banco de dados local do escritório; nenhum dado foi transmitido a serviços externos.',
      ),
      p.item(
        'Regra absoluta do sistema: nenhuma informação jurídica é inventada — todo conteúdo factual da base possui fonte, URL oficial e data de consulta; registros não confirmados ficam marcados em revisão humana.',
      ),
      p.item('Conteúdo com confiabilidade C não deve fundamentar documento definitivo sem validação adicional.'),
      p.item('Prazos e precedentes devem ser validados à luz do processo concreto e da legislação vigente.'),
      p.item(
        'LGPD: documento interno do escritório — não distribuir sem revisão; o banco local não contém dados sensíveis além dos informados pelo próprio usuário.',
      ),
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
      title: `Relatório Executivo — ${caso.nome}`,
      description: 'Relatório executivo de caso gerado localmente (banco local, LGPD)',
      styles: {
        default: {
          document: { run: { font: 'Calibri', size: 21 } },
        },
      },
      sections: [
        { properties: { page: { margin: { top: 1200, bottom: 1200, left: 1300, right: 1300 } } }, children: filhos },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    const nomeArquivo =
      'relatorio-' +
      (caso.nome
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'caso') +
      '.docx';

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${nomeArquivo}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    console.error('[api/ejc/casos/:id/relatorio][GET]', e);
    return NextResponse.json({ error: 'Falha ao gerar relatório' }, { status: 500 });
  }
}
