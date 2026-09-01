'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { BrainCircuit, Clock3, ExternalLink, Send, ShieldAlert, ShieldCheck, Sparkles, Trash2 } from 'lucide-react';
import { Markdown } from './markdown';
import { consumirAcao } from '@/lib/ejc/ui-actions';
import type { AskResponse } from './types';

const EXEMPLOS = [
  'Quais são os requisitos para tutela de urgência prevista no CPC?',
  'Meu cliente recebeu determinado auto de infração ambiental. Quais linhas defensivas devem ser analisadas?',
  'Beneficiário de justiça gratuita vencido paga honorários de sucumbência no processo do trabalho?',
  'Quando cabe agravo de instrumento contra decisão fora do rol do art. 1.015 do CPC?',
  'A empresa atrasou verbas rescisórias: quais multas cobrar?',
  'Qual o prazo do recurso ordinário trabalhista e como se contam os prazos na CLT?',
  'Quais as peças e prazos do agravo de instrumento?',
  'Qual o prazo para comunicar vazamento de dados à ANPD?',
  'Como funciona o recurso inominado do Juizado Especial: prazos e preparo?',
  'Cabe recurso especial contra decisão da turma recursal dos Juizados?',
  'App infantil pode coletar dados de crianças sem consentimento dos pais?',
  'Como transferir dados pessoais para o exterior conforme a LGPD?',
  'Quando o fabricante responde por acidente causado por produto defeituoso?',
  'O fornecedor descobriu que seu produto tem risco: o que deve fazer (recall)?',
  'O recall do veículo não foi atendido há mais de um ano: quais efeitos no CRLV?',
  'Quando cabe mandado de segurança e o que o impede?',
  'Cabe liminar em mandado de segurança para compensação de créditos tributários?',
  'Quando cabe o incidente de desconsideração da personalidade jurídica e quais os prazos?',
  'Qual o prazo para o devedor pagar no cumprimento de sentença e quais as multas?',
  'O que pode ser alegado na impugnação ao cumprimento de sentença?',
  'Qual o prazo de prescrição da pretensão de reparação civil no Código Civil?',
  'Quando a prescrição é interrompida e quantas vezes ela pode ser interrompida?',
  'Quando a doação pode ser revogada por ingratidão e em qual prazo?',
  'É nula a doação que invade a legítima (inoficiosa) no Código Civil?',
  'Quais os prazos e requisitos de cada espécie de usucapião no Código Civil?',
  'Como funciona a usucapião extrajudicial direto no cartório (ata notarial e notificações)?',
  'Posso usucapir imóvel em que o ex-cônjuge abandonou o lar?',
  'O que diz o art. 927 do Código Civil sobre reparação e o risco da atividade?',
  'Quem responde pelos atos do empregado: responsabilidade do empregador e regresso?',
];

