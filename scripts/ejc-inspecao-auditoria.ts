// EJC — Inspeção dos achados da auditoria (somente leitura)
import { db } from '../src/lib/db';

async function main() {
  // 1. Doc sumula-150-stf (URL não oficial)
  const s150 = await db.knowledgeDocument.findUnique({ where: { slug: 'sumula-150-stf-prescricao-execucao' }, select: { slug: true, tipoDocumento: true, status: true, confiabilidade: true, fonte: true, urlFonte: true, dataConsulta: true, lote: true } });
  console.log('SUMULA-150-STF:', JSON.stringify(s150, null, 2));

  // 2. Tipos dos docs com nº CNJ fora de jurisprudência
  const cnjDocs = ['tema-29-stj-revisao-nao-afasta-mora', 'tema-1061-stj-onus-autenticidade-assinatura', 'tjdft-marketplace-responsabilidade-intermediador'];
  for (const slug of cnjDocs) {
    const d = await db.knowledgeDocument.findUnique({ where: { slug }, select: { slug: true, tipoDocumento: true, status: true, confiabilidade: true, fonte: true, urlFonte: true, dataConsulta: true, metadados: true } });
    console.log('CNJ-DOC:', JSON.stringify(d, null, 2));
  }

  // 3. jurimetria-estrutura-revisionais-bancarias — menção a súmula/acórdão
  const j = await db.knowledgeDocument.findUnique({ where: { slug: 'jurimetria-estrutura-revisionais-bancarias' }, select: { conteudo: true } });
  const trecho = j?.conteudo.split('\n').filter((l) => /súmula|acórdão/i.test(l));
  console.log('JURIMETRIA-REVISIONAL trechos com súmula/acórdão:', JSON.stringify(trecho, null, 2));

  // 4. Todas as tags fora do formato canônico
  const docs = await db.knowledgeDocument.findMany({ select: { slug: true, tags: true, area: true, subarea: true } });
  const fora: { slug: string; tag: string; subarea: string | null }[] = [];
  for (const d of docs) {
    if (!d.tags) continue;
    try {
      const arr = JSON.parse(d.tags) as unknown;
      if (!Array.isArray(arr)) continue;
      for (const t of arr) {
        if (typeof t === 'string' && !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(t)) fora.push({ slug: d.slug, tag: t, subarea: d.subarea });
      }
    } catch { /* ignorado */ }
  }
  console.log('TAGS FORA DO FORMATO (todas):', JSON.stringify(fora, null, 2));
  console.log('TOTAL:', fora.length);

  // 5. Distribuição de valores de tags fora do formato
  const contagem = new Map<string, number>();
  for (const f of fora) contagem.set(f.tag, (contagem.get(f.tag) ?? 0) + 1);
  console.log('DISTINTAS:', JSON.stringify([...contagem.entries()], null, 2));

  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
