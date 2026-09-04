// EJC — Integrações públicas: infraestrutura comum (guia de integrações, seção 3).
// Adaptação da "tabela de cache PostgreSQL" do guia para cache em memória com TTL
// (política do projeto: sem middleware extra; dados de fontes públicas são efêmeros
// e reconsultáveis). Inclui timeout, retentativa com backoff e erros tipados.

interface EntradaCache {
  valor: unknown;
  expiraEm: number;
}

const CACHE = new Map<string, EntradaCache>();

/** Limpa entradas expiradas (chamado a cada uso). */
function podar(): void {
  const agora = Date.now();
  for (const [chave, entrada] of CACHE) {
    if (entrada.expiraEm <= agora) CACHE.delete(chave);
  }
}

export async function buscarComCache<T>(
  fonte: string,
  chaveConsulta: string,
  ttlMs: number,
  f: () => Promise<T>,
): Promise<T> {
  podar();
  const chave = `${fonte}::${chaveConsulta}`;
  const existente = CACHE.get(chave);
  if (existente && existente.expiraEm > Date.now()) {
    return existente.valor as T;
  }
  const valor = await f();
  CACHE.set(chave, { valor, expiraEm: Date.now() + ttlMs });
  return valor;
}

export class ErroIntegracao extends Error {
  readonly fonte: string;
  readonly httpStatus?: number;
  constructor(fonte: string, mensagem: string, httpStatus?: number) {
    super(`[${fonte}] ${mensagem}`);
    this.fonte = fonte;
    this.httpStatus = httpStatus;
  }
}

// WAFs de fontes públicas (CNJ/DataJud, BrasilAPI) recusam clientes sem
// User-Agent de navegador (HTTP 403) — undici manda "undici" por padrão.
const UA = { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36' };

/** Fetch com timeout + retentativa (backoff 500ms/1.000ms nas re-tentativas). */
export async function fetchComRetry(url: string, init: RequestInit = {}, tentativas = 3): Promise<Response> {
  let ultimoErro: unknown;
  for (let i = 0; i < tentativas; i++) {
    try {
      const res = await fetch(url, {
        ...init,
        headers: { ...UA, ...(init.headers ?? {}) },
        signal: AbortSignal.timeout(15_000),
      });
      if (res.status >= 500 && i < tentativas - 1) throw new ErroIntegracao('http', `HTTP ${res.status}`, res.status);
      return res;
    } catch (e) {
      ultimoErro = e;
      if (i < tentativas - 1) await new Promise((r) => setTimeout(r, 500 * (i + 1) * 2));
    }
  }
  throw ultimoErro instanceof Error ? ultimoErro : new ErroIntegracao('http', String(ultimoErro));
}
