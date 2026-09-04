'use client';

// EJC — Aba "Minutas IA": geração de peças jurídicas com IA sobre a base curada,
// inspirada no modelo do MinutaIA e adaptada às regras do Jurimetria DPT:
//   · Tarja de anonimização antes do LLM (mapa auditável — LGPD por desenho);
//   · Fundamentos apenas da base EJC com [FONTE n] (anti-invenção);
//   · Editor por seções + exportação .docx local (nada persistido no servidor);
//   · Histórico do navegador guarda só metadados, salvo opt-in explícito.

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Copy,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileSignature,
  FileText,
  Landmark,
  Loader2,
  MailWarning,
  PenLine,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stamp,
  Trash2,
  Wand2,
} from 'lucide-react';
import { CAMPOS, TIPOS_PECA, tipoPorId } from '@/lib/ejc/minutas-tipos';
import type { MarcadorTarja } from '@/lib/ejc/minutas-ia';

const ICONES: Record<string, typeof FileSignature> = {
  FileSignature,
  Shield,
  Scale,
  MailWarning,
  Stamp,
  FileText,
  PenLine,
};

interface SecaoMinuta {
  id: string;
  titulo: string;
  dica?: string;
  conteudo: string;
  conteudoTarjado?: string;
}
interface FonteMinuta {
  slug: string;
  titulo: string;
  tipoDocumento: string;
  area: string;
  confiabilidade: string;
  status: string;
  fonte: string | null;
  urlFonte: string | null;
  dataConsulta: string | null;
  score: number;
}
interface RespostaMinuta {
  tipoId: string;
  tipoNome: string;
  secoes: SecaoMinuta[];
  fontes: FonteMinuta[];
  lacunas: string[];
  avisos: string[];
  anonimizacao: { total: number; porTipo: Record<string, number>; marcadores: MarcadorTarja[] };
  usarBase: boolean;
  tempoMs: number;
}

interface ItemHistorico {
  id: string;
  tipoId: string;
  tipoNome: string;
  data: string;
  rascunhoGuardado: boolean;
  secoes?: SecaoMinuta[];
  fontes?: FonteMinuta[];
  avisos?: string[];
  lacunas?: string[];
  marcadores?: MarcadorTarja[];
}

const HIST_KEY = 'dpt-minutas-historico-v1';

