// EJC — Minutas IA: exportação .docx da minuta gerada (aba Minutas IA).
// POST { tipoNome, valores, secoes, fontes, avisos, lacunas } → arquivo .docx
// gerado localmente (LGPD: nada persistido; download direto do navegador).
// Conteúdo é RASCUNHO para revisão humana — disclaimers incluídos no documento.

import { NextRequest, NextResponse } from 'next/server';
import { AlignmentType, BorderStyle, Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';

const VERDE = '1F5C4D';
const OURO = '8A7226';
const CINZA = '5B6B66';
const VERMELHO = '9B3B33';

interface SecaoMinuta {
  id?: string;
  titulo?: string;
  conteudo?: string;
}
interface FonteDocx {
  slug?: string;
  titulo?: string;
  confiabilidade?: string;
  status?: string;
  urlFonte?: string | null;
  dataConsulta?: string | null;
}
interface Payload {
  tipoNome?: string;
  valores?: Record<string, string>;
  secoes?: SecaoMinuta[];
  fontes?: FonteDocx[];
  avisos?: string[];
  lacunas?: string[];
  usarBase?: boolean;
}

/** Linha com suporte a **negrito** (único markdown aceito). */
function linhaComNegrito(texto: string, tamanho?: number, cor?: string): Paragraph {
  const runs: TextRun[] = [];
  const partes = texto.split(/\*\*/);
  for (let i = 0; i < partes.length; i++) {
    if (!partes[i]) continue;
    runs.push(new TextRun({ text: partes[i], bold: i % 2 === 1, size: tamanho, color: cor }));
  }
  return runs.length ? new Paragraph({ children: runs, spacing: { after: 160 }, alignment: AlignmentType.JUSTIFIED }) : new Paragraph({ text: '', spacing: { after: 80 } });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload;
    const secoes = (body.secoes ?? []).filter((s) => s.conteudo?.trim());
    if (!secoes.length) return NextResponse.json({ error: 'Nenhuma seção para exportar.' }, { status: 400 });
    const valores = body.valores ?? {};

    const filhos: Paragraph[] = [];

    // Cabeçalho de marca
    filhos.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: 'DE PAULA TEIXEIRA ADVOCACIA', bold: true, size: 26, color: VERDE })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [new TextRun({ text: 'Minutas IA · Jurimetria DPT — rascunho gerado com IA para revisão humana', size: 18, color: OURO })],
      }),
    );

    // Título da peça
    filhos.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 240 },
        children: [new TextRun({ text: (body.tipoNome ?? 'Minuta').toUpperCase(), bold: true, size: 30, color: '222222' })],
      }),
    );

    // Capa (juízo/partes)
    const capa: string[] = [];
    if (valores.comarca) capa.push(`Juízo: ${valores.comarca}`);
    if (valores.autor) capa.push(`Autor/requerente: ${valores.autor.split('\n')[0]}`);
    if (valores.reu) capa.push(`Réu/requerido: ${valores.reu.split('\n')[0]}`);
    if (valores.valorCausa) capa.push(`Valor da causa: ${valores.valorCausa}`);
    if (valores.advogado) capa.push(`Advogado(a): ${valores.advogado}`);
    if (capa.length) {
      filhos.push(
        new Paragraph({
          spacing: { after: 240 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: OURO, space: 6 } },
          children: capa.flatMap((l) => [new TextRun({ text: l, size: 20, color: CINZA }), new TextRun({ text: '   ·   ', size: 20, color: OURO })]).slice(0, -1),
        }),
      );
    }

    // Seções
    for (const s of secoes) {
      filhos.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 260, after: 120 },
          children: [new TextRun({ text: (s.titulo ?? 'Seção').toUpperCase(), bold: true, size: 24, color: VERDE })],
        }),
      );
      for (const paragrafo of (s.conteudo ?? '').split(/\n{1,}/)) {
        const linha = paragrafo.trim();
        if (!linha) continue;
        filhos.push(linhaComNegrito(linha, 22, '333333'));
      }
    }

    // Fontes utilizadas
    if (body.fontes?.length) {
      filhos.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 120 },
          children: [new TextRun({ text: 'FONTES DA BASE (RASTREABILIDADE)', bold: true, size: 24, color: VERDE })],
        }),
      );
      body.fontes.forEach((f, i) => {
        const partes = `[FONTE ${i + 1}] ${f.titulo ?? f.slug ?? '—'} (confiabilidade ${f.confiabilidade ?? '—'}${f.status !== 'ATIVO' ? `, status ${f.status ?? '—'}` : ''}${f.urlFonte ? ` · ${f.urlFonte}` : ''}${f.dataConsulta ? ` · consulta ${f.dataConsulta}` : ''})`;
        filhos.push(linhaComNegrito(partes, 18, CINZA));
      });
    }

    // Avisos e lacunas (honestidade)
    const alertas = [...(body.avisos ?? []), ...(body.lacunas ?? []).map((l) => `Lacuna: ${l}`)];
    if (alertas.length) {
      filhos.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 120 },
          children: [new TextRun({ text: 'AVISOS E PENDÊNCIAS', bold: true, size: 24, color: VERMELHO })],
        }),
      );
      for (const a of alertas) filhos.push(linhaComNegrito(`• ${a}`, 18, VERMELHO));
    }

    // Rodapé de responsabilidade
    filhos.push(
      new Paragraph({
        spacing: { before: 360, after: 0 },
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: OURO, space: 8 } },
        children: [new TextRun({
          text: 'Este rascunho foi gerado por IA a partir da base curada Jurimetria DPT e NÃO substitui a revisão do(a) advogado(a). Fundamentos citados possuem fonte, URL e data de consulta no apêndice. Peça definitiva exige conferência de dispositivos, prazos e jurisprudência vigentes no processo concreto.',
          size: 16,
          color: CINZA,
          italics: true,
        })],
      }),
    );

    const doc = new Document({
      creator: 'Jurimetria DPT — De Paula Teixeira Advocacia',
      title: `${body.tipoNome ?? 'Minuta'} — Minutas IA`,
      description: 'Rascunho de peça jurídica gerado com IA sobre base curada (rascunho para revisão humana).',
      styles: { default: { document: { run: { font: 'Georgia', size: 22 } } } },
      sections: [{ properties: {}, children: filhos }],
    });

    const buffer = await Packer.toBuffer(doc);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="minuta-ia-${(body.tipoNome ?? 'peca').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.docx"`,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao exportar minuta .docx', detalhe: String(e) }, { status: 500 });
  }
}
