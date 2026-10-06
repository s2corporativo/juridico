/**
 * Seed das 7 fontes P0 do Atlas Forense (Painel JEC BH e Betim):
 * define priority='p0_obrigatoria', descreve apenas o catálogo público
 * e insere fontes ausentes.
 * Idempotente (upsert por sourceKey).
 */
import mysql from "mysql2/promise";

const conn = await mysql.createConnection({
  host: "127.0.0.1",
  port: Number(process.env.DB_PORT || 33061),
  user: "root",
  password: "",
  database: "atlas_ejc",
});

const p0 = [
  {
    sourceKey: "cnj-datajud",
    label: "DataJud — API Pública do CNJ",
    maintainer: "Conselho Nacional de Justiça",
    sourceType: "api",
    baseUrl: "https://apis.cnj.jus.br/consultaprocessual/api/v1",
    documentationUrl: "https://datajud-wiki.cnj.jus.br/api-publica/",
    authentication: "api_key",
    integrationStatus: "credential_required",
    coverage: "Processos de todos os tribunais brasileiros (metadados, sem documentos).",
    contentScope: "Metadados processuais: classe, assunto, órgão, movimentos agregados.",
    usageNote: "Chave de acesso gratuita solicitada ao CNJ. Consulta pontual por número CNJ e censo agregado por tribunal; sem conteúdo de decisões.",
    citationText: "DataJud — API Pública do CNJ",
    privacyNote: "Metadados processuais agregados; sem partes identificáveis no acervo.",
  },
  {
    sourceKey: "cnj-djen-comunica",
    label: "Comunica CNJ — DJEN",
    maintainer: "Conselho Nacional de Justiça",
    sourceType: "api",
    baseUrl: "https://comunicapi.cnj.jus.br/api/v1/comunicacao",
    documentationUrl: "https://datajud-wiki.cnj.jus.br/djen-comunicacao/",
    authentication: "none",
    integrationStatus: "not_integrated",
    coverage: "Intimações, citações e editais publicados no DJEN (Diário de Justiça Eletrônico Nacional).",
    contentScope: "Referência institucional ao Diário de Justiça Eletrônico Nacional; sem coleta de comunicações pelo Atlas.",
    usageNote: "Consulte o portal oficial. O Atlas não coleta nem armazena comunicações individualizadas.",
    citationText: "Comunica CNJ — DJEN",
    privacyNote: "O Atlas não armazena teor de comunicações do DJEN.",
  },
  {
    sourceKey: "lexml",
    label: "LexML — Senado Federal",
    maintainer: "Senado Federal",
    sourceType: "webservice",
    baseUrl: "http://lexml.gov.br/busca/sru",
    documentationUrl: "https://www.lexml.gov.br/documentacao/SRU-2.0.pdf",
    authentication: "none",
    integrationStatus: "not_integrated",
    coverage: "Legislação, jurisprudência e documentos públicos indexados no LexML Brasil.",
    contentScope: "Protocolo SRU (SearchRetrieve) com URNs LexML, títulos e descrições.",
    usageNote: "Referência ao serviço público LexML; consulta automatizada não habilitada nesta versão.",
    citationText: "LexML Brasil — Senado Federal",
    privacyNote: "O Atlas não armazena documentos individualizados desta fonte.",
  },
  {
    sourceKey: "stj-dados-abertos",
    label: "Dados Abertos do STJ",
    maintainer: "Superior Tribunal de Justiça",
    sourceType: "catalog",
    baseUrl: "https://dadosabertos.stj.jus.br",
    documentationUrl: "https://dadosabertos.stj.jus.br/dataset",
    authentication: "none",
    integrationStatus: "integrated",
    coverage: "Catálogo de acórdãos e decisões publicados pelo STJ em dados abertos.",
    contentScope: "package_search (CKAN): títulos, descrições e URLs de datasets de julgados.",
    usageNote: "O Atlas consulta apenas metadados do catálogo CKAN; confirme o inteiro teor no portal oficial do STJ.",
    citationText: "Dados Abertos do STJ",
    privacyNote: "O Atlas armazena apenas metadados públicos aprovados para o catálogo.",
  },
  {
    sourceKey: "tjmg-jurisprudencia",
    label: "Jurisprudência TJMG",
    maintainer: "Tribunal de Justiça de Minas Gerais",
    sourceType: "manual",
    baseUrl: "https://www.tjmg.jus.br/jurisprudencia",
    documentationUrl: "https://www.tjmg.jus.br/jurisprudencia",
    authentication: "manual",
    integrationStatus: "manual_only",
    coverage: "Acórdãos e decisões do TJMG (BH, Betim e comarcas da RMBH).",
    contentScope: "Busca unificada do TJMG; sem API pública de consulta automática.",
    usageNote: "Consulta manual nos formulários oficiais do tribunal; sem importação automática nesta versão.",
    citationText: "Jurisprudência TJMG",
    privacyNote: "O catálogo do Atlas não importa dados de processos individuais desta fonte.",
  },
  {
    sourceKey: "tjmg-esaj",
    label: "e-SAJ TJMG — Consulta Processual",
    maintainer: "Tribunal de Justiça de Minas Gerais",
    sourceType: "webservice",
    baseUrl: "https://esaj.tjmg.jus.br/cpopg/open.do",
    documentationUrl: "https://esaj.tjmg.jus.br/esaj/portal.do",
    authentication: "none",
    integrationStatus: "not_integrated",
    coverage: "Consulta pública de processos cíveis do TJMG (primeiro grau).",
    contentScope: "Movimentações, partes e assuntos de processos individuais.",
    usageNote: "Consulta manual por número de processo (sem API aberta confirmada neste ambiente).",
    citationText: "e-SAJ — TJMG",
    privacyNote: "Consulta pública pontual; acervo do Atlas armazena apenas metadados.",
  },
  {
    sourceKey: "imprensa-oficial-mg",
    label: "Imprensa Oficial MG — DJE-MG",
    maintainer: "Estado de Minas Gerais",
    sourceType: "manual",
    baseUrl: "https://www.jusmg.gov.br",
    documentationUrl: "https://www.jusmg.gov.br",
    authentication: "manual",
    integrationStatus: "not_integrated",
    coverage: "Publicações oficiais do Estado de Minas Gerais (atos, editais, deliberacoes).",
    contentScope: "Diário eletrônico do Executivo e atos públicos oficiais.",
    usageNote: "Consulta manual no portal oficial; confira atos e datas na origem.",
    citationText: "Imprensa Oficial do Estado de Minas Gerais",
    privacyNote: "O Atlas não importa publicações individualizadas desta fonte.",
  },
];

