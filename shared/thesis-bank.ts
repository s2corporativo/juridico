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
