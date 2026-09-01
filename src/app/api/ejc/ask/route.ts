import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { retrieve, type DocParaRetrieval } from '@/lib/ejc/rag';
import ZAI from 'z-ai-web-dev-sdk';

interface Payload {
  pergunta?: string;
  topK?: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload;
    const pergunta = (body.pergunta ?? '').trim();
    if (!pergunta) return NextResponse.json({ error: 'Informe a pergunta.' }, { status: 400 });
    if (pergunta.length > 2000) return NextResponse.json({ error: 'Pergunta muito longa.' }, { status: 400 });

    const all = await db.knowledgeChunk.findMany({
      where: { document: { status: 'ATIVO' } },
      include: {
        document: { select: { id: true, slug: true, titulo: true, tipoDocumento: true, area: true, confiabilidade: true, status: true, fonte: true, urlFonte: true, dataConsulta: true, prioridade: true, tags: true } },
      },
    });
    const paraRetrieval: DocParaRetrieval[] = all.map((c) => ({
      documentId: c.document.id,
      slug: c.document.slug,
      titulo: c.document.titulo,
      tipoDocumento: c.document.tipoDocumento,
      area: c.document.area,
      confiabilidade: c.document.confiabilidade,
      status: c.document.status,
      fonte: c.document.fonte,
      urlFonte: c.document.urlFonte,
      dataConsulta: c.document.dataConsulta,
      prioridade: c.document.prioridade,
      tags: c.document.tags ? JSON.parse(c.document.tags) : [],
      chunkId: c.id,
      chunkContexto: c.contexto,
      chunkTexto: c.texto,
    }));

    const hits = retrieve(pergunta, paraRetrieval, Math.min(12, Math.max(4, body.topK ?? 8)));
    if (!hits.length) {
      return NextResponse.json({
        pergunta,
        resposta:
          'Não encontrei conteúdo suficiente na base Jurimetria DPT para responder com confiabilidade. Em vez de inventar informação (proibido pelo sistema), sugiro: (1) reformular a pergunta com termos jurídicos; (2) verificar se o lote relevante já foi abastecido; (3) pesquisar em fonte oficial (Planalto/tribunais) e inserir o conteúdo validado.',
        fontes: [],
        contextualizado: true,
      });
    }

    // Contexto com rastreabilidade
    const contexto = hits
      .map((h, i) => {
        const revisao = h.status !== 'ATIVO' ? ' [REGISTRO EM REVISAO_HUMANA — não usar como fundamento definitivo]' : '';
        return `[FONTE ${i + 1}] ${h.titulo} (tipo: ${h.tipoDocumento}; confiabilidade: ${h.confiabilidade}; fonte: ${h.fonte ?? '—'}; URL: ${h.urlFonte ?? '—'}; consulta: ${h.dataConsulta ?? '—'})${revisao}\n${h.chunkTexto}`;
      })
      .join('\n\n---\n\n');

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content:
            'Você é o assistente jurídico da Jurimetria DPT (De Paula Teixeira Advocacia). Responda SOMENTE com base no CONTEXTO fornecido (trechos da base de conhecimento EJC validada). REGRA ABSOLUTA: nunca invente números de processos, súmulas, dispositivos legais, percentuais ou precedentes que não estejam no contexto. Se o contexto não bastar, diga explicitamente o que falta. Cite as fontes no formato [FONTE n]. Ao citar prazos, reforce que o prazo concreto deve ser validado no processo. ATENÇÃO às siglas: neste sistema "AI" significa "auto de infração" (ambiental/administrativo) — nunca expanda para outra sigla. Separe claramente dado factual (com fonte) de análise qualitativa. Responda em português do Brasil, de forma técnica, objetiva e estruturada (markdown).',
        },
        { role: 'user', content: `PERGUNTA: ${pergunta}\n\nCONTEXTO DA BASE JURIMETRIA DPT:\n${contexto}` },
      ],
      thinking: { type: 'disabled' },
    });
    const resposta = completion.choices[0]?.message?.content ?? 'Sem resposta do modelo.';

    const fontes = hits.map((h) => ({
      slug: h.slug,
      titulo: h.titulo,
      tipoDocumento: h.tipoDocumento,
      area: h.area,
      confiabilidade: h.confiabilidade,
      status: h.status,
      fonte: h.fonte,
      urlFonte: h.urlFonte,
      dataConsulta: h.dataConsulta,
      score: h.score,
      trecho: h.chunkTexto.slice(0, 320),
    }));

    return NextResponse.json({ pergunta, resposta, fontes, modo: 'rag+llm', totalFontes: fontes.length });
  } catch (e) {
    return NextResponse.json({ error: 'Erro na consulta jurídica', detalhe: String(e) }, { status: 500 });
  }
}
