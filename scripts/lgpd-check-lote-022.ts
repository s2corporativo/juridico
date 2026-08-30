// EJC — VERIFICAÇÃO LGPD OBRIGATÓRIA (Task ID 12-a / LOTE-022)
// Varre TODO o conteúdo final dos documentos do LOTE-022 contra:
//   - regex CPF        : \b\d{3}[.\s-]?\d{3}[.\s-]?\d{3}[-\s]?\d{2}\b
//   - e-mail
//   - telefone         : (?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}
//   - palavras-chave   : "autor:", "réu:", "advogado:"
// Se achar trecho suspeito, imprime com contexto para exclusão/revisão ANTES da ingestão.
// Uso: bun scripts/lgpd-check-lote-022.ts
import lote022 from '../data/ejc/lote-022-jurimetria-jec';

const RE_CPF = /\b\d{3}[.\s-]?\d{3}[.\s-]?\d{3}[-\s]?\d{2}\b/g;
const RE_EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const RE_FONE = /(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}/g;
const KEYWORDS = ['autor:', 'réu:', 'advogado:'];

function contexto(texto: string, inicio: number, fim: number): string {
  const a = Math.max(0, inicio - 40);
  const b = Math.min(texto.length, fim + 40);
  return texto.slice(a, b).replace(/\n/g, '\\n');
}

let totalOcorrencias = 0;
let docsLimpos = 0;
const suspeitos: { doc: string; campo: string; tipo: string; trecho: string; contexto: string }[] = [];

for (const doc of lote022) {
  const campos: Record<string, string> = {
    titulo: doc.titulo,
    conteudo: doc.conteudo,
    metadados: JSON.stringify(doc.metadados ?? {}),
    tags: JSON.stringify(doc.tags ?? []),
    assunto: doc.assunto ?? '',
    subassunto: doc.subassunto ?? '',
    fonte: doc.fonte ?? '',
    urlFonte: doc.urlFonte ?? '',
  };
  let docTemOcorrencia = false;
  for (const [campo, texto] of Object.entries(campos)) {
    for (const [tipo, re] of [['CPF', RE_CPF], ['EMAIL', RE_EMAIL], ['FONE', RE_FONE]] as const) {
      const r = new RegExp(re.source, re.flags);
      let m: RegExpExecArray | null;
      while ((m = r.exec(texto)) !== null) {
        totalOcorrencias++;
        docTemOcorrencia = true;
        suspeitos.push({ doc: doc.slug, campo, tipo, trecho: m[0], contexto: contexto(texto, m.index, m.index + m[0].length) });
      }
    }
    const lower = texto.toLowerCase();
    for (const kw of KEYWORDS) {
      let idx = lower.indexOf(kw);
      while (idx !== -1) {
        totalOcorrencias++;
        docTemOcorrencia = true;
        suspeitos.push({ doc: doc.slug, campo, tipo: `KEYWORD "${kw}"`, trecho: kw, contexto: contexto(texto, idx, idx + kw.length) });
        idx = lower.indexOf(kw, idx + kw.length);
      }
    }
  }
  if (!docTemOcorrencia) docsLimpos++;
}

console.log('=== VERIFICAÇÃO LGPD — LOTE-022 (jurimetria JEC) ===');
console.log(`Documentos varridos: ${lote022.length} | campos: slug, titulo, conteudo, metadados, tags, assunto, subassunto, fonte, urlFonte`);
console.log(`Documentos 100% limpos (zero ocorrências): ${docsLimpos}/${lote022.length}`);
console.log(`Ocorrências encontradas: ${totalOcorrencias}`);
for (const s of suspeitos) {
  console.log(`\n[${s.tipo}] doc=${s.doc} campo=${s.campo}`);
  console.log(`  trecho: "${s.trecho}"`);
  console.log(`  contexto: ...${s.contexto}...`);
}
console.log('\n=== FIM — decidir exclusão/revisão de cada ocorrência antes de ingerir ===');
