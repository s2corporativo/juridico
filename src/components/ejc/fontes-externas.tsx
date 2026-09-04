'use client';

// EJC — Fontes públicas externas (guia de integrações, P3–P5):
//   · LexML Brasil — descoberta de referências normativas (SRU). Pode estar
//     bloqueada por verificação anti-bot do Senado neste ambiente (estado honesto).
//   · Querido Diário — diários oficiais municipais (BH, Betim, Contagem, Igarapé).
//     Excertos com link ao documento de origem; nada ingere na base RAG (anti-loop).
//   · INLABS (DOU) — exige cadastro pessoal do usuário; mostra estado honesto.

import { useCallback, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, FileSearch, Gavel, Loader2, Newspaper, Search } from 'lucide-react';

interface ItemLexML {
  urn: string;
  titulo: string;
  tipoDocumento?: string;
  autoridade?: string;
  data?: string;
  url: string;
}
interface ExcertoGazette {
  data: string;
  edicao?: string;
  texto: string;
  url: string;
  municipio: string;
}

const CIDADES: { id: string; nome: string }[] = [
  { id: '3121106', nome: 'Betim/MG' },
  { id: '3106200', nome: 'Belo Horizonte/MG' },
  { id: '3119401', nome: 'Contagem/MG' },
  { id: '3129301', nome: 'Igarapé/MG' },
];

