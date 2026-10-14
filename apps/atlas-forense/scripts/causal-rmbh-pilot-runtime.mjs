import { createHash, createHmac } from "node:crypto";

export const DATAJUD_BASE_URL = "https://api-publica.datajud.cnj.jus.br";
export const DATAJUD_ACCESS_URL = "https://datajud-wiki.cnj.jus.br/api-publica/acesso/";
export const JEC_CLASS_CODE = 436;
export const JEC_DEGREE = "JE";
export const DEFAULT_PAGE_SIZE = 100;
export const DEFAULT_MAX_PAGES_PER_BATCH = 2;
export const MAX_PAGE_SIZE = 100;

export function buildCausalPilotQuery({ bodyCodes, subjectCodes, from = "2025-01-01", to = "2026-08-27", pageSize = DEFAULT_PAGE_SIZE, searchAfter } = {}) {
  if (!Array.isArray(bodyCodes) || bodyCodes.length < 1 || bodyCodes.length > 24) throw new Error("O lote causal deve conter entre 1 e 24 órgãos.");
  if (!Array.isArray(subjectCodes) || subjectCodes.length < 1 || subjectCodes.length > 1_024) throw new Error("A lista de assuntos deve conter entre 1 e 1.024 códigos.");
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > MAX_PAGE_SIZE) throw new Error("pageSize deve estar entre 1 e 100.");
  const query = {
    size: pageSize,
    track_total_hits: true,
    _source: ["numeroProcesso", "tribunal", "grau", "dataAjuizamento", "dataHoraUltimaAtualizacao", "@timestamp", "classe", "assuntos", "orgaoJulgador", "movimentos"],
    query: { bool: { filter: [
      { term: { grau: JEC_DEGREE } },
      { terms: { "classe.codigo": [JEC_CLASS_CODE] } },
      { terms: { "orgaoJulgador.codigo": bodyCodes.map(Number) } },
      { terms: { "assuntos.codigo": subjectCodes.map(Number) } },
      { range: { dataAjuizamento: { gte: `${from.replaceAll("-", "")}000000`, lte: `${to.replaceAll("-", "")}235959` } } },
    ] } },
    sort: [{ "@timestamp": { order: "asc" } }],
  };
  if (searchAfter) query.search_after = searchAfter;
  return query;
}

function nameOf(value) {
  if (!value || typeof value !== "object") return null;
  const name = value.nome ?? value.name;
  return typeof name === "string" ? name.trim() : null;
}
function flatten(values) {
  return (Array.isArray(values) ? values.flat(Infinity) : []).filter(value => value && typeof value === "object");
}
function safeDate(value) { return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value) ? value : null; }

export function sanitizeCausalHit(source, sortValue = null) {
  if (!source || typeof source !== "object") return null;
  const processNumber = typeof source.numeroProcesso === "string" ? source.numeroProcesso.replace(/\D/g, "") : "";
  if (processNumber.length < 15 || processNumber.length > 25) return null;
  const classObject = source.classe && typeof source.classe === "object" ? source.classe : {};
  const bodyObject = source.orgaoJulgador && typeof source.orgaoJulgador === "object" ? source.orgaoJulgador : {};
  const subjects = flatten(source.assuntos).map(item => ({ code: Number.isInteger(Number(item.codigo)) ? Number(item.codigo) : null, label: nameOf(item) })).filter(item => item.code !== null && item.label);
  const movements = flatten(source.movimentos).map(item => ({ code: Number.isInteger(Number(item.codigo)) ? Number(item.codigo) : null, name: nameOf(item), date: safeDate(item.dataHora ?? item.data) })).filter(item => item.name || item.date).slice(-80);
  return {
    processNumber,
    tribunal: typeof source.tribunal === "string" ? source.tribunal : "TJMG",
    degree: typeof source.grau === "string" ? source.grau : JEC_DEGREE,
    filingDate: safeDate(source.dataAjuizamento),
    updatedAt: safeDate(source.dataHoraUltimaAtualizacao ?? source["@timestamp"]),
    classCode: Number.isInteger(Number(classObject.codigo)) ? Number(classObject.codigo) : JEC_CLASS_CODE,
    classLabel: nameOf(classObject) ?? "Juizado Especial Cível",
    bodyCode: Number.isInteger(Number(bodyObject.codigo)) ? Number(bodyObject.codigo) : null,
    bodyLabel: nameOf(bodyObject) ?? "Órgão julgador não informado",
    municipalityIbgeCode: Number.isInteger(Number(bodyObject.codigoMunicipioIBGE)) ? Number(bodyObject.codigoMunicipioIBGE) : null,
    subjects,
    movements,
    sort: Array.isArray(sortValue) ? sortValue : null,
  };
}

