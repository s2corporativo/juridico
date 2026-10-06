import mysql from "mysql2/promise";
import { pathToFileURL } from "node:url";

const topics = [
  { parentPathKey: null, kind: "area", title: "Direito do Consumidor", slug: "direito-do-consumidor", pathKey: "direito-do-consumidor", summary: "Área para relações de consumo, contratos e responsabilidade por serviços.", synonyms: "consumerista; relação de consumo", sourceStatus: "attachment_reviewed" },
  { parentPathKey: "direito-do-consumidor", kind: "instituto", title: "Serviços financeiros", slug: "servicos-financeiros", pathKey: "direito-do-consumidor/servicos-financeiros", summary: "Instituto para contratos, tarifas e meios de pagamento.", synonyms: "bancário; conta; contrato", sourceStatus: "attachment_reviewed" },
  { parentPathKey: "direito-do-consumidor/servicos-financeiros", kind: "tema", title: "Tarifas e contratos bancários", slug: "tarifas-e-contratos-bancarios", pathKey: "direito-do-consumidor/servicos-financeiros/tarifas-e-contratos-bancarios", summary: "Tema piloto sobre tarifas, revisional, seguro prestamista e exibição contratual.", synonyms: "tarifa; seguro prestamista; revisional", sourceStatus: "attachment_reviewed" },
  { parentPathKey: null, kind: "area", title: "Responsabilidade Civil", slug: "responsabilidade-civil", pathKey: "responsabilidade-civil", summary: "Área para reparação de danos, falha de serviço e obrigações contratuais.", synonyms: "dano moral; dano material", sourceStatus: "attachment_reviewed" },
  { parentPathKey: "responsabilidade-civil", kind: "tema", title: "Falha de serviço e dano moral", slug: "falha-de-servico-e-dano-moral", pathKey: "responsabilidade-civil/falha-de-servico-e-dano-moral", summary: "Tema piloto sobre falha operacional, dano material e lesão à honra objetiva.", synonyms: "falha operacional; honra objetiva", sourceStatus: "attachment_reviewed" },
  { parentPathKey: "responsabilidade-civil", kind: "subarea", title: "Relações contratuais", slug: "relacoes-contratuais", pathKey: "responsabilidade-civil/relacoes-contratuais", summary: "Subárea para reserva de domínio, registro e proteção de terceiro de boa-fé.", synonyms: "reserva de domínio; gravame", sourceStatus: "attachment_reviewed" },
  { parentPathKey: "responsabilidade-civil/relacoes-contratuais", kind: "tema", title: "Reserva de domínio e terceiro de boa-fé", slug: "reserva-de-dominio-e-terceiro-de-boa-fe", pathKey: "responsabilidade-civil/relacoes-contratuais/reserva-de-dominio-e-terceiro-de-boa-fe", summary: "Tema piloto sobre registro, oponibilidade e gravame indevido.", synonyms: "oponibilidade; gravame", sourceStatus: "attachment_reviewed" },
];

const theses = [
  { topicPathKey: "responsabilidade-civil/falha-de-servico-e-dano-moral", title: "Falha operacional em meios de pagamento pode atingir a honra objetiva da pessoa jurídica", position: "condicionada", description: "No acervo piloto, o entendimento foi registrado em caso com falha operacional comprovada, dano material e lesão à honra objetiva.", legalBasis: "Fundamentação resumida no acórdão importado; confirmar inteiro teor antes de uso profissional.", proofNotes: "Comprovação da falha, nexo causal, dano material e repercussão objetiva.", adverseFacts: "Ausência de prova da falha, do nexo ou da repercussão concreta.", sourceStatus: "attachment_reviewed", lastReviewedAt: "2026-08-26 18:10:55" },
  { topicPathKey: "direito-do-consumidor/servicos-financeiros/tarifas-e-contratos-bancarios", title: "Exibição incidental de contrato bancário pode afastar extinção prematura por inépcia", position: "favoravel", description: "O acervo registra acórdão em que a guarda do documento pelo banco foi tratada como razão para prosseguimento do feito.", legalBasis: "Fundamento processual resumido do acórdão importado.", proofNotes: "Indicação do documento, pertinência com a controvérsia e demonstração de que está em poder da instituição.", adverseFacts: "Pedido genérico, documento já disponível ou ausência de pertinência.", sourceStatus: "attachment_reviewed", lastReviewedAt: "2026-08-26 18:10:55" },
  { topicPathKey: "direito-do-consumidor/servicos-financeiros/tarifas-e-contratos-bancarios", title: "Tarifas e seguro prestamista exigem análise da efetiva prestação e da liberdade de escolha", position: "condicionada", description: "Os julgados importados recomendam leitura individualizada de tarifa, serviço prestado e prova de escolha livre quanto ao seguro.", legalBasis: "Fundamentos resumidos nos acórdãos importados; não generalizar parâmetros a todos os contratos.", proofNotes: "Contrato, comprovantes de serviço, proposta de seguro e elementos de escolha do consumidor.", adverseFacts: "Prova de serviço efetivo, contratação independente ou peculiaridade contratual.", sourceStatus: "attachment_reviewed", lastReviewedAt: "2026-08-26 18:10:55" },
];

