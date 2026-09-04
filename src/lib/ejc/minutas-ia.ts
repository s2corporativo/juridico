// EJC — Motor de Minutas IA (server-only).
// Fluxo inspirado no MinutaIA, adaptado às regras do Jurimetria DPT:
//   1. TARJA (anonimização determinística): dados sensíveis viram marcadores
//      [NOME_1], [CPF_1]… ANTES de qualquer contato com o LLM (LGPD por desenho).
//   2. GUARDA anti-injection: texto do usuário entra como DADO delimitado, com
//      detecção de padrões suspeitos de instrução embutida (aviso transparente).
//   3. FUNDAMENTAÇÃO rastreável: retrieval na base EJC com [FONTE n]; sem base
//      suficiente, a seção sai marcada para revisão humana (anti-invenção).

export interface MarcadorTarja {
  marcador: string;
  original: string;
  tipo: 'NOME' | 'CPF' | 'CNPJ' | 'DOCUMENTO' | 'ENDERECO' | 'TELEFONE' | 'EMAIL' | 'VALOR' | 'CEP';
}

export interface TarjaResultado {
  texto: string;
  marcadores: MarcadorTarja[];
}

const RE_CPF = /\b\d{3}\.?\d{3}\.?\d{3}[- ]?\d{2}\b/g;
const RE_CNPJ = /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g;
const RE_CEP = /\b\d{5}-?\d{3}\b/g;
const RE_TELEFONE = /\b(?:\+?55[- ]?)?\(?\d{2}\)?[- ]?9?\d{4}[- ]?\d{4}\b/g;
const RE_EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/gi;
const RE_VALOR = /R\$\s?\d{1,3}(?:\.\d{3})*(?:,\d{2})?/g;
// Endereço: logradouro conhecido + trecho até vírgula/ponto/linha (conservador).
const RE_ENDERECO =
  /\b(?:Rua|Avenida|Av\.|Travessa|Tv\.|Alameda|Rodovia|Praça|Beco|Quadra|Lote)\s[^,;.\n]{3,80}(?:,?\s?\d{1,5})?/g;
// Nome próprio: marcadores de tratamento seguidos de 1–3 palavras capitalizadas.
const RE_TRATAMENTO = /\b(?:Sr\.?|Sra\.?|Srta\.?|Dr\.?|Dra\.?|Exmo\.?|Exma\.?)\s+(?:[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]{2,}(?:\s+(?:de|da|do|dos|das|e)\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]{2,}|\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]{2,}){0,2})/g;

