'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BarChart3,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Gavel,
  Landmark,
  Loader2,
  MapPin,
  RotateCcw,
  TrendingUp,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MetaJurimetria {
  conector: string;
  status: 'ATIVA' | 'AGUARDANDO_CHAVE';
  comoHabilitar?: string;
  tribunais: Array<{ id: string; nome: string; destaque?: boolean }>;
  municipios: Array<{ codigo: string; nome: string }>;
  graus: string[];
  anos: number[];
  nota: string;
  citacao: string;
}

interface RankingItem {
  codigo: string;
  nome: string;
  total: number;
}

interface AmostraItem {
  numeroProcesso: string | null;
  tribunal: string | null;
  grau: string | null;
  classe: string | null;
  orgaoJulgador: string | null;
  municipioIBGE: string | null;
  dataAjuizamento: string | null;
  assuntos: string[];
  sistema: string | null;
  atualizadoEm: string | null;
}

interface RespostaJurimetria {
  filtros: Record<string, unknown>;
  total: number;
  totalRelacao: string;
  porVara: RankingItem[];
  porClasse: RankingItem[];
  porGrau: Array<{ grau: string; total: number }>;
  porAssunto: Array<{ assunto: string; total: number }>;
  varasUnicas: number | null;
  porAno: Array<{ ano: number; total: number }>;
  amostra: AmostraItem[];
  citacao: string;
  error?: string;
}

interface RegistroDetalhe {
  numeroProcesso: string | null;
  tribunal: string | null;
  atualizadoEm: string | null;
  classe: string | null;
  orgaoJulgador: string | null;
  assuntos: string[];
  movimentos: Array<{ data: string | null; nome: string | null }>;
}

const TRIBUNAIS_DESTAQUE_SIGLA = ['TJMG', 'TRF-6', 'TRT-3', 'TRE-MG'];

const formatarTotal = (n: number, relacao?: string) => {
  const base = n.toLocaleString('pt-BR');
  return relacao === 'gte' ? `${base}+` : base;
};

const formatarCNJ = (num: string) => {
  const n = num.replace(/[^0-9]/g, '');
  if (n.length !== 20) return num;
  return `${n.slice(0, 7)}-${n.slice(7, 9)}.${n.slice(9, 13)}.${n.slice(13, 14)}.${n.slice(14, 16)}.${n.slice(16, 20)}`;
};

