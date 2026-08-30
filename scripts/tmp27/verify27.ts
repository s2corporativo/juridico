// Verificação anti-invenção v2 — valida SOMENTE os blocos "## Texto CONFIRMADO LITERALMENTE"
// do lote-027 contra os arquivos oficiais normalizados (anotações de redação removidas dos DOIS lados;
// divisão em trechos contíguos nos marcadores de elisão [...]).
import { readFileSync } from 'fs';

const lote = readFileSync('/home/z/my-project/data/ejc/lote-027-penal-ii.ts', 'utf8');

const ANNOT = /\((?:Redação dada|Incluíd[oa] pela|Renumerado|Revogad[oa] pela|Vide|Vigência|Regulamento|Incluíd[oa] pela Leinº)[^)]*\)\s*\.?/g;

const norm = (s: string) =>
  s
    .replace(/\s+/g, ' ')
    .replace(ANNOT, ' ')
    .replace(/§\s*(\d+)\s*o\b/g, '§ $1º')
    .replace(/(\d)\s+º/g, '$1º')
    .replace(/Leinº/g, 'Lei nº')
    .replace(/ ([,;:.])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

const SOURCES: Record<string, string> = {
  cp: norm(readFileSync('/tmp/leis-txt/Del2848compilado.txt', 'utf8')),
  cpp: norm(readFileSync('/tmp/leis-txt/Del3689compilado.txt', 'utf8')),
  cf: norm(readFileSync('/tmp/leis-txt/const88.txt', 'utf8')),
  l14155: norm(readFileSync('/tmp/leis-txt/L14155.txt', 'utf8')),
  l9099: norm(readFileSync('/tmp/leis-txt/L9099.txt', 'utf8')),
};

// Extrai blocos "## Texto CONFIRMADO LITERALMENTE" até o próximo "## "
const blocos: { slug: string; texto: string }[] = [];
const slugRe = /slug:\s*'([^']+)'/g;
let m: RegExpExecArray | null;
const slugPos: { slug: string; pos: number }[] = [];
while ((m = slugRe.exec(lote))) slugPos.push({ slug: m[1], pos: m.index });
const blocoRe = /## Texto CONFIRMADO LITERALMENTE[^`]*?(?=\n## |\nNOTA)/g;
let b: RegExpExecArray | null;
while ((b = blocoRe.exec(lote))) {
  const s = slugPos.filter((x) => x.pos < b!.index).pop()?.slug ?? '?';
  blocos.push({ slug: s, texto: b[0] });
}

let ok = 0, fail = 0;
const failures: { slug: string; frag: string }[] = [];
for (const { slug, texto } of blocos) {
  // remove cabeçalho e aspas delimitadoras
  const corpo = texto.replace(/^## Texto CONFIRMADO LITERALMENTE[^\n]*\n/, '').replace(/"/g, ' ');
  // fatia em trechos contíguos: quebra em [...] e em "no arquivo constam ainda"/"constam ainda"
  const trechos = corpo
    .split(/\[\.\.\.\]|no arquivo constam ainda|constam ainda no arquivo|no arquivo compilado traz ainda|\[VERIFICAR[^\]]*\]/g)
    .map((t) => norm(t))
    .filter((t) => t.length >= 30);
  for (const t of trechos) {
    const found = Object.values(SOURCES).some((s) => s.includes(t));
    if (found) ok++;
    else { fail++; failures.push({ slug, frag: t.slice(0, 200) }); }
  }
}
console.log(`BLOCOS LITERAIS: ${blocos.length} | TRECHOS ok=${ok} FALHAS=${fail}`);
for (const f of failures) console.log(`  [${f.slug}] NÃO ACHADA: ${f.frag}`);