/** Campos livres informados no formulário — fontes confiáveis de nomes próprios. */
export function extrairNomesDeCampos(valores: Record<string, string>): string[] {
  const nomes = new Set<string>();
  const campos = [valores.autor, valores.reu, valores.advogado].filter(Boolean) as string[];
  for (const campo of campos) {
    // Sequências de 2–4 palavras capitalizadas (inclui conectivos minúsculos).
    const re = /[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]{2,}(?:\s+(?:de|da|do|dos|das|e)\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]{2,}|\s+[A-ZÁÉÍÓÚÂÊÔÃÕÇ][a-záéíóúâêôãõç]{2,}){1,3}/g;
    for (const m of campo.matchAll(re)) {
      const nome = m[0].trim();
      if (nome.length >= 6) nomes.add(nome);
    }
    // Nome único antes de "—" ou "," no campo (ex.: "Fulano de Tal — OAB 123").
    const primeira = campo.split(/[—,;\n]/)[0]?.trim();
    if (primeira && primeira.length >= 5 && /^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(primeira) && !/OAB|CNPJ|CPF/.test(primeira)) {
      nomes.add(primeira);
    }
  }
  // Descarta falsos positivos: juízos e logradouros (entram na tarja como ENDERECO).
  return [...nomes].filter(
    (n) => n.length >= 5 && !/^(Comarca|Juizado|Foro|Tribunal|Minas|Brasil)$/.test(n) && !/^(?:Rua|Avenida|Av\.?|Travessa|Tv\.?|Alameda|Rodovia|Praça|Beco|Quadra|Lote)\b/.test(n),
  );
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Aplica a tarja: substitui dados sensíveis por marcadores determinísticos. */
export function anonimizar(texto: string, nomesConhecidos: string[] = []): TarjaResultado {
  const marcadores: MarcadorTarja[] = [];
  const contagem = new Map<string, number>();
  const novoMarcador = (tipo: MarcadorTarja['tipo'], original: string): string => {
    const prox = (contagem.get(tipo) ?? 0) + 1;
    contagem.set(tipo, prox);
    const marcador = `[${tipo}_${prox}]`;
    marcadores.push({ marcador, original, tipo });
    return marcador;
  };

  let saida = texto;
  const substituir = (tipo: MarcadorTarja['tipo'], re: RegExp) => {
    const global = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    const achados = [...new Set(saida.match(global) ?? [])];
    for (const achado of achados) {
      if (!achado.trim()) continue;
      saida = saida.split(achado).join(novoMarcador(tipo, achado));
    }
  };

  // 1. Nomes conhecidos (campos do formulário — mais confiáveis; do maior para o menor).
  const nomesUnicos = [...new Set(nomesConhecidos)].sort((a, b) => b.length - a.length);
  for (const nome of nomesUnicos) {
    substituir('NOME', new RegExp(escapeRe(nome), 'g'));
  }
  // 2. Padrões estruturados (ordem importa: CNPJ/CPF antes de telefone; endereço antes de CEP).
  substituir('CNPJ', RE_CNPJ);
  substituir('CPF', RE_CPF);
  substituir('EMAIL', RE_EMAIL);
  substituir('ENDERECO', RE_ENDERECO);
  substituir('CEP', RE_CEP);
  substituir('TELEFONE', RE_TELEFONE);
  substituir('VALOR', RE_VALOR);
  substituir('NOME', RE_TRATAMENTO);
  return { texto: saida, marcadores };
}

/** Restaura os valores originais no texto gerado (usa os marcadores encontrados). */
export function desanonimizar(texto: string, marcadores: MarcadorTarja[]): string {
  let saida = texto;
  for (const { marcador, original } of marcadores) {
    saida = saida.split(marcador).join(original);
  }
  return saida;
}

const PADROES_INJECTION: RegExp[] = [
  /ignore (?:as |as anteriores |todas as )?instru[çc][õo]es/gi,
  /desconsidere (?:o |as |as instru)/gi,
  /voc[êe] (?:agora )?(?:[ée] |ser[áa] |deve )/gi,
  /(?:system|assistant|role)\s*:/gi,
  /\{\{[\s\S]{0,80}\}\}/g,
  /<\/?(?:system|instruction|prompt)>/gi,
  /(?:n[ãa]o )?(?:revele|revelar|mostre) (?:suas )?(?:instru[çc][õo]es|o prompt)/gi,
];

export interface GuardaResultado {
  suspeito: boolean;
  padroes: string[];
  textoLimpo: string;
}

/** Detecta tentativas de instrução embutida no texto do usuário (camada 1, transparente). */
export function guardaInjection(texto: string): GuardaResultado {
  const padroes: string[] = [];
  for (const re of PADROES_INJECTION) {
    const global = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
    const m = texto.match(global);
    if (m) padroes.push(...m.map((x) => x.slice(0, 60)));
  }
  // Neutraliza delimitadores que o próprio sistema usa (evita fuga do bloco de dados).
  const textoLimpo = texto
    .replace(/<{3,}\s*FATOS/gi, '«FATOS')
    .replace(/FATOS\s*_{3,}>?>/gi, 'FATOS»')
    .replace(/<{3,}\s*MINUTA/gi, '«MINUTA')
    .replace(/MINUTA\s*_{3,}>?>/gi, 'MINUTA»');
  return { suspeito: padroes.length > 0, padroes: [...new Set(padroes)].slice(0, 5), textoLimpo };
}

/** Torna o marcador de bloco seguro para embutir no prompt. */
export function blocoDados(texto: string, nome: string): string {
  return `<<<DADOS_${nome}_INICIO>>>\n${texto}\n<<<DADOS_${nome}_FIM>>>`;
}
