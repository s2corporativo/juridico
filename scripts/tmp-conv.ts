// Temp converter (Task 12-b) — html → texto simples preservando linhas
import { readFileSync, writeFileSync } from 'fs';
const [, , src, dst] = process.argv;
let h = readFileSync(src, 'latin1');
h = h.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
h = h.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|tr|h[1-6]|li|blockquote)>/gi, '\n');
h = h.replace(/<td[^>]*>/gi, ' ').replace(/<[^>]+>/g, ' ');
h = h.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
h = h.replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n');
writeFileSync(dst, h, 'utf8');
console.log(dst, h.length);