const formatarDataAjuizamento = (d: string | null) => {
  if (!d || !/^[0-9]{14}$/.test(d)) return '—';
  const ano = Number(d.slice(0, 4));
  // Datas corruptas no acervo público (ex.: ano 2202) são exibidas como "—" — honesto, sem "conserto" inventado.
  if (ano < 1980 || ano > 2035) return '—';
  const mes = Number(d.slice(4, 6));
  const dia = Number(d.slice(6, 8));
  const hh = d.slice(8, 10);
  const mm = d.slice(10, 12);
  return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano} ${hh}:${mm}`;
};

const CLASSE_SELECT = 'h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring';

// Jurimetria DPT — recortes por cidade (IBGE), vara, classe, grau e ano via DataJud/CNJ.
export function JurimetriaTab() {
  const [meta, setMeta] = useState<MetaJurimetria | null>(null);
  const [tribunal, setTribunal] = useState('tjmg');
  const [municipioIBGE, setMunicipioIBGE] = useState('3106200');
  const [municipioManual, setMunicipioManual] = useState('');
  const [usarManual, setUsarManual] = useState(false);
  const [varaCodigo, setVaraCodigo] = useState('');
  const [classeCodigo, setClasseCodigo] = useState('');
  const [grau, setGrau] = useState('');
  const [ano, setAno] = useState('');
  const [pagina, setPagina] = useState(0);

  const [resultado, setResultado] = useState<RespostaJurimetria | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [detalhe, setDetalhe] = useState<{ aberto: boolean; registro: RegistroDetalhe | null; carregando: boolean; erro: string | null }>({
    aberto: false,
    registro: null,
    carregando: false,
    erro: null,
  });

  useEffect(() => {
    fetch('/api/ejc/jurimetria')
      .then((r) => r.json())
      .then(setMeta)
      .catch(() => setMeta(null));
  }, []);

  const analisar = useCallback(
    async (novaPagina = 0) => {
      setCarregando(true);
      setErro(null);
      try {
        const r = await fetch('/api/ejc/jurimetria', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tribunal,
            municipioIBGE: usarManual ? municipioManual.replace(/[^0-9]/g, '') : municipioIBGE || undefined,
            varaCodigo: varaCodigo || undefined,
            classeCodigo: classeCodigo || undefined,
            grau: grau || undefined,
            ano: ano || undefined,
            pagina: novaPagina,
          }),
        });
        const d = (await r.json()) as RespostaJurimetria;
        if (!r.ok) {
          setErro(d.error ?? 'Consulta indisponível.');
          setResultado(null);
          return;
        }
        setResultado(d);
        setPagina(novaPagina);
      } catch {
        setErro('Falha de rede ao contatar o DataJud/CNJ.');
      } finally {
        setCarregando(false);
      }
    },
    [tribunal, municipioIBGE, municipioManual, usarManual, varaCodigo, classeCodigo, grau, ano],
  );

  // Primeira análise automática (Belo Horizonte) — demonstra o recurso sem exigir clique.
  useEffect(() => {
    if (meta?.status === 'ATIVA' && !resultado && !carregando) {
      void analisar(0);
    }
  }, [meta?.status]);

  const limparFiltros = () => {
    setVaraCodigo('');
    setClasseCodigo('');
    setGrau('');
    setAno('');
  };

  const selecionarMunicipio = (valor: string) => {
    setMunicipioIBGE(valor);
    setVaraCodigo('');
    setClasseCodigo('');
  };

  const abrirDetalhe = async (item: AmostraItem) => {
    if (!item.numeroProcesso) return;
    setDetalhe({ aberto: true, registro: null, carregando: true, erro: null });
    try {
      const r = await fetch('/api/ejc/datajud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numero: item.numeroProcesso, tribunal: item.tribunal?.toLowerCase() ?? 'tjmg' }),
      });
      const d = await r.json();
      if (!r.ok) {
        setDetalhe({ aberto: true, registro: null, carregando: false, erro: d.error ?? 'Consulta indisponível.' });
        return;
      }
      if (d.encontrado && d.registro) {
        setDetalhe({ aberto: true, registro: d.registro, carregando: false, erro: null });
      } else {
        setDetalhe({ aberto: true, registro: null, carregando: false, erro: d.mensagem ?? 'Processo não localizado no DataJud.' });
      }
    } catch {
      setDetalhe({ aberto: true, registro: null, carregando: false, erro: 'Falha de rede na consulta.' });
    }
  };

  const maxAno = useMemo(
    () => Math.max(1, ...(resultado?.porAno ?? []).map((a) => a.total)),
    [resultado],
  );
  const maxVara = useMemo(() => Math.max(1, ...(resultado?.porVara ?? []).map((v) => v.total)), [resultado]);
  const maxClasse = useMemo(() => Math.max(1, ...(resultado?.porClasse ?? []).map((c) => c.total)), [resultado]);

  const classeMaisComum = resultado?.porClasse?.[0]?.nome ?? null;
  const assuntoMaisComum = resultado?.porAssunto?.[0]?.assunto ?? null;
  const totalGeral = resultado ? formatarTotal(resultado.total, resultado.totalRelacao) : '—';

  const nomeMunicipioSelecionado = usarManual
    ? municipioManual.replace(/[^0-9]/g, '') || 'código IBGE manual'
    : meta?.municipios.find((m) => m.codigo === municipioIBGE)?.nome ?? 'todo o tribunal';

  return (
    <div className="space-y-5">
      {/* Cabeçalho do recurso */}
      <Card className="elevacao-card rounded-xl">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2 text-base">
            <TrendingUp className="size-4 text-primary" aria-hidden />
            Jurimetria — estatísticas processuais por cidade e vara
            {meta && (
              <Badge
                variant="outline"
                className={
                  meta.status === 'ATIVA'
                    ? 'border-emerald-500/40 text-[9px] text-emerald-700 dark:text-emerald-400'
                    : 'border-orange-500/40 text-[9px] text-orange-700 dark:text-orange-400'
                }
              >
                DataJud/CNJ · {meta.status === 'ATIVA' ? 'ATIVA' : 'AGUARDANDO CHAVE'}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Recortes por município (código IBGE), vara, classe, grau e ano de ajuizamento, agregados em tempo real
            pela API pública do DataJud/CNJ. A API pública não expõe nomes das partes (LGPD) — apenas metadados do
            processo, e nada é injetado na base de conhecimento.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Filtros */}
      <Card className="elevacao-card rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Filter className="size-4 text-primary" aria-hidden />
            Recorte da análise
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="jm-tribunal">Tribunal</Label>
              <select
                id="jm-tribunal"
                value={tribunal}
                onChange={(e) => {
                  setTribunal(e.target.value);
                  setVaraCodigo('');
                  setClasseCodigo('');
                }}
                className={CLASSE_SELECT}
              >
                {meta?.tribunais
                  .filter((t) => t.destaque)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome}
                    </option>
                  ))}
                {meta?.tribunais
                  .filter((t) => !t.destaque)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nome}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jm-municipio">Cidade / Comarca (MG)</Label>
              <select
                id="jm-municipio"
                value={usarManual ? '__manual__' : municipioIBGE}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '__manual__') {
                    setUsarManual(true);
                    setMunicipioIBGE('');
                  } else {
                    setUsarManual(false);
                    selecionarMunicipio(v);
                  }
                }}
                className={CLASSE_SELECT}
              >
                <option value="">Todo o tribunal (sem recorte de cidade)</option>
                {meta?.municipios.map((m) => (
                  <option key={m.codigo} value={m.codigo}>
                    {m.nome} — IBGE {m.codigo}
                  </option>
                ))}
                <option value="__manual__">Outra cidade (digitar código IBGE)…</option>
              </select>
            </div>
            {usarManual ? (
              <div className="space-y-1.5">
                <Label htmlFor="jm-ibge-manual">Código IBGE do município</Label>
                <div className="flex gap-2">
                  <Input
                    id="jm-ibge-manual"
                    value={municipioManual}
                    onChange={(e) => {
                      setMunicipioManual(e.target.value.replace(/[^0-9]/g, '').slice(0, 7));
                      setVaraCodigo('');
                      setClasseCodigo('');
                    }}
                    placeholder="ex.: 3160705"
                    inputMode="numeric"
                    className="font-mono"
                  />
                  <Button variant="ghost" size="sm" onClick={() => setUsarManual(false)} aria-label="Voltar à lista de cidades">
                    <RotateCcw className="size-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="jm-ano">Ano de ajuizamento</Label>
                <select id="jm-ano" value={ano} onChange={(e) => setAno(e.target.value)} className={CLASSE_SELECT}>
                  <option value="">Todos os anos</option>
                  {meta?.anos.map((a) => (
                    <option key={a} value={String(a)}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="jm-vara">Vara / Órgão julgador</Label>
              <select
                id="jm-vara"
                value={varaCodigo}
                onChange={(e) => setVaraCodigo(e.target.value)}
                className={CLASSE_SELECT}
                disabled={!resultado || resultado.porVara.length === 0}
              >
                <option value="">Todas as varas do recorte</option>
                {resultado?.porVara.map((v) => (
                  <option key={v.codigo} value={v.codigo}>
                    {v.nome.length > 62 ? `${v.nome.slice(0, 62)}…` : v.nome} ({formatarTotal(v.total)})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="jm-classe">Classe processual</Label>
              <select
                id="jm-classe"
                value={classeCodigo}
                onChange={(e) => setClasseCodigo(e.target.value)}
                className={CLASSE_SELECT}
                disabled={!resultado || resultado.porClasse.length === 0}
              >
                <option value="">Todas as classes</option>
                {resultado?.porClasse.map((c) => (
                  <option key={c.codigo} value={c.codigo}>
                    {c.nome.length > 62 ? `${c.nome.slice(0, 62)}…` : c.nome} ({formatarTotal(c.total)})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Grau de jurisdição</Label>
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtro por grau">
                <Button
                  size="sm"
                  variant={grau === '' ? 'default' : 'outline'}
                  className="h-9 rounded-full px-3 text-xs"
                  onClick={() => setGrau('')}
                >
                  Todos
                </Button>
                {(meta?.graus ?? ['G1', 'G2', 'JE', 'TR']).map((g) => (
                  <Button
                    key={g}
                    size="sm"
                    variant={grau === g ? 'default' : 'outline'}
                    className="h-9 rounded-full px-3 text-xs"
                    onClick={() => setGrau(grau === g ? '' : g)}
                    aria-pressed={grau === g}
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => void analisar(0)}
              disabled={carregando || meta?.status === 'AGUARDANDO_CHAVE' || (usarManual && municipioManual.replace(/[^0-9]/g, '').length !== 7)}
              className="gap-1.5"
            >
              {carregando ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <BarChart3 className="size-4" aria-hidden />}
              Analisar recorte
            </Button>
            <Button variant="ghost" onClick={limparFiltros} className="gap-1.5 text-muted-foreground">
              <RotateCcw className="size-3.5" aria-hidden />
              Limpar vara/classe/grau/ano
            </Button>
            <p className="text-[11px] text-muted-foreground sm:ml-auto">
              Recorte atual: <span className="font-medium text-foreground">{nomeMunicipioSelecionado}</span>
              {ano ? ` · ${ano}` : ''}
              {grau ? ` · grau ${grau}` : ''}
            </p>
          </div>
        </CardContent>
      </Card>

      {erro && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-4 text-sm text-orange-700 dark:text-orange-400" role="alert">
          {erro}
          {meta?.status === 'AGUARDANDO_CHAVE' && meta.comoHabilitar && (
            <p className="mt-1 text-xs">{meta.comoHabilitar}</p>
          )}
        </div>
      )}

      {resultado && !erro && (
        <>
          {/* Métricas do recorte */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="elevacao-card rounded-xl">
              <CardContent className="p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <Gavel className="size-3.5 text-primary" aria-hidden /> Processos no recorte
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{totalGeral}</p>
                <p className="text-[10px] text-muted-foreground">Total indexado no DataJud para o filtro</p>
              </CardContent>
            </Card>
            <Card className="elevacao-card rounded-xl">
              <CardContent className="p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <Building2 className="size-3.5 text-primary" aria-hidden /> Varas em atuação
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums">
                  {resultado.varasUnicas !== null ? resultado.varasUnicas.toLocaleString('pt-BR') : '—'}
                </p>
                <p className="text-[10px] text-muted-foreground">Órgãos julgadores distintos no recorte</p>
              </CardContent>
            </Card>
            <Card className="elevacao-card rounded-xl">
              <CardContent className="p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <Landmark className="size-3.5 text-primary" aria-hidden /> Classe mais comum
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug" title={classeMaisComum ?? ''}>
                  {classeMaisComum ?? '—'}
                </p>
                {resultado.porClasse[0] && (
                  <p className="text-[10px] text-muted-foreground">{formatarTotal(resultado.porClasse[0].total)} processos</p>
                )}
              </CardContent>
            </Card>
            <Card className="elevacao-card rounded-xl">
              <CardContent className="p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" aria-hidden /> Assunto mais frequente
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug" title={assuntoMaisComum ?? ''}>
                  {assuntoMaisComum ?? '—'}
                </p>
                {resultado.porAssunto[0] && (
                  <p className="text-[10px] text-muted-foreground">{formatarTotal(resultado.porAssunto[0].total)} processos</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Distribuição anual + graus */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="elevacao-card rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <CalendarDays className="size-4 text-primary" aria-hidden /> Ajuizamentos por ano (2018–2026)
                </CardTitle>
                <CardDescription>Interação com as barras não disponível — use o filtro &ldquo;Ano&rdquo; acima.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {resultado.porAno.length === 0 && <p className="text-xs text-muted-foreground">Sem dados no período monitorado.</p>}
                {resultado.porAno.map((a) => (
                  <button
                    key={a.ano}
                    type="button"
                    onClick={() => {
                      setAno(String(a.ano));
                      void analisar(0);
                    }}
                    className="group flex w-full items-center gap-2 text-left"
                    aria-label={`Filtrar por ${a.ano}: ${formatarTotal(a.total)} processos`}
                  >
                    <span className="w-10 shrink-0 font-mono text-xs tabular-nums text-muted-foreground group-hover:text-primary">{a.ano}</span>
                    <span className="h-5 min-w-0 flex-1 overflow-hidden rounded-md bg-muted">
                      <span
                        className="flex h-full items-center justify-end rounded-md bg-primary/85 pr-1.5 text-[10px] font-semibold text-primary-foreground transition-all group-hover:bg-primary"
                        style={{ width: `${Math.max(6, (a.total / maxAno) * 100)}%` }}
                      >
                        {a.total > 0 ? formatarTotal(a.total) : ''}
                      </span>
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="elevacao-card rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm">Distribuição por grau de jurisdição</CardTitle>
                <CardDescription>
                  G1/G2 = primeiro e segundo graus · JE = Juizados Especiais · TR = turmas recursais
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {resultado.porGrau.length === 0 && <p className="text-xs text-muted-foreground">Sem dados de grau no recorte.</p>}
                {resultado.porGrau.map((g) => (
                  <button
                    key={g.grau}
                    type="button"
                    onClick={() => {
                      setGrau(grau === g.grau ? '' : g.grau);
                      void analisar(0);
                    }}
                    className={`rounded-lg border px-3 py-2 text-left transition-colors hover:bg-accent ${
                      grau === g.grau ? 'border-primary bg-primary/10' : ''
                    }`}
                    aria-pressed={grau === g.grau}
                  >
                    <span className="block text-sm font-bold tabular-nums">{formatarTotal(g.total)}</span>
                    <span className="text-[10px] text-muted-foreground">grau {g.grau}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Ranking varas × classes */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="elevacao-card rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm">Varas com mais processos no recorte</CardTitle>
                <CardDescription>Clique para restringir a análise a uma vara específica.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="scrollbar-thin max-h-80 pr-2">
                  <div className="space-y-2">
                    {resultado.porVara.map((v) => (
                      <button
                        key={v.codigo}
                        type="button"
                        onClick={() => {
                          setVaraCodigo(varaCodigo === v.codigo ? '' : v.codigo);
                          void analisar(0);
                        }}
                        className={`group w-full rounded-lg border p-2 text-left transition-colors hover:bg-accent ${
                          varaCodigo === v.codigo ? 'border-primary bg-primary/10' : ''
                        }`}
                      >
                        <p className="line-clamp-2 text-[11px] font-medium leading-snug">{v.nome}</p>
                        <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted">
                          <span
                            className="block h-full rounded-full bg-primary/80 transition-all group-hover:bg-primary"
                            style={{ width: `${Math.max(4, (v.total / maxVara) * 100)}%` }}
                          />
                        </span>
                        <span className="mt-0.5 block text-[10px] tabular-nums text-muted-foreground">
                          {formatarTotal(v.total)} processos · código {v.codigo}
                        </span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="elevacao-card rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm">Classes processuais mais usadas</CardTitle>
                <CardDescription>Clique para restringir a análise a uma classe.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="scrollbar-thin max-h-80 pr-2">
                  <div className="space-y-2">
                    {resultado.porClasse.map((c) => (
                      <button
                        key={c.codigo}
                        type="button"
                        onClick={() => {
                          setClasseCodigo(classeCodigo === c.codigo ? '' : c.codigo);
                          void analisar(0);
                        }}
                        className={`group w-full rounded-lg border p-2 text-left transition-colors hover:bg-accent ${
                          classeCodigo === c.codigo ? 'border-primary bg-primary/10' : ''
                        }`}
                      >
                        <p className="line-clamp-2 text-[11px] font-medium leading-snug">{c.nome}</p>
                        <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-muted">
                          <span
                            className="block h-full rounded-full bg-[--brand-gold]/80 transition-all group-hover:bg-[--brand-gold]"
                            style={{ width: `${Math.max(4, (c.total / maxClasse) * 100)}%` }}
                          />
                        </span>
                        <span className="mt-0.5 block text-[10px] tabular-nums text-muted-foreground">
                          {formatarTotal(c.total)} processos · código {c.codigo}
                        </span>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Assuntos frequentes */}
          {resultado.porAssunto.length > 0 && (
            <Card className="elevacao-card rounded-xl">
              <CardHeader>
                <CardTitle className="text-sm">Assuntos mais frequentes no recorte</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-1.5">
                {resultado.porAssunto.map((a) => (
                  <Badge key={a.assunto} variant="secondary" className="text-[10px]">
                    {a.assunto} · {formatarTotal(a.total)}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Amostra dos processos mais recentes */}
          <Card className="elevacao-card rounded-xl">
            <CardHeader>
              <CardTitle className="text-sm">Amostra — processos mais recentes do recorte</CardTitle>
              <CardDescription>
                10 registros por página, ordenados pela data de ajuizamento. Clique em &ldquo;Detalhar&rdquo; para a
                linha do tempo de movimentos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="scrollbar-thin overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-xs">
                  <thead>
                    <tr className="border-b text-[10px] uppercase tracking-wide text-muted-foreground">
                      <th className="pb-2 pr-3 font-medium">Processo</th>
                      <th className="pb-2 pr-3 font-medium">Ajuizamento</th>
                      <th className="pb-2 pr-3 font-medium">Classe</th>
                      <th className="pb-2 pr-3 font-medium">Órgão julgador</th>
                      <th className="pb-2 pr-3 font-medium">Grau</th>
                      <th className="pb-2 font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultado.amostra.map((item) => (
                      <tr key={item.numeroProcesso ?? Math.random()} className="border-b last:border-0 align-top">
                        <td className="py-2 pr-3 font-mono text-[11px]">{formatarCNJ(item.numeroProcesso ?? '')}</td>
                        <td className="py-2 pr-3 tabular-nums text-muted-foreground">{formatarDataAjuizamento(item.dataAjuizamento)}</td>
                        <td className="max-w-[160px] py-2 pr-3">
                          <span className="line-clamp-2">{item.classe ?? '—'}</span>
                        </td>
                        <td className="max-w-[220px] py-2 pr-3">
                          <span className="line-clamp-2 text-muted-foreground">{item.orgaoJulgador ?? '—'}</span>
                        </td>
                        <td className="py-2 pr-3">
                          <Badge variant="outline" className="text-[9px]">
                            {item.grau ?? '—'}
                          </Badge>
                        </td>
                        <td className="py-2">
                          <Button size="sm" variant="ghost" className="h-7 gap-1 px-2 text-[11px]" onClick={() => void abrirDetalhe(item)}>
                            Detalhar
                            <ChevronRight className="size-3" aria-hidden />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {resultado.amostra.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-muted-foreground">
                          Nenhum processo retornado para este recorte — o acervo público pode não cobrir a comarca/tribunal escolhido.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagina === 0 || carregando}
                  onClick={() => void analisar(Math.max(0, pagina - 1))}
                  className="gap-1 text-xs"
                >
                  <ChevronLeft className="size-3.5" aria-hidden /> Anterior
                </Button>
                <span className="text-[11px] tabular-nums text-muted-foreground">página {pagina + 1}</span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={carregando || resultado.amostra.length < 10}
                  onClick={() => void analisar(pagina + 1)}
                  className="gap-1 text-xs"
                >
                  Próxima <ChevronRight className="size-3.5" aria-hidden />
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-[11px] leading-relaxed text-muted-foreground">
            {resultado.citacao} A API pública do DataJud não divulga nomes das partes (LGPD). Números e movimentos
            devem ser conferidos no processo concreto e nos portais oficiais dos tribunais.
          </p>
        </>
      )}

      {/* Detalhe do processo */}
      <Dialog open={detalhe.aberto} onOpenChange={(aberto) => setDetalhe((d) => ({ ...d, aberto }))}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base">
              Processo {detalhe.registro?.numeroProcesso ? formatarCNJ(detalhe.registro.numeroProcesso) : '— detalhamento'}
            </DialogTitle>
            <DialogDescription>
              Metadados públicos — Conselho Nacional de Justiça (DataJud). Sem injeção na base de conhecimento.
            </DialogDescription>
          </DialogHeader>
          {detalhe.carregando && (
            <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden /> Consultando o DataJud…
            </p>
          )}
          {detalhe.erro && <p className="py-3 text-sm text-orange-700 dark:text-orange-400">{detalhe.erro}</p>}
          {detalhe.registro && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[10px] border-primary/40 text-primary">
                  {detalhe.registro.tribunal}
                </Badge>
                {detalhe.registro.classe && <span className="text-xs font-medium">{detalhe.registro.classe}</span>}
                {detalhe.registro.orgaoJulgador && (
                  <span className="text-[11px] text-muted-foreground">· {detalhe.registro.orgaoJulgador}</span>
                )}
              </div>
              {detalhe.registro.assuntos.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {detalhe.registro.assuntos.map((a) => (
                    <Badge key={a} variant="secondary" className="text-[10px]">
                      {a}
                    </Badge>
                  ))}
                </div>
              )}
              <div>
                <p className="mb-1.5 text-xs font-semibold">Movimentos ({detalhe.registro.movimentos.length})</p>
                <ScrollArea className="scrollbar-thin max-h-64 pr-2">
                  <div className="space-y-1">
                    {[...detalhe.registro.movimentos].reverse().map((m, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-md border px-2.5 py-1.5 text-[11px]">
                        <span className="shrink-0 font-mono tabular-nums text-muted-foreground">
                          {m.data ? new Date(m.data).toLocaleDateString('pt-BR') : '—'}
                        </span>
                        <span className="min-w-0 flex-1">{m.nome ?? 'Movimento'}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Atualizado em{' '}
                {detalhe.registro.atualizadoEm ? new Date(detalhe.registro.atualizadoEm).toLocaleString('pt-BR') : '—'}.{' '}
                <a
                  href="https://datajud-wiki.cnj.jus.br/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
                >
                  Portal oficial <ExternalLink className="size-2.5" aria-hidden />
                </a>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Nota metodológica */}
      {meta && (
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {meta.nota} O acervo público concentra os sistemas sincronizados pelo CNJ (ex.: PJe); comarcas de outros
          sistemas podem não aparecer — nesse caso, o sistema exibe o vazio de forma honesta, jamais simula dados.
          {TRIBUNAIS_DESTAQUE_SIGLA.length > 0 && (
            <> Tribunais com foco MG: {TRIBUNAIS_DESTAQUE_SIGLA.join(', ')}.</>
          )}
        </p>
      )}
    </div>
  );
}
