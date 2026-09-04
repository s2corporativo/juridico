'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  BadgeCheck, Copy, ExternalLink, FileDown, FileSearch, History, Loader2, Quote, ScrollText,
  ShieldCheck, Sparkles, XCircle, AlertTriangle,
} from 'lucide-react';

interface HitHibridoUI {
  slug: string; titulo: string; tipoDocumento: string; area: string;
  confiabilidade: string; status: string; fonte: string | null; urlFonte: string | null;
  dataConsulta: string | null; chunkTexto: string; scoreBm25: number; scoreEmb: number; score: number; motor: string;
}
interface IteracaoUI { n: number; consulta: string; novosSlugs: string[]; motivo: string }
interface FonteWebUI { titulo: string; url: string; origem: string }
interface MemoUI {
  modo: 'agente' | 'degradado';
  resumo: string;
  fundamentos: { tese: string; aplicacao: string; fontes: string[] }[];
  contra_argumentos: { ponto: string; resposta: string; fontes: string[] }[];
  sugestao_peca: string;
  lacunas: string[];
}
interface PesquisaUI {
  pergunta: string; motor: string; iteracoes: IteracaoUI[]; fontes: HitHibridoUI[];
  fontesWeb: FonteWebUI[]; memo: MemoUI; tempoMs: number;
}

// Memo persistido no banco (GET /api/ejc/pesquisa) — fontes guardadas com campos reduzidos
interface MemoSalvo {
  id: string; pergunta: string; modo: string; motor: string; totalFontes: number;
  tempoMs: number; createdAt: string;
  memo: MemoUI | null;
  iteracoes: IteracaoUI[] | null;
  fontes: { slug: string; titulo: string; urlFonte: string | null; confiabilidade: string; status: string }[] | null;
}

// Reconstrói a visão completa a partir do memo salvo (campos não persistidos recebem default honesto)
function memoSalvoParaUI(m: MemoSalvo): PesquisaUI | null {
  if (!m.memo) return null;
  return {
    pergunta: m.pergunta,
    motor: m.motor,
    iteracoes: Array.isArray(m.iteracoes) ? m.iteracoes : [],
    fontes: (m.fontes ?? []).map((f) => ({
      slug: f.slug,
      titulo: f.titulo,
      tipoDocumento: '—',
      area: '—',
      confiabilidade: f.confiabilidade ?? 'B',
      status: f.status ?? 'ATIVO',
      fonte: null,
      urlFonte: f.urlFonte ?? null,
      dataConsulta: null,
      chunkTexto: '',
      scoreBm25: 0,
      scoreEmb: 0,
      score: 0,
      motor: m.motor,
    })),
    fontesWeb: [],
    memo: m.memo,
    tempoMs: m.tempoMs ?? 0,
  };
}
interface VerificacaoUI {
  tipo: string; citacao: string; veredicto: string; detalhe: string;
  tribunal?: string; classe?: string; orgaoJulgador?: string; dataAjuizamento?: string;
  autos?: { tribunal: string; url: string; descricao: string };
  baseSlug?: string; baseTitulo?: string; baseUrl?: string | null; trecho?: string;
}

function corVeredicto(v: string): { badge: 'default' | 'secondary' | 'destructive' | 'outline'; cor: string; icone: typeof BadgeCheck } {
  if (v === 'VALIDA') return { badge: 'default', cor: 'bg-emerald-600 text-white hover:bg-emerald-700', icone: BadgeCheck };
  if (v === 'CONFIRMADA_BASE') return { badge: 'default', cor: 'bg-sky-700 text-white hover:bg-sky-800', icone: ShieldCheck };
  if (v === 'NUMERO_INVALIDO') return { badge: 'destructive', cor: '', icone: XCircle };
  if (v === 'NAO_INDEXADO') return { badge: 'secondary', cor: '', icone: AlertTriangle };
  return { badge: 'secondary', cor: '', icone: AlertTriangle };
}

