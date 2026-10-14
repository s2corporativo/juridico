const MOVEMENT_RULES = [
  { type: "ajuizamento", phase: "origin", pattern: /distribui|ajuiz|protoc|cadastr|recebimento da inicial/i },
  { type: "citacao_intimacao", phase: "origin", pattern: /cita[cç]|intima[cç]|notifica[cç]/i },
  { type: "audiencia", phase: "origin", pattern: /audi[eê]ncia|concilia[cç][aã]o|media[cç][aã]o|instru[cç][aã]o/i },
  { type: "contestacao_defesa", phase: "origin", pattern: /contesta[cç][aã]o|defesa|manifesta[cç][aã]o da parte r[eé]/i },
  { type: "prova", phase: "origin", pattern: /prova|per[ií]cia|laudo|documento juntado|juntada/i },
  { type: "cumprimento", phase: "execution", pattern: /cumprimento|execu[cç][aã]o|penhora|bloqueio|alvar[aá]|pagamento|satisfa[cç][aã]o/i },
  { type: "sentenca", phase: "origin", pattern: /\bsenten[cç]a\b|julgamento conforme estado|decis[aã]o de m[eé]rito/i },
  { type: "acordo", phase: "origin", pattern: /acordo|homologa[cç][aã]o|transa[cç][aã]o/i },
  { type: "recurso", phase: "appeal", pattern: /recurso|apela[cç][aã]o|embargos|turma recursal|contrarraz[oõ]es/i },
  { type: "julgamento_recurso", phase: "appeal", pattern: /ac[oó]rd[aã]o|julgamento de recurso|decis[aã]o colegiada/i },
  { type: "extincao", phase: "origin", pattern: /extin[cç][aã]o|arquivamento|desist[eê]ncia|abandono|incompet[eê]ncia/i },
  { type: "baixa", phase: "execution", pattern: /baixa definitiva|tr[aâ]nsito em julgado|remessa ao arquivo|processo baixado/i },
];

const OUTCOME_RULES = [
  { outcome: "acordo_homologado", pattern: /acordo.*homolog|homologa[cç][aã]o.*acordo/i },
  { outcome: "extinto_sem_merito", pattern: /extin[cç][aã]o.*sem m[eé]rito|extinto.*sem m[eé]rito/i },
  { outcome: "parcialmente_procedente", pattern: /parcialmente procedente|proced[eê]ncia parcial/i },
  { outcome: "procedente", pattern: /pedido[s]? procedente|proced[eê]ncia|senten[cç]a.*procedente/i },
  { outcome: "improcedente", pattern: /pedido[s]? improcedente|improced[eê]ncia|senten[cç]a.*improcedente/i },
];

const CAUSAL_PATTERNS = [
  { claimType: "dano_moral", pattern: /dano\s*moral|abalo|honra|negativa[cç][aã]o|cobran[cç]a indevida|inscri[cç][aã]o indevida/i },
  { claimType: "dano_material", pattern: /dano\s*material|preju[ií]zo|perda financeira|restitui[cç][aã]o|ressarcimento|indeniza[cç][aã]o material/i },
  { claimType: "obrigacao_fazer", pattern: /obriga[cç][aã]o de fazer|exclus[aã]o|cancelamento|regulariza[cç][aã]o|fornecimento|entrega/i },
];