export function FontesExternas() {
  // LexML
  const [termoLexml, setTermoLexml] = useState('');
  const [lexmlItens, setLexmlItens] = useState<ItemLexML[] | null>(null);
  const [lexmlEstado, setLexmlEstado] = useState<'ocioso' | 'buscando' | 'erro'>('ocioso');
  const [lexmlErro, setLexmlErro] = useState('');

  // Querido Diário
  const [cidade, setCidade] = useState(CIDADES[0].id);
  const [termoQd, setTermoQd] = useState('');
  const [qdItens, setQdItens] = useState<ExcertoGazette[] | null>(null);
  const [qdEstado, setQdEstado] = useState<'ocioso' | 'buscando' | 'erro'>('ocioso');
  const [qdErro, setQdErro] = useState('');

  // INLABS
  const [inlabsStatus, setInlabsStatus] = useState<{ configurado: boolean; mensagem: string } | null>(null);

  useEffect(() => {
    fetch('/api/ejc/inlabs')
      .then((r) => r.json())
      .then(setInlabsStatus)
      .catch(() => setInlabsStatus(null));
  }, []);

  const buscarLexml = useCallback(async () => {
    setLexmlEstado('buscando');
    setLexmlErro('');
    try {
      const r = await fetch(`/api/ejc/lexml?query=${encodeURIComponent(termoLexml)}&max=8`);
      const d = await r.json();
      if (!r.ok || d.error) {
        setLexmlErro(d.error ?? 'Falha na consulta ao LexML.');
        setLexmlEstado('erro');
        return;
      }
      setLexmlItens(d.itens ?? []);
      setLexmlEstado('ocioso');
    } catch {
      setLexmlErro('Falha de rede na consulta ao LexML.');
      setLexmlEstado('erro');
    }
  }, [termoLexml]);

  const buscarQd = useCallback(async () => {
    setQdEstado('buscando');
    setQdErro('');
    try {
      const r = await fetch(`/api/ejc/querido-diario?municipio=${cidade}&termo=${encodeURIComponent(termoQd)}`);
      const d = await r.json();
      if (!r.ok || d.error) {
        setQdErro(d.error ?? 'Falha na consulta ao Querido Diário.');
        setQdEstado('erro');
        return;
      }
      setQdItens(d.publicacoes ?? []);
      setQdEstado('ocioso');
    } catch {
      setQdErro('Falha de rede — a fonte pode estar indisponível neste ambiente.');
      setQdEstado('erro');
    }
  }, [cidade, termoQd]);

  return (
    <div className="space-y-4">
      {/* LexML */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Gavel className="size-4 text-amber-600" /> LexML Brasil — referências normativas
          </CardTitle>
          <CardDescription>
            Descoberta de legislação/atos por metadados (URN, tipo, data) com remissão ao documento oficial. Fonte: Senado Federal — pode estar sob verificação anti-bot neste ambiente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[240px] flex-1 space-y-1">
              <Label htmlFor="lexml-termo" className="text-[11px]">Termo (ex.: súmula vinculante, Lei 14.133)</Label>
              <Input id="lexml-termo" value={termoLexml} onChange={(e) => setTermoLexml(e.target.value)} placeholder="Busca por URN/título…" className="text-sm" onKeyDown={(e) => e.key === 'Enter' && buscarLexml()} />
            </div>
            <Button onClick={buscarLexml} disabled={lexmlEstado === 'buscando' || termoLexml.trim().length < 3} size="sm" className="gap-1.5">
              {lexmlEstado === 'buscando' ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />} Buscar
            </Button>
          </div>
          {lexmlErro && <p className="text-xs text-amber-600 dark:text-amber-400">{lexmlErro}</p>}
          {lexmlItens && lexmlItens.length > 0 && (
            <div className="scrollbar-thin max-h-64 space-y-1.5 overflow-y-auto">
              {lexmlItens.map((i) => (
                <div key={i.urn} className="flex items-center gap-2 rounded-lg border p-2 text-xs">
                  <FileSearch className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1 truncate" title={i.titulo}>{i.titulo}</span>
                  {i.data && <span className="shrink-0 tabular-nums text-muted-foreground">{i.data.slice(0, 10)}</span>}
                  <a href={i.url} target="_blank" rel="noreferrer" className="shrink-0 text-primary hover:underline" title="Abrir no LexML"><ExternalLink className="size-3.5" /></a>
                </div>
              ))}
            </div>
          )}
          {lexmlItens && lexmlItens.length === 0 && !lexmlErro && (
            <p className="text-xs text-muted-foreground">Nenhum resultado para o termo.</p>
          )}
        </CardContent>
      </Card>

      {/* Querido Diário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Newspaper className="size-4 text-amber-600" /> Diários oficiais municipais (Querido Diário)
          </CardTitle>
          <CardDescription>Excertos de publicações municipais das cidades de atuação, com link ao documento de origem. Metadados apenas — nada é injetado na base RAG (anti-loop).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-end gap-2">
            <div className="space-y-1">
              <Label htmlFor="qd-cidade" className="text-[11px]">Município</Label>
              <select id="qd-cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
                {CIDADES.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[220px] flex-1 space-y-1">
              <Label htmlFor="qd-termo" className="text-[11px]">Termo (ex.: licitação, sanção, contrato)</Label>
              <Input id="qd-termo" value={termoQd} onChange={(e) => setTermoQd(e.target.value)} placeholder="Publicações que citam o termo…" className="text-sm" onKeyDown={(e) => e.key === 'Enter' && buscarQd()} />
            </div>
            <Button onClick={buscarQd} disabled={qdEstado === 'buscando' || termoQd.trim().length < 3} size="sm" className="gap-1.5">
              {qdEstado === 'buscando' ? <Loader2 className="size-3.5 animate-spin" /> : <Search className="size-3.5" />} Buscar
            </Button>
          </div>
          {qdErro && <p className="text-xs text-amber-600 dark:text-amber-400">{qdErro}</p>}
          {qdItens && qdItens.length > 0 && (
            <div className="scrollbar-thin max-h-72 space-y-2 overflow-y-auto">
              {qdItens.map((g, i) => (
                <div key={i} className="rounded-lg border p-2.5 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[10px] tabular-nums">{g.data.slice(0, 10)}</Badge>
                    {g.edicao && <span className="text-[10px] text-muted-foreground">edição {g.edicao}</span>}
                    <span className="text-[10px] text-muted-foreground">{g.municipio}</span>
                    {g.url && (
                      <a href={g.url} target="_blank" rel="noreferrer" className="ml-auto shrink-0 text-primary hover:underline" title="Abrir PDF oficial">
                        <ExternalLink className="size-3.5" />
                      </a>
                    )}
                  </div>
                  {g.texto && <p className="mt-1 line-clamp-3 text-muted-foreground">{g.texto}</p>}
                </div>
              ))}
            </div>
          )}
          {qdItens && qdItens.length === 0 && !qdErro && (
            <p className="text-xs text-muted-foreground">Nenhuma publicação encontrada para o termo neste município.</p>
          )}
        </CardContent>
      </Card>

      {/* INLABS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Newspaper className="size-4 text-amber-600" /> INLABS — Diário Oficial da União
          </CardTitle>
          <CardDescription>Texto integral do DOU (XML/PDF por seção). Exige cadastro pessoal gratuito do(a) advogado(a).</CardDescription>
        </CardHeader>
        <CardContent>
          {inlabsStatus ? (
            <div className="flex items-start gap-2">
              <Badge variant={inlabsStatus.configurado ? 'secondary' : 'outline'} className={inlabsStatus.configurado ? 'bg-emerald-600 text-white hover:bg-emerald-600' : ''}>
                {inlabsStatus.configurado ? 'ATIVA' : 'NÃO CONFIGURADA'}
              </Badge>
              <p className="text-xs leading-relaxed text-muted-foreground">{inlabsStatus.mensagem}</p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Verificando status…</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
