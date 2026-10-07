import type { TemplateDTO } from "@/lib/types";

export const MAX_BATCH_CASES = 50;

export interface ParsedBatchCase {
  index: number;
  title?: string;
  fields: Record<string, string>;
  raw: string;
}

function norm(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function parseBatchCases(
  text: string,
  template: TemplateDTO,
): { cases: ParsedBatchCase[]; errors: string[] } {
  const errors: string[] = [];
  const blocks = text
    .split(/^\s*-{3,}\s*$/m)
    .map((block) => block.trim())
    .filter(Boolean);

  const keyByNorm = new Map<string, string>();
  for (const field of template.fields) {
    keyByNorm.set(norm(field.key), field.key);
    keyByNorm.set(norm(field.label), field.key);
  }
  const titleAliases = new Set(["titulo", "title", "nomedaminuta"]);

  const cases: ParsedBatchCase[] = [];
  blocks.forEach((block, index) => {
    const fields: Record<string, string> = {};
    let title: string | undefined;
    let matched = 0;

    for (const line of block.split("\n")) {
      const match = line.match(/^\s*([^:]{1,60}?)\s*:\s*(.+)$/);
      if (!match) continue;
      const label = norm(match[1]);
      const value = match[2].trim();
      if (!value) continue;
      if (titleAliases.has(label)) {
        title = value;
        continue;
      }
      const key = keyByNorm.get(label);
      if (!key) {
        errors.push('Caso ' + (index + 1) + ': campo "' + match[1] + '" não existe no template — linha ignorada.');
        continue;
      }
      fields[key] = fields[key] ? fields[key] + "; " + value : value;
      matched++;
    }

    if (matched === 0 && !title) {
      errors.push('Caso ' + (index + 1) + ': nenhuma linha "campo: valor" reconhecida — bloco ignorado.');
      return;
    }
    cases.push({ index, title, fields, raw: block.slice(0, 120) });
  });

  return { cases, errors };
}
