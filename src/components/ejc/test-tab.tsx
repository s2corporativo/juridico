'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, FlaskConical, History, MinusCircle, XCircle } from 'lucide-react';
import type { TesteInfo } from './types';

function icone(status: string) {
  if (status === 'SUCESSO') return <CheckCircle2 className="size-4 text-emerald-600" />;
  if (status === 'PARCIAL') return <MinusCircle className="size-4 text-amber-600" />;
  return <XCircle className="size-4 text-red-600" />;
}

interface TestePersistido {
  id: string;
  pergunta: string;
  score: number | null;
  status: string | null;
  createdAt: string;
  documentosEncontrados: { slug: string; titulo: string; score: number; confiabilidade: string }[] | null;
}

export function TestTab() {
  const [resultados, setResultados] = useState<TesteInfo[] | null>(null);
  const [media, setMedia] = useState<number | null>(null);
  const [executando, setExecutando] = useState(false);
  const [historico, setHistorico] = useState<TestePersistido[]>([]);
  const [totalTestes, setTotalTestes] = useState<number | null>(null);

  const carregarHistorico = async () => {
    try {
      const r = await fetch('/api/ejc/test');
      const d = await r.json();
      setHistorico((d.testes ?? []).slice(0, 10));
      if (Array.isArray(d.padrao)) setTotalTestes(d.padrao.length);
    } catch {
      /* histórico é opcional */
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  const executar = async () => {
    setExecutando(true);
    try {
      const r = await fetch('/api/ejc/test', { method: 'POST' });
      const d = await r.json();
      setResultados(d.resultados ?? []);
      setMedia(d.mediaScore ?? null);
      carregarHistorico();
    } finally {
      setExecutando(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><FlaskConical className="size-4 text-amber-600" /> Testes de qualidade do RAG</CardTitle>
          <CardDescription>
            Conjunto padrão de perguntas (item 37 da missão): cada teste verifica se o retrieval encontra os documentos esperados (legislação correta, jurisprudência, teses e modelos vinculados). Toda execução é registrada no banco (histórico abaixo).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <Button onClick={executar} disabled={executando} className="gap-2 shadow-sm">
            {executando ? (<><span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> Executando...</>) : (<><FlaskConical className="size-4" /> Executar {totalTestes ?? 'os'} testes de recuperação</>)}
          </Button>
          {media !== null && (
            <div className="flex items-center gap-3">
              <div className="text-sm"><span className="font-bold text-xl tabular-nums">{Math.round(media * 100)}%</span> <span className="text-muted-foreground">de acerto médio</span></div>
              <Progress value={media * 100} className="h-2 w-40" />
            </div>
          )}
        </CardContent>
      </Card>

      {resultados && (
        <div className="space-y-3">
          {resultados.map((r, i) => (
            <Card key={i} className="transition-shadow hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5">{icone(r.status)}</div>
                    <div>
                      <p className="text-sm font-medium">{r.pergunta}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Esperados: {r.esperados.join(', ')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="shrink-0 tabular-nums">{Math.round(r.score * 100)}%</Badge>
                </div>
                <div className="scrollbar-thin mt-3 max-h-24 overflow-y-auto">
                  <div className="flex flex-wrap gap-1.5">
                    {r.registros.map((reg, j) => (
                      <Badge key={j} variant={r.esperados.includes(reg.slug) ? 'default' : 'secondary'} className="max-w-full truncate text-[10px] font-normal">
                        {reg.slug} · {reg.score}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {historico.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><History className="size-4 text-amber-600" /> Histórico persistido</CardTitle>
            <CardDescription>Últimas execuções registradas no banco (rastreabilidade dos testes).</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="scrollbar-thin max-h-72 overflow-y-auto px-6 pb-4">
              <div className="space-y-1.5">
                {historico.map((h) => (
                  <div key={h.id} className="flex items-center gap-2.5 rounded-lg border p-2.5 text-xs">
                    {icone(h.status ?? 'FALHA')}
                    <span className="min-w-0 flex-1 truncate">{h.pergunta}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">{Math.round((h.score ?? 0) * 100)}%</span>
                    <span className="hidden shrink-0 tabular-nums text-muted-foreground sm:inline">{new Date(h.createdAt).toLocaleString('pt-BR')}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!resultados && !executando && historico.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Nenhum teste executado ainda. Clique no botão acima para validar a recuperação pelo EJC.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
