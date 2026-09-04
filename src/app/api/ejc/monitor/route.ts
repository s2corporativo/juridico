// EJC — Monitoramento processual via DataJud (guia de integrações, P1).
// GET    /api/ejc/monitor              → lista processos monitorados + último resumo
// POST   /api/ejc/monitor              → ações:
//   { acao: 'adicionar', numeroProcesso, tribunalAlias, rotulo? }
//   { acao: 'sincronizar', id }        → consulta DataJud ao vivo p/ um processo
//   { acao: 'sincronizarTodos' }       → varre todos (throttle: pula consulta se
//                                        última < 6h; usado pelo cron diário)
// DELETE /api/ejc/monitor?id=...       → desativa (mantém histórico)
// LGPD: armazenamos APENAS número CNJ + alias + rótulo livre (metadados públicos,
// pseudonimizados pela fonte). Movimentações nunca são persistidas — vão ao
// cliente sob demanda e ficam só no cache em memória.
// NOTA TÉCNICA: acesso via SQL cru (Prisma raw) — o client global do processo pode
// estar stale em relação ao schema regenerado (evita reinício do dev server).

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buscarComCache } from '@/lib/ejc/integracoes/base';
import { buscarProcesso, ultimoMovimento, ALIAS_TRIBUNAL } from '@/lib/ejc/integracoes/datajud';

export const dynamic = 'force-dynamic';
// rev 2 — usa lib datajud com chave do .env em disco e parse do envelope ES

const THROTTLE_MS = 6 * 60 * 60 * 1000; // 6h por processo entre consultas reais

interface LinhaMonitor {
  id: string;
  numeroProcesso: string;
  tribunalAlias: string;
  rotulo: string | null;
  ativo: number | boolean;
  ultimaConsulta: Date | string | null;
  ultimoResumo: string | null;
  createdAt: Date | string;
}

function normalizarLinha(r: LinhaMonitor) {
  return {
    id: r.id,
    numeroProcesso: r.numeroProcesso,
    tribunalAlias: r.tribunalAlias,
    rotulo: r.rotulo,
    ativo: Boolean(r.ativo),
    ultimaConsulta: r.ultimaConsulta ? new Date(r.ultimaConsulta).toISOString() : null,
    ultimoResumo: r.ultimoResumo,
    createdAt: new Date(r.createdAt).toISOString(),
  };
}

function normalizarNumero(n: string): string {
  return n.replace(/\D/g, '');
}