export function buildCaseKey(alias, processNumber, secret) {
  if (!secret || secret.length < 32) throw new Error("ATLAS_CAUSAL_CASE_KEY_SECRET deve possuir ao menos 32 caracteres.");
  return `${alias}:${createHmac("sha256", secret).update(processNumber).digest("hex")}`;
}
export function hashRecord(record) { return createHash("sha256").update(JSON.stringify(record)).digest("hex"); }

/**
 * Transforma o registro transitório do DataJud em um artefato persistível.
 * numeroProcesso só existe em memória, para deduplicação e HMAC; o valor
 * NUNCA deve integrar JSON, logs, banco, evidências ou arquivo de análise.
 * A allowlist evita persistir campos imprevistos do provedor.
 */
export function toPersistableCausalRecord(record, alias, secret) {
  if (!record || typeof record.processNumber !== "string") throw new Error("Número transitório de processo ausente.");
  const sanitized = {
    caseKey: buildCaseKey(alias, record.processNumber, secret),
    sourceHashSha256: hashRecord(record),
    tribunal: record.tribunal,
    degree: record.degree,
    filingDate: record.filingDate,
    updatedAt: record.updatedAt,
    classCode: record.classCode,
    classLabel: record.classLabel,
    bodyCode: record.bodyCode,
    bodyLabel: record.bodyLabel,
    municipalityIbgeCode: record.municipalityIbgeCode,
    municipality: record.municipality ?? null,
    subjects: record.subjects,
    movements: record.movements,
  };
  const serialized = JSON.stringify(sanitized);
  if (serialized.includes(record.processNumber) || hasDirectPersonalData(serialized)) {
    throw new Error("Metadados não sanitizados detectados; coleta bloqueada sem gravar arquivos.");
  }
  return sanitized;
}

export function queryFingerprint(query) { return createHash("sha256").update(JSON.stringify(query)).digest("hex"); }
export function extractSearchPage(payload) {
  if (!payload || typeof payload !== "object" ||
      payload.timed_out === true ||
      Number(payload?._shards?.failed ?? 0) > 0 ||
      !Array.isArray(payload?.hits?.hits)) {
    throw new Error("Resposta DataJud inválida, parcial ou com timeout: não computar como amostra vazia.");
  }
  const hits = payload.hits.hits;
  return {
    total: Number(payload?.hits?.total?.value ?? 0),
    totalRelation: payload?.hits?.total?.relation ?? "unknown",
    records: hits.map(hit => sanitizeCausalHit(hit?._source, hit?.sort?.[0])).filter(Boolean),
    nextSearchAfter: hits.at(-1)?.sort ?? null,
  };
}

const directPersonalData = /(\d{3}\.\d{3}\.\d{3}-\d{2}|\b\d{11}\b|\b\d{20}\b|\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|\[\s*(?:NOME|CPF|CNPJ|EMAIL|TELEFONE)_[^\]]+\])/i;
export function hasDirectPersonalData(value) { return directPersonalData.test(String(value ?? "")); }
export function deriveAnnotations(record, evidenceRefId) {
  return record.subjects.filter(subject => !hasDirectPersonalData(subject.label)).map(subject => {
    const normalized = subject.label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
    const claimType = /dano\s*moral/.test(normalized) ? "dano_moral" : /dano\s*material/.test(normalized) ? "dano_material" : /obrigacao.*fazer/.test(normalized) ? "obrigacao_fazer" : "outro";
    const role = claimType === "outro" ? "fato_gerador" : "pedido";
    return { evidenceRefId, role, claimType, label: subject.label, normalizedLabel: normalized, sourceKind: "cnj_subject", confidence: claimType === "outro" ? 0.55 : 0.65 };
  });
}
export function summarizePilot(records, rejected = 0) {
  return { records: records.length, rejected, municipalities: new Set(records.map(record => record.municipalityIbgeCode).filter(Boolean)).size, bodies: new Set(records.map(record => record.bodyCode).filter(Boolean)).size, withMovements: records.filter(record => record.movements.length > 0).length, withMoralOrMaterialSubject: records.filter(record => record.subjects.some(subject => /dano\s*(moral|material)/i.test(subject.label))).length };
}