const jurisprudenceTopics = [
  ["TJMG-BETIM-2025-063186-8-001", "direito-do-consumidor/servicos-financeiros/tarifas-e-contratos-bancarios", "primary"],
  ["TJMG-BETIM-2025-304515-7-001", "responsabilidade-civil/falha-de-servico-e-dano-moral", "primary"],
  ["TJMG-BH-2025-323134-4-001", "responsabilidade-civil/relacoes-contratuais/reserva-de-dominio-e-terceiro-de-boa-fe", "primary"],
  ["TJMG-BH-2026-307529-5-001", "direito-do-consumidor/servicos-financeiros/tarifas-e-contratos-bancarios", "primary"],
  ["TJMG-CONTAGEM-2025-094026-9-001", "direito-do-consumidor/servicos-financeiros/tarifas-e-contratos-bancarios", "primary"],
  ["TJMG-CONTAGEM-2025-261059-7-001", "direito-do-consumidor/servicos-financeiros/tarifas-e-contratos-bancarios", "primary"],
];

const thesisAuthorities = [
  ["Falha operacional em meios de pagamento pode atingir a honra objetiva da pessoa jurídica", "TJMG-BETIM-2025-304515-7-001", "supports", "Caso piloto de falha operacional e honra objetiva."],
  ["Exibição incidental de contrato bancário pode afastar extinção prematura por inépcia", "TJMG-CONTAGEM-2025-094026-9-001", "supports", "Caso piloto processual sobre exibição incidental."],
  ["Tarifas e seguro prestamista exigem análise da efetiva prestação e da liberdade de escolha", "TJMG-BETIM-2025-063186-8-001", "supports", "Caso piloto sobre tarifas, efetiva prestação e seguro."],
  ["Tarifas e seguro prestamista exigem análise da efetiva prestação e da liberdade de escolha", "TJMG-CONTAGEM-2025-261059-7-001", "context", "Caso piloto com parâmetros específicos sobre juros e seguro."],
];

const auditEvents = [
  ["ingestion_batch", "jurisprudencia-local-lote-1-20260826", "imported_metadata", "attachment_reviewed", "Compêndio Nacional", "Importação dos seis registros com origem oficial indicada e sem execução dos scripts do ZIP.", "2026-08-26 18:10:55"],
  ...["TJMG-BETIM-2025-304515-7-001", "TJMG-CONTAGEM-2025-094026-9-001", "TJMG-BH-2026-307529-5-001", "TJMG-BETIM-2025-063186-8-001", "TJMG-CONTAGEM-2025-261059-7-001", "TJMG-BH-2025-323134-4-001"].map(key => ["jurisprudence_record", key, "imported_metadata", "official_confirmed", "Compêndio Nacional", "Metadado público importado do lote piloto.", "2026-08-26 18:10:55"]),
  ["public_data_source", "cnj-datajud", "cataloged", "official_confirmed", "Sistema Atlas Forense", "Fonte oficial catalogada; integração depende de chave temporária e Termo de Uso vigente.", "2026-08-26 19:15:27"],
  ["public_data_source", "stj-dados-abertos", "cataloged", "official_confirmed", "Sistema Atlas Forense", "Catálogo CKAN oficial validado passivamente; nenhum recurso foi ingerido.", "2026-08-26 19:15:27"],
  ["public_data_source", "lexml-sru", "cataloged", "attachment_reviewed", "Sistema Atlas Forense", "Documentação oficial de SRU confirmada; endpoint não foi automatizado após verificação de conexão.", "2026-08-26 19:15:27"],
  ["public_data_source", "tjmg-jurisprudencia", "cataloged", "official_confirmed", "Sistema Atlas Forense", "Portal oficial mantido apenas para consulta manual; não há API pública documentada.", "2026-08-26 19:15:27"],
  ["public_data_source", "lexml-sru", "license_verified", "official_confirmed", "Sistema Atlas Forense", "Página oficial de Dados Abertos do LexML confirmou condições gerais de dados abertos; disponibilidade do endpoint SRU segue pendente por verificação de conexão.", "2026-08-26 19:21:35"],
  ["public_data_source", "stj-dados-abertos", "connector_enabled", "official_confirmed", "Sistema Atlas Forense", "Consulta pública do catálogo CKAN do STJ ativada por tRPC, sem download de recursos ou ingestão automática.", "2026-08-26 19:22:29"],
  ["national_census_run", "datajud-jec-nacional-2025-2026-v1", "planned", "official_confirmed", "Sistema Atlas Forense", "Execução nacional preparada; nenhuma métrica coletada e nenhuma credencial registrada.", "2026-08-26 21:00:27"],
];

export const publicMetadataManifest = { topics, theses, jurisprudenceTopics, thesisAuthorities, auditEvents };

export function validatePublicMetadataManifest(manifest = publicMetadataManifest) {
  if (manifest.topics.length !== 7 || manifest.theses.length !== 3 || manifest.jurisprudenceTopics.length !== 6 || manifest.thesisAuthorities.length !== 4 || manifest.auditEvents.length !== 14) {
    throw new Error("Manifesto público do Compêndio está incompleto.");
  }
  if (manifest.jurisprudenceTopics.some(([externalId]) => !externalId.startsWith("TJMG-"))) {
    throw new Error("Manifesto contém identificador jurisprudencial fora do lote público validado.");
  }
}