async function consultar(
  alias: string,
  numero: string,
): Promise<{ resumo: string | null; dataUltima: string | null; movimentos: { nome: string; dataHora?: string }[]; classe?: string; orgao?: string } | { erro: string }> {
  try {
    const resultados = await buscarComCache('datajud', `${alias}:${numero}`, THROTTLE_MS, () => buscarProcesso(alias, numero));
    if (!resultados.length) return { resumo: null, dataUltima: null, movimentos: [] };
    const p = resultados[0];
    const movs = [...(p.movimentos ?? [])]
      .sort((a, b) => (b.dataHora ?? '').localeCompare(a.dataHora ?? ''))
      .slice(0, 12)
      .map((m) => ({ nome: m.nome, dataHora: m.dataHora }));
    const um = ultimoMovimento(p);
    return {
      resumo: um ? `${um.nome}${um.dataHora ? ` · ${um.dataHora.slice(0, 10)}` : ''}` : null,
      dataUltima: p.dataUltimaAtualizacao ?? null,
      movimentos: movs,
      classe: p.classe?.nome,
      orgao: p.orgaoJulgador?.nome,
    };
  } catch (e) {
    return { erro: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET() {
  try {
    const lista = (await db.$queryRawUnsafe('SELECT * FROM ProcessoMonitorado WHERE ativo = 1 ORDER BY createdAt DESC')) as LinhaMonitor[];
    return NextResponse.json({ processos: lista.map(normalizarLinha), tribunais: ALIAS_TRIBUNAL });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao listar monitoramento', detalhe: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { acao?: string; id?: string; numeroProcesso?: string; tribunalAlias?: string; rotulo?: string };

    if (body.acao === 'adicionar') {
      const numero = normalizarNumero(body.numeroProcesso ?? '');
      if (numero.length !== 20) return NextResponse.json({ error: 'Número CNJ deve ter 20 dígitos (aceito com pontuação).' }, { status: 400 });
      if (!body.tribunalAlias || !ALIAS_TRIBUNAL[body.tribunalAlias]) {
        return NextResponse.json({ error: `Alias de tribunal inválido. Use um de: ${Object.keys(ALIAS_TRIBUNAL).join(', ')}` }, { status: 400 });
      }
      const dup = (await db.$queryRawUnsafe('SELECT id FROM ProcessoMonitorado WHERE numeroProcesso = ? LIMIT 1', numero)) as unknown[];
      if (dup.length) return NextResponse.json({ error: 'Processo já monitorado.' }, { status: 409 });
      const id = crypto.randomUUID();
      await db.$queryRawUnsafe(
        'INSERT INTO ProcessoMonitorado (id, numeroProcesso, tribunalAlias, rotulo, ativo, createdAt) VALUES (?, ?, ?, ?, 1, ?)',
        id, numero, body.tribunalAlias, body.rotulo?.slice(0, 120) ?? null, new Date().toISOString(),
      );
      const consulta = await consultar(body.tribunalAlias, numero);
      const resumo = 'erro' in consulta ? `ERRO: ${consulta.erro.slice(0, 180)}` : (consulta.resumo ?? 'processo não localizado na fonte');
      await db.$queryRawUnsafe('UPDATE ProcessoMonitorado SET ultimaConsulta = ?, ultimoResumo = ? WHERE id = ?', new Date().toISOString(), resumo, id);
      const linha = (await db.$queryRawUnsafe('SELECT * FROM ProcessoMonitorado WHERE id = ?', id)) as LinhaMonitor[];
      return NextResponse.json({ processo: normalizarLinha(linha[0]), consulta });
    }

    if (body.acao === 'sincronizar' && body.id) {
      const linhas = (await db.$queryRawUnsafe('SELECT * FROM ProcessoMonitorado WHERE id = ? LIMIT 1', body.id)) as LinhaMonitor[];
      if (!linhas.length) return NextResponse.json({ error: 'Processo não encontrado.' }, { status: 404 });
      const p = normalizarLinha(linhas[0]);
      const consulta = await consultar(p.tribunalAlias, p.numeroProcesso);
      if ('erro' in consulta) return NextResponse.json({ error: consulta.erro }, { status: 502 });
      await db.$queryRawUnsafe('UPDATE ProcessoMonitorado SET ultimaConsulta = ?, ultimoResumo = ? WHERE id = ?', new Date().toISOString(), consulta.resumo ?? 'processo não localizado na fonte', p.id);
      return NextResponse.json({ numeroProcesso: p.numeroProcesso, ...consulta });
    }

    if (body.acao === 'sincronizarTodos') {
      const lista = (await db.$queryRawUnsafe('SELECT * FROM ProcessoMonitorado WHERE ativo = 1 ORDER BY createdAt DESC')) as LinhaMonitor[];
      const agora = Date.now();
      const resultados: { numeroProcesso: string; resumo?: string; erro?: string; pulado?: boolean }[] = [];
      for (const linha of lista) {
        const p = normalizarLinha(linha);
        const ultima = p.ultimaConsulta ? new Date(p.ultimaConsulta).getTime() : 0;
        if (agora - ultima < THROTTLE_MS) {
          resultados.push({ numeroProcesso: p.numeroProcesso, pulado: true });
          continue;
        }
        const consulta = await consultar(p.tribunalAlias, p.numeroProcesso);
        const resumo = 'erro' in consulta ? `ERRO: ${consulta.erro.slice(0, 180)}` : (consulta.resumo ?? 'processo não localizado na fonte');
        await db.$queryRawUnsafe('UPDATE ProcessoMonitorado SET ultimaConsulta = ?, ultimoResumo = ? WHERE id = ?', new Date().toISOString(), resumo, p.id);
        resultados.push({ numeroProcesso: p.numeroProcesso, resumo });
      }
      return NextResponse.json({ sincronizados: resultados.length, resultados });
    }

    return NextResponse.json({ error: 'Ação inválida. Use adicionar | sincronizar | sincronizarTodos.' }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: 'Erro no monitoramento', detalhe: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Informe ?id=' }, { status: 400 });
    await db.$queryRawUnsafe('UPDATE ProcessoMonitorado SET ativo = 0 WHERE id = ?', id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erro ao desativar processo monitorado', detalhe: String(e) }, { status: 500 });
  }
}