function normalize(value) { return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim(); }
function safeDate(value) { return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value) ? value : null; }
export function classifyMovement(name) {
  const normalized = normalize(name);
  const rule = MOVEMENT_RULES.find(candidate => candidate.pattern.test(normalized));
  return rule ? { type: rule.type, phase: rule.phase } : { type: "outro", phase: "origin" };
}
export function detectOutcome(name) {
  const normalized = normalize(name);
  return OUTCOME_RULES.find(rule => rule.pattern.test(normalized))?.outcome ?? null;
}
export function analyzeMovements(movements = []) {
  const timeline = movements.map((movement, index) => {
    const name = typeof movement?.name === "string" ? movement.name.trim() : "";
    const date = safeDate(movement?.date);
    const classification = classifyMovement(name);
    return { index, date, code: Number.isInteger(Number(movement?.code)) ? Number(movement.code) : null, name, ...classification, outcome: detectOutcome(name) };
  }).filter(item => item.name || item.date).sort((a, b) => String(a.date ?? "").localeCompare(String(b.date ?? "")) || a.index - b.index);
  const recognized = timeline.filter(item => item.type !== "outro");
  const outcomes = timeline.filter(item => item.outcome).map(item => ({ outcome: item.outcome, date: item.date, evidenceName: item.name }));
  return {
    timeline,
    recognizedCount: recognized.length,
    firstDate: timeline[0]?.date ?? null,
    lastDate: timeline.at(-1)?.date ?? null,
    phases: [...new Set(timeline.map(item => item.phase))],
    milestones: [...new Set(recognized.map(item => item.type))],
    outcomes,
    hasMeritSignal: timeline.some(item => ["sentenca", "julgamento_recurso", "acordo"].includes(item.type)),
    hasExecutionSignal: timeline.some(item => item.phase === "execution"),
    hasAppealSignal: timeline.some(item => item.phase === "appeal"),
  };
}
function subjectCandidate(subject) {
  const label = String(subject?.label ?? "").trim();
  const normalized = normalize(label);
  const rule = CAUSAL_PATTERNS.find(candidate => candidate.pattern.test(normalized));
  if (!rule) return null;
  return { role: "fato_gerador", claimType: rule.claimType, label, normalizedLabel: normalized, sourceKind: "cnj_subject", confidence: 0.55, reviewStatus: "pending", basis: "assunto TPU; não comprova fato nem resultado" };
}
export function deriveCausalCandidates(record, analysis) {
  const fromSubjects = (record.subjects ?? []).map(subjectCandidate).filter(Boolean);
  const movementSignals = analysis.timeline.filter(item => item.type !== "outro").map(item => ({ role: "consequencia", claimType: "outro", label: item.name, normalizedLabel: normalize(item.name), sourceKind: "movement", confidence: 0.35, reviewStatus: "pending", basis: "movimento processual; não equivale ao teor da decisão" }));
  return [...fromSubjects, ...movementSignals].slice(0, 40);
}
export function analyzeCase(record) {
  const movementAnalysis = analyzeMovements(record.movements);
  return { caseKey: record.caseKey ?? null, bodyCode: record.bodyCode ?? null, municipality: record.municipality ?? null, subjects: record.subjects ?? [], movementAnalysis, causalCandidates: deriveCausalCandidates(record, movementAnalysis), review: { status: "pending", required: true, reason: "Confirmar inteiro teor, fato gerador, nexo, pedido e resultado antes de uso jurídico." } };
}
export function summarizeAnalyses(analyses) {
  const list = Array.isArray(analyses) ? analyses : [];
  const countBy = key => Object.fromEntries([...new Set(list.flatMap(item => item.movementAnalysis?.[key] ?? []))].map(value => [value, list.filter(item => (item.movementAnalysis?.[key] ?? []).includes(value)).length]));
  return { cases: list.length, withMeritSignal: list.filter(item => item.movementAnalysis?.hasMeritSignal).length, withAppealSignal: list.filter(item => item.movementAnalysis?.hasAppealSignal).length, withExecutionSignal: list.filter(item => item.movementAnalysis?.hasExecutionSignal).length, milestones: countBy("milestones"), outcomeSignals: Object.fromEntries([...new Set(list.flatMap(item => (item.movementAnalysis?.outcomes ?? []).map(outcome => outcome.outcome)))].map(value => [value, list.reduce((sum, item) => sum + (item.movementAnalysis?.outcomes ?? []).filter(outcome => outcome.outcome === value).length, 0)])), candidatesPendingReview: list.reduce((sum, item) => sum + (item.causalCandidates ?? []).length, 0) };
}
