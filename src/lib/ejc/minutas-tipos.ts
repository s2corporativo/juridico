// EJC — Minutas IA: catálogo de tipos de peça (dados puros, sem dependências de servidor).
// Inspirado no modelo de geração assistida do MinutaIA, mas ancorado nas regras do
// Jurimetria DPT: fundamentação SOMENTE da base curada com [FONTE n], anonimização
// (tarja) dos dados sensíveis antes do contato com o LLM e revisão humana explícita.

export interface SecaoPeca {
  id: string;
  titulo: string;
  /** Dica exibida ao usuário no editor. */
  dica: string;
}

export interface TipoPeca {
  id: string;
  nome: string;
  descricao: string;
  /** Ícone sugerido (nome lucide — resolvido no cliente). */
  icone: string;
  /** Seções geradas, em ordem. */
  secoes: SecaoPeca[];
  /** Termos base para o retrieval de fundamentos na base EJC. */
  termosBusca: string[];
  /** Campos extras que este tipo exige (ids de CAMPOS). */
  camposExtras?: string[];
}

export interface CampoFormulario {
  id: string;
  label: string;
  placeholder: string;
  /** single = input de 1 linha; text = textarea. */
  tipo: 'single' | 'text';
  /** Campo contém dado pessoal (entra na tarja de anonimização). */
  sensivel?: boolean;
  /** Aparece em todos os tipos. */
  comum?: boolean;
}

export const CAMPOS: CampoFormulario[] = [
  { id: 'comarca', label: 'Comarca / Juízo', placeholder: 'Ex.: Comarca de Betim — 2º Juizado Especial Cível', tipo: 'single', comum: true },
  { id: 'autor', label: 'Parte autora / requerente', placeholder: 'Nome completo, nacionalidade, estado civil, profissão, CPF, endereço', tipo: 'text', sensivel: true, comum: true },
  { id: 'reu', label: 'Parte ré / requerida', placeholder: 'Nome ou razão social, CNPJ/CPF, endereço', tipo: 'text', sensivel: true, comum: true },
  { id: 'advogado', label: 'Advogado(a) e OAB', placeholder: 'Nome do(a) advogado(a) — OAB/MG 000.000', tipo: 'single', sensivel: true, comum: true },
  { id: 'valorCausa', label: 'Valor da causa', placeholder: 'Ex.: R$ 10.000,00', tipo: 'single', comum: true },
  { id: 'fatos', label: 'Fatos (narrativa)', placeholder: 'Descreva os fatos em ordem cronológica: datas, condutas, danos, tentativas de solução amigável…', tipo: 'text', sensivel: true, comum: true },
  { id: 'pedidos', label: 'Pedidos', placeholder: 'Liste o que se pretende: condenação, danos, tutela de urgência, juros/correção, custas…', tipo: 'text', comum: true },
  { id: 'provas', label: 'Provas disponíveis', placeholder: 'Ex.: contrato, notas fiscais, prints de conversa, boletim de ocorrência, testemunhas', tipo: 'single', comum: true },
  { id: 'observacoes', label: 'Observações e teses do(a) advogado(a)', placeholder: 'Teses preferidas, limites de argumentação, tom desejado…', tipo: 'text', comum: true },
];

const SECAO_ENDERECAMENTO: SecaoPeca = { id: 'enderecamento', titulo: 'Endereçamento', dica: 'Juízo de destino (editável)' };
const SECAO_QUALIFICACAO: SecaoPeca = { id: 'qualificacao', titulo: 'Qualificação das partes', dica: 'Partes com dados substituídos por marcadores [NOME_1] etc. quando a tarja estiver ativa' };
const SECAO_FATOS: SecaoPeca = { id: 'fatos', titulo: 'Dos fatos', dica: 'Narrativa cronológica e objetiva' };
const SECAO_FUNDAMENTOS: SecaoPeca = { id: 'fundamentos', titulo: 'Dos fundamentos jurídicos', dica: 'Cada fundamento com citação [FONTE n] da base — sem base suficiente, marcado para revisão humana' };
const SECAO_PEDIDOS: SecaoPeca = { id: 'pedidos', titulo: 'Dos pedidos', dica: 'Pedidos alinhados aos fatos e fundamentos' };
const SECAO_PROVAS: SecaoPeca = { id: 'provas', titulo: 'Das provas', dica: 'Rol de provas que a parte pretende produzir' };
const SECAO_VALOR: SecaoPeca = { id: 'valor', titulo: 'Do valor da causa', dica: 'Atribuição e critério' };
const SECAO_FECHAMENTO: SecaoPeca = { id: 'fechamento', titulo: 'Fechamento', dica: 'Termos em que pede deferimento, local/data e assinatura' };

