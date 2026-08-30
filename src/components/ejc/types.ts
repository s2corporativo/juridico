'use client';

// Tipos compartilhados do cliente EJC
export interface DocListItem {
  id: string;
  slug: string;
  titulo: string;
  tipoDocumento: string;
  area: string;
  subarea: string | null;
  assunto: string | null;
  prioridade: string;
  confiabilidade: string;
  status: string;
  fonte: string | null;
  urlFonte: string | null;
  dataConsulta: string | null;
  lote: string | null;
  tags: string[];
  dataUltimaVerificacao: string | null;
  updatedAt: string;
}

export interface ChunkInfo {
  id: string;
  ordem: number;
  contexto: string;
  texto: string;
  palavras: number;
}

export interface DocDetail extends DocListItem {
  conteudo: string;
  metadados: Record<string, unknown> | null;
  versao: number;
  vigente: boolean;
  dadosFicticios: boolean;
  proximaVerificacaoRecomendada: string | null;
  chunks: ChunkInfo[];
  relacaoOrigem: { id: string; tipo: string; descricao: string | null; destino: { slug: string; titulo: string; tipoDocumento: string } }[];
  relacaoDestino: { id: string; tipo: string; descricao: string | null; origem: { slug: string; titulo: string; tipoDocumento: string } }[];
}

export interface RetrievalHitInfo {
  documentId: string;
  slug: string;
  titulo: string;
  tipoDocumento: string;
  area: string;
  chunkContexto: string;
  chunkTexto: string;
  score: number;
  confiabilidade: string;
  fonte: string | null;
  urlFonte: string | null;
  dataConsulta: string | null;
  status: string;
}

export interface StatsInfo {
  total: number;
  chunks: number;
  lotes: {
    codigo: string;
    descricao: string;
    status: string;
    pesquisado: number;
    criados: number;
    atualizados: number;
    duplicatasEvitadas: number;
    createdAt: string;
    relatorio: { avisos: string[]; necessitaRevisao: string[]; fontesConsultadas: string[] } | null;
  }[];
  frescor?: {
    ok: number;
    revisaoDevida: number;
    semVerificacao: number;
    devidos: { slug: string; titulo: string; diasAtraso: number }[];
  };
  bancos: { banco: string; nome: string; descricao: string; quantidade: number }[];
  areas: { id: string; nome: string; quantidade: number; subareas: { id: string; nome: string }[] }[];
  confiabilidade: { nivel: string; label: string; descricao: string; cor: string; quantidade: number }[];
  status: { status: string; quantidade: number }[];
  checks: string[];
}

export interface AskResponse {
  pergunta: string;
  resposta: string;
  fontes: RetrievalHitInfo[];
  modo: string;
  totalFontes: number;
  error?: string;
}

export interface TesteInfo {
  pergunta: string;
  esperados: string[];
  encontrados: string[];
  acertos: number;
  score: number;
  status: string;
  registros: { slug: string; titulo: string; score: number; confiabilidade: string }[];
}
