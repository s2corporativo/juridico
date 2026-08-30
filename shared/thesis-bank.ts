export const THESIS_USE_TYPES=["attack","defense","both"] as const;
export type ThesisUseType=(typeof THESIS_USE_TYPES)[number];
export const THESIS_LIFECYCLE_STATUSES=["draft","source_pending","source_confirmed","legal_review","counter_review","validated","contested","outdated","superseded","revoked","archived"] as const;
export type ThesisLifecycleStatus=(typeof THESIS_LIFECYCLE_STATUSES)[number];
export const THESIS_REVIEW_STAGES=["researcher","validator","counter_review","auditor"] as const;
export type ThesisReviewStage=(typeof THESIS_REVIEW_STAGES)[number];
export const THESIS_SCORE_METHODOLOGY_VERSION="atlas-confidence-v1";
export const THESIS_SCORE_DISCLAIMER="Índice comparativo de força documental e jurisprudencial. Não representa probabilidade de êxito.";
export type ThesisScoreParts={legalStrength:number;jurisprudentialConsistency:number;freshness:number;evidenceQuality:number};
export function calculateThesisCompositeScore(p:ThesisScoreParts){return Math.round((p.legalStrength*.35+p.jurisprudentialConsistency*.30+p.freshness*.15+p.evidenceQuality*.20)*10)/10}
export function scoreLabel(score:number){if(score>=85)return"muito forte";if(score>=70)return"forte";if(score>=55)return"moderada";if(score>=40)return"fraca";return"insuficiente"}
export function lifecycleLabel(status:ThesisLifecycleStatus){const labels:Record<ThesisLifecycleStatus,string>={draft:"Rascunho",source_pending:"Fonte pendente",source_confirmed:"Fonte confirmada",legal_review:"Revisão jurídica",counter_review:"Revisão de contratese",validated:"Validada",contested:"Controvertida",outdated:"Desatualizada",superseded:"Superada",revoked:"Revogada",archived:"Arquivada"};return labels[status]}
export const PUBLIC_THESIS_STATUSES:readonly ThesisLifecycleStatus[]=["validated","contested"];
export function isPublicThesisStatus(status:ThesisLifecycleStatus){return PUBLIC_THESIS_STATUSES.includes(status)}

/**
 * Enums de curadoria compartilhados entre o router tRPC (validação) e o
 * formulário de curadoria (o `<select>` que o curador vê). Antes, o client
 * enviava um literal fixo para cada um destes campos — nenhum era escolha
 * real do curador, o que inclusive derrotava o próprio gate de publicação
 * (todo fundamento entrava como "lei" e "fonte oficial confirmada").
 */
export const THESIS_AUTHORITY_TYPES=["constitution","law","code","regulation","sumula","binding_sumula","repetitive_theme","irdr","iac","other"] as const;
export type ThesisAuthorityType=(typeof THESIS_AUTHORITY_TYPES)[number];
export function authorityTypeLabel(type:ThesisAuthorityType){const labels:Record<ThesisAuthorityType,string>={constitution:"Constituição",law:"Lei",code:"Código",regulation:"Regulamento",sumula:"Súmula",binding_sumula:"Súmula vinculante",repetitive_theme:"Tema repetitivo",irdr:"IRDR",iac:"IAC",other:"Outro"};return labels[type]}

export const THESIS_LEGAL_BASIS_SOURCE_STATUSES=["official_confirmed","source_pending","secondary_pending","not_for_use"] as const;
export type ThesisLegalBasisSourceStatus=(typeof THESIS_LEGAL_BASIS_SOURCE_STATUSES)[number];

export const THESIS_EVIDENCE_IMPORTANCE=["required","recommended","contextual"] as const;
export type ThesisEvidenceImportance=(typeof THESIS_EVIDENCE_IMPORTANCE)[number];

export const THESIS_AUTHORITY_STANCES=["supports","opposes","context"] as const;
export type ThesisAuthorityStance=(typeof THESIS_AUTHORITY_STANCES)[number];
export function authorityStanceLabel(stance:ThesisAuthorityStance){const labels:Record<ThesisAuthorityStance,string>={supports:"Favorável",opposes:"Contrário",context:"Contextual"};return labels[stance]}

export const THESIS_COUNTERARGUMENT_SOURCE_STATUSES=["official_confirmed","editorial_review","source_pending"] as const;
export type ThesisCounterargumentSourceStatus=(typeof THESIS_COUNTERARGUMENT_SOURCE_STATUSES)[number];

export const THESIS_METRIC_SOURCE_STATUSES=["official_aggregate","validated_sample","methodology_pending"] as const;
export type ThesisMetricSourceStatus=(typeof THESIS_METRIC_SOURCE_STATUSES)[number];

export const THESIS_REVIEW_DECISIONS=["approved","rejected","returned"] as const;
export type ThesisReviewDecision=(typeof THESIS_REVIEW_DECISIONS)[number];
export function reviewDecisionLabel(decision:ThesisReviewDecision){const labels:Record<ThesisReviewDecision,string>={approved:"Aprovar",rejected:"Reprovar",returned:"Devolver"};return labels[decision]}

/** Rótulos genéricos de status de fonte, usados nos três campos que reaproveitam a mesma família de valores textuais. */
export function sourceStatusLabel(status:string){const labels:Record<string,string>={official_confirmed:"Fonte oficial confirmada",source_pending:"Fonte pendente de verificação",secondary_pending:"Fonte secundária pendente",not_for_use:"Não utilizável",editorial_review:"Em revisão editorial",official_aggregate:"Agregado oficial",validated_sample:"Amostra validada",methodology_pending:"Metodologia pendente"};return labels[status]??status}
