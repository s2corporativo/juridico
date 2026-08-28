import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const RMBH_LEGAL_MUNICIPALITIES = [
  "Baldim",
  "Belo Horizonte",
  "Betim",
  "Brumadinho",
  "Caeté",
  "Capim Branco",
  "Confins",
  "Contagem",
  "Esmeraldas",
  "Florestal",
  "Ibirité",
  "Igarapé",
  "Itaguara",
  "Itatiaiuçu",
  "Jaboticatubas",
  "Juatuba",
  "Lagoa Santa",
  "Mário Campos",
  "Mateus Leme",
  "Matozinhos",
  "Nova Lima",
  "Nova União",
  "Pedro Leopoldo",
  "Raposos",
  "Ribeirão das Neves",
  "Rio Acima",
  "Rio Manso",
  "Sabará",
  "Santa Luzia",
  "São Joaquim de Bicas",
  "São José da Lapa",
  "Sarzedo",
  "Taquaraçu de Minas",
  "Vespasiano",
];

export function buildRmbhDataset(municipalities, refreshedAt = new Date().toISOString()) {
  const byName = new Map(municipalities.map(({ id, nome }) => [nome, id]));
  const rows = RMBH_LEGAL_MUNICIPALITIES.map((name) => ({ name, ibgeCode: byName.get(name) }));
  const missing = rows.filter(({ ibgeCode }) => !Number.isInteger(ibgeCode));

  if (rows.length !== 34 || missing.length > 0) {
    throw new Error(`Lista RMBH incompleta: ${missing.map(({ name }) => name).join(", ") || "quantidade inválida"}`);
  }

  return {
    schemaVersion: 1,
    scope: "rmbh_legal_34_municipalities",
    source: {
      legalComposition: "Lei Complementar MG nº 89, de 12/01/2006",
      legalUrl: "https://www.almg.gov.br/legislacao-mineira/texto/LCP/89/2006/?cons=1",
      codesUrl: "https://servicodados.ibge.gov.br/api/v1/localidades/estados/31/municipios",
    },
    refreshedAt,
    municipalities: rows,
  };
}

export async function refreshRmbhDataset(outputPath) {
  const response = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados/31/municipios", {
    headers: { accept: "application/json" },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`IBGE respondeu HTTP ${response.status}`);

  const dataset = buildRmbhDataset(await response.json());
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(dataset, null, 2)}\n`, "utf8");
  return dataset;
}

const directInvocation = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (directInvocation) {
  const outputPath = resolve(process.cwd(), "data/rmbh-municipalities.json");
  const dataset = await refreshRmbhDataset(outputPath);
  console.log(`RMBH atualizada: ${dataset.municipalities.length} municípios; saída=${outputPath}`);
}