function montaMarkdownFundamentacao(p: PesquisaUI): string {
  const linhas: string[] = [`## Fundamentação — ${p.pergunta}`, '', `> Gerada pelo agente de pesquisa (${p.motor}). Verifique cada citação no documento original antes do protocolo.`, '', p.memo.resumo, ''];
  p.memo.fundamentos.forEach((f, i) => {
    linhas.push(`### ${i + 1}. ${f.tese}`, '', f.aplicacao, '');
    if (f.fontes.length) linhas.push(`**Fontes:** ${f.fontes.map((s) => `\`${s}\``).join(', ')}`, '');
  });
  if (p.memo.contra_argumentos.length) {
    linhas.push('### Contra-argumentos e respostas', '');
    p.memo.contra_argumentos.forEach((c) => linhas.push(`- **${c.ponto}** → ${c.resposta}${c.fontes.length ? ` (${c.fontes.join(', ')})` : ''}`));
    linhas.push('');
  }
  linhas.push('### Fontes rastreáveis', '');
  p.fontes.forEach((f) => linhas.push(`- ${f.titulo} — ${f.fonte ?? '—'} · ${f.urlFonte ?? 'sem URL'} · consulta ${f.dataConsulta ?? '—'} · confiabilidade ${f.confiabilidade} · status ${f.status}`));
  if (p.fontesWeb.length) {
    linhas.push('', '### Pistas externas (conferir antes de citar)', '');
    p.fontesWeb.forEach((w) => linhas.push(`- ${w.titulo} — ${w.url}`));
  }
  return linhas.join('\n');
}

export function PesquisaTab() {
  const [pergunta, setPergunta] = useState('');
  const [pesquisando, setPesquisando] = useState(false);
  const [pesquisa, setPesquisa] = useState<PesquisaUI | null>(null);
  const [textoCitacao, setTextoCitacao] = useState('');
  const [verificando, setVerificando] = useState(false);
  const [verificacoes, setVerificacoes] = useState<VerificacaoUI[] | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [baixando, setBaixando] = useState(false);
  const [historico, setHistorico] = useState<MemoSalvo[]>([]);

  useEffect(() => {
    fetch('/api/ejc/pesquisa')
      .then((r) => r.json())
      .then((d) => setHistorico((d.memos ?? []).slice(0, 8)))
      .catch(() => setHistorico([]));
  }, [pesquisa]);

  async function pesquisar() {
    if (pergunta.trim().length < 8 || pesquisando) return;
    setPesquisando(true);
    setPesquisa(null);
    try {
      const r = await fetch('/api/ejc/pesquisa', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pergunta }) });
      const d = await r.json();
      if (!d.error) setPesquisa(d as PesquisaUI);
    } finally {
      setPesquisando(false);
    }
  }

  async function verificar() {
    if (textoCitacao.trim().length < 6 || verificando) return;
    setVerificando(true);
    try {
      const r = await fetch('/api/ejc/verificar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ texto: textoCitacao }) });
      const d = await r.json();
      setVerificacoes(d.verificacoes ?? []);
    } finally {
      setVerificando(false);
    }
  }

  function copiarFundamentacao() {
    if (!pesquisa) return;
    void navigator.clipboard.writeText(montaMarkdownFundamentacao(pesquisa));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  async function baixarDocx() {
    if (!pesquisa || baixando) return;
    setBaixando(true);
    try {
      const r = await fetch('/api/ejc/pesquisa/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pergunta: pesquisa.pergunta,
          motor: pesquisa.motor,
          tempoMs: pesquisa.tempoMs,
          memo: pesquisa.memo,
          fontes: pesquisa.fontes.map((f) => ({
            slug: f.slug, titulo: f.titulo, confiabilidade: f.confiabilidade,
            status: f.status, fonte: f.fonte, urlFonte: f.urlFonte, dataConsulta: f.dataConsulta,
          })),
          fontesWeb: pesquisa.fontesWeb,
        }),
      });
      if (!r.ok) return;
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const cd = r.headers.get('Content-Disposition') ?? '';
      a.download = /filename="([^"]+)"/.exec(cd)?.[1] ?? 'memo-fundamentacao.docx';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* download é acessório — silencioso */
    } finally {
      setBaixando(false);
    }
  }

  function abrirMemoSalvo(m: MemoSalvo) {
    const ui = memoSalvoParaUI(m);
    if (ui) {
      setPesquisa(ui);
      setPergunta(m.pergunta);
    } else {
      setPergunta(m.pergunta);
    }
  }

  return (
    <div className="space-y-5">
      <Card className="border-[--brand-green]/25">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Sparkles className="size-5 text-[--brand-green]" /> Pesquisa jurídica agêntica — fundamentação com citações rastreáveis</CardTitle>
          <CardDescription>
            Corpus indexado com <strong>BM25 + embeddings locais</strong> (fusão RRF). O agente itera (planeja → busca → critica lacunas → refina),
            analisa contra-argumentos e produz um memo com <strong>citações prontas para peça</strong> — cada fonte com URL oficial, data de consulta e confiabilidade.
            Pistas externas de jurisprudência aparecem apenas como leitura complementar (nunca injetadas na base).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            placeholder="Ex.: É possível conceder tutela de urgência para suspender inscrição no Serasa com discussão judicial do débito em curso? Quais teses e súmulas fundamentam?"
            className="min-h-24"
          />
          <div className="flex items-center gap-3">
            <Button onClick={pesquisar} disabled={pesquisando || pergunta.trim().length < 8} className="gap-2 bg-[--brand-green] text-white hover:bg-[--brand-green]/90">
              {pesquisando ? <><Loader2 className="size-4 animate-spin" /> Pesquisando (agente iterativo)…</> : <><FileSearch className="size-4" /> Pesquisar e fundamentar</>}
            </Button>
            {pesquisa && <Badge variant="outline" className="text-[11px]">{pesquisa.motor}</Badge>}
            {pesquisa && <Badge variant="outline" className="text-[11px]">{(pesquisa.tempoMs / 1000).toFixed(1)}s</Badge>}
            {pesquisa && (
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={copiarFundamentacao} className="gap-1.5">
                  {copiado ? <BadgeCheck className="size-4 text-emerald-600" /> : <Copy className="size-4" />} Copiar (Markdown)
                </Button>
                <Button variant="outline" size="sm" onClick={baixarDocx} disabled={baixando} className="gap-1.5" title="Gera documento .docx localmente (LGPD: nada sai do servidor)">
                  {baixando ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />} Baixar (.docx)
                </Button>
              </div>
            )}
          </div>

          {pesquisa && (
            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Iterações do agente</p>
                <div className="scrollbar-thin flex flex-wrap gap-2">
                  {pesquisa.iteracoes.map((it) => (
                    <Badge key={it.n} variant={it.n === 1 ? 'default' : 'secondary'} className="max-w-full gap-1 text-left text-[10px] font-normal" title={it.motivo}>
                      <Quote className="size-3" /> {it.n}ª: {it.consulta.slice(0, 60)}{it.consulta.length > 60 ? '…' : ''} (+{it.novosSlugs.length} docs)
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <ScrollText className="size-4 text-[--brand-green]" />
                  <p className="text-sm font-semibold">Memo de fundamentação</p>
                  <Badge variant={pesquisa.memo.modo === 'agente' ? 'default' : 'secondary'} className="text-[10px]">
                    {pesquisa.memo.modo === 'agente' ? 'agente IA' : 'degradado (sem IA — honesto)'}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed">{pesquisa.memo.resumo}</p>
                {pesquisa.memo.fundamentos.length > 0 && (
                  <ol className="mt-3 list-decimal space-y-3 pl-5">
                    {pesquisa.memo.fundamentos.map((f, i) => (
                      <li key={i} className="text-sm">
                        <span className="font-semibold">{f.tese}</span>
                        <p className="mt-0.5 text-muted-foreground">{f.aplicacao}</p>
                        {f.fontes.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {f.fontes.map((s) => <Badge key={s} variant="outline" className="text-[10px] font-normal">{s}</Badge>)}
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                )}
                {pesquisa.memo.contra_argumentos.some((c) => c.ponto && !c.ponto.startsWith('Nenhum')) && (
                  <>
                    <Separator className="my-3" />
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contra-argumentos analisados</p>
                    <ul className="space-y-2 text-sm">
                      {pesquisa.memo.contra_argumentos.map((c, i) => (
                        <li key={i}><strong>{c.ponto}</strong> → {c.resposta}</li>
                      ))}
                    </ul>
                  </>
                )}
                {pesquisa.memo.sugestao_peca && (
                  <>
                    <Separator className="my-3" />
                    <p className="text-sm"><span className="font-semibold">Uso em peça: </span>{pesquisa.memo.sugestao_peca}</p>
                  </>
                )}
                {pesquisa.memo.lacunas.length > 0 && (
                  <p className="mt-3 rounded bg-amber-500/10 p-2 text-xs text-amber-700 dark:text-amber-400">
                    <strong>Lacunas honestas:</strong> {pesquisa.memo.lacunas.join(' · ')}
                  </p>
                )}
              </div>

              <div className="scrollbar-thin max-h-96 space-y-2 overflow-y-auto pr-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fontes da base ({pesquisa.fontes.length}) — rastreabilidade completa</p>
                {pesquisa.fontes.map((f) => (
                  <div key={f.slug} className="rounded-lg border p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{f.titulo}</span>
                      <Badge variant="outline" className="text-[10px]">{f.tipoDocumento}</Badge>
                      <Badge variant="outline" className="text-[10px]">conf. {f.confiabilidade}</Badge>
                      {f.status !== 'ATIVO' && <Badge variant="destructive" className="text-[10px]">{f.status}</Badge>}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{f.chunkTexto}</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="font-mono">{f.slug}</span>
                      {f.urlFonte && <a href={f.urlFonte} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[--brand-green] hover:underline"><ExternalLink className="size-3" /> fonte oficial</a>}
                      {f.dataConsulta && <span>· consulta {f.dataConsulta}</span>}
                      <span>· BM25 {f.scoreBm25.toFixed(1)} · emb {(f.scoreEmb * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
                {pesquisa.fontesWeb.length > 0 && (
                  <div className="rounded-lg border border-dashed p-3 text-sm">
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pistas externas (não injetadas na base)</p>
                    {pesquisa.fontesWeb.map((w) => (
                      <a key={w.url} href={w.url} target="_blank" rel="noopener noreferrer" className="block truncate text-[12px] text-[--brand-green] hover:underline">
                        <ExternalLink className="mr-1 inline size-3" />{w.titulo}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {historico.length > 0 && (
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><History className="size-3.5" /> Memos recentes</p>
              <div className="flex flex-wrap gap-2">
                {historico.map((m) => (
                  <button key={m.id} onClick={() => abrirMemoSalvo(m)} className="max-w-xs truncate rounded-full border bg-background px-3 py-1 text-[11px] transition-colors hover:border-[--brand-green] hover:text-[--brand-green]" title={`Abrir memo completo (${m.totalFontes} fontes) · ${new Date(m.createdAt).toLocaleString('pt-BR')}`}>
                    {m.pergunta} · {m.totalFontes} fontes · {m.modo}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[--brand-gold]/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="size-5 text-[--brand-gold]" /> Verificador de citação — antes de protocolar</CardTitle>
          <CardDescription>
            Cole um trecho da peça. O sistema valida <strong>números CNJ</strong> (checksum módulo 97 + existência ao vivo no DataJud), localiza <strong>súmulas e precedentes</strong> na base curada
            e devolve o <strong>link para a página dos autos</strong> do tribunal. Nada é persistido (LGPD). O sistema nunca afirma citação que não confirmou.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={textoCitacao}
            onChange={(e) => setTextoCitacao(e.target.value)}
            placeholder={'Ex.: "Nos termos da Súmula 203 do STJ... (processo 1234567-89.2024.8.13.0238)... conforme REsp 1.234.567/SP"'}
            className="min-h-24 font-mono text-[13px]"
          />
          <Button onClick={verificar} disabled={verificando || textoCitacao.trim().length < 6} className="gap-2">
            {verificando ? <><Loader2 className="size-4 animate-spin" /> Verificando…</> : <><ShieldCheck className="size-4" /> Verificar citações</>}
          </Button>

          {verificacoes && (
            <div className="space-y-2">
              {verificacoes.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma citação reconhecida no texto (procure números CNJ, súmulas ou precedentes).</p>}
              {verificacoes.map((v, i) => {
                const c = corVeredicto(v.veredicto);
                const Icone = c.icone;
                return (
                  <div key={i} className="rounded-lg border p-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <Icone className="size-4" />
                      <span className="font-medium">{v.citacao}</span>
                      <Badge className={c.cor || undefined} variant={c.cor ? undefined : c.badge}>{v.veredicto.replace(/_/g, ' ')}</Badge>
                      {v.tribunal && <Badge variant="outline" className="text-[10px]">{v.tribunal}</Badge>}
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">{v.detalhe}</p>
                    {v.classe && (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        {v.classe}{v.orgaoJulgador ? ` · ${v.orgaoJulgador}` : ''}{v.dataAjuizamento ? ` · ajuizado ${v.dataAjuizamento.slice(0, 10)}` : ''}
                      </p>
                    )}
                    {v.trecho && <p className="mt-1.5 rounded bg-muted/40 p-2 text-[12px] italic">{v.trecho}</p>}
                    <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
                      {v.autos && (
                        <a href={v.autos.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-[--brand-green] hover:underline">
                          <ExternalLink className="size-3" /> Página dos autos — {v.autos.tribunal}
                        </a>
                      )}
                      {v.baseUrl && (
                        <a href={v.baseUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:underline">
                          <ExternalLink className="size-3" /> fonte oficial da súmula/precedente
                        </a>
                      )}
                      {v.baseSlug && <span className="font-mono text-muted-foreground">base: {v.baseSlug}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