async function requireId(connection, sql, value, label) {
  const [[row]] = await connection.query(sql, [value]);
  if (!row) throw new Error(`${label} obrigatório não foi localizado: ${value}`);
  return row.id;
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL é obrigatória para a carga de metadados públicos.");
  validatePublicMetadataManifest();
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  try {
    await connection.beginTransaction();
    const topicIds = new Map();
    for (const topic of topics) {
      const parentId = topic.parentPathKey ? topicIds.get(topic.parentPathKey) : null;
      if (topic.parentPathKey && !parentId) throw new Error(`Tema-pai ausente no manifesto: ${topic.parentPathKey}`);
      await connection.query(
        "INSERT INTO legal_topics (parentId,kind,title,slug,pathKey,summary,synonyms,cnjCodes,sourceStatus,version) VALUES (?,?,?,?,?,?,?,NULL,?,1) ON DUPLICATE KEY UPDATE parentId=VALUES(parentId),kind=VALUES(kind),title=VALUES(title),slug=VALUES(slug),summary=VALUES(summary),synonyms=VALUES(synonyms),sourceStatus=VALUES(sourceStatus),version=VALUES(version)",
        [parentId, topic.kind, topic.title, topic.slug, topic.pathKey, topic.summary, topic.synonyms, topic.sourceStatus],
      );
      topicIds.set(topic.pathKey, await requireId(connection, "SELECT id FROM legal_topics WHERE pathKey = ?", topic.pathKey, "Tema"));
    }

    const thesisIds = new Map();
    for (const thesis of theses) {
      const topicId = topicIds.get(thesis.topicPathKey);
      if (!topicId) throw new Error(`Tema da tese ausente: ${thesis.topicPathKey}`);
      const [[existing]] = await connection.query("SELECT id FROM legal_theses WHERE topicId = ? AND title = ? LIMIT 1", [topicId, thesis.title]);
      const fields = [thesis.position, thesis.description, thesis.legalBasis, thesis.proofNotes, thesis.adverseFacts, thesis.sourceStatus, thesis.lastReviewedAt];
      if (existing) {
        await connection.query("UPDATE legal_theses SET position=?,description=?,legalBasis=?,proofNotes=?,adverseFacts=?,sourceStatus=?,lastReviewedAt=? WHERE id=?", [...fields, existing.id]);
        thesisIds.set(thesis.title, existing.id);
      } else {
        const [result] = await connection.query("INSERT INTO legal_theses (topicId,title,position,description,legalBasis,proofNotes,adverseFacts,sourceStatus,lastReviewedAt) VALUES (?,?,?,?,?,?,?,?,?)", [topicId, thesis.title, ...fields]);
        thesisIds.set(thesis.title, result.insertId);
      }
    }

    for (const [externalId, topicPathKey, relevance] of jurisprudenceTopics) {
      const jurisprudenceId = await requireId(connection, "SELECT id FROM jurisprudence_records WHERE externalId = ?", externalId, "Julgado");
      const topicId = topicIds.get(topicPathKey);
      await connection.query("INSERT INTO jurisprudence_topics (jurisprudenceId,topicId,relevance) VALUES (?,?,?) ON DUPLICATE KEY UPDATE relevance=VALUES(relevance)", [jurisprudenceId, topicId, relevance]);
    }

    for (const [thesisTitle, externalId, stance, note] of thesisAuthorities) {
      const thesisId = thesisIds.get(thesisTitle);
      const jurisprudenceId = await requireId(connection, "SELECT id FROM jurisprudence_records WHERE externalId = ?", externalId, "Julgado");
      await connection.query("INSERT INTO thesis_authorities (thesisId,jurisprudenceId,stance,note) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE stance=VALUES(stance),note=VALUES(note)", [thesisId, jurisprudenceId, stance, note]);
    }

    for (const [entityType, entityKey, action, sourceStatus, actorLabel, note, createdAt] of auditEvents) {
      const [[existing]] = await connection.query("SELECT id FROM audit_events WHERE entityType=? AND entityKey=? AND action=? AND sourceStatus <=> ? AND actorLabel=? AND note <=> ? LIMIT 1", [entityType, entityKey, action, sourceStatus, actorLabel, note]);
      if (!existing) await connection.query("INSERT INTO audit_events (entityType,entityKey,action,sourceStatus,actorLabel,note,createdAt) VALUES (?,?,?,?,?,?,?)", [entityType, entityKey, action, sourceStatus, actorLabel, note, createdAt]);
    }
    await connection.commit();
    console.log("METADADOS_PUBLICOS: 7 temas, 3 teses, 6 vínculos temáticos, 4 autoridades e 14 eventos de auditoria.");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.destroy();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { console.error(`METADADOS_PUBLICOS_ERRO: ${error instanceof Error ? error.message : "erro desconhecido"}`); process.exitCode = 1; });
}
