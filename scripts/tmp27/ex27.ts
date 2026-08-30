// Extrai blocos de artigos do texto convertido e reflowa parágrafos (sem alterar caracteres)
import { readFileSync } from 'fs';

const [, , file, fromMark, toMark] = process.argv;
const txt = readFileSync(`/tmp/leis-txt/${file}.txt`, 'utf8');
const lines = txt.split('\n');
const i = lines.findIndex((l) => l.trim().startsWith(fromMark));
const j = toMark ? lines.findIndex((l, k) => k > i && l.trim().startsWith(toMark)) : lines.length;
if (i < 0) { console.error('MARCA INICIAL NÃO ACHADA:', fromMark); process.exit(1); }
if (j <= i) { console.error('MARCA FINAL NÃO ACHADA:', toMark); process.exit(1); }
// reflow: junta linhas quebradas em parágrafos (quebra só em linha vazia)
const out: string[] = [];
let buf = '';
for (let k = i; k < j; k++) {
  const l = lines[k];
  if (l.trim() === '') { if (buf) { out.push(buf.trim()); buf = ''; } continue; }
  buf = buf ? buf + ' ' + l.trim() : l.trim();
}
if (buf) out.push(buf.trim());
console.log(out.join('\n\n'));