export const TIPOS_PECA: TipoPeca[] = [
  {
    id: 'peticao-inicial',
    nome: 'Petição inicial (cível / JEC)',
    descricao: 'Peça inaugural: endereçamento, qualificação, fatos, fundamentos com base curada, pedidos, provas e valor da causa.',
    icone: 'FileSignature',
    termosBusca: ['petição inicial juizado especial cível admissibilidade', 'pedido certo determinado tutela urgência', 'valor da causa benefício justiça gratuita'],
    secoes: [SECAO_ENDERECAMENTO, SECAO_QUALIFICACAO, SECAO_FATOS, SECAO_FUNDAMENTOS, SECAO_PEDIDOS, SECAO_PROVAS, SECAO_VALOR, SECAO_FECHAMENTO],
  },
  {
    id: 'contestacao',
    nome: 'Contestação',
    descricao: 'Defesa: preliminares processuais, mérito com fundamentos da base, impugnação a provas e pedidos finais.',
    icone: 'Shield',
    termosBusca: ['contestação preliminares processuais inépcia ilegitimidade', 'prescrição decadência defesa mérito', 'ônus da prova impugnação especificada'],
    secoes: [SECAO_ENDERECAMENTO, SECAO_QUALIFICACAO, { id: 'preliminares', titulo: 'Preliminares processuais', dica: 'Inépcia, ilegitimidade, incompetência, prescrição/decadência — se houver' }, SECAO_FATOS, SECAO_FUNDAMENTOS, SECAO_PEDIDOS, SECAO_FECHAMENTO],
  },
  {
    id: 'recurso-inominado',
    nome: 'Recurso inominado (JEC — Lei 9.099)',
    descricao: 'Recurso dos juizados: síntese da sentença, razões de reforma com fundamentos da base e pedidos.',
    icone: 'Scale',
    termosBusca: ['recurso inominado juizados especiais efeitos suspensivo devolutivo', 'sentença juizado especial fundamentação', 'preparo recurso inominado gratuidade'],
    secoes: [SECAO_ENDERECAMENTO, SECAO_QUALIFICACAO, { id: 'sintese-sentenca', titulo: 'Síntese da sentença recorrida', dica: 'O que foi decidido e o que se impugna' }, SECAO_FUNDAMENTOS, SECAO_PEDIDOS, SECAO_FECHAMENTO],
  },
  {
    id: 'notificacao-extrajudicial',
    nome: 'Notificação extrajudicial',
    descricao: 'Intimação pré-processual: fatos, descumprimento, fundamento da base, prazo para regularização e consequências.',
    icone: 'MailWarning',
    termosBusca: ['notificação extrajudicial constituição em mora inadimplemento', 'mora ex re ex persona purge mora', 'tentativa solução consensual mediação'],
    secoes: [SECAO_QUALIFICACAO, SECAO_FATOS, SECAO_FUNDAMENTOS, { id: 'intimacao', titulo: 'Da intimação e prazo', dica: 'Prazo para regularizar/cumprir e consequências do descumprimento' }, SECAO_FECHAMENTO],
  },
  {
    id: 'procuracao',
    nome: 'Procuração ad judicia',
    descricao: 'Instrumento de mandato judicial: outorgante, outorgado, poderes gerais e especiais (cláusulas do for).',
    icone: 'Stamp',
    termosBusca: ['procuração poderes ad judicia et extra', 'mandato judicial poderes especiais transigir recibir', 'Estatuto OAB poderes advocacia'],
    secoes: [SECAO_QUALIFICACAO, { id: 'poderes', titulo: 'Dos poderes', dica: 'Poderes gerais do foro judicial e cláusulas ad judicia + especiais (transigir, dar quitação, receber…)' }, { id: 'substabelecimento', titulo: 'Da faculdade de substabelecer', dica: 'Com ou sem reserva de poderes' }, SECAO_FECHAMENTO],
  },
  {
    id: 'contrato-servicos',
    nome: 'Contrato de prestação de serviços',
    descricao: 'Contrato civil: partes, objeto, remuneração, prazos, rescisão e foro — fundamentado na base civil.',
    icone: 'FileText',
    termosBusca: ['contrato prestação de serviços obrigações cláusulas essenciais', 'rescisão contratual multa inadimplemento', 'Código Defesa Consumidor relação consumo serviços'],
    secoes: [SECAO_QUALIFICACAO, { id: 'objeto', titulo: 'Do objeto', dica: 'Descrição precisa dos serviços/obrigações' }, { id: 'remuneracao', titulo: 'Da remuneração e forma de pagamento', dica: 'Valores, vencimentos, reajuste e inadimplência' }, { id: 'prazos', titulo: 'Do prazo e da execução', dica: 'Início, fim, marcos e prorrogação' }, { id: 'rescisao', titulo: 'Da rescisão e penalidades', dica: 'Hipóteses, multas e aviso prévio' }, { id: 'foro', titulo: 'Disposições gerais e foro', dica: 'Foro de eleição, discrepâncias, assinaturas e testemunhas' }],
  },
  {
    id: 'peticao-intercorrente',
    nome: 'Petição intercorrente (genérica)',
    descricao: 'Requerimento livre em curso processual: descreva o requerimento, fatos correlatos e pedido específico.',
    icone: 'PenLine',
    termosBusca: ['petição intercorrente requerimento processo curso', 'juntada documentos faculdade juiz artigos 139 CPC', 'prazos processuais contagem dias úteis'],
    secoes: [SECAO_ENDERECAMENTO, SECAO_QUALIFICACAO, { id: 'requerimento', titulo: 'Do requerimento', dica: 'Objeto direto da petição' }, SECAO_FATOS, SECAO_FUNDAMENTOS, SECAO_PEDIDOS, SECAO_FECHAMENTO],
  },
];

export function tipoPorId(id: string): TipoPeca | undefined {
  return TIPOS_PECA.find((t) => t.id === id);
}

/** Campos comuns + extras do tipo, em ordem de exibição. */
export function camposDoTipo(tipo: TipoPeca): CampoFormulario[] {
  return CAMPOS.filter((c) => c.comum || tipo.camposExtras?.includes(c.id));
}