let upserts = 0;
for (const s of p0) {
  const [res] = await conn.execute(
    `INSERT INTO public_data_sources
      (sourceKey, label, maintainer, sourceType, baseUrl, documentationUrl, authentication,
       integrationStatus, priority, coverage, contentScope, usageNote, citationText, privacyNote)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'p0_obrigatoria', ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
      label = VALUES(label), maintainer = VALUES(maintainer), sourceType = VALUES(sourceType),
      baseUrl = VALUES(baseUrl), documentationUrl = VALUES(documentationUrl),
      authentication = VALUES(authentication), integrationStatus = VALUES(integrationStatus),
      priority = 'p0_obrigatoria', coverage = VALUES(coverage), contentScope = VALUES(contentScope),
      usageNote = VALUES(usageNote), citationText = VALUES(citationText), privacyNote = VALUES(privacyNote),
      updatedAt = NOW()`,
    [s.sourceKey, s.label, s.maintainer, s.sourceType, s.baseUrl, s.documentationUrl, s.authentication, s.integrationStatus, s.coverage, s.contentScope, s.usageNote, s.citationText, s.privacyNote]
  );
  upserts += res.affectedRows;
}

const [[{ total }]] = await conn.query(
  "SELECT COUNT(*) AS total FROM public_data_sources WHERE priority = 'p0_obrigatoria'"
);
console.log(`Seed P0 concluído: ${p0.length} fontes processadas (${upserts} linhas afetadas), ${total} marcadas p0_obrigatoria.`);
await conn.end();