function confBadge(c: string) {
  if (c === 'A') return { cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30', icon: <ShieldCheck className="size-3" /> };
  if (c === 'B') return { cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30', icon: <ShieldCheck className="size-3" /> };
  return { cls: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30', icon: <ShieldAlert className="size-3" /> };
}

const HIST_KEY = 'ejc-historico-consultas';

interface RegistroHistorico { p: string; t: number }

function lerHistorico(): RegistroHistorico[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(HIST_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => x && typeof x.p === 'string').slice(0, 20) : [];
  } catch {
    return [];
  }
}

function salvarHistorico(pergunta: string) {
  if (typeof window === 'undefined') return;
  const atual = lerHistorico().filter((r) => r.p !== pergunta);
  atual.unshift({ p: pergunta, t: Date.now() });
  try {
    window.localStorage.setItem(HIST_KEY, JSON.stringify(atual.slice(0, 20)));
  } catch {
    /* storage cheio/indisponível — histórico é acessório */
  }
}

export function AskTab() {
  const [pergunta, setPergunta] = useState('');
  const [resp, setResp] = useState<AskResponse | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [semantico, setSemantico] = useState(true);
  const [historico, setHistorico] = useState<RegistroHistorico[]>([]);

  useEffect(() => setHistorico(lerHistorico()), []);

  const perguntar = async (p?: string) => {
    const texto = (p ?? pergunta).trim();
    if (!texto || carregando) return;
    setCarregando(true);
    setErro(null);
    setResp(null);
    try {
      const r = await fetch('/api/ejc/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pergunta: texto, semantico }),
      });
      const d = (await r.json()) as AskResponse;
      if (!r.ok) setErro(d.error ?? 'Erro na consulta');
      else {
        setResp(d);
        salvarHistorico(texto);
        setHistorico(lerHistorico());
      }
    } catch {
      setErro('Falha de comunicação com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  // Recebe consultas despachadas pela paleta de comandos (⌘K) — via evento
  // direto OU via ação pendente lida no mount (a aba é remontada ao trocar).
  useEffect(() => {
    const onPerguntar = (e: Event) => {
      const texto = (e as CustomEvent<{ texto: string }>).detail?.texto?.trim();
      if (texto) {
        setPergunta(texto);
        perguntar(texto);
      }
    };
    window.addEventListener('ejc:perguntar', onPerguntar);
    const pendente = consumirAcao('perguntar');
    if (pendente?.trim()) {
      setPergunta(pendente.trim());
      perguntar(pendente.trim());
    }
    return () => window.removeEventListener('ejc:perguntar', onPerguntar);
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {/* Pergunta */}
      <div className="space-y-4 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><BrainCircuit className="size-4 text-amber-600" /> Consulta jurídica (RAG)</CardTitle>
            <CardDescription>
              A resposta é gerada exclusivamente a partir da base EJC validada, com rastreabilidade até a fonte. O sistema NUNCA inventa precedentes — se a base não contém a resposta, ele diz o que falta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="Descreva a dúvida jurídica, o caso ou o documento..."
              rows={5}
              aria-label="Pergunta jurídica"
            />
            <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/30 px-3 py-2">
              <div className="min-w-0">
                <Label htmlFor="busca-semantica" className="flex items-center gap-1.5 text-xs font-medium"><BrainCircuit className="size-3.5 text-amber-600" /> Busca semântica (IA)</Label>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">Expande a consulta com terminologia jurídica e funde os rankings (RRF). Se a IA falhar, usa o léxico puro.</p>
              </div>
              <Switch id="busca-semantica" checked={semantico} onCheckedChange={setSemantico} aria-label="Ativar busca semântica" className="shrink-0" />
            </div>
            <Button onClick={() => perguntar()} disabled={carregando || !pergunta.trim()} className="w-full">
              {carregando ? <Sparkles className="mr-2 size-4 animate-pulse" /> : <Send className="mr-2 size-4" />}
              {carregando ? 'Consultando a base...' : semantico ? 'Consultar (busca híbrida)' : 'Consultar (léxico)'}
            </Button>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">Perguntas de teste (item 37):</p>
              <div className="flex flex-wrap gap-1.5">
                {EXEMPLOS.map((e) => (
                  <button key={e} onClick={() => { setPergunta(e); perguntar(e); }} className="rounded-full border px-2.5 py-1 text-left text-[11px] transition-colors hover:border-amber-500/50 hover:bg-amber-500/5">
                    {e}
                  </button>
                ))}
              </div>
            </div>
            {historico.length > 0 && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground"><Clock3 className="size-3" /> Suas consultas recentes ({historico.length})</p>
                  <button
                    onClick={() => { try { window.localStorage.removeItem(HIST_KEY); } catch { /* noop */ } setHistorico([]); }}
                    className="inline-flex items-center gap-1 text-[10px] text-muted-foreground transition-colors hover:text-red-600 dark:hover:text-red-400"
                    aria-label="Limpar histórico de consultas"
                  >
                    <Trash2 className="size-3" /> limpar
                  </button>
                </div>
                <div className="scrollbar-thin max-h-[168px] space-y-1 overflow-y-auto pr-1">
                  {historico.map((h) => (
                    <button
                      key={h.t + h.p.slice(0, 24)}
                      onClick={() => { setPergunta(h.p); perguntar(h.p); }}
                      className="block w-full rounded-md border px-2.5 py-1.5 text-left text-[11px] transition-colors hover:border-amber-500/40 hover:bg-amber-500/5"
                      title="Consultar novamente"
                    >
                      <span className="line-clamp-1">{h.p}</span>
                      <span className="text-[9px] text-muted-foreground">{new Date(h.t).toLocaleString('pt-BR')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resposta */}
      <div className="lg:col-span-3">
        <Card className="min-h-[420px]">
          <CardHeader>
            <CardTitle className="text-base">Resposta rastreável</CardTitle>
            {resp && <CardDescription>{resp.totalFontes} fonte(s) recuperada(s) · modo {resp.modo}</CardDescription>}
          </CardHeader>
          <CardContent>
            {carregando && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                <BrainCircuit className="size-8 animate-pulse text-amber-600" />
                <p className="text-sm">Recuperando conhecimento na base EJC...</p>
              </div>
            )}
            {erro && <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">{erro}</div>}
            {!carregando && !erro && !resp && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
                <BrainCircuit className="size-8" />
                <p className="text-sm">Faça uma pergunta para ver a resposta com fontes.</p>
              </div>
            )}
            {resp && !carregando && (
              <div className="space-y-4">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <Markdown>{resp.resposta}</Markdown>
                </div>
                {resp.fontes.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Fontes recuperadas (rastreabilidade)</p>
                    <ScrollArea className="h-[240px]">
                      <div className="space-y-2 pr-3">
                        {resp.fontes.map((f, i) => {
                          const cb = confBadge(f.confiabilidade);
                          return (
                            <div key={f.slug + i} className="rounded-lg border p-3">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Badge variant="secondary" className="text-[10px]">FONTE {i + 1}</Badge>
                                <Badge variant="outline" className={`text-[10px] ${cb.cls}`}>{cb.icon}{f.confiabilidade}</Badge>
                                <Badge variant="outline" className="text-[10px]">{f.tipoDocumento}</Badge>
                                {f.status !== 'ATIVO' && <Badge variant="outline" className="text-[10px] text-orange-600 border-orange-500/40">revisão humana</Badge>}
                                <span className="ml-auto text-[10px] text-muted-foreground">score {f.score}</span>
                              </div>
                              <p className="mt-1.5 text-xs font-medium">{f.titulo}</p>
                              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{f.trecho}</p>
                              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                                {f.urlFonte && <a href={f.urlFonte} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-amber-600 hover:underline"><ExternalLink className="size-3" /> abrir fonte oficial</a>}
                                {f.dataConsulta && <span>consulta {f.dataConsulta}</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
