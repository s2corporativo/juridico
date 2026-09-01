// Jurimetria DPT — Tipos centrais
// Metadados obrigatórios (item 19 da missão) e sistema de confiança (item 33)

export const TIPOS_DOCUMENTO = [
  'LEGISLACAO',
  'JURISPRUDENCIA',
  'TESE',
  'PECA',
  'CONTRATO',
  'CHECKLIST',
  'FLUXO',
  'TABELA_DOCUMENTOS',
  'TRIAGEM',
  'PRAZO',
  'ARGUMENTACAO',
  'DOUTRINA',
  'REGRA_INTELIGENCIA',
  'REGRAS_CONTRATUAIS',
  'JURIMETRIA',
] as const;
export type TipoDocumento = (typeof TIPOS_DOCUMENTO)[number];

export const BANCOS_EJC: Record<string, { tipo: TipoDocumento[]; nome: string; descricao: string }> = {
  'BANCO 01 — Legislação': { tipo: ['LEGISLACAO'], nome: 'Banco de Legislação', descricao: 'Normas vigentes com ficha estruturada, artigos principais e fonte oficial.' },
  'BANCO 02 — Jurisprudência': { tipo: ['JURISPRUDENCIA'], nome: 'Banco de Jurisprudência', descricao: 'Precedentes e súmulas validados com fonte oficial e data de consulta.' },
  'BANCO 03 — Teses Jurídicas': { tipo: ['TESE'], nome: 'Banco de Teses', descricao: 'Teses com fundamentos, requisitos, riscos e probabilidade qualitativa.' },
  'BANCO 04 — Peças Jurídicas': { tipo: ['PECA'], nome: 'Banco de Peças', descricao: 'Modelos profissionais com campos variáveis e checklist de revisão.' },
  'BANCO 05 — Contratos': { tipo: ['CONTRATO'], nome: 'Banco de Contratos', descricao: 'Modelos contratuais com análise de cláusulas críticas.' },
  'BANCO 06 — Checklists': { tipo: ['CHECKLIST'], nome: 'Banco de Checklists', descricao: 'Checklists operacionais por situação jurídica.' },
  'BANCO 07 — Fluxos Processuais': { tipo: ['FLUXO'], nome: 'Banco de Fluxos', descricao: 'Mapas evento → prazo → providência → risco → próxima etapa.' },
  'BANCO 08 — Documentos por Ação': { tipo: ['TABELA_DOCUMENTOS'], nome: 'Documentos Necessários', descricao: 'Tabelas de documentos por tipo de demanda.' },
  'BANCO 09 — Triagem': { tipo: ['TRIAGEM'], nome: 'Perguntas de Triagem', descricao: 'Roteiros inteligentes de entrevista e classificação de casos.' },
  'BANCO 10 — Prazos': { tipo: ['PRAZO'], nome: 'Banco de Prazos', descricao: 'Base de referência de prazos com fundamento e termo inicial.' },
  'BANCO 11 — Argumentação': { tipo: ['ARGUMENTACAO'], nome: 'Argumentos e Contra-Argumentos', descricao: 'Análise sob ambos os lados da controvérsia.' },
  'BANCO 12 — Doutrina e Conceitos': { tipo: ['DOUTRINA'], nome: 'Doutrina e Conceitos', descricao: 'Explicações técnicas próprias e sintéticas dos institutos.' },
  'BANCO 13 — Inteligência Processual': { tipo: ['REGRA_INTELIGENCIA'], nome: 'Inteligência Processual', descricao: 'Regras SE-ENTÃO interpretáveis pelo EJC.' },
  'BANCO 14 — Inteligência Contratual': { tipo: ['REGRAS_CONTRATUAIS'], nome: 'Inteligência Contratual', descricao: 'Regras de detecção de riscos em cláusulas.' },
  'BANCO 15 — Jurimetria': { tipo: ['JURIMETRIA'], nome: 'Jurimetria', descricao: 'Estrutura para dados estatísticos REAIS — nunca inventados.' },
};

export const CONFIANCA_LABELS: Record<string, { label: string; descricao: string; cor: string }> = {
  A: { label: 'A — Fonte oficial confirmada', descricao: 'Fonte oficial diretamente confirmada (Planalto, tribunais, gov.br).', cor: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  B: { label: 'B — Institucional confiável', descricao: 'Fonte institucional ou secundária altamente confiável.', cor: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  C: { label: 'C — Requer validação', descricao: 'Fonte secundária que necessita validação. NÃO usar automaticamente para fundamentar documento definitivo.', cor: 'bg-red-500/15 text-red-600 dark:text-red-400' },
};

export const CHECKS_INGESTAO = [
  'CHECK 1 — Fonte existente?',
  'CHECK 2 — Fonte oficial quando disponível?',
  'CHECK 3 — Conteúdo vigente?',
  'CHECK 4 — Número do processo correto?',
  'CHECK 5 — Tribunal correto?',
  'CHECK 6 — Data correta?',
  'CHECK 7 — Texto não inventado?',
  'CHECK 8 — Há duplicata?',
  'CHECK 9 — Metadados adequados?',
  'CHECK 10 — Classificação correta?',
] as const;

// Interface do documento de entrada (JSON dos lotes)
export interface InputDocument {
  slug: string;
  titulo: string;
  tipoDocumento: string;
  area: string;
  subarea?: string | null;
  assunto?: string | null;
  subassunto?: string | null;
  prioridade?: string;
  conteudo: string;
  metadados?: Record<string, unknown> | null;
  tags?: string[] | null;
  fonte?: string | null;
  urlFonte?: string | null;
  dataConsulta?: string | null;
  confiabilidade?: string;
  vigente?: boolean;
  status?: string;
  dadosFicticios?: boolean;
  dataUltimaVerificacao?: string | null;
  proximaVerificacaoRecomendada?: string | null;
  relacionamentos?: { destinoSlug: string; tipo: string; descricao?: string }[];
  chunks?: { contexto: string; texto: string }[];
}

export interface Chunk {
  contexto: string;
  texto: string;
}

export interface RetrievalHit {
  documentId: string;
  slug: string;
  titulo: string;
  tipoDocumento: string;
  area: string;
  chunkId: string;
  chunkContexto: string;
  chunkTexto: string;
  score: number;
  confiabilidade: string;
  fonte: string | null;
  urlFonte: string | null;
  dataConsulta: string | null;
  status: string;
}
