// Converte HTML Planalto (ISO-8859-1) -> texto plano UTF-8 para extração literal
import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const FILES = ['Del2848compilado', 'Del3689compilado', 'const88', 'L14155', 'L9099'];
mkdirSync('/tmp/leis-txt', { recursive: true });

for (const f of FILES) {
  const buf = readFileSync(`/tmp/leis-oficiais/${f}.htm`);
  let html = new TextDecoder('windows-1252').decode(buf);
  // remove blocos não visíveis
  html = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  // quebras em tags de bloco
  html = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|tr|h[1-6]|li|center|blockquote)>/gi, '\n');
  // strip tags
  let txt = html.replace(/<[^>]*>/g, ' ');
  // entidades nomeadas comuns
  const ents: Record<string, string> = {
    nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
    aacute: 'á', agrave: 'à', acirc: 'â', atilde: 'ã', aring: 'å', auml: 'ä',
    eacute: 'é', ecirc: 'ê', egrave: 'è', iacute: 'í', icirc: 'î', igrave: 'ì',
    oacute: 'ó', otilde: 'õ', ocirc: 'ô', ouml: 'ö', uacute: 'ú', uuml: 'ü',
    ccedil: 'ç', ntild: 'ñ', ntilde: 'ñ', szlig: 'ß', ordf: 'ª', ordm: 'º',
    mdash: '—', ndash: '–', ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', hellip: '…',
    deg: '°', copy: '©', sect: '§', para: '¶', middot: '·',
  };
  txt = txt.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)));
  txt = txt.replace(/&([a-zA-Z]+);/g, (m, name) => ents[name.toLowerCase()] ?? m);
  // normaliza espaços por linha (mantém quebras)
  txt = txt.split('\n').map((l) => l.replace(/[ \t\u00a0]+/g, ' ').replace(/^ | $/g, '')).join('\n');
  txt = txt.replace(/\n{3,}/g, '\n\n');
  writeFileSync(`/tmp/leis-txt/${f}.txt`, txt, 'utf8');
  console.log(f, '=>', txt.length, 'chars');
}
