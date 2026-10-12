"use client";

import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, RefreshCw, ShieldCheck, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SourceItem = {
  atlasItemId: string;
  tribunal: string;
  title: string;
  officialUrl: string;
  sourceKey: string;
  publishedAt: string | null;
  editorialStatus: "approved";
  documentStatus: "discovery_only";
  citableAsPrecedent: false;
  text: null;
};
type Snapshot = {
  ok: true;
  source: "atlas_forense";
  snapshotVersion: string;
  total: number;
  page: number;
  pageSize: number;
  complete: boolean;
  items: SourceItem[];
};
type Health = {
  ok: true;
  lastRunStatus: string;
  lastRunFinishedAt: string | null;
  lastRunCounts: { discovered: number; queued: number; failed: number } | null;
};

async function fetchData<T>(path: string): Promise<T> {
  const response = await fetch(path, { credentials: "same-origin", cache: "no-store" });
  if (!response.ok) throw new Error(response.status === 401 ? "Entre com sua conta para consultar o Atlas." : "Atlas indisponível ou ainda não configurado.");
  return response.json() as Promise<T>;
}

async function loadOverview() {
  const [snapshot, health] = await Promise.all([
    fetchData<Snapshot>("/api/atlas/knowledge?view=snapshot"),
    fetchData<Health>("/api/atlas/knowledge?view=health"),
  ]);
  if (!snapshot.ok || !health.ok) throw new Error("Resposta do Atlas inválida.");
  return { snapshot, health };
}

export function AtlasWorkspace() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void loadOverview().then(({ snapshot, health }) => {
      if (!active) return;
      setSnapshot(snapshot);
      setHealth(health);
      setError(null);
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : "Não foi possível consultar o Atlas.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      const result = await loadOverview();
      setSnapshot(result.snapshot);
      setHealth(result.health);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Erro na conexão.");
    } finally {
      setLoading(false);
    }
  }

  async function changePage(page: number) {
    if (!snapshot || page < 0) return;
    setLoading(true);
    try {
      // Versão obrigatória para paginação: impede mistura de snapshots diferentes.
      const query = new URLSearchParams({ view: "snapshot", page: String(page), version: snapshot.snapshotVersion });
      const updated = await fetchData<Snapshot>(`/api/atlas/knowledge?${query}`);
      if (updated.snapshotVersion !== snapshot.snapshotVersion) throw new Error("A base foi atualizada. Recarregue a pesquisa.");
      setSnapshot(updated);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Falha na paginação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-juridia space-y-6 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Inteligência Jurídica Unificada</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Atlas Forense</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Base editorial central do JuridIA. O Atlas organiza e valida fontes;
            o JuridIA as consulta para pesquisa e produção de minutas.
          </p>
        </div>
        <Button variant="outline" disabled={loading} onClick={() => void refresh()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Consultar agora
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle className="text-sm">Estado da conexão</CardTitle></CardHeader><CardContent className="flex items-center gap-2 text-sm">
          {error ? <WifiOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4 text-primary" />}
          {loading ? "Consultando…" : error ? "Não sincronizado" : snapshot ? "Conectado ao Atlas" : "Sem dados"}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Itens editoriais aprovados</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">
          {snapshot?.total ?? "—"}
        </CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Última execução editorial</CardTitle></CardHeader><CardContent className="text-sm">
          {health?.lastRunFinishedAt ? new Date(health.lastRunFinishedAt).toLocaleString("pt-BR") : "Não comprovada"}
        </CardContent></Card>
      </div>

      {error && <p role="alert" className="rounded-md border p-3 text-sm text-destructive">{error}</p>}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" /> Atualizações oficiais aprovadas
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Catálogo de descoberta. Estes registros não são inteiro teor de julgados
            e não devem ser citados como precedentes sem verificação adicional.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {snapshot?.items.length === 0 && <p className="text-sm text-muted-foreground">Nenhum item aprovado disponível nesta versão.</p>}
          {snapshot?.items.map((item) => (
            <article key={item.sourceKey + item.atlasItemId} className="rounded-lg border p-3">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs text-muted-foreground">{item.tribunal} · {item.publishedAt ?? "Data não informada"} · Verificado editorialmente</p>
              <a className="mt-2 inline-flex items-center gap-1 text-xs text-primary underline-offset-2 hover:underline"
                 href={item.officialUrl} target="_blank" rel="noopener noreferrer">
                Consultar fonte oficial <ExternalLink className="h-3 w-3" />
              </a>
            </article>
          ))}
          {snapshot && snapshot.total > snapshot.pageSize && (
            <div className="flex items-center justify-between gap-3 pt-2">
              <Button variant="outline" disabled={loading || snapshot.page === 0} onClick={() => void changePage(snapshot.page - 1)}>Anterior</Button>
              <span className="text-xs text-muted-foreground">Página {snapshot.page + 1}</span>
              <Button variant="outline" disabled={loading || snapshot.complete} onClick={() => void changePage(snapshot.page + 1)}>Próxima</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
