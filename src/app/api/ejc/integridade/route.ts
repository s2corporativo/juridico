// EJC — API de Integridade da Curadoria
// GET /api/ejc/integridade → auditoria completa (estrutura, taxonomia, CHECK 1-10,
// LGPD, anti-invenção, duplicidade, saúde do RAG). Cache em memória (TTL 10 min)
// porque a auditoria varre toda a base; ?refresh=1 força re-execução.

import { NextRequest, NextResponse } from 'next/server';
import { auditarCuradoria, type AuditoriaCuradoria } from '@/lib/ejc/auditoria';

interface CacheIntegridade {
  geradoEm: number;
  dados: AuditoriaCuradoria;
}

const g = globalThis as any;
const TTL_MS = 10 * 60 * 1000;

export async function GET(req: NextRequest) {
  try {
    const refresh = req.nextUrl.searchParams.get('refresh') === '1';
    const cache: CacheIntegridade | undefined = g.ejcAuditoriaCache;

    if (!refresh && cache && Date.now() - cache.geradoEm < TTL_MS) {
      return NextResponse.json({ ...cache.dados, emCache: true });
    }

    const auditoria = await auditarCuradoria();
    g.ejcAuditoriaCache = { geradoEm: Date.now(), dados: auditoria } satisfies CacheIntegridade;
    return NextResponse.json({ ...auditoria, emCache: false });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao auditar a integridade da curadoria', detalhe: String(e) }, { status: 500 });
  }
}