export function MinutasTab() {
  const [tipoId, setTipoId] = useState(TIPOS_PECA[0].id);
  const [valores, setValores] = useState<Record<string, string>>({});
  const [usarBase, setUsarBase] = useState(true);
  const [guardarRascunho, setGuardarRascunho] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespostaMinuta | null>(null);
  const [secoesEdit, setSecoesEdit] = useState<SecaoMinuta[]>([]);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [baixando, setBaixando] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [historico, setHistorico] = useState<ItemHistorico[]>([]);

  const tipo = tipoPorId(tipoId) ?? TIPOS_PECA[0];

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HIST_KEY);
      if (raw) setHistorico(JSON.parse(raw).slice(0, 10));
    } catch {
      /* histórico é opcional */
    }
  }, []);

  const gerar = async () => {
    setGerando(true);
    setErro(null);
    setResultado(null);
    setMostrarMapa(false);
    try {
      const r = await fetch('/api/ejc/minutas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipoId, valores, usarBase }),
      });
      const d = await r.json();
      if (!r.ok || d.error) {
        setErro(d.error ?? 'Falha ao gerar a minuta.');
        return;
      }
      const resp = d as RespostaMinuta;
      setResultado(resp);
      setSecoesEdit(resp.secoes.map((s) => ({ ...s })));
      // registra histórico após setSecoesEdit — usa o estado recém-definido via closure
      const item: ItemHistorico = {
        id: `${Date.now()}`,
        tipoId: resp.tipoId,
        tipoNome: resp.tipoNome,
        data: new Date().toISOString(),
        rascunhoGuardado: guardarRascunho,
        ...(guardarRascunho
          ? { secoes: resp.secoes, fontes: resp.fontes, avisos: resp.avisos, lacunas: resp.lacunas, marcadores: resp.anonimizacao.marcadores }
          : {}),
      };
      const atual = [item, ...historico].slice(0, 10);
      setHistorico(atual);
      try {
        window.localStorage.setItem(HIST_KEY, JSON.stringify(atual));
      } catch {
        /* noop */
      }
    } catch {
      setErro('Falha de rede ao gerar a minuta.');
    } finally {
      setGerando(false);
    }
  };

  const abrirDoHistorico = (item: ItemHistorico) => {
    if (!item.rascunhoGuardado || !item.secoes) return;
    setTipoId(item.tipoId);
    setResultado({
      tipoId: item.tipoId,
      tipoNome: item.tipoNome,
      secoes: item.secoes,
      fontes: item.fontes ?? [],
      lacunas: item.lacunas ?? [],
      avisos: item.avisos ?? [],
      anonimizacao: { total: item.marcadores?.length ?? 0, porTipo: {}, marcadores: item.marcadores ?? [] },
      usarBase,
      tempoMs: 0,
    });
    setSecoesEdit(item.secoes.map((s) => ({ ...s })));
  };

  const limparHistorico = () => {
    setHistorico([]);
    try {
      window.localStorage.removeItem(HIST_KEY);
    } catch {
      /* noop */
    }
  };

  const textoMarkdown = () => {
    if (!resultado) return '';
    const linhas: string[] = [`# ${resultado.tipoNome}`, ''];
    for (const s of secoesEdit) {
      linhas.push(`## ${s.titulo}`, '', s.conteudo, '');
    }
    if (resultado.fontes.length) {
      linhas.push('## Fontes da base (rastreabilidade)', '');
      resultado.fontes.forEach((f, i) =>
        linhas.push(`- [FONTE ${i + 1}] ${f.titulo} (confiabilidade ${f.confiabilidade}${f.urlFonte ? ` · ${f.urlFonte}` : ''})`),
      );
      linhas.push('');
    }
    if (resultado.lacunas.length) {
      linhas.push('## Lacunas', '', ...resultado.lacunas.map((l) => `- ${l}`));
    }
    return linhas.join('\n');
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(textoMarkdown());
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* clipboard indisponível */
    }
  };

  const baixarDocx = async () => {
    if (!resultado) return;
    setBaixando(true);
    try {
      const r = await fetch('/api/ejc/minutas/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipoNome: resultado.tipoNome,
          valores,
          secoes: secoesEdit,
          fontes: resultado.fontes,
          avisos: resultado.avisos,
          lacunas: resultado.lacunas,
          usarBase: resultado.usarBase,
        }),
      });
      if (!r.ok) return;
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `minuta-ia-${resultado.tipoId}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBaixando(false);
    }
  };

  const totalMarcadores = resultado?.anonimizacao.total ?? 0;

  return (
    <div className="grid gap-4 lg:grid-cols-[400px_1fr]">
      {/* ── Coluna esquerda: tipo + dados do caso ── */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wand2 className="size-4 text-amber-600" /> 1. Tipo de peça
            </CardTitle>
            <CardDescription>Escolha o modelo — a estrutura e a fundamentação seguem o tipo.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {TIPOS_PECA.map((t) => {
              const Icone = ICONES[t.icone] ?? FileSignature;
              const ativo = t.id === tipoId;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTipoId(t.id)}
                  aria-pressed={ativo}
                  className={`flex items-start gap-2.5 rounded-lg border p-2.5 text-left transition-all ${
                    ativo ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30' : 'hover:border-primary/40 hover:bg-muted/50'
                  }`}
                >
                  <Icone className={`mt-0.5 size-4 shrink-0 ${ativo ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-tight">{t.nome}</span>
                    <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{t.descricao}</span>
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PenLine className="size-4 text-amber-600" /> 2. Dados do caso
            </CardTitle>
            <CardDescription>
              Dados sensíveis recebem <strong>tarja automática</strong>: a IA recebe apenas marcadores como{' '}
              <code className="rounded bg-muted px-1 text-[10px]">[NOME_1]</code> — o mapa completo fica visível para você auditar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {CAMPOS.filter((c) => c.comum || tipo.camposExtras?.includes(c.id)).map((c) => (
              <div key={c.id} className="space-y-1.5">
                <Label htmlFor={`campo-${c.id}`} className="flex items-center gap-1.5 text-xs">
                  {c.label}
                  {c.sensivel && (
                    <Badge variant="outline" className="px-1 py-0 text-[9px] font-normal text-muted-foreground">
                      <EyeOff className="size-2.5" /> tarja
                    </Badge>
                  )}
                </Label>
                {c.tipo === 'text' ? (
                  <Textarea
                    id={`campo-${c.id}`}
                    value={valores[c.id] ?? ''}
                    onChange={(e) => setValores((v) => ({ ...v, [c.id]: e.target.value }))}
                    placeholder={c.placeholder}
                    className="min-h-[72px] text-sm"
                  />
                ) : (
                  <Input
                    id={`campo-${c.id}`}
                    value={valores[c.id] ?? ''}
                    onChange={(e) => setValores((v) => ({ ...v, [c.id]: e.target.value }))}
                    placeholder={c.placeholder}
                    className="text-sm"
                  />
                )}
              </div>
            ))}

            <div className="flex items-center justify-between gap-3 rounded-lg border p-2.5">
              <div className="min-w-0">
                <Label htmlFor="usar-base" className="text-xs font-medium">Fundamentar na base EJC</Label>
                <p className="text-[11px] text-muted-foreground">Retrieval BM25 na base curada com citações [FONTE n].</p>
              </div>
              <Switch id="usar-base" checked={usarBase} onCheckedChange={setUsarBase} />
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border p-2.5">
              <div className="min-w-0">
                <Label htmlFor="guardar-rascunho" className="text-xs font-medium">Guardar rascunho neste navegador</Label>
                <p className="text-[11px] text-muted-foreground">Por padrão o histórico guarda só metadados (LGPD).</p>
              </div>
              <Switch id="guardar-rascunho" checked={guardarRascunho} onCheckedChange={setGuardarRascunho} />
            </div>

            <Button onClick={gerar} disabled={gerando} className="w-full gap-2 shadow-sm">
              {gerando ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Gerando minuta (tarja → base → IA)…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Gerar minuta com IA
                </>
              )}
            </Button>
            {erro && (
              <Alert variant="destructive">
                <ShieldAlert className="size-4" />
                <AlertDescription className="text-xs">{erro}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {historico.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <span className="flex items-center gap-2"><Landmark className="size-4 text-amber-600" /> Rascunhos recentes</span>
                <Button variant="ghost" size="sm" onClick={limparHistorico} className="h-7 gap-1 px-2 text-[11px] text-muted-foreground">
                  <Trash2 className="size-3" /> limpar
                </Button>
              </CardTitle>
              <CardDescription>{guardarRascunho ? 'Com rascunhos completos (opt-in local).' : 'Apenas metadados — texto não persistido (LGPD).'}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="scrollbar-thin max-h-52 overflow-y-auto px-6 pb-4">
                <div className="space-y-1.5">
                  {historico.map((h) => (
                    <div key={h.id} className="flex items-center gap-2 rounded-lg border p-2 text-xs">
                      {h.rascunhoGuardado ? (
                        <ShieldCheck className="size-3.5 shrink-0 text-emerald-600" title="Rascunho guardado localmente" />
                      ) : (
                        <EyeOff className="size-3.5 shrink-0 text-muted-foreground" title="Só metadados guardados" />
                      )}
                      <button
                        type="button"
                        onClick={() => abrirDoHistorico(h)}
                        className={`min-w-0 flex-1 truncate text-left ${h.rascunhoGuardado ? 'hover:underline' : 'cursor-default text-muted-foreground'}`}
                        title={h.rascunhoGuardado ? 'Abrir rascunho' : 'Rascunho não guardado (modo padrão LGPD)'}
                      >
                        {h.tipoNome} · {new Date(h.data).toLocaleString('pt-BR')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── Coluna direita: minuta gerada ── */}
      <div className="space-y-4">
        {!resultado && !gerando && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <FileSignature className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">A minuta aparece aqui, seção por seção</p>
                <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-muted-foreground">
                  Fluxo com transparência total: (1) tarja de dados sensíveis com mapa auditável; (2) fundamentação apenas da base
                  curada com [FONTE n]; (3) editor por seções; (4) exportação .docx local. Tudo com revisão humana explícita.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {gerando && (
          <Card>
            <CardContent className="space-y-3 py-8">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-full animate-pulse rounded bg-muted" style={{ animationDelay: `${i * 120}ms` }} />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-muted" style={{ animationDelay: `${i * 120 + 60}ms` }} />
                </div>
              ))}
              <p className="pt-2 text-center text-xs text-muted-foreground">Anonimizando dados → consultando a base → redigindo com IA…</p>
            </CardContent>
          </Card>
        )}

        {resultado && (
          <>
            {/* Painel de tarja / anonimização */}
            <Card className={totalMarcadores > 0 ? 'border-emerald-500/40' : ''}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  {totalMarcadores > 0 ? (
                    <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600">
                      <ShieldCheck className="size-3" /> Tarja ativa: {totalMarcadores} dado(s) mascarado(s) antes da IA
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <ShieldCheck className="size-3" /> Nenhum dado sensível detectado pela tarja
                    </Badge>
                  )}
                  {Object.entries(resultado.anonimizacao.porTipo).map(([t, n]) => (
                    <Badge key={t} variant="secondary" className="text-[10px] font-normal">
                      {t}: {n}
                    </Badge>
                  ))}
                  {totalMarcadores > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setMostrarMapa((m) => !m)} className="ml-auto h-7 gap-1 px-2 text-[11px]">
                      <Eye className="size-3" /> {mostrarMapa ? 'Ocultar' : 'Ver'} mapa
                    </Button>
                  )}
                  <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
                    {resultado.tempoMs ? `${(resultado.tempoMs / 1000).toFixed(1)}s` : ''}
                  </span>
                </div>
                {mostrarMapa && totalMarcadores > 0 && (
                  <div className="scrollbar-thin mt-3 max-h-40 overflow-y-auto rounded-lg border">
                    <table className="w-full text-[11px]">
                      <thead className="sticky top-0 bg-muted/80 text-left text-muted-foreground">
                        <tr>
                          <th className="px-2.5 py-1.5 font-medium">Marcador</th>
                          <th className="px-2.5 py-1.5 font-medium">Tipo</th>
                          <th className="px-2.5 py-1.5 font-medium">Valor original (só na sua tela)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultado.anonimizacao.marcadores.map((m, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-2.5 py-1.5 font-mono">{m.marcador}</td>
                            <td className="px-2.5 py-1.5">{m.tipo}</td>
                            <td className="max-w-0 truncate px-2.5 py-1.5 text-muted-foreground" title={m.original}>{m.original}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="mt-2 text-[11px] text-muted-foreground">
                  A IA recebeu <strong>somente</strong> os marcadores — os valores reais desta coluna nunca saíram desta tela/servidor para o modelo.
                </p>
              </CardContent>
            </Card>

            {resultado.avisos.length > 0 && (
              <Alert className="border-amber-500/50 bg-amber-500/5">
                <ShieldAlert className="size-4 text-amber-600" />
                <AlertDescription className="text-xs text-amber-700 dark:text-amber-400">
                  {resultado.avisos.map((a, i) => (
                    <p key={i} className={i > 0 ? 'mt-1' : ''}>{a}</p>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            {/* Ações */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1 text-[11px]">
                <FileSignature className="size-3" /> {resultado.tipoNome}
              </Badge>
              {resultado.usarBase && (
                <Badge variant="outline" className="gap-1 text-[11px]">
                  <Sparkles className="size-3 text-amber-600" /> {resultado.fontes.length} fonte(s) da base
                </Badge>
              )}
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={copiar} className="gap-1.5">
                  <Copy className="size-3.5" /> {copiado ? 'Copiado!' : 'Copiar (Markdown)'}
                </Button>
                <Button size="sm" onClick={baixarDocx} disabled={baixando} className="gap-1.5 shadow-sm">
                  {baixando ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />} Baixar (.docx)
                </Button>
              </div>
            </div>

            {/* Editor por seções */}
            {secoesEdit.map((s, idx) => (
              <Card key={s.id} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-bold text-primary">{idx + 1}</span>
                    <CardTitle className="text-sm">{s.titulo}</CardTitle>
                    {s.conteudoTarjado && /\[(?:NOME|CPF|CNPJ|ENDERECO|TELEFONE|EMAIL|VALOR|CEP)_\d+\]/.test(s.conteudo) && (
                      <Badge variant="secondary" className="text-[9px] font-normal" title="Esta seção contém marcadores substituídos pelo mapa acima">
                        tarjado → restaurado
                      </Badge>
                    )}
                  </div>
                  {s.dica && <CardDescription className="text-[11px]">{s.dica}</CardDescription>}
                </CardHeader>
                <CardContent className="pt-0">
                  <Textarea
                    value={s.conteudo}
                    onChange={(e) =>
                      setSecoesEdit((ant) => ant.map((x, i) => (i === idx ? { ...x, conteudo: e.target.value } : x)))
                    }
                    className="min-h-[120px] text-sm leading-relaxed"
                    aria-label={`Conteúdo da seção ${s.titulo}`}
                    placeholder="Gerado pela IA — edite livremente."
                  />
                </CardContent>
              </Card>
            ))}

            {/* Fontes */}
            {resultado.fontes.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Fontes da base usadas na fundamentação</CardTitle>
                  <CardDescription className="text-[11px]">Cada citação [FONTE n] da minuta corresponde a um item rastreável abaixo.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="scrollbar-thin max-h-56 overflow-y-auto px-6 pb-4">
                    <div className="space-y-1.5">
                      {resultado.fontes.map((f, i) => (
                        <div key={f.slug} className="flex items-center gap-2 rounded-lg border p-2 text-xs">
                          <span className="shrink-0 font-mono text-[10px] text-muted-foreground">[FONTE {i + 1}]</span>
                          <span className="min-w-0 flex-1 truncate" title={f.titulo}>{f.titulo}</span>
                          <Badge variant={f.confiabilidade === 'A' ? 'secondary' : 'outline'} className="shrink-0 text-[9px]">{f.confiabilidade}</Badge>
                          {f.status !== 'ATIVO' && (
                            <Badge variant="outline" className="shrink-0 border-amber-500/50 text-[9px] text-amber-600">{f.status}</Badge>
                          )}
                          {f.urlFonte && (
                            <a href={f.urlFonte} target="_blank" rel="noreferrer" className="shrink-0 text-primary hover:underline" title="Abrir fonte oficial">
                              <ExternalLink className="size-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {resultado.lacunas.length > 0 && (
              <Alert className="border-amber-500/40 bg-amber-500/5">
                <ShieldAlert className="size-4 text-amber-600" />
                <AlertDescription className="text-xs">
                  <p className="font-medium text-amber-700 dark:text-amber-400">Lacunas informadas pela IA (revisão humana):</p>
                  <ul className="mt-1 list-inside list-disc space-y-0.5 text-muted-foreground">
                    {resultado.lacunas.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
              Rascunho gerado por IA sobre a base curada. A peça definitiva exige revisão do(a) advogado(a) responsável — dispositivos,
              prazos e jurisprudência devem ser conferidos no processo concreto.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
